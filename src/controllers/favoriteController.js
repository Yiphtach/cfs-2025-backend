const Favorite = require('../models/Favorite');
const User = require('../models/User');

// @desc    Add a favorite fighter
// @route   POST /api/favorites
// @access  Private
const addFavorite = async (req, res) => {
    try {
        const { fighterId, fighterName } = req.body;
        const userId = req.user.id;

        let favorite = await Favorite.findOne({ userId, fighterId });
        if (favorite) {
            return res.status(400).json({ message: 'Fighter already in favorites' });
        }

        favorite = new Favorite({ userId, fighterId, fighterName });
        await favorite.save();

        res.status(201).json(favorite);
    } catch (error) {
        console.error('Error adding favorite:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all favorite fighters for a user
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

// @desc    Remove a fighter from favorites
// @route   DELETE /api/favorites/:fighterId
// @access  Private
const removeFavorite = async (req, res) => {
    try {
        const { fighterId } = req.params;
        const userId = req.user.id;

        const favorite = await Favorite.findOneAndDelete({ userId, fighterId });
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
// The favoriteController.js file contains the logic for adding, getting, and removing favorite fighters. The addFavorite function adds a new favorite fighter to the database. The getFavorites function retrieves all favorite fighters for a user. The removeFavorite function removes a favorite fighter from the database. Each function handles errors and sends an appropriate response to the client.