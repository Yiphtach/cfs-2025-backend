//Handles real-time fight chat
// src/sockets/chatSocket.js - Handles real-time fight chat
const socketIo = require('socket.io');

const initializeSockets = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);
        
        socket.on('joinFightRoom', (room) => {
            socket.join(room);
            console.log(`User ${socket.id} joined fight room: ${room}`);
        });

        socket.on('sendFightMessage', ({ room, message }) => {
            io.to(room).emit('receiveFightMessage', message);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
};

module.exports = { initializeSockets };