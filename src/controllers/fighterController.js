// src/controllers/fighterController.js
const superheroApi = require('../config/superheroApi');
const axios = require('axios');

// Cache configuration
const CACHE_DURATION = 3600000; // 1 hour in milliseconds
const characterCache = new Map();

// Cache helper functions
const getCachedData = (key) => {
    const cached = characterCache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
    }
    return null;
};

const setCacheData = (key, data) => {
    characterCache.set(key, {
        data,
        timestamp: Date.now()
    });
};

// Response helper
const sendResponse = (res, data, statusCode = 200) => {
    res.status(statusCode).json({
        status: statusCode === 200 ? 'success' : 'error',
        data: statusCode === 200 ? data : null,
        error: statusCode !== 200 ? data : null
    });
};

// @desc    Get fighter by ID
// @route   GET /api/fighters/:id
// @access  Private
const getFighterById = async (req, res) => {
    try {
        const { id } = req.params;

        // Check cache first
        const cachedFighter = getCachedData(`fighter-${id}`);
        if (cachedFighter) {
            return sendResponse(res, cachedFighter);
        }

        const fighter = await superheroApi.getCharacter(id);
        
        if (!fighter || fighter.response === 'error') {
            return sendResponse(res, { message: 'Fighter not found' }, 404);
        }

        // Cache the result
        setCacheData(`fighter-${id}`, fighter);
        sendResponse(res, fighter);

    } catch (error) {
        console.error('Error fetching fighter by ID:', error);
        sendResponse(res, { 
            message: 'Failed to fetch fighter details',
            error: error.message 
        }, error.response?.status || 500);
    }
};

// @desc    Search for fighters by name
// @route   GET /api/fighters/search/:name
// @access  Private
const searchFighterByName = async (req, res) => {
    try {
        const { name } = req.params;

        if (!name || name.length < 2) {
            return sendResponse(res, { 
                message: 'Search term must be at least 2 characters long' 
            }, 400);
        }

        // Check cache
        const cachedSearch = getCachedData(`search-${name}`);
        if (cachedSearch) {
            return sendResponse(res, cachedSearch);
        }

        const results = await superheroApi.searchCharacter(name);

        if (!results || results.response === 'error') {
            return sendResponse(res, { message: 'No fighters found' }, 404);
        }

        // Process and enhance search results
        const enhancedResults = results.results.map(fighter => ({
            id: fighter.id,
            name: fighter.name,
            powerstats: fighter.powerstats,
            image: fighter.image.url,
            publisher: fighter.biography.publisher
        }));

        // Cache the processed results
        setCacheData(`search-${name}`, enhancedResults);
        sendResponse(res, enhancedResults);

    } catch (error) {
        console.error('Error searching fighters:', error);
        sendResponse(res, { 
            message: 'Failed to search fighters',
            error: error.message 
        }, 500);
    }
};

// @desc    Get specific fighter stats
// @route   GET /api/fighters/:id/:category
// @access  Private
const getFighterStats = async (req, res) => {
    try {
        const { id, category } = req.params;
        const validCategories = ['powerstats', 'biography', 'appearance', 'work', 'connections', 'image'];

        if (!validCategories.includes(category)) {
            return sendResponse(res, { 
                message: 'Invalid category',
                validCategories 
            }, 400);
        }

        // Check cache
        const cachedStats = getCachedData(`fighter-${id}-${category}`);
        if (cachedStats) {
            return sendResponse(res, cachedStats);
        }

        let data;
        switch (category) {
            case 'powerstats':
                data = await superheroApi.getPowerStats(id);
                // Convert string values to numbers
                data = Object.entries(data).reduce((acc, [key, value]) => ({
                    ...acc,
                    [key]: parseInt(value) || 0
                }), {});
                break;
            case 'biography':
                data = await superheroApi.getBiography(id);
                break;
            case 'appearance':
                data = await superheroApi.getAppearance(id);
                break;
            case 'work':
                data = await superheroApi.getWork(id);
                break;
            case 'connections':
                data = await superheroApi.getConnections(id);
                break;
            case 'image':
                data = await superheroApi.getImage(id);
                break;
        }

        if (!data || data.response === 'error') {
            return sendResponse(res, { 
                message: `Failed to fetch ${category} data` 
            }, 404);
        }

        // Cache the result
        setCacheData(`fighter-${id}-${category}`, data);
        sendResponse(res, data);

    } catch (error) {
        console.error(`Error fetching fighter ${category}:`, error);
        sendResponse(res, { 
            message: `Failed to fetch ${category}`,
            error: error.message 
        }, error.response?.status || 500);
    }
};

