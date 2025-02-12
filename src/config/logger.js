//Logger configuration (Morgan)
// src/config/logger.js - Logger Configuration using Morgan
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

// Create a write stream (in append mode) for logging
const logStream = fs.createWriteStream(path.join(__dirname, '../../logs/access.log'), { flags: 'a' });

// Define logging format
const logger = morgan('combined', { stream: logStream });

module.exports = logger;