const express = require('express');
const {ScheduleModel} = require('../../models/donorModel'); 
const assigndoctorrouter = express.Router();
const redis = require('redis');
const redisClient = redis.createClient({
  socket: {
    host: 'localhost', 
    port: 6379
  }
}); 
redisClient.connect()

assigndoctorrouter.get('/', async (req, res) => {
  const cacheKey = 'schedulesData';
  try {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log('Served from Redis cache');
      return res.json(JSON.parse(cachedData)); 
    }

    console.log('Fetched from MongoDB (not cached)');

    const schedules = await ScheduleModel.find();
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(schedules));

    res.json(schedules);
  } catch (error) {
    console.error('Error fetching schedules:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = assigndoctorrouter;