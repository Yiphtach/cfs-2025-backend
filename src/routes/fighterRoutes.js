const express = require('express');
const { getFighterById, searchFighterByName, getFighterStats } = require('../controllers/fighterController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// @route   GET /api/fighters/search/:name
// @desc    Search for superheroes by name
// @access  Public
router.get('/search/:name', authMiddleware, searchFighterByName);

// @route   GET /api/fighters/:id
// @desc    Get superhero details by ID
// @access  Public
router.get('/:id', authMiddleware, getFighterById);

// @route   GET /api/fighters/:id/:category
// @desc    Get all fighter details (powerstats, biography, etc.)
// @access  Public
router.get('/:id/:category', authMiddleware, getFighterStats);

module.exports = router;
// The fighterRoutes.js file defines the routes for searching for fighters by name, getting fighter details by ID, and getting all fighter details. The routes are protected and require authentication using the authMiddleware middleware. The routes are defined as follows: