//Fight schema (History, Fighters, Outcome)
const mongoose = require('mongoose');

const FightSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fighter1: { type: String, required: true },
    fighter2: { type: String, required: true },
    winner: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Fight', FightSchema);
