const express = require('express');
const router = express.Router();
const { addFavorite, getFavorites, removeFavorite } = require('../controllers/favoriteController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST /api/favorites
// @desc    Add a favorite fighter
// @access  Private
router.post('/', authMiddleware, addFavorite);

// @route   GET /api/favorites
// @desc    Get all favorite fighters for a user
// @access  Private
router.get('/', authMiddleware, getFavorites);

// @route   DELETE /api/favorites/:fighterId
// @desc    Remove a fighter from favorites
// @access  Private
router.delete('/:fighterId', authMiddleware, removeFavorite);

module.exports = router;
// The favoriteRoutes.js file defines the routes for adding, getting, and removing favorite fighters. The routes are protected and require authentication using the authMiddleware middleware. The routes are defined as follows: