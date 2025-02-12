// src/middleware/authMiddleware.js - JWT Authentication Middleware
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: 'Access Denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user) {
            return res.status(401).json({ message: 'Invalid Token' });
        }
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid or Expired Token' });
    }
};

module.exports = authMiddleware;