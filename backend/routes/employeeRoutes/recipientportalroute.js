const express = require('express');
const RecipientPortal = require('../../models/recipientportalmodel');
const recipientportalrouter = express.Router();


recipientportalrouter.post('/', async (req, res) => {
  try {
      const { username, bloodType, contactNumber, requiredUnits, dateNeeded, additionalInfo } = req.body;

      if (!req.session.donor || req.session.donor.username !== username) {
          return res.status(401).json({ message: 'Unauthorized. Please log in again.' });
      }

      const recipientFormSubmission = new RecipientPortal({
          patientName: username,  
          bloodType,
          contactNumber,
          requiredUnits,
          dateNeeded,
          additionalInfo
      });

      await recipientFormSubmission.save();
      res.status(201).json({ success: true, message: 'Form submitted successfully!' });
  } catch (err) {
      res.status(400).json({ success: false, error: err.message });
  }
});


module.exports = recipientportalrouter;
