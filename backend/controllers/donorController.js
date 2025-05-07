const { DonorModel, ScheduleModel, TimeSlotModel } = require('../models/donorModel');
const bcrypt = require('bcrypt');
const multer = require("multer");
const path = require('path');
const redis = require("redis");
const redisClient = redis.createClient({
  url: 'redis://default:AVj8AAIjcDEwM2UwZTQ4NmUwZjQ0NjE5YTNhNzVmODY5Y2IyYjg5MXAxMA@settling-gecko-22780.upstash.io:6379',
  socket: {
    tls: true, 
    rejectUnauthorized: false, 
  },
});
redisClient.connect()


exports.registerDonor = async (req, res) => {
  const { username, password, fname, lname, email, gender, age, phone, bloodGroup, address, idType, idNumber } = req.body;
  
  try {
    const existingDonor = await DonorModel.findOne({ username });
    if (existingDonor) {
      return res.status(400).json({ message: "Username already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newDonor = new DonorModel({
      username,
      password: hashedPassword,
      fname,
      lname,
      email,
      gender,
      age,
      phone,
      bloodGroup,
      address,
      idType,
      idNumber
    });

    await newDonor.save();
    return res.status(201).json({ message: "Donor registered successfully." });
  } catch (error) {
    console.error("Error registering donor:", error);
    return res.status(500).json({ message: "Error registering donor." });
  }
};

exports.loginDonor = async (req, res) => {
  const { username, password } = req.body;

  try {
    console.log("Login attempt for username:", username);
    
    const donor = await DonorModel.findOne({ username });
    if (!donor || !(await bcrypt.compare(password, donor.password))) {
      console.log("Invalid credentials for:", username);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    req.session.donor = { _id: donor._id, username: donor.username };
 
    console.log("Session object before save:", req.session);
    console.log("Session ID:", req.session.id);
    
    req.session.save((err) => {
      if (err) {
        console.error("Error saving session:", err);
        return res.status(500).json({ message: 'Error during session initialization.' });
      }

      console.log("Session after save:", req.session);
      console.log("Set-Cookie header:", res.getHeaders()['set-cookie']);
      
      res.status(200).json({ 
        message: 'Login successful',
        debugSessionId: req.session.id
      });
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
exports.logoutDonor = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Error logging out donor." });
    }
    res.clearCookie('connect.sid'); 
    res.status(200).json({ message: "Logout successful." });
  });
};

exports.getDonorProfile = async (req, res) => {
  try {

    console.log("Profile request headers:", req.headers);
    console.log("Profile request cookies:", req.headers.cookie);
    console.log("Session in profile request:", req.session);
    console.log("Session ID in profile request:", req.session.id);

    if (!req.session.donor) {
      console.log("No donor in session - unauthorized");
      return res.status(401).json({ message: "Unauthorized" });
    }

    const cacheKey = `donorProfile_${req.session.donor._id}`; 

    const cachedProfile = await redisClient.get(cacheKey);
    if (cachedProfile) {
      console.log('Served donor profile from Redis cache');
      return res.status(200).json(JSON.parse(cachedProfile));
    }

    const donor = await DonorModel.findById(req.session.donor._id);
    if (!donor) {
      console.log("Donor not found in database:", req.session.donor._id);
      return res.status(404).json({ message: "Donor not found." });
    }

    await redisClient.setEx(cacheKey, 3600, JSON.stringify(donor));
    console.log("Donor profile cached in Redis");

    res.status(200).json(donor);
  } catch (error) {
    console.error("Error fetching donor profile:", error);
    return res.status(500).json({ message: "Error fetching donor profile." });
  }
};

exports.updateDonorProfile = async (req, res) => {
  const { fname, lname, email, phone, bloodGroup, address } = req.body;
  const cacheKey = `donorProfile_${req.session.donor._id}`; 

  try {
    const updatedDonor = await DonorModel.findByIdAndUpdate(
      req.session.donor._id,
      { fname, lname, email, phone, bloodGroup, address },
      { new: true }
    );
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(updatedDonor));
    console.log("Donor profile cached in Redis");

    if (!updatedDonor) {
      return res.status(404).json({ message: "Donor not found." });
    }

    res.status(200).json({ message: "Profile updated successfully.", donor: updatedDonor });
  } catch (error) {
    console.error("Error updating donor profile:", error);
    return res.status(500).json({ message: "Error updating donor profile." });
  }
};

exports.getAvailableTimeSlots = async (req, res) => {
  try {
    const { date } = req.query;
    const selectedDate = new Date(date);

    const cacheKey = `availableSlots_${date}`;
    
    if (selectedDate < new Date().setHours(0, 0, 0, 0)) {
      return res.status(400).json({ message: "Cannot book appointments for past dates" });
    }

    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log("Served from Redis cache");
      return res.status(200).json(JSON.parse(cachedData));
    }

    let timeSlots = await TimeSlotModel.find({ date: selectedDate });

    if (timeSlots.length === 0) {
      const defaultSlots = ['9:00 AM-10:00 AM', '10:00 AM-11:00 AM', '11:00 AM-12:00 PM', '12:00 PM-1:00 AM', '2:00 PM-3:00 PM', '3:00 PM-4:00 PM', '4:00 PM-5:00 PM', '5:00 PM-6:00 PM', '6:00 PM-7:00 PM', '7:00 PM-8:00 PM']
        .map(slot => ({
          date: selectedDate,
          slot,
          bookedCount: 0
        }));
      
      timeSlots = await TimeSlotModel.insertMany(defaultSlots);
    }

    const availableSlots = timeSlots.map(slot => ({
      slot: slot.slot,
      available: slot.bookedCount < 15,
      remainingSpots: 15 - slot.bookedCount
    }));

    await redisClient.setEx(cacheKey, 3600, JSON.stringify(availableSlots));
    console.log("Fetched from MongoDB and cached");

    res.status(200).json(availableSlots);
  } catch (error) {
    console.error("Error fetching time slots:", error);
    res.status(500).json({ message: "Error fetching available time slots" });
  }
};