// @desc    Get fighter image
// @route   GET /api/fighters/:id/image
// @access  Private
const getFighterImage = async (req, res) => {
    try {
        const { id } = req.params;

        // Check cache
        const cachedImage = getCachedData(`fighter-image-${id}`);
        if (cachedImage) {
            return sendResponse(res, cachedImage);
        }

        const imageData = await superheroApi.getImage(id);

        if (!imageData || !imageData.url) {
            return sendResponse(res, { message: 'Image not found' }, 404);
        }

        const result = { 
            imageUrl: imageData.url,
            id: id
        };

        // Cache the result
        setCacheData(`fighter-image-${id}`, result);
        sendResponse(res, result);

    } catch (error) {
        console.error('Error fetching fighter image:', error);
        sendResponse(res, { 
            message: 'Failed to fetch fighter image',
            error: error.message 
        }, 500);
    }
};

// @desc    Get top ranked fighters
// @route   GET /api/fighters/rankings/top
// @access  Private
const getTopFighters = async (req, res) => {
    try {
        const { limit = 10, sort = 'wins' } = req.query;
        
        // Check cache
        const cacheKey = `top-fighters-${limit}-${sort}`;
        const cachedRankings = getCachedData(cacheKey);
        if (cachedRankings) {
            return sendResponse(res, cachedRankings);
        }

        const validSortFields = ['wins', 'winRate', 'totalFights'];
        const sortField = validSortFields.includes(sort) ? sort : 'wins';

        const fighters = await Fighter.find()
            .sort({ [`stats.${sortField}`]: -1 })
            .limit(Number(limit))
            .select('name powerstats stats image biography.publisher')
            .lean();

        // Enhance with win rates
        const enhancedFighters = fighters.map(fighter => ({
            ...fighter,
            winRate: ((fighter.stats.wins / fighter.stats.totalFights) * 100 || 0).toFixed(2)
        }));

        // Cache results
        setCacheData(cacheKey, enhancedFighters);
        sendResponse(res, enhancedFighters);

    } catch (error) {
        console.error('Error fetching top fighters:', error);
        sendResponse(res, {
            message: 'Failed to fetch top fighters',
            error: error.message
        }, 500);
    }
};

// @desc    Get fighters by publisher
// @route   GET /api/fighters/publisher/:publisher
// @access  Private
const getFightersByPublisher = async (req, res) => {
    try {
        const { publisher } = req.params;
        const { limit = 20, page = 1 } = req.query;

        // Check cache
        const cacheKey = `publisher-${publisher}-${page}-${limit}`;
        const cachedResults = getCachedData(cacheKey);
        if (cachedResults) {
            return sendResponse(res, cachedResults);
        }

        const fighters = await Fighter.find({ 'biography.publisher': publisher })
            .sort({ name: 1 })
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .select('name powerstats image biography')
            .lean();

        const total = await Fighter.countDocuments({ 'biography.publisher': publisher });

        const result = {
            fighters,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                currentPage: page,
                limit
            }
        };

        // Cache results
        setCacheData(cacheKey, result);
        sendResponse(res, result);

    } catch (error) {
        console.error('Error fetching fighters by publisher:', error);
        sendResponse(res, {
            message: 'Failed to fetch fighters by publisher',
            error: error.message
        }, 500);
    }
};

