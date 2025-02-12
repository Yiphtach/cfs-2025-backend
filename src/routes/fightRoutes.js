//Fight simulation routes
// // src/routes/fightRoutes.js - Routes for Fight Simulation
const express = require('express');
const router = express.Router();
const { simulateFight, getFightHistory } = require('../controllers/fightController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST /api/fights/simulate
// @desc    Simulate a fight between two characters
// @access  Private
router.post('/simulate', authMiddleware, simulateFight);

// @route   GET /api/fights/history
// @desc    Retrieve fight history for a user
// @access  Private
router.get('/history', authMiddleware, getFightHistory);

module.exports = router;