exports.scheduleAppointment = async (req, res) => {
  const { date, timeSlot, address } = req.body;

  try {
    const selectedDate = new Date(date);
    
    if (selectedDate < new Date().setHours(0, 0, 0, 0)) {
      return res.status(400).json({ message: "Cannot book appointments for past dates" });
    }

    let timeSlotDoc = await TimeSlotModel.findOne({ 
      date: selectedDate,
      slot: timeSlot
    });

    if (!timeSlotDoc) {
      timeSlotDoc = new TimeSlotModel({
        date: selectedDate,
        slot: timeSlot,
        bookedCount: 0
      });
    }

    if (timeSlotDoc.bookedCount >= 15) {
      return res.status(400).json({ message: "This time slot is fully booked" });
    }

    const donor = await DonorModel.findById(req.session.donor._id);
    if (!donor) {
      return res.status(404).json({ message: "Donor not found" });
    }

    const newSchedule = new ScheduleModel({
      name: donor.username,
      bloodGroup: donor.bloodGroup,
      date: selectedDate,
      timeSlot,
      address
    });

    timeSlotDoc.bookedCount += 1;
    
    await Promise.all([
      newSchedule.save(),
      timeSlotDoc.save()
    ]);

    res.status(201).json({ message: "Appointment scheduled successfully" });
  } catch (error) {
    console.error("Error scheduling appointment:", error);
    return res.status(500).json({ message: "Error scheduling appointment" });
  }
};

exports.getDonationHistory = async (req, res) => {
  try {
    if (!req.session.donor) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const schedules = await ScheduleModel.find({
      name: req.session.donor.username,
      is_verified_by_mp: 1
    }).sort({ date: -1 }); 

    if (!schedules.length) {
      return res.status(200).json([]); 
    }

    res.status(200).json(schedules);
  } catch (error) {
    console.error("Error fetching donation history:", error);
    return res.status(500).json({ message: "Error fetching donation history." });
  }
};

exports.getSession = (req, res) => {
  if (req.session.donor) {
      res.json({ username: req.session.donor.username });
  } else {
      res.status(401).json({ message: 'Not logged in' });
  }
};




