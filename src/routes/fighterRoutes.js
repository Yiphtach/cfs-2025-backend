// const express = require('express');
// const axios = require('axios');
// const { getSuperheroApiUrl } = require('../config/superheroApi');

// const router = express.Router();

// // Search for superheroes by name
// router.get('/search/:name', async (req, res) => {
//     try {
//         const { name } = req.params;
//         const response = await axios.get(`${getSuperheroApiUrl()}/search/${name}`);
//         res.json(response.data);
//     } catch (error) {
//         res.status(500).json({ message: 'Failed to fetch superhero data' });
//     }
// });

// // Get superhero details by ID
// router.get('/:id', async (req, res) => {
//     try {
//         const { id } = req.params;
//         const response = await axios.get(`${getSuperheroApiUrl()}/${id}`);
//         res.json(response.data);
//     } catch (error) {
//         res.status(500).json({ message: 'Failed to fetch superhero details' });
//     }
// });

// // Get powerstats
// router.get('/:id/powerstats', async (req, res) => {
//     try {
//         const { id } = req.params;
//         const response = await axios.get(`${getSuperheroApiUrl()}/${id}/powerstats`);
//         res.json(response.data);
//     } catch (error) {
//         res.status(500).json({ message: 'Failed to fetch powerstats' });
//     }
// });

// // Get biography
// router.get('/:id/biography', async (req, res) => {
//     try {
//         const { id } = req.params;
//         const response = await axios.get(`${getSuperheroApiUrl()}/${id}/biography`);
//         res.json(response.data);
//     } catch (error) {
//         res.status(500).json({ message: 'Failed to fetch biography' });
//     }
// });

// // Get appearance
// router.get('/:id/appearance', async (req, res) => {
//     try {
//         const { id } = req.params;
//         const response = await axios.get(`${getSuperheroApiUrl()}/${id}/appearance`);
//         res.json(response.data);
//     } catch (error) {
//         res.status(500).json({ message: 'Failed to fetch appearance' });
//     }
// });

// // Get work details
// router.get('/:id/work', async (req, res) => {
//     try {
//         const { id } = req.params;
//         const response = await axios.get(`${getSuperheroApiUrl()}/${id}/work`);
//         res.json(response.data);
//     } catch (error) {
//         res.status(500).json({ message: 'Failed to fetch work details' });
//     }
// });

// // Get connections
// router.get('/:id/connections', async (req, res) => {
//     try {
//         const { id } = req.params;
//         const response = await axios.get(`${getSuperheroApiUrl()}/${id}/connections`);
//         res.json(response.data);
//     } catch (error) {
//         res.status(500).json({ message: 'Failed to fetch connections' });
//     }
// });

// // Get image
// router.get('/:id/image', async (req, res) => {
//     try {
//         const { id } = req.params;
//         const response = await axios.get(`${getSuperheroApiUrl()}/${id}/image`);
//         res.json(response.data);
//     } catch (error) {
//         res.status(500).json({ message: 'Failed to fetch image' });
//     }
// });

// module.exports = router;
