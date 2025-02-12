// src/routes/chatRoutes.js - Routes for Real-time Fight Commentary using Socket.io
const express = require('express');
const router = express.Router();
const { getChatHistory, saveChatMessage } = require('../controllers/chatController');
const authMiddleware = require('../middleware/authMiddleware');
const Chat = require('../models/Chat');

// @route   GET /api/chat/history/:fightId
// @desc    Retrieve chat history for a specific fight
// @access  Private
router.get('/history/:fightId', authMiddleware, getChatHistory);

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected to chat');
        
        socket.on('joinFightChat', (fightId) => {
            socket.join(fightId);
            console.log(`User joined fight chat room: ${fightId}`);
        });
        
        socket.on('sendMessage', async ({ fightId, userId, username, message }) => {
            try {
                const chatMessage = new Chat({ fightId, userId, username, message });
                await chatMessage.save();
                io.to(fightId).emit('receiveMessage', chatMessage);
            } catch (error) {
                console.error('Error saving chat message:', error);
            }
        });
        
        socket.on('disconnect', () => {
            console.log('User disconnected from chat');
        });
    });
    return router;
};
