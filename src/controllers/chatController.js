// Real-time fight commentary using Socket.io
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

// @desc Handle new chat messages
const handleNewMessage = async (io, fightId, userId, message) => {
    try {
        const newMessage = await Chat.create({ fightId, userId, message });
        io.to(fightId).emit('receiveMessage', newMessage);
    } catch (error) {
        console.error('Error saving chat message:', error);
    }
};

module.exports = { getChatHistory, handleNewMessage };
