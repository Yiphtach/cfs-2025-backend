//Main Express App
// src/app.js - Main Express App Setup
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const fighterRoutes = require('./routes/fighterRoutes');
const fightRoutes = require('./routes/fightRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const chatRoutes = require('./routes/chatRoutes');
const { errorHandler } = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/fighters', fighterRoutes);
app.use('/api/fights', fightRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/chat', chatRoutes);
app.use(errorHandler);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected Successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

module.exports = app;
//The main app.js file is the entry point for the Express application. It sets up the Express app, loads environment variables, connects to MongoDB, and defines routes using the route modules. It also includes error handling middleware.