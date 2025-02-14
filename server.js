const express = require('express'); // Import Express framework
const mongoose = require('mongoose'); // Import Mongoose for MongoDB interactions
const dotenv = require('dotenv'); // Import dotenv for environment variable management
const cors = require('cors'); // Import CORS for cross-origin requests
const http = require('http'); // Import HTTP module to create the server
const { Server } = require('socket.io'); // Import Socket.io for real-time communication
const authRoutes = require('./src/routes/authRoutes'); // Authentication routes
const fighterRoutes = require('./src/routes/fighterRoutes'); // Superhero data routes
const fightRoutes = require('./src/routes/fightRoutes'); // Fight simulation routes
const favoriteRoutes = require('./src/routes/favoriteRoutes'); // User favorite superheroes routes
const chatRoutes = require('./src/routes/chatRoutes'); // Chat-related routes
const connectDB = require('./src/config/db'); // MongoDB connection configuration
const chatSocket = require('./src/sockets/chatSocket'); // Socket.io event handlers
const jwt = require('jsonwebtoken'); // Import JWT for authentication
const User = require('./src/models/User'); // User model for MongoDB
const Fight = require('./src/models/Fight'); // Fight model for MongoDB
const axios = require('axios'); // Import Axios for making API requests
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing
const errorHandler = require('./src/middleware/errorHandler'); // Centralized error handling
const authMiddleware = require('./src/middleware/authMiddleware'); // JWT authentication middleware

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } }); // Enable WebSocket communication

// Middleware setup
app.use(cors()); // Enable CORS for cross-origin requests
app.use(express.json()); // Parse incoming JSON data

// Connect to MongoDB and start server only if successful
connectDB()
    .then(() => console.log(`✅ Connected to MongoDB: ${mongoose.connection.name}`))
    .catch((error) => {
        console.error("❌ MongoDB Connection Error:", error);
        process.exit(1);
    });

// Routes
app.use('/api/fighters', authMiddleware, fighterRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/fights', authMiddleware, fightRoutes);
app.use('/api/favorites', authMiddleware, favoriteRoutes);
app.use('/api/chat', authMiddleware, chatRoutes);

app._router.stack.forEach((route) => {
    if (route.route && route.route.path) {
        console.log(route.route.path);
    }
});

// Default route for API root
app.get('/', (req, res) => {
    res.send("Welcome to the Comic Fight Simulator API!");
});

// Error Handling Middleware
app.use(errorHandler);


// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
