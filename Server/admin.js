const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const Auth = require('../models/authSchema');
const Profile = require('../models/Profile');
const bcrypt = require('bcryptjs');

// Add new user (admin only)
router.post('/users', adminAuth, async (req, res) => {
    try {
        const { username, email, password, role = 'user' } = req.body;

        // Validate required fields
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Username, email, and password are required' });
        }

        // Check if user already exists
        const existingUser = await Auth.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = await Auth.create({
            username,
            email,
            password_hash: hashedPassword,
            created_at: new Date(),
            updated_at: new Date()
        });

        // Create profile
        const profile = await Profile.create({
            user: newUser._id,
            username,
            email,
            role,
            isActive: true
        });

        // Return user data without password
        const userData = {
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            role,
            created_at: newUser.created_at,
            profile
        };

        res.status(201).json({
            message: 'User created successfully',
            user: userData
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Error creating user' });
    }
});

// Get all users with their profiles
router.get('/users', adminAuth, async (req, res) => {
    try {
        // Get all users from Auth collection
        const users = await Auth.find({}).select('-password_hash');
        
        // Get all profiles
        const profiles = await Profile.find({});

        // Combine user and profile data
        const usersWithProfiles = users.map(user => {
            const userProfile = profiles.find(profile => profile.user.toString() === user._id.toString());
            return {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.email === 'admin@example.com' ? 'admin' : 'user',
                isActive: true,
                created_at: user.created_at,
                updated_at: user.updated_at,
                profile: userProfile || null
            };
        });

        res.json(usersWithProfiles);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users' });
    }
});

// Delete user
router.delete('/users/:userId', adminAuth, async (req, res) => {
    try {
        // Delete user from Auth collection
        const user = await Auth.findByIdAndDelete(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Also delete associated profile
        await Profile.findOneAndDelete({ user: req.params.userId });

        res.json({ message: 'User and associated profile deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Error deleting user' });
    }
});

// Update user role (only for non-admin users)
router.patch('/users/:userId/role', adminAuth, async (req, res) => {
    try {
        const { role } = req.body;
        const userId = req.params.userId;
        
        // Get user
        const user = await Auth.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Prevent changing admin's role
        if (user.email === 'admin@example.com') {
            return res.status(403).json({ message: 'Cannot change admin role' });
        }

        // For demonstration, we'll store the role in a profile
        let profile = await Profile.findOne({ user: userId });
        if (profile) {
            profile.role = role;
            await profile.save();
        } else {
            profile = await Profile.create({
                user: userId,
                username: user.username,
                email: user.email,
                role: role
            });
        }

        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: role,
            profile: profile
        });
    } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).json({ message: 'Error updating user role' });
    }
});

// Get user details
router.get('/users/:userId', adminAuth, async (req, res) => {
    try {
        const user = await Auth.findById(req.params.userId).select('-password_hash');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get user profile
        const profile = await Profile.findOne({ user: req.params.userId });

        const userData = {
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.email === 'admin@example.com' ? 'admin' : 'user',
            created_at: user.created_at,
            updated_at: user.updated_at,
            profile: profile || null
        };

        res.json(userData);
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ message: 'Error fetching user details' });
    }
});

// Update user status
router.patch('/users/:userId/status', adminAuth, async (req, res) => {
    try {
        const { isActive } = req.body;
        const userId = req.params.userId;

        // Get user
        const user = await Auth.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Prevent changing admin's status
        if (user.email === 'admin@example.com') {
            return res.status(403).json({ message: 'Cannot change admin status' });
        }

        // Update status in profile
        let profile = await Profile.findOne({ user: userId });
        if (profile) {
            profile.isActive = isActive;
            await profile.save();
        } else {
            profile = await Profile.create({
                user: userId,
                username: user.username,
                email: user.email,
                isActive: isActive
            });
        }

        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            isActive: isActive,
            profile: profile
        });
    } catch (error) {
        console.error('Error updating user status:', error);
        res.status(500).json({ message: 'Error updating user status' });
    }
});

module.exports = router; 