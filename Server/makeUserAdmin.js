const mongoose = require('mongoose');
const User = require('../models/userSchema');
require('dotenv').config({ path: '../.env' });

const makeUserAdmin = async (userEmail) => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Find and update user
        const updatedUser = await User.findOneAndUpdate(
            { email: userEmail },
            { 
                $set: { 
                    role: 'admin',
                    isActive: true
                }
            },
            { new: true }
        );

        if (!updatedUser) {
            console.log('User not found with email:', userEmail);
            return;
        }

        console.log('User successfully updated to admin role!');
        console.log('User details:', {
            username: updatedUser.username,
            email: updatedUser.email,
            role: updatedUser.role
        });

    } catch (error) {
        console.error('Error updating user:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

// Get email from command line argument
const userEmail = process.argv[2];

if (!userEmail) {
    console.log('Please provide an email address:');
    console.log('Usage: node makeUserAdmin.js user@example.com');
    process.exit(1);
}

makeUserAdmin(userEmail); 