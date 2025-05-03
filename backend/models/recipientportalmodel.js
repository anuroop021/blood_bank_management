const mongoose = require('mongoose');

const recipientPortalSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  bloodType: { type: String, required: true },
  contactNumber: { 
    type: String, 
    required: true,
    validate: {
      validator: function(v) {
        return /^[1-9]\d{9}$/.test(v); 
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  requiredUnits: { type: Number, required: true },
  dateNeeded: { type: Date, required: true },
  additionalInfo: { type: String },
});

module.exports = mongoose.model('RecipientPortal', recipientPortalSchema);
