const mongoose = require('mongoose');
const Auth = require('../models/authSchema');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '../.env' });

const createAdminUser = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await Auth.findOne({ email: 'admin@example.com' });
        
        if (existingAdmin) {
            console.log('Admin user already exists:', existingAdmin.email);
            process.exit(0);
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash('Admin@123', 10);

        // Create new admin user
        const adminUser = new Auth({
            username: 'admin',
            email: 'admin@example.com',
            password_hash: hashedPassword,
            created_at: new Date(),
            updated_at: new Date()
        });

        await adminUser.save();
        console.log('Admin user created successfully!');
        console.log('Email:', adminUser.email);
        console.log('Password: Admin@123');

    } catch (error) {
        console.error('Error creating admin user:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

createAdminUser(); 