const User = require('../models/userSchema');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer'); // You'll need to install this package

// Get user profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password_hash');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user });
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update user profile
exports.updateProfile = async (req, res) => {
    try {
        const updates = req.body;
        // Remove sensitive fields that shouldn't be updated directly
        delete updates.password_hash;
        delete updates.email; // Email updates should be handled separately with verification
        delete updates.role;
        delete updates.isEmailVerified;

        const user = await User.findByIdAndUpdate(
            req.user.userId,
            { $set: updates },
            { new: true, runValidators: true }
        ).select('-password_hash');

        res.status(200).json({
            message: "Profile updated successfully",
            user
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Change password
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.userId);

        const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: "Current password is incorrect" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password_hash = hashedPassword;
        await user.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Error changing password:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Request password reset
exports.requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        // Send reset email
        // Note: Configure your email transport in production
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        
        await transporter.sendMail({
            to: user.email,
            subject: 'Password Reset Request',
            html: `
                <p>You requested a password reset</p>
                <p>Click this <a href="${resetUrl}">link</a> to reset your password</p>
                <p>This link will expire in 1 hour</p>
            `
        });

        res.status(200).json({ message: "Password reset email sent" });
    } catch (error) {
        console.error("Error requesting password reset:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Reset password with token
exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired reset token" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password_hash = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: "Password has been reset successfully" });
    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Upload profile picture
exports.uploadProfilePicture = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const user = await User.findById(req.user.userId);
        user.profile.avatar = req.file.path; // Assuming you're using multer for file uploads
        await user.save();

        res.status(200).json({
            message: "Profile picture uploaded successfully",
            avatarUrl: user.profile.avatar
        });
    } catch (error) {
        console.error("Error uploading profile picture:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update email notifications preferences
exports.updateNotificationPreferences = async (req, res) => {
    try {
        const { preferences } = req.body;
        const user = await User.findById(req.user.userId);
        
        user.preferences.emailNotifications = {
            ...user.preferences.emailNotifications,
            ...preferences
        };
        
        await user.save();
        
        res.status(200).json({
            message: "Notification preferences updated successfully",
            preferences: user.preferences.emailNotifications
        });
    } catch (error) {
        console.error("Error updating notification preferences:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update profile visibility settings
exports.updatePrivacySettings = async (req, res) => {
    try {
        const { visibility } = req.body;
        const user = await User.findById(req.user.userId);
        
        user.preferences.profileVisibility = {
            ...user.preferences.profileVisibility,
            ...visibility
        };
        
        await user.save();
        
        res.status(200).json({
            message: "Privacy settings updated successfully",
            visibility: user.preferences.profileVisibility
        });
    } catch (error) {
        console.error("Error updating privacy settings:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}; 