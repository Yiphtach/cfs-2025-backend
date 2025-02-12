// src/config/db.js - MongoDB Connection Setup
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log(`✅ MongoDB Connected: ${mongoose.connection.name}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        process.exit(1); // Exit process with failure
    }
};

// MongoDB Connection Event Handlers
mongoose.connection.on('connected', () => {
    console.log('🎯 MongoDB connected successfully.');
});

mongoose.connection.on('error', (err) => {
    console.error(`❗ MongoDB connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ MongoDB disconnected.');
});

// Gracefully handle app termination
process.on('SIGINT', () => {
    mongoose.disconnect().then(() => {
        console.log('🛑 MongoDB disconnected due to app termination.');
        process.exit(0);
    });
});

module.exports = connectDB;
