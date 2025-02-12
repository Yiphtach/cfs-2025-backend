//Handles fight calculations & XP logic
// src/services/fightService.js - Handles fight calculations & XP logic
const axios = require('axios');
const Fight = require('../models/Fight');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();

const SUPERHERO_API_BASE = `https://superheroapi.com/api/${process.env.SUPERHERO_API_KEY}`;

// Function to fetch power stats of a character
const getPowerStats = async (characterId) => {
    try {
        const response = await axios.get(`${SUPERHERO_API_BASE}/${characterId}/powerstats`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching powerstats for character ${characterId}:`, error);
        return null;
    }
};

// Function to determine fight winner based on stats
const simulateFight = async (fighter1Id, fighter2Id) => {
    const fighter1Stats = await getPowerStats(fighter1Id);
    const fighter2Stats = await getPowerStats(fighter2Id);

    if (!fighter1Stats || !fighter2Stats) return null;

    let fighter1Score = 0;
    let fighter2Score = 0;
    
    const statKeys = ['intelligence', 'strength', 'speed', 'durability', 'power', 'combat'];
    statKeys.forEach(stat => {
        const stat1 = parseInt(fighter1Stats[stat]) || 0;
        const stat2 = parseInt(fighter2Stats[stat]) || 0;
        
        if (stat1 > stat2) fighter1Score++;
        else if (stat2 > stat1) fighter2Score++;
    });

    const winnerId = fighter1Score > fighter2Score ? fighter1Id : fighter2Id;
    return { fighter1Id, fighter2Id, winnerId, fighter1Score, fighter2Score };
};

// Function to store fight results in database
const saveFightResult = async (fightData, userId) => {
    try {
        const newFight = new Fight(fightData);
        await newFight.save();
        
        await User.findByIdAndUpdate(userId, { $inc: { xp: 10 } });
        return newFight;
    } catch (error) {
        console.error('Error saving fight result:', error);
        return null;
    }
};

module.exports = { simulateFight, saveFightResult };
