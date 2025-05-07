const mongoose = require('mongoose');

const medicalProfessionalSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    default:'1234'
  },
  role: {
    type: String,
    required: true,
    enum: ['Doctor', 'Nurse'],
  },
  contactNumber: {
    type: String,
    required: true,
    match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number'],
  },
  email: {
    type: String,
    required: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
  }
  
});

 
medicalProfessionalSchema.index({ username: 1 });

module.exports = mongoose.model('medicalProfessional', medicalProfessionalSchema);
