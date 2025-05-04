const express = require('express');
const {DonorModel} = require('../../models/donorModel');
const donorpiechartrouter = express.Router();
const redis = require('redis');
const redisClient = redis.createClient({
  url: 'redis://default:AVj8AAIjcDEwM2UwZTQ4NmUwZjQ0NjE5YTNhNzVmODY5Y2IyYjg5MXAxMA@settling-gecko-22780.upstash.io:6379',
  socket: {
    tls: true, 
    rejectUnauthorized: false, 
  },
});

redisClient.connect()

donorpiechartrouter.get('/', async (req, res) => {
  const cacheKey = 'donorBloodGroupCounts'; 
  try {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log('Served from Redis cache');
      return res.json(JSON.parse(cachedData));
    }

    console.log('Fetched from MongoDB (not cached)');

    const counts = await DonorModel.aggregate([
      { $group: { _id: '$bloodGroup', count: { $sum: 1 } } }
    ]);
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(counts));

    res.json(counts);
  } catch (error) {
    console.error('Error fetching recipient counts:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = donorpiechartrouter;
