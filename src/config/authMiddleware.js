// src/middleware/authMiddleware.js - JWT Authentication Middleware

const jwt = require('jsonwebtoken'); // Import JSON Web Token library for authentication
const dotenv = require('dotenv'); // Import dotenv to manage environment variables
const User = require('../models/User'); // Import User model to fetch user details from database

dotenv.config(); // Load environment variables from .env file

const authMiddleware = async (req, res, next) => {
    try {
        // Get token from header and check format
        const authHeader = req.header('Authorization');
        
        if (!authHeader) {
            return res.status(401).json({ 
                status: 'error',
                message: 'Access denied. No token provided.' 
            });
        }

        // Validate Bearer token format
        if (!authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                status: 'error',
                message: 'Invalid token format. Use Bearer scheme.' 
            });
        }

        const token = authHeader.split(' ')[1];

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Fetch user and check status
            const user = await User.findById(decoded.id)
                .select('-password')
                .lean(); // Use lean() for better performance

            if (!user) {
                return res.status(404).json({ 
                    status: 'error',
                    message: 'User no longer exists.' 
                });
            }

            // Add user to request object
            req.user = user;
            next();

        } catch (jwtError) {
            // Specific JWT error handling
            if (jwtError.name === 'TokenExpiredError') {
                return res.status(401).json({
                    status: 'error',
                    message: 'Token has expired'
                });
            }
            
            if (jwtError.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    status: 'error',
                    message: 'Invalid token'
                });
            }

            throw jwtError; // Propagate other JWT errors
        }

    } catch (error) {
        // Log the error for debugging (assuming you have a logger configured)
        console.error('Auth Middleware Error:', error);
        
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error during authentication'
        });
    }
};

module.exports = authMiddleware;