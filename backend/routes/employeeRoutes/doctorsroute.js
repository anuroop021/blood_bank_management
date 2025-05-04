const express = require('express');
const MedicalProfessional = require('../../models/medicalprofessionalmodel');
const doctorsrouter = express.Router();
const redis = require('redis');
const redisClient = redis.createClient({
  socket: {
    host: process.env.NODE_ENV === 'production' ? "settling-gecko-22780.upstash.io" : "localhost", // Conditional host
    port: 6379,
    tls: process.env.NODE_ENV === 'production' ? true : false, // Use TLS/SSL for Upstash
  },
  password: process.env.NODE_ENV === 'production' ? "AVj8AAIjcDEwM2UwZTQ4NmUwZjQ0NjE5YTNhNzVmODY5Y2IyYjg5MXAxMA" : undefined, // Password for Upstash, or undefined for localhost
});

redisClient.connect()
  .then(() => console.log('Connected to Redis'))
  .catch(err => console.error('Redis connection error:', err));

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
