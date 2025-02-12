// src/controllers/chatController.js - Chat Controller Logic
const Chat = require('../models/Chat');

// @desc Retrieve chat history for a specific fight
// @route GET /api/chat/history/:fightId
// @access Private
const getChatHistory = async (req, res) => {
    try {
        const { fightId } = req.params;
        const chatHistory = await Chat.find({ fightId }).populate('userId', 'username');
        res.status(200).json(chatHistory);
    } catch (error) {
        console.error('Error fetching chat history:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc Save a new chat message and broadcast it
const saveChatMessage = async (io, fightId, userId, username, message) => {
    try {
        const newMessage = new Chat({ fightId, userId, username, message });
        await newMessage.save();
        io.to(fightId).emit('receiveMessage', newMessage);
    } catch (error) {
        console.error('Error saving chat message:', error);
    }
};

module.exports = { getChatHistory, saveChatMessage };
