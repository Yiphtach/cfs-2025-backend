// src/models/Fight.js - Fight Schema using Character IDs
const mongoose = require('mongoose');

const FightSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fighter1: {
        id: { type: Number, required: true },
        name: { type: String, required: true }
    },
    fighter2: {
        id: { type: Number, required: true },
        name: { type: String, required: true }
    },
    winner: {
        id: { type: Number, required: true },
        name: { type: String, required: true }
    },
    fightDetails: {
        id1Stats: {
            intelligence: { type: Number, default: 0 },
            strength: { type: Number, default: 0 },
            speed: { type: Number, default: 0 },
            durability: { type: Number, default: 0 },
            power: { type: Number, default: 0 },
            combat: { type: Number, default: 0 }
        },
        id2Stats: {
            intelligence: { type: Number, default: 0 },
            strength: { type: Number, default: 0 },
            speed: { type: Number, default: 0 },
            durability: { type: Number, default: 0 },
            power: { type: Number, default: 0 },
            combat: { type: Number, default: 0 }
        }
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Fight', FightSchema);
// In this snippet, we define a FightSchema that stores the details of a fight between two fighters. The schema includes the user ID of the user who initiated the fight, the IDs and names of the two fighters, the winner of the fight, and the power stats of each fighter. The schema also includes a createdAt field to store the timestamp of when the fight was created.