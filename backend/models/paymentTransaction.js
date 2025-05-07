const mongoose = require("mongoose");



const paymentTransactionSchema = new mongoose.Schema({
  transactionID: {
    type: String,
    required: true,
    unique: true,
  },
  userType: {
    type: String,
    required: true,
    enum: ['individual', 'hospital'],
  },
  bloodType: {
    type: String,
    required: true,
    enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
  },
  bloodUnits: {
    type: Number,
    required: true,
    min: 1,
  },
  amount: {
    type: Number,
    required: true,
  },
  transactionStatus: {
    type: String,
    required: true,
    unique: true,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  transactionDate: {
    type: Date,
    default: Date.now,
  },
  donor: {
    type: String,
    default: null,
  },
  hospitalID: {
    type: String,
    default: null,
  },
});

paymentTransactionSchema.index({ transactionStatus: 1});

module.exports = mongoose.model('PaymentTransaction', paymentTransactionSchema);
