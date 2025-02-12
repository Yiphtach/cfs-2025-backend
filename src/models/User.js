//User schema (XP, Rank, Favorites)
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    xp: { type: Number, default: 0 },
    rank: { type: Number, default: 0 },
    favorites: [{ type: String }] // List of favorite fighter IDs
});

module.exports = mongoose.model('User', UserSchema);
