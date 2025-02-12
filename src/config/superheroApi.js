// API wrapper for Superhero API

// src/config/superheroApi.js
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const API_BASE_URL = `https://superheroapi.com/api/${process.env.SUPERHERO_API_KEY}`;

const fetchCharacterById = async (characterId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${characterId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching character by ID:', error);
        throw error;
    }
};

const fetchPowerStats = async (characterId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${characterId}/powerstats`);
        return response.data;
    } catch (error) {
        console.error('Error fetching power stats:', error);
        throw error;
    }
};

const fetchBiography = async (characterId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${characterId}/biography`);
        return response.data;
    } catch (error) {
        console.error('Error fetching biography:', error);
        throw error;
    }
};

const fetchAppearance = async (characterId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${characterId}/appearance`);
        return response.data;
    } catch (error) {
        console.error('Error fetching appearance:', error);
        throw error;
    }
};

const fetchWork = async (characterId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${characterId}/work`);
        return response.data;
    } catch (error) {
        console.error('Error fetching work details:', error);
        throw error;
    }
};

const fetchConnections = async (characterId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${characterId}/connections`);
        return response.data;
    } catch (error) {
        console.error('Error fetching connections:', error);
        throw error;
    }
};

const fetchImage = async (characterId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${characterId}/image`);
        return response.data;
    } catch (error) {
        console.error('Error fetching image:', error);
        throw error;
    }
};

const searchCharacterByName = async (name) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/search/${name}`);
        return response.data;
    } catch (error) {
        console.error('Error searching character by name:', error);
        throw error;
    }
};

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