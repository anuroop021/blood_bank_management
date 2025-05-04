const express = require('express');
const { ScheduleModel } = require('../../models/donorModel');
const assigneddonorsrouter = express.Router();
const redis = require('redis');
const redisClient = redis.createClient({
  url: 'redis://default:AVj8AAIjcDEwM2UwZTQ4NmUwZjQ0NjE5YTNhNzVmODY5Y2IyYjg5MXAxMA@settling-gecko-22780.upstash.io:6379',
  socket: {
    tls: true, 
    rejectUnauthorized: false, 
  },
});

redisClient.connect()
// Get only unverified patients assigned to a doctor
assigneddonorsrouter.get('/', async (req, res) => {
  const username = req.query.username;
  const cacheKey = `unverifiedPatients_${username}`;

  try {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log('Served from Redis cache');
      return res.json(JSON.parse(cachedData)); 
    }

    console.log('Fetched from MongoDB (not cached)');

    const patients = await ScheduleModel.find({
      doctor: username,
      is_verified_by_mp: 0, 
    });

    if (patients.length === 0) {
      return res.status(404).json({ message: 'No unverified patients found for this doctor' });
    }

    await redisClient.setEx(cacheKey, 3600, JSON.stringify(patients));
    res.json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update verification status
assigneddonorsrouter.put('/verify/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const patient = await ScheduleModel.findByIdAndUpdate(
      id,
      { is_verified_by_mp: 1 },
      { new: true }
    );

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.status(200).json({ message: 'Patient verified successfully' });
  } catch (error) {
    console.error('Error updating verification status:', error);
    res.status(500).json({ message: 'Failed to verify patient' });
  }
});

module.exports = assigneddonorsrouter;
