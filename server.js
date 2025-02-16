const express = require('express'); // Import Express framework
const mongoose = require('mongoose'); // Import Mongoose for MongoDB interactions
const dotenv = require('dotenv'); // Import dotenv for environment variable management
const cors = require('cors'); // Import CORS for cross-origin requests
const http = require('http'); // Import HTTP module to create the server
const connectDB = require('./config/db'); // MongoDB connection configuration
const errorHandler = require('./middleware/errorHandler'); // Centralized error handling
const authMiddleware = require('./middleware/authMiddleware'); // JWT authentication middleware

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const server = http.createServer(app);

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
app.use('/api/fighters', authMiddleware);
app.use('/api/fights', authMiddleware);

// Default route for API root
app.get('/', (req, res) => {
    res.send("Welcome to the Comic Fight Simulator API!");
});

// Error Handling Middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
