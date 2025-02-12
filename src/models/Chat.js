// src/models/Chat.js - Chat Schema for MongoDB
const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema(
    {
        fightId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Fight',
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        username: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
            trim: true,
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Chat', ChatSchema);
