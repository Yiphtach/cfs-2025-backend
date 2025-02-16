// src/controllers/fightController.js - Fight Simulation Logic
const Fight = require('../models/Fight');
const User = require('../models/User');
const { fetchPowerStats } = require('../services/superheroApi');

// Function to calculate fight winner based on power stats
const determineWinner = (fighter1Stats, fighter2Stats) => {
    let fighter1Score = 0;
    let fighter2Score = 0;
    
    const statKeys = ['intelligence', 'strength', 'speed', 'durability', 'power', 'combat'];
    statKeys.forEach(stat => {
        if (parseInt(fighter1Stats[stat]) > parseInt(fighter2Stats[stat])) {
            fighter1Score++;
        } else if (parseInt(fighter1Stats[stat]) < parseInt(fighter2Stats[stat])) {
            fighter2Score++;
        }
    });
    
    return fighter1Score > fighter2Score ? 'fighter1' : 'fighter2';
};

// @desc Simulate a fight between two characters
// @route POST /api/fights/simulate
// @access Private
const simulateFight = async (req, res) => {
    try {
        const { fighter1Id, fighter2Id } = req.body;
        if (!fighter1Id || !fighter2Id) {
            return res.status(400).json({ message: 'Both fighters must be selected' });
        }

        const fighter1Stats = await fetchPowerStats(fighter1Id);
        const fighter2Stats = await fetchPowerStats(fighter2Id);
        
        if (!fighter1Stats || !fighter2Stats) {
            return res.status(404).json({ message: 'Error fetching fighter stats' });
        }

        const winner = determineWinner(fighter1Stats, fighter2Stats);
        const fight = await Fight.create({
            fighter1Id,
            fighter2Id,
            winner: winner === 'fighter1' ? fighter1Id : fighter2Id,
            userId: req.user.id,
        });

        // Update user XP
        await User.findByIdAndUpdate(req.user.id, { $inc: { xp: 10 } });
        
        res.status(201).json({ message: 'Fight simulated successfully', fight });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc Retrieve fight history for a user
// @route GET /api/fights/history
// @access Private
const getFightHistory = async (req, res) => {
    try {
        const fights = await Fight.find({ userId: req.user.id }).populate('fighter1Id fighter2Id');
        res.status(200).json(fights);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { simulateFight, getFightHistory };
