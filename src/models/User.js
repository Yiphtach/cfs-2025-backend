//User schema (XP, Rank, Favorites)
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    xp: { type: Number, default: 0 },
    rank: { type: Number, default: 0 },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Character' }] // List of favorite fighter IDs
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
