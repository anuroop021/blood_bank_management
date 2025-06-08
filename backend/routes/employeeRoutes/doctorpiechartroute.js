const express = require('express');
const { ScheduleModel } = require('../../models/donorModel');
const doctorpiechartrouter = express.Router();
const redis = require('redis');
const redisClient = redis.createClient({
  url: 'redis://default:AWcWAAIjcDFkNjg4MzUwODUwMjE0MGQ3ODJiNTI3YjZmOWZkMDg0MXAxMA@many-mackerel-26390.upstash.io:6379',
  socket: {
    tls: true, 
    rejectUnauthorized: false, 
  },
});

redisClient.connect()

doctorpiechartrouter.get('/', async (req, res) => {
  const cacheKey = 'doctorPieChartCounts';
  try {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log('Served from Redis cache');
      return res.json(JSON.parse(cachedData)); // Return cached data
    }

    console.log('Fetched from MongoDB (not cached)');

    const counts = await ScheduleModel.aggregate([
      { $group: { _id: '$doctor', count: { $sum: 1 } } }
    ]);
    
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(counts));
    res.json(counts);
  } catch (error) {
    console.error('Error fetching recipient counts:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = doctorpiechartrouter;