// @desc    Get matchup analysis between two fighters
// @route   GET /api/fighters/matchup/:fighter1Id/:fighter2Id
// @access  Private
const getMatchupAnalysis = async (req, res) => {
    try {
        const { fighter1Id, fighter2Id } = req.params;

        // Check cache
        const cacheKey = `matchup-${fighter1Id}-${fighter2Id}`;
        const cachedAnalysis = getCachedData(cacheKey);
        if (cachedAnalysis) {
            return sendResponse(res, cachedAnalysis);
        }

        // Fetch both fighters
        const [fighter1, fighter2] = await Promise.all([
            superheroApi.getCharacter(fighter1Id),
            superheroApi.getCharacter(fighter2Id)
        ]);

        if (!fighter1 || !fighter2) {
            return sendResponse(res, { message: 'One or both fighters not found' }, 404);
        }

        // Calculate stat comparisons
        const analysis = {
            fighters: {
                fighter1: {
                    id: fighter1Id,
                    name: fighter1.name,
                    image: fighter1.image.url
                },
                fighter2: {
                    id: fighter2Id,
                    name: fighter2.name,
                    image: fighter2.image.url
                }
            },
            statComparison: {},
            advantages: {
                fighter1: [],
                fighter2: []
            },
            overallProbability: {}
        };

        // Compare each stat
        Object.entries(fighter1.powerstats).forEach(([stat, value1]) => {
            const value2 = fighter2.powerstats[stat];
            const difference = Number(value1) - Number(value2);
            
            analysis.statComparison[stat] = {
                fighter1: Number(value1),
                fighter2: Number(value2),
                difference,
                advantage: difference > 0 ? 'fighter1' : difference < 0 ? 'fighter2' : 'none'
            };

            if (difference > 10) {
                analysis.advantages.fighter1.push(stat);
            } else if (difference < -10) {
                analysis.advantages.fighter2.push(stat);
            }
        });

        // Calculate overall probability
        const totalStats1 = Object.values(fighter1.powerstats).reduce((sum, val) => sum + Number(val), 0);
        const totalStats2 = Object.values(fighter2.powerstats).reduce((sum, val) => sum + Number(val), 0);
        const totalPower = totalStats1 + totalStats2;

        analysis.overallProbability = {
            fighter1: ((totalStats1 / totalPower) * 100).toFixed(2),
            fighter2: ((totalStats2 / totalPower) * 100).toFixed(2)
        };

        // Cache analysis
        setCacheData(cacheKey, analysis);
        sendResponse(res, analysis);

    } catch (error) {
        console.error('Error analyzing matchup:', error);
        sendResponse(res, {
            message: 'Failed to analyze matchup',
            error: error.message
        }, 500);
    }
};

// @desc    Get fighter's battle history
// @route   GET /api/fighters/:id/history
// @access  Private
const getFighterHistory = async (req, res) => {
    try {
        const { id } = req.params;
        const { limit = 10, page = 1 } = req.query;

        const history = await Fight.find({
            $or: [
                { 'fighters.challenger.id': id },
                { 'fighters.opponent.id': id }
            ]
        })
            .sort({ fightDate: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .lean();

        const total = await Fight.countDocuments({
            $or: [
                { 'fighters.challenger.id': id },
                { 'fighters.opponent.id': id }
            ]
        });

        const enhancedHistory = history.map(fight => ({
            ...fight,
            result: fight.result.winner.id === id ? 'WIN' : 'LOSS',
            opponent: fight.fighters.challenger.id === id ? 
                fight.fighters.opponent : fight.fighters.challenger
        }));

        sendResponse(res, {
            history: enhancedHistory,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                currentPage: Number(page),
                limit: Number(limit)
            }
        });

    } catch (error) {
        console.error('Error fetching fighter history:', error);
        sendResponse(res, {
            message: 'Failed to fetch fighter history',
            error: error.message
        }, 500);
    }
};

// @desc    Toggle fighter as favorite for current user
// @route   POST /api/fighters/:id/favorite
// @access  Private
const toggleFavoriteFighter = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const fighter = await superheroApi.getCharacter(id);
        if (!fighter) {
            return sendResponse(res, { message: 'Fighter not found' }, 404);
        }

        const user = await User.findById(userId);
        const favoriteIndex = user.favorites.findIndex(f => f.characterId === id);

        if (favoriteIndex > -1) {
            // Remove from favorites
            user.favorites.splice(favoriteIndex, 1);
            await user.save();
            sendResponse(res, { message: 'Fighter removed from favorites' });
        } else {
            // Add to favorites
            user.favorites.push({
                characterId: id,
                name: fighter.name,
                addedAt: new Date()
            });
            await user.save();
            sendResponse(res, { message: 'Fighter added to favorites' });
        }

    } catch (error) {
        console.error('Error toggling favorite fighter:', error);
        sendResponse(res, {
            message: 'Failed to update favorites',
            error: error.message
        }, 500);
    }
};

// Add these to the exports
module.exports = {
    getFighterById,
    searchFighterByName,
    getFighterStats,
    getFighterImage,
    getTopFighters,
    getFightersByPublisher,
    getMatchupAnalysis,
    getFighterHistory,
    toggleFavoriteFighter
};