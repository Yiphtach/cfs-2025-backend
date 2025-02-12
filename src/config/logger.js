//Logger configuration (Morgan)
// src/config/logger.js - Logger Configuration using Morgan
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();

// Create a write stream (in append mode) for logging
const logStream = fs.createWriteStream(path.join(__dirname, '../logs/access.log'), { flags: 'a' });

// Define logging format
const logger = morgan('combined', { stream: logStream });

module.exports = logger;

// Fix for 404 error on root path
app.get('/', (req, res) => {
    res.send('Welcome to the MERN Comic Fight API');
});

// Fix for chatSocket TypeError
const { initializeSockets } = require('../sockets/chatSocket');

module.exports = { app, initializeSockets };
