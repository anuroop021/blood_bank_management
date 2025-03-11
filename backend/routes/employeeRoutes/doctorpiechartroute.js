const express = require('express');
const { ScheduleModel } = require('../../models/donorModel');
const doctorpiechartrouter = express.Router();

doctorpiechartrouter.get('/', async (req, res) => {
  try {
    const counts = await ScheduleModel.aggregate([
      { $group: { _id: '$doctor', count: { $sum: 1 } } }
    ]);
    res.json(counts);
  } catch (error) {
    console.error('Error fetching recipient counts:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = doctorpiechartrouter;
