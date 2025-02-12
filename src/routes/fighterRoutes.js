const express = require('express');
const { getFighterById, searchFighterByName, getFighterStats } = require('../controllers/fighterController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Search for superheroes by name
router.get('/search/:name', searchFighterByName);

// Get superhero details by ID
router.get('/:id', getFighterById);

// Get all fighter details (powerstats, biography, etc.)
router.get('/:id/:category', getFighterStats);

module.exports = router;
