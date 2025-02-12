//Fight schema (History, Fighters, Outcome)
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
        fighter1Stats: {
            intelligence: { type: Number, default: 0 },
            strength: { type: Number, default: 0 },
            speed: { type: Number, default: 0 },
            durability: { type: Number, default: 0 },
            power: { type: Number, default: 0 },
            combat: { type: Number, default: 0 }
        },
        fighter2Stats: {
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
