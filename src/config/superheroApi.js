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
        if (!response.data || response.data.response === 'error') {
            throw new Error(response.data.error || 'Invalid API response');
        }
        if (isDev) console.log(`✅ API Response for ${endpoint}:`, response.data);
        return response.data;
    } catch (error) {
        console.error(`❌ Error fetching ${endpoint}:`, error.message);
        throw new Error('Failed to fetch superhero data');
    }
};

const fetchCharacterById = async (characterId) => fetchFromAPI(`${characterId}`);
const fetchPowerStats = async (characterId) => fetchFromAPI(`${characterId}/powerstats`);
const fetchBiography = async (characterId) => fetchFromAPI(`${characterId}/biography`);
const fetchAppearance = async (characterId) => fetchFromAPI(`${characterId}/appearance`);
const fetchWork = async (characterId) => fetchFromAPI(`${characterId}/work`);
const fetchConnections = async (characterId) => fetchFromAPI(`${characterId}/connections`);
const fetchImage = async (characterId) => fetchFromAPI(`${characterId}/image`);
const searchCharacterByName = async (name) => fetchFromAPI(`search/${name}`);

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
// In this code snippet, we have a module that interacts with the Superhero API using Axios. The module exports functions to fetch superhero data by ID, search for a character by name, and retrieve various details about a character. The module also configures Axios to retry failed requests up to three times with an exponential delay between retries. The API base URL and API key are stored in environment variables, and the module logs API responses in development mode.