//Fetch superheroes & power stats
const { fetchSuperheroData } = require('../config/superheroApi');

// Get fighter by ID
const getFighterById = async (req, res) => {
    try {
        const { id } = req.params;
        const fighter = await fetchSuperheroData(id);
        res.json(fighter);
    } catch (error) {
        res.status(error.response?.status || 500).json({ message: 'Failed to fetch superhero details' });
    }
};

// Search fighter by name
const searchFighterByName = async (req, res) => {
    try {
        const { name } = req.params;
        const results = await fetchSuperheroData(`search/${name}`);
        res.json(results);
    } catch (error) {
        res.status(error.response?.status || 500).json({ message: 'Failed to search for superhero' });
    }
};

// Get specific fighter data (powerstats, biography, etc.)
const getFighterStats = async (req, res) => {
    try {
        const { id, category } = req.params;
        if (!['powerstats', 'biography', 'appearance', 'work', 'connections', 'image'].includes(category)) {
            return res.status(400).json({ message: 'Invalid category' });
        }
        const data = await fetchSuperheroData(`${id}/${category}`);
        res.json(data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ message: `Failed to fetch ${category}` });
    }
};

module.exports = { getFighterById, searchFighterByName, getFighterStats };
