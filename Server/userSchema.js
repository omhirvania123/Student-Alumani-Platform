const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    // Basic Information
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters long']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long']
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isEmailVerified: { type: Boolean, default: false },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,

    // Profile Information
    profile: {
        firstName: { type: String },
        lastName: { type: String },
        avatar: { type: String }, // URL to profile picture
        bio: { type: String },
        dateOfBirth: { type: Date },
        gender: { 
            type: String, 
            enum: ['male', 'female', 'other', 'prefer not to say'] 
        },
        contactNumber: { type: String },
        location: {
            city: String,
            state: String,
            country: String
        }
    },

    // Academic Information
    academic: {
        degree: String,
        major: String,
        graduationYear: Number,
        enrollmentYear: Number,
        university: String,
        studentId: String, // For current students
    },

    // Professional Information
    professional: {
        currentPosition: String,
        company: String,
        industry: String,
        experience: Number, // in years
        skills: [String],
        linkedinUrl: String,
        portfolioUrl: String
    },

    // Preferences
    preferences: {
        emailNotifications: {
            messages: { type: Boolean, default: true },
            events: { type: Boolean, default: true },
            jobs: { type: Boolean, default: true },
            mentorship: { type: Boolean, default: true }
        },
        profileVisibility: {
            email: { type: Boolean, default: false },
            phone: { type: Boolean, default: false },
            profile: { type: Boolean, default: true }
        }
    },

    // System Fields
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date
    },
    accountStatus: { 
        type: String, 
        enum: ['active', 'inactive', 'suspended'], 
        default: 'active' 
    },
    updated_at: { type: Date, default: Date.now }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw error;
    }
};

// Pre-save middleware to update the updated_at field
userSchema.pre('save', function(next) {
    this.updated_at = new Date();
    next();
});

// Instance method to get full name
userSchema.methods.getFullName = function() {
    return `${this.profile.firstName} ${this.profile.lastName}`;
};

// Static method to find active users
userSchema.statics.findActive = function() {
    return this.find({ accountStatus: 'active' });
};

const User = mongoose.model('User', userSchema);

module.exports = User;