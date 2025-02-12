//Favorites handling routes
// src/routes/favoriteRoutes.js - Routes for User Favorites
const express = require('express');
const router = express.Router();
const { addFavorite, getFavorites, removeFavorite } = require('../controllers/favoriteController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST /api/favorites/add
// @desc    Add a favorite character
// @access  Private
router.post('/add', authMiddleware, addFavorite);

// @route   GET /api/favorites
// @desc    Get all favorite characters for a user
// @access  Private
router.get('/', authMiddleware, getFavorites);

// @route   DELETE /api/favorites/remove/:characterId
// @desc    Remove a character from favorites
// @access  Private
router.delete('/remove/:characterId', authMiddleware, removeFavorite);

module.exports = router;