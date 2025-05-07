const mongoose = require('mongoose');


const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
});

adminSchema.index({ username: 1 });

module.exports = mongoose.model('AdminModel', adminSchema);
