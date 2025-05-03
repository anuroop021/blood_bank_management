const express = require('express');
const MedicalProfessional = require('../../models/medicalprofessionalmodel');
const doctorsrouter = express.Router();
const redis = require("redis");
const redisClient = redis.createClient({
  socket: {
    host: 'localhost', 
    port: 6379
  }
}); 
redisClient.connect()

doctorsrouter.get('/', async (req, res) => {
  const cacheKey = 'doctorUsernames';
  try {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log('Served from Redis cache');
      return res.json(JSON.parse(cachedData)); 
    }

    console.log('Fetched from MongoDB (not cached)');

    const doctors = await MedicalProfessional.find({}, 'username');
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(doctors));
    res.json(doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
});

module.exports = doctorsrouter;
