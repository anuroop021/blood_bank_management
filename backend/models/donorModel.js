const mongoose = require("mongoose");


const validateIDNumber = function(idType, idNumber) {
  let regex, validationMessage;
  switch (idType) {
    case "Aadhar":
      regex = /^\d{12}$/;
      validationMessage = "Invalid Aadhar number!";
      break;
    case "Driving License":
      regex = /^[A-Za-z0-9]{16}$/;
      validationMessage = "Invalid Driving License number!";
      break;
    case "PAN":
      regex = /^[A-Za-z0-9]{10}$/;
      validationMessage = "Invalid PAN number!";
      break;
    case "Passport":
      regex = /^[A-Za-z0-9]{12}$/;
      validationMessage = "Invalid Passport number!";
      break;
    case "Voter ID":
      regex = /^[A-Za-z0-9]{10}$/;
      validationMessage = "Invalid Voter ID number!";
      break;
    default:
      return true; 
  }
  if (!regex.test(idNumber)) {
    throw new Error(validationMessage);
  }
  return true;
};


const DonorSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true  
  },
  password: {
    type: String,
    required: true
  },
  fname: {
    type: String,
    required: true
  },
  lname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'others'],
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  phone: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^\d{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid mobile number!`
    }
  },
  bloodGroup: {
    type: String,
    enum: ['AB-Ve', 'AB+Ve', 'A-Ve', 'A+Ve', 'B-Ve', 'B+Ve', 'O-Ve', 'O+Ve'],
    required: true
  },
  address: {
    type: String,
    required: true
  },
  idType: {
    type: String,
    enum: ['Aadhar', 'Driving License', 'PAN', 'Passport', 'Voter ID'],
    required: true
  },
  idNumber: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return validateIDNumber(this.idType, v);
      },
      message: props => props.reason.message
    }
  },
  idDocument: String,
});


const TimeSlotSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  slot: {
    type: String,
    required: true,
    enum: ['9:00 AM-10:00 AM', '10:00 AM-11:00 AM', '11:00 AM-12:00 PM', '12:00 PM-1:00 AM', '2:00 PM-3:00 PM', '3:00 PM-4:00 PM', '4:00 PM-5:00 PM', '5:00 PM-6:00 PM', '6:00 PM-7:00 PM', '7:00 PM-8:00 PM']
  },
  bookedCount: {
    type: Number,
    default: 0,
    max: 15
  }
});

const ScheduleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  bloodGroup: {
    type: String,
    enum: ['AB-Ve', 'AB+Ve', 'A-Ve', 'A+Ve', 'B-Ve', 'B+Ve', 'O-Ve', 'O+Ve'],
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  timeSlot: {
    type: String,
    required: true,
    enum: ['9:00 AM-10:00 AM', '10:00 AM-11:00 AM', '11:00 AM-12:00 PM', '12:00 PM-1:00 AM', '2:00 PM-3:00 PM', '3:00 PM-4:00 PM', '4:00 PM-5:00 PM', '5:00 PM-6:00 PM', '6:00 PM-7:00 PM', '7:00 PM-8:00 PM']
  },
  address: {
    type: String,
    required: true
  },
  is_verified_by_mp: {
    type: Number,
    default: 0
  },
  doctor: {
    type: String,
    default: ""
  },
  is_verified_by_mp: {
    type: Number,
    default: 0
  }
});
const DonorModel = mongoose.model("Donor", DonorSchema);
const TimeSlotModel = mongoose.model("TimeSlot", TimeSlotSchema);
const ScheduleModel = mongoose.model("Schedule", ScheduleSchema);

module.exports = { DonorModel, ScheduleModel, TimeSlotModel };





