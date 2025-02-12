// src/services/superheroApi.js - API Wrapper for Superhero API
const axios = require('axios');
const dotenv = require('dotenv');
const axiosRetry = require('axios-retry').default;

dotenv.config();

const API_BASE_URL = `https://superheroapi.com/api/${process.env.SUPERHERO_API_KEY}`;
const isDev = process.env.NODE_ENV === 'development';

// Configure automatic retries for failed requests
axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

const fetchFromAPI = async (endpoint) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${endpoint}`);
        if (isDev) console.log(`✅ API Response for ${endpoint}:`, response.data);
        return response.data;
    } catch (error) {
        console.error(`❌ Error fetching ${endpoint}:`, error.message);
        throw new Error('Failed to fetch superhero data');
    }
};


const fetchCharacterById = (characterId) => fetchFromAPI(`${characterId}`);
const fetchPowerStats = (characterId) => fetchFromAPI(`${characterId}/powerstats`);
const fetchBiography = (characterId) => fetchFromAPI(`${characterId}/biography`);
const fetchAppearance = (characterId) => fetchFromAPI(`${characterId}/appearance`);
const fetchWork = (characterId) => fetchFromAPI(`${characterId}/work`);
const fetchConnections = (characterId) => fetchFromAPI(`${characterId}/connections`);
const fetchImage = (characterId) => fetchFromAPI(`${characterId}/image`);
const searchCharacterByName = (name) => fetchFromAPI(`search/${name}`);

module.exports = {
    fetchCharacterById,
    fetchPowerStats,
    fetchBiography,
    fetchAppearance,
    fetchWork,
    fetchConnections,
    fetchImage,
    searchCharacterByName,
};
