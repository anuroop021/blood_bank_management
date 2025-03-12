const mongoose = require('mongoose');

const HospPaymentSchema = new mongoose.Schema({
    HospitalName: { type: String, required: true },
    bloodType: { type: String, required: true },
    contactNumber: { 
        type: String, 
        required: true, 
        validate: {
            validator: function(value) {
                return /^[1-9]\d{9}$/.test(value); 
            },
            message: 'Contact number must be exactly 10 digits and cannot start with 0.'
        }
    },
    requiredUnits: { type: Number, required: true },
    urgencyLevel: { type: String, required: true },
    dateNeeded: { type: Date, required: true },
    additionalInfo: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('HospPayment', HospPaymentSchema);
