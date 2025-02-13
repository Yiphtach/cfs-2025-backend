// src/controllers/authController.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Input validation helper
const validateRegistration = (username, email, password) => {
    const errors = [];
    
    if (!username || username.length < 3) {
        errors.push('Username must be at least 3 characters long');
    }
    
    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        errors.push('Please provide a valid email address');
    }
    
    if (!password || password.length < 6) {
        errors.push('Password must be at least 6 characters long');
    }
    
    return errors;
};

// JWT token generator
const generateToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: '24h' } // Extended token validity
    );
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validate input
        const validationErrors = validateRegistration(username, email, password);
        if (validationErrors.length > 0) {
            return res.status(400).json({
                status: 'error',
                errors: validationErrors
            });
        }

        // Check existing users
        const [existingEmail, existingUsername] = await Promise.all([
            User.findOne({ email: email.toLowerCase() }),
            User.findOne({ username: username.trim() })
        ]);

        if (existingEmail) {
            return res.status(400).json({
                status: 'error',
                message: 'Email already registered'
            });
        }

        if (existingUsername) {
            return res.status(400).json({
                status: 'error',
                message: 'Username already taken'
            });
        }

        // Create new user
        const user = new User({
            username: username.trim(),
            email: email.toLowerCase(),
            password,
            rank: {
                level: 1,
                title: 'Rookie Fighter',
                xp: 0
            }
        });

        await user.save();

        // Generate token and return user data
        const token = generateToken(user.id);
        
        res.status(201).json({
            status: 'success',
            data: {
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    rank: user.rank
                }
            }
        });

    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to register user'
        });
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Please provide both email and password'
            });
        }

        // Find user and include necessary fields
        const user = await User.findOne({ email: email.toLowerCase() })
            .select('_id username email password rank stats');

        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid credentials'
            });
        }

        // Verify password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid credentials'
            });
        }

        // Generate token and return user data
        const token = generateToken(user.id);

        res.json({
            status: 'success',
            data: {
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    rank: user.rank,
                    stats: user.stats
                }
            }
        });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to login'
        });
    }
});

// @route   GET /api/auth/user
// @desc    Get logged-in user details with stats
// @access  Private
router.get('/user', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select('-password')
            .lean();

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        res.json({
            status: 'success',
            data: {
                user: {
                    ...user,
                    winRate: user.stats ? (user.stats.wins / user.stats.totalFights * 100 || 0).toFixed(2) : 0
                }
            }
        });

    } catch (error) {
        console.error('Fetch User Error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch user data'
        });
    }
});

// @route   PUT /api/auth/password
// @desc    Update user password
// @access  Private
router.put('/password', authMiddleware, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                status: 'error',
                message: 'Please provide both current and new password'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                status: 'error',
                message: 'New password must be at least 6 characters long'
            });
        }

        const user = await User.findById(req.user.id);
        const isMatch = await user.comparePassword(currentPassword);

        if (!isMatch) {
            return res.status(401).json({
                status: 'error',
                message: 'Current password is incorrect'
            });
        }

        user.password = newPassword;
        await user.save();

        res.json({
            status: 'success',
            message: 'Password updated successfully'
        });

    } catch (error) {
        console.error('Password Update Error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to update password'
        });
    }
});

module.exports = router;