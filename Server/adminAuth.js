const jwt = require('jsonwebtoken');
const Auth = require('../models/authSchema');

const adminAuth = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'No authentication token, access denied' });
        }

        // Verify token
        const decoded = jwt.verify(token, "harshhhh"); // Using the same secret as in auth.controller.js
        
        // Get user from database
        const user = await Auth.findById(decoded.userId);
        
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Check if user is admin (by email)
        if (user.email !== 'admin@example.com') {
            return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
        }

        // Add user to request
        req.user = user;
        next();
    } catch (error) {
        console.error('Auth error:', error);
        res.status(401).json({ message: 'Token is invalid' });
    }
};

module.exports = adminAuth; 