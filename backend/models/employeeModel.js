const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    shift: {
        type: String,
        enum: ['9:00 AM - 5:00 PM', '1:00 PM - 9:00 PM', '10:00 PM - 6:00 AM'],
        required: true
    },
    email: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    password: {
        type: String,
        default: '1234',
        required: true
    }
});

employeeSchema.index({ email: 1 });

module.exports = mongoose.model("Employee", employeeSchema); 
