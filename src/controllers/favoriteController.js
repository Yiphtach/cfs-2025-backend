//Handle favorites
// src/controllers/favoriteController.js - Controller for Managing Favorites
const Favorite = require('../models/Favorite');
const User = require('../models/User');

// @desc    Add a favorite character
// @route   POST /api/favorites/add
// @access  Private
const addFavorite = async (req, res) => {
    try {
        const { characterId, name, imageUrl } = req.body;
        const userId = req.user.id;

        let favorite = await Favorite.findOne({ userId, characterId });
        if (favorite) {
            return res.status(400).json({ message: 'Character already in favorites' });
        }

        favorite = new Favorite({ userId, characterId, name, imageUrl });
        await favorite.save();

        res.status(201).json(favorite);
    } catch (error) {
        console.error('Error adding favorite:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all favorite characters for a user
// @route   GET /api/favorites
// @access  Private
const getFavorites = async (req, res) => {
    try {
        const favorites = await Favorite.find({ userId: req.user.id });
        res.status(200).json(favorites);
    } catch (error) {
        console.error('Error fetching favorites:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Remove a character from favorites
// @route   DELETE /api/favorites/remove/:characterId
// @access  Private
const removeFavorite = async (req, res) => {
    try {
        const { characterId } = req.params;
        const userId = req.user.id;

        const favorite = await Favorite.findOneAndDelete({ userId, characterId });
        if (!favorite) {
            return res.status(404).json({ message: 'Favorite not found' });
        }

        res.status(200).json({ message: 'Favorite removed successfully' });
    } catch (error) {
        console.error('Error removing favorite:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { addFavorite, getFavorites, removeFavorite };
