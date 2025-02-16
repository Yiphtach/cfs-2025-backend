// src/controllers/fighterController.js - Fetch Superheroes & Power Stats
const { 
    fetchCharacterById, 
    fetchPowerStats, 
    fetchBiography, 
    fetchAppearance, 
    fetchWork, 
    fetchConnections, 
    fetchImage, 
    searchCharacterByName 
} = require('../services/superheroApi');

// @desc Get fighter by ID
// @route GET /api/id/:id
// @access Public
const getFighterById = async (req, res) => {
    try {
        const { id } = req.params;
        const fighter = await fetchCharacterById(id);
        res.json(fighter);
    } catch (error) {
        res.status(error.response?.status || 500).json({ message: 'Failed to fetch superhero details' });
    }
};

// @desc Get fighter power stats
// @route GET /api/id/:id/powerstats
// @access Public
const getFighterPowerStats = async (req, res) => {
    try {
        const { id } = req.params;
        const stats = await fetchPowerStats(id);
        res.json(stats);
    } catch (error) {
        res.status(error.response?.status || 500).json({ message: 'Failed to fetch power stats' });
    }
};

// @desc Get specific fighter data (biography, appearance, work, connections, image)
// @route GET /api/id/:id/:category
// @access Public
const getFighterData = async (req, res) => {
    try {
        const { id, category } = req.params;
        const validCategories = {
            biography: fetchBiography,
            appearance: fetchAppearance,
            work: fetchWork,
            connections: fetchConnections,
            image: fetchImage,
        };

        if (!validCategories[category]) {
            return res.status(400).json({ message: 'Invalid category' });
        }

        const data = await validCategories[category](id);
        res.json(data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ message: `Failed to fetch ${req.params.category}` });
    }
};

// @desc Search fighter by name
// @route GET /api/search/:name
// @access Public
const searchFighterByName = async (req, res) => {
    try {
        const { name } = req.params;
        const results = await searchCharacterByName(name);
        res.json(results);
    } catch (error) {
        res.status(error.response?.status || 500).json({ message: 'Failed to search for superhero' });
    }
};

module.exports = { 
    getFighterById, 
    getFighterPowerStats, 
    getFighterData, 
    searchFighterByName 
};
// In this code snippet, we have a controller module that exports functions to fetch superhero data by ID, search for a character by name, and retrieve various details about a character. The module uses functions from the superheroApi module to interact with the Superhero API and handles errors by returning appropriate status codes and error messages.