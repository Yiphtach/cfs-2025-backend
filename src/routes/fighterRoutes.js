// src/routes/fighterRoutes.js
const express = require('express');
const { 
    getFighterById, 
    searchFighterByName, 
    getFighterStats, 
    getFighterImage,
    getTopFighters,
    getFightersByPublisher,
    getMatchupAnalysis,
    getFighterHistory,
    toggleFavoriteFighter
} = require('../controllers/fighterController');
const authMiddleware = require('../middleware/authMiddleware');



const router = express.Router();

/**
 * Search Routes
 */
// @route   GET /api/fighters/search/:name
// @desc    Search for fighters by name
// @access  Private
router.get('/search/:name', 
    authMiddleware, 
    //rateLimiter,
    searchFighterByName
);

/**
 * Fighter Details Routes
 */
// @route   GET /api/fighters/:id
// @desc    Get fighter details by ID
// @access  Private
router.get('/:id', 
    authMiddleware, 
    //rateLimiter,
    getFighterById
);

// @route   GET /api/fighters/:id/:category
// @desc    Get specific fighter details (powerstats, biography, etc.)
// @access  Private
router.get('/:id/:category', 
    authMiddleware, 
    //rateLimiter,
    getFighterStats
);

// @route   GET /api/fighters/:id/image
// @desc    Get fighter image
// @access  Private
router.get('/:id/image', 
    authMiddleware,
    //rateLimiter,
    getFighterImage
);

/**
 * Fighter Rankings & Stats Routes
 */
// @route   GET /api/fighters/rankings/top
// @desc    Get top ranked fighters by win rate
// @access  Private
router.get('/rankings/top', 
    authMiddleware,
    getTopFighters
);

// @route   GET /api/fighters/publisher/:publisher
// @desc    Get fighters by publisher (DC, Marvel, etc.)
// @access  Private
router.get('/publisher/:publisher',
    authMiddleware,
    getFightersByPublisher
);

/**
 * Fighter Analysis Routes
 */
// @route   GET /api/fighters/matchup/:fighter1Id/:fighter2Id
// @desc    Get detailed matchup analysis between two fighters
// @access  Private
router.get('/matchup/:fighter1Id/:fighter2Id',
    authMiddleware,
    getMatchupAnalysis
);

// @route   GET /api/fighters/:id/history
// @desc    Get fighter's battle history
// @access  Private
router.get('/:id/history',
    authMiddleware,
    getFighterHistory
);

/**
 * User Interaction Routes
 */
// @route   POST /api/fighters/:id/favorite
// @desc    Toggle fighter as favorite for current user
// @access  Private
router.post('/:id/favorite',
    authMiddleware,
    toggleFavoriteFighter
);

/**
 * Error Handler
 */
router.use((err, req, res, next) => {
    console.error('Fighter Routes Error:', err);
    res.status(err.status || 500).json({
        status: 'error',
        message: err.message || 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

module.exports = router;