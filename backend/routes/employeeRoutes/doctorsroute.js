const express = require('express');
const MedicalProfessional = require('../../models/medicalprofessionalmodel');
const doctorsrouter = express.Router();

doctorsrouter.get('/', async (req, res) => {
  try {
    const doctors = await MedicalProfessional.find({}, 'username');
    res.json(doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
});

module.exports = doctorsrouter;
