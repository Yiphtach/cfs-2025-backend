const express = require('express');
const router = express.Router();
const {
    fetchCharacterById,
    fetchPowerStats,
    fetchBiography,
    fetchAppearance,
    fetchWork,
    fetchConnections,
    fetchImage,
    searchCharacterByName
} = require('../config/superheroApi');
const authMiddleware = require('../config/authMiddleware');

// @route   GET /api/id/:id
// @desc    Get character details by ID
// @access  Public
router.get('/id', async (req, res) => {
    try {
        const data = await fetchCharacterById(req.params.id);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/id/:id/powerstats
// @desc    Get power stats of a character
// @access  Public
router.get('/id/powerstats', async (req, res) => {
    try {
        const data = await fetchPowerStats(req.params.id);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/id/:id/biography
// @desc    Get biography of a character
// @access  Public
router.get('/id/biography', async (req, res) => {
    try {
        const data = await fetchBiography(req.params.id);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/id/:id/appearance
// @desc    Get appearance of a character
// @access  Public
router.get('/id/appearance', async (req, res) => {
    try {
        const data = await fetchAppearance(req.params.id);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/id/:id/work
// @desc    Get work details of a character
// @access  Public
router.get('/id/work', async (req, res) => {
    try {
        const data = await fetchWork(req.params.id);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/id/:id/connections
// @desc    Get connections of a character
// @access  Public
router.get('/id/connections', async (req, res) => {
    try {
        const data = await fetchConnections(req.params.id);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/id/:id/image
// @desc    Get character image
// @access  Public
router.get('/id/image', async (req, res) => {
    try {
        const data = await fetchImage(req.params.id);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/search/:name
// @desc    Search character by name
// @access  Public
router.get('/search/:name', async (req, res) => {
    try {
        const data = await searchCharacterByName(req.params.name);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
