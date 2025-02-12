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
const request = require('supertest'); // Import Supertest for API testing
const errorHandler = require('./src/middleware/errorHandler'); // Centralized error handling
const authMiddleware = require('./src/middleware/authMiddleware'); // JWT authentication middleware
const fightService = require('./src/services/fightService'); // Fight simulation logic




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
connectDB().then(() => {
    console.log(`✅ Connected to MongoDB: ${mongoose.connection.name}`)});


//Routes
app.use('/api/fighters', fighterRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/fights', fightRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/chat', chatRoutes);


// Initialize Socket.io
//chatSocket(io);


// Error Handling Middleware
app.use(errorHandler);


// Authentication Routes
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Hash password before storing in DB
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        // Compare password with hashed password in DB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        // Generate JWT token for authentication
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


// Fight History Routes
app.post('/api/fights/save', async (req, res) => {
    try {
        const { userId, fighter1, fighter2, winner } = req.body;
        const fight = new Fight({ userId, fighter1, fighter2, winner });
        await fight.save();
        res.status(201).json({ message: 'Fight history saved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


app.get('/api/fights/history/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const fights = await Fight.find({ userId });
        res.json(fights);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


// Superhero API Integration
const SUPERHERO_API_URL = process.env.SUPERHERO_API_URL;


// Search for superheroes by name
app.get('/api/fighters/search/:name', async (req, res) => {
    try {
        const { name } = req.params;
        const response = await axios.get(`${SUPERHERO_API_URL}/search/${name}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch superhero data' });
    }
});


// Get superhero details by ID
app.get('/api/fighters/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const response = await axios.get(`${SUPERHERO_API_URL}/${id}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch superhero details' });
    }
});


// Function to update user XP and Rank
const updateUserXP = async (userId, xpGained) => {
    try {
        const user = await User.findById(userId);
        if (user) {
            user.xp = (user.xp || 0) + xpGained;
            user.rank = Math.floor(user.xp / 100); // Example rank calculation
            await user.save();
        }
    } catch (error) {
        console.error('Error updating user XP:', error);
    }
};


// Leaderboard Route - Get Top Ranked Users
app.get('/api/leaderboard', async (req, res) => {
    try {
        const topUsers = await User.find().sort({ xp: -1 }).limit(10);
        res.json(topUsers);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch leaderboard' });
    }
});


// User Profile Route - Get User Info by ID
app.get('/api/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch user profile' });
    }
});


// Favorite Fighters Routes
app.post('/api/favorites/add', async (req, res) => {
    try {
        const { userId, fighterId } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (!user.favorites.includes(fighterId)) {
            user.favorites.push(fighterId);
            await user.save();
        }
        res.json({ message: 'Fighter added to favorites', favorites: user.favorites });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add favorite' });
    }
});


app.delete('/api/favorites/remove', async (req, res) => {
    try {
        const { userId, fighterId } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.favorites = user.favorites.filter(id => id !== fighterId);
        await user.save();
        res.json({ message: 'Fighter removed from favorites', favorites: user.favorites });
    } catch (error) {
        res.status(500).json({ message: 'Failed to remove favorite' });
    }
});


app.get('/api/favorites/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ favorites: user.favorites });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch favorites' });
    }
});


// Fight Simulation Logic with XP Update
app.post('/api/fights/simulate', async (req, res) => {
    try {
        const { userId, fighter1Id, fighter2Id } = req.body;
        // Fetch power stats of both fighters
        const fighter1 = (await axios.get(`${SUPERHERO_API_URL}/${fighter1Id}/powerstats`)).data;
        const fighter2 = (await axios.get(`${SUPERHERO_API_URL}/${fighter2Id}/powerstats`)).data;


        // Compute a weighted power score for each fighter
        const calcPower = (stats) =>
            stats.power * 0.3 + stats.strength * 0.25 + stats.speed * 0.15 + stats.combat * 0.2 + stats.durability * 0.1;


        const fighter1Power = calcPower(fighter1);
        const fighter2Power = calcPower(fighter2);
       
        // Determine winner based on higher power score
        const winner = fighter1Power > fighter2Power ? fighter1Id : fighter2Id;
       
        // Award XP to the user who initiated the fight
        await updateUserXP(userId, 50);


        res.json({ fighter1Id, fighter2Id, winner });
    } catch (error) {
        res.status(500).json({ message: 'Fight simulation failed' });
    }
});


// Real-time Fight Commentary using Socket.io
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
   
    socket.on('joinFightRoom', (fightId) => {
        socket.join(fightId);
        console.log(`User joined fight room: ${fightId}`);
    });
   
    socket.on('sendCommentary', ({ fightId, message }) => {
        io.to(fightId).emit('receiveCommentary', message);
    });
   
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});


// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));