// src/middleware/authMiddleware.js - JWT Authentication Middleware

const jwt = require('jsonwebtoken'); // Import JSON Web Token library for authentication
const dotenv = require('dotenv'); // Import dotenv to manage environment variables
const User = require('../models/User'); // Import User model to fetch user details from database

dotenv.config(); // Load environment variables from .env file

// Middleware function to authenticate users using JWT
const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization'); // Extract token from request headers
    if (!token) { // If no token is provided, deny access
        return res.status(401).json({ message: 'Access Denied. No token provided.' });
    }

    try {
        // Remove 'Bearer ' prefix from the token if present and verify using JWT_SECRET
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        
        // Fetch user from database using the decoded ID and exclude password field
        req.user = await User.findById(decoded.id).select('-password');
        
        // If user does not exist, return unauthorized response
        if (!req.user) {
            return res.status(401).json({ message: 'Invalid Token' });
        }
        
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        res.status(401).json({ message: 'Invalid or Expired Token' }); // Handle invalid or expired tokens
    }
};

module.exports = authMiddleware; // Export middleware for use in protected routes
