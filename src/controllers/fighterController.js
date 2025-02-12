const { fetchCharacterById, searchCharacterByName, fetchPowerStats, fetchBiography, fetchAppearance, fetchWork, fetchConnections, fetchImage } = require('../config/superheroApi');
const axios = require('axios');

// Get fighter by ID
const getFighterById = async (req, res) => {
    try {
        const { id } = req.params;
        const fighter = await fetchCharacterById(id);
        res.json(fighter);
    } catch (error) {
        res.status(error.response?.status || 500).json({ message: 'Failed to fetch superhero details' });
    }
};

// Search fighter by name
const searchFighterByName = async (req, res) => {
    try {
        const { name } = req.params;
        const results = await searchCharacterByName(name);
        res.json(results);
    } catch (error) {
        res.status(error.response?.status || 500).json({ message: 'Failed to search for superhero' });
    }
};

// Get specific fighter data (powerstats, biography, etc.)
const getFighterStats = async (req, res) => {
    try {
        const { id, category } = req.params;
        let data;
        switch (category) {
            case 'powerstats':
                data = await fetchPowerStats(id);
                break;
            case 'biography':
                data = await fetchBiography(id);
                break;
            case 'appearance':
                data = await fetchAppearance(id);
                break;
            case 'work':
                data = await fetchWork(id);
                break;
            case 'connections':
                data = await fetchConnections(id);
                break;
            case 'image':
                data = await fetchImage(id);
                break;
            default:
                return res.status(400).json({ message: 'Invalid category' });
        }
        res.json(data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ message: `Failed to fetch ${category}` });
    }
};

const getFighterImage = async (req, res) => {
    try {
        const { id } = req.params;
        const API_KEY = process.env.SUPERHERO_API_KEY;
        const API_URL = `https://superheroapi.com/api/${API_KEY}/${id}/image`;

        const response = await axios.get(API_URL);
        if (!response.data || !response.data.url) {
            return res.status(404).json({ message: 'Image not found' });
        }

        res.json({ imageUrl: response.data.url });
    } catch (error) {
        console.error('Error fetching fighter image:', error);
        res.status(500).json({ message: 'Failed to fetch fighter image' });
    }
};


module.exports = { getFighterById, searchFighterByName, getFighterStats, getFighterImage };
// The fighterController.js file defines the controller logic for handling requests related to fighters. It includes functions to get fighter details by ID, search for fighters by name, and get specific fighter data (powerstats, biography, etc.). The controller functions make use of the superheroApi service to interact with the Superhero API and fetch data. The controller functions are exported for use in the fighterRoutes.js file.