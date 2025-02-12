//Chat & Socket.io routes
// src/routes/chatRoutes.js - Routes for Real-time Fight Commentary using Socket.io
const express = require('express');
const router = express.Router();
const { getChatHistory } = require('../controllers/chatController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   GET /api/chat/history/:fightId
// @desc    Retrieve chat history for a specific fight
// @access  Private
router.get('/history/:fightId', authMiddleware, getChatHistory);

// Socket.io Chat Routes
module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected to chat');
        
        socket.on('joinFightChat', (fightId) => {
            socket.join(fightId);
            console.log(`User joined fight chat room: ${fightId}`);
        });
        
        socket.on('sendMessage', ({ fightId, userId, message }) => {
            const chatMessage = { fightId, userId, message, timestamp: new Date() };
            io.to(fightId).emit('receiveMessage', chatMessage);
        });
        
        socket.on('disconnect', () => {
            console.log('User disconnected from chat');
        });
    });
    return router;
};
