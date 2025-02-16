// src/services/fightService.js - Handles fight calculations & XP logic
const User = require('../models/User');
const Fight = require('../models/Fight');
const { fetchPowerStats } = require('../services/superheroApi');

// Function to calculate fight winner based on power stats
const determineWinner = (fighter1Stats, fighter2Stats) => {
    let fighter1Score = 0;
    let fighter2Score = 0;
    
    const statWeights = {
        intelligence: 10,
        strength: 25,
        speed: 15,
        durability: 10,
        power: 30,
        combat: 20
    };

    Object.keys(statWeights).forEach(stat => {
        if (parseInt(fighter1Stats[stat]) > parseInt(fighter2Stats[stat])) {
            fighter1Score += statWeights[stat];
        } else if (parseInt(fighter1Stats[stat]) < parseInt(fighter2Stats[stat])) {
            fighter2Score += statWeights[stat];
        }
    });
    
    return fighter1Score > fighter2Score ? 'fighter1' : 'fighter2';
};

// Simulate a fight
const simulateFight = async (userId, fighter1Id, fighter2Id) => {
    try {
        const fighter1Stats = await fetchPowerStats(fighter1Id);
        const fighter2Stats = await fetchPowerStats(fighter2Id);
        
        if (!fighter1Stats || !fighter2Stats) {
            throw new Error('Error fetching fighter stats');
        }

        const winner = determineWinner(fighter1Stats, fighter2Stats);
        const fight = await Fight.create({
            userId,
            fighter1: fighter1Id,
            fighter2: fighter2Id,
            winner: winner === 'fighter1' ? fighter1Id : fighter2Id,
        });

        // Update user XP
        await User.findByIdAndUpdate(userId, { $inc: { xp: 10 } });
        
        return fight;
    } catch (error) {
        console.error('Error simulating fight:', error);
        throw new Error('Fight simulation failed');
    }
};

// Retrieve fight history
const getFightHistory = async (userId) => {
    try {
        return await Fight.find({ userId }).populate('fighter1 fighter2');
    } catch (error) {
        console.error('Error fetching fight history:', error);
        throw new Error('Failed to retrieve fight history');
    }
};

module.exports = {
    simulateFight,
    getFightHistory
};
// In this snippet, we define a fightService module that contains functions to simulate a fight between two fighters and retrieve the fight history for a user. The simulateFight function calculates the winner of the fight based on the power stats of the fighters and updates the user's XP. The getFightHistory function retrieves the fight history for a user from the database. These functions interact with the Fight and User models to store and retrieve fight data. The determineWinner function calculates the winner of the fight based on the power stats of the fighters. The module exports these functions to be used by other parts of the application.