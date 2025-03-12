const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const donorRoute = require('./routes/donorRoute'); 
const session = require('express-session');
const morgan = require('morgan');
const csurf = require('csurf');
const helmet = require('helmet');

mongoose.connect("mongodb://127.0.0.1:27017/BloodBankWebsite")
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((error) => {
    console.log('MongoDB connection error:', error);
  });

const app = express();

app.use(helmet());
app.use(morgan('dev'));

app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true
}));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  secret: '!sJdF83#N9d$7k@tL*3hPzQ1&gW2^pX9', 
  resave: false,
  saveUninitialized: false,
  cookie: { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production', 
    sameSite: 'strict', 
  }
}));

const csrfProtection = csurf({ cookie: true });

app.use((req, res, next) => {
  if (req.cookies && req.cookies.sessionID) {
    csrfProtection(req, res, next);
  } else {
    next();
  }
});

app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).json({ message: 'Invalid CSRF token' });
  }
  next(err);
});


//Models
const Employee = require('./models/employeeModel'); 
const {DonorModel,ScheduleModel} = require('./models/donorModel');
const AdminModel = require('./models/AdminModel');
const Hospital = require('./models/hospitalModel');
const HospPayment = require('./models/hospitalpayment')
const PaymentTransaction = require('./models/paymentTransaction');
const medicalProfessional = require('./models/medicalprofessionalmodel');

//Routes
app.use('/api/donor', donorRoute);

const employeeloginroute = require('./routes/employeeRoutes/employeeloginroute');
const recipientportalroute = require('./routes/employeeRoutes/recipientportalroute');
const donorcountroute = require('./routes/employeeRoutes/donorcountroute');
const recipientcountroute = require('./routes/employeeRoutes/recipientcountroute');
const recipientbarchartroute = require('./routes/employeeRoutes/recipientbarchartroute');
const donorpiechartroute = require('./routes/employeeRoutes/donorpiechartroute');
const doctorpiechartroute = require('./routes/employeeRoutes/doctorpiechartroute');
const supportteamroute = require('./routes/employeeRoutes/supportteamroute');
const assigndoctorroute = require('./routes/employeeRoutes/assigndoctorroute');
const updatedoctorroute = require('./routes/employeeRoutes/updatedoctorroute');
const medicalprofessionalloginroute = require('./routes/employeeRoutes/medicalprofessionalloginroute');
const assigneddonorsroute = require('./routes/employeeRoutes/assigneddonorsroute');
const doctorsroute = require('./routes/employeeRoutes/doctorsroute');

app.get('/api', (req, res) => {
  res.send('Welcome to the Blood Bank Management API');
});

// Employee routes--------------------------------------------------------------------------------------------------
app.use('/api/employee/login', employeeloginroute);
app.use('/api/recipientportal', recipientportalroute);
app.use('/api/donor-count', donorcountroute);
app.use('/api/recipient-count', recipientcountroute);
app.use('/api/recipient-count-by-blood-type', recipientbarchartroute);
app.use('/api/donor-count-by-blood-type', donorpiechartroute);
app.use('/api/doctor-patient-count', doctorpiechartroute);
app.use('/api/issues', supportteamroute)
app.use('/api/assigndoctor', assigndoctorroute);
app.use('/api/updatedoctor', updatedoctorroute);
app.use('/api/medicalprofessional/login', medicalprofessionalloginroute);
app.use('/api/assigneddonors',assigneddonorsroute);
app.use('/api/doctors',doctorsroute);
// Admin routes---------------------------------------------------------------------------------------------------

app.get('/api/dondash', async (req, res) => {
  try {
    const uniqueDonors = await DonorModel.distinct('email'); 
    const numberOfDonors = uniqueDonors.length;
    const numberOfEmployees = await Employee.countDocuments(); 
    const totalBloodUnits = numberOfDonors; 

    res.json({
      totalBloodUnits,
      numberOfDonors,
      numberOfEmployees
  
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard data.' });
  }
});
app.get('/api/blood-group-counts', async (req, res) => {
  try {
    const bloodGroupCounts = await DonorModel.aggregate([
      {
        $match: { is_verified_by_mp: 1 }  
      },
      {
        $group: {
          _id: "$bloodGroup",
          count: { $sum: 1 }
        }
      }
    ]);
    res.json(bloodGroupCounts);
  } catch (error) {
    console.error("Error fetching blood group counts:", error);
    res.status(500).send("Server Error");
  }
});
app.get('/api/counts', async (req, res) => {
  try {
    const donorsRegistered = await DonorModel.countDocuments();
    const donationsDone = await ScheduleModel.aggregate([
      { $match: { is_verified_by_mp: 1 } }, 
      { $group: { _id: "$bloodGroup", count: { $sum: 1 } } } 
    ]);
    const employeesRegistered = await Employee.countDocuments();
    const bloodUnitsCollected = donationsDone.length; 

    res.json({ 
      donorsRegistered, 
      employeesRegistered, 
      donationsDone: donationsDone.length, 
      bloodUnitsCollected 
    });
  } catch (error) {
    console.error("Error fetching counts:", error);
    res.status(500).send("Server Error");
  }
});
app.post('/api/adminLogin', async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await AdminModel.findOne({ username });

    if (admin && admin.password === password) {
      res.cookie('adminToken', 'yourAdminTokenHere', { httpOnly: true });
      res.status(200).json({ success: true, message: 'Login successful!' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Error during admin login:', error);
    res.status(500).json({ message: 'Error during login' });
  }
});
app.post('/api/adminLogout', (req, res) => {
  res.clearCookie('adminToken');
  res.status(200).json({ success: true, message: 'Logout successful!' });
});
app.get('/api/donorAD', async (req, res) => {
  try {
    const donors = await DonorModel.find().select('fname lname phone bloodGroup email age');
    const formattedDonors = donors.map(donor => ({
      _id: donor._id,
      donorName: `${donor.fname } ${donor.lname }`, 
      phone: donor.phone,
      bloodGroup: donor.bloodGroup,
      email: donor.email,
      age: donor.age,
    }));
    
    res.json(formattedDonors);
  } catch (error) {
    console.error('Error fetching donors:', error);
    res.status(500).json({ message: 'Failed to fetch donors.' });
  }
});



app.get('/api/employees',  async (req, res) => {
  try {
    const employees = await Employee.find(); 
    res.json(employees); 
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Failed to fetch employees.' });
  }
});
app.delete('/api/employees/:id',  async (req, res) => {
  try {
    const employeeId = req.params.id;
    await Employee.findByIdAndDelete(employeeId);
    res.status(200).json({ message: 'Employee removed successfully!' });
  } catch (error) {
    console.error('Error removing employee:', error);
    res.status(500).json({ message: 'Failed to remove employee.' });
  }
});
app.put('/api/employees/:id', async (req, res) => {
  const { username, contact, shift, email, address } = req.body;

  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    if (username) employee.username = username;
    if (contact) employee.contact = contact;
    if (shift) employee.shift = shift;
    if (email) employee.email = email;
    if (address) employee.address = address;

    const updatedEmployee = await employee.save();

    res.json({ message: 'Employee updated successfully!', employee: updatedEmployee });
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ error: 'Failed to update employee' });
  }
});
app.post('/AddEmploy', async (req, res) => {
  try {
    const newEmployee = new Employee({
      username: req.body.username,
      contact: req.body.contact,
      shift: req.body.shift,
      email: req.body.email,
      address: req.body.address
    });

    await newEmployee.save();
    res.status(201).json({ message: 'Employee added successfully!' });
  } catch (error) {
    console.error('Error saving employee:', error);
    res.status(500).json({ message: 'Failed to add employee.' });
  }
});



// Get all hospitals
app.get('/api/hospitals', async (req, res) => {
  try {
    const hospitals = await Hospital.find();
    res.json(hospitals);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch hospitals' });
  }
});
app.post('/AddHospital', async (req, res) => {
  try {
    const { username, password, address, contact, email, type, bloodbank_capacity, establishedYear } = req.body;

    const validTypes = ['Private', 'Government'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: "Invalid 'type' value. It must be 'Private' or 'Government'." });
    }

    const hospitalData = {
      username,
      password: password || '1234', 
      address,
      contact,
      email,
      type,
      bloodbank_capacity,
      establishedYear,
    };

    const hospital = new Hospital(hospitalData);
    

    await hospital.save();
    
    res.status(201).json({ message: 'Hospital added successfully' });
    
  } catch (error) {
    res.status(400).json({ message: 'Failed to add hospital', error: error.message });
  }
});
app.put('/api/hospitals/update/:id', async (req, res) => {
  const { username, address, contact, email, shift, bloodbank_capacity } = req.body;
  
  try {
    const hospital = await Hospital.findById(req.params.id);

    if (!hospital) {
      return res.status(404).json({ error: 'Hospital not found' });
    }


    if (username) hospital.username = username;
    if (address) hospital.address = address;
    if (contact) hospital.contact = contact;
    if (email) hospital.email = email;
    if (shift) hospital.shift = shift;
    if (bloodbank_capacity) hospital.bloodbank_capacity = bloodbank_capacity;

    const updatedHospital = await hospital.save();

    res.json(updatedHospital);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update hospital' });
  }
});
app.delete('/api/hospitals/remove/:id', async (req, res) => {
  try {
    const deletedHospital = await Hospital.findByIdAndDelete(req.params.id);

    if (!deletedHospital) {
      return res.status(404).json({ error: 'Hospital not found' });
    }

    res.json({ message: 'Hospital removed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove hospital' });
  }
});

app.post('/api/HospitalLogin', async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Hospital.findOne({ username });

    if (admin && admin.password === password) {
      res.status(200).json({
        success: true,
        message: 'Login successful!',
        userId: admin._id, // Send user ID to store in localStorage
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Error during Hospital login:', error);
    res.status(500).json({ message: 'Error during login' });
  }
});


app.post('/api/hospitals/register', async (req, res) => {
  try {
    const {
      username,
      password,
      address,
      contact,
      email,
      type,
      bloodbank_capacity,
      establishedYear,
    } = req.body;

    const newHospital = new Hospital({
      username,
      password,
      address,
      contact,
      email,
      type,
      bloodbank_capacity,
      establishedYear,
    });

    await newHospital.save();

    return res.status(200).json({ message: 'Hospital registered successfully!' });
  } catch (error) {
    return res.status(500).json({
      message: 'Error occurred while registering hospital.',
      error: error.message,
    });
  }
});

app.post('/api/HospitalPayment', async (req, res) => {
  try {
    const {
      HospitalName, bloodType, contactNumber, requiredUnits,
      urgencyLevel, dateNeeded, additionalInfo,
    } = req.body;

    const newHospPayment = new HospPayment({
      HospitalName,
      bloodType,
      contactNumber,
      requiredUnits,
      urgencyLevel,
      dateNeeded,
      additionalInfo,
  
    });

    await newHospPayment.save();

    res.status(201).json({ success: true, message: 'Request stored successfully' });
  } catch (error) {
    console.error('Error saving hospital payment request:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.post('/api/payment', async (req, res) => {
  try {
    const userId = req.cookies.userId; 

    if (!userId) {
      return res.status(400).json({ message: 'User not authenticated' });
    }

    const donor = await DonorModel.findById(userId);
    const hospital = await HospitalModel.findById(userId);

    if (!donor && !hospital) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const { bloodType, bloodUnits, amount, transactionStatus } = req.body;

    const newTransaction = new PaymentTransaction({
      bloodType,
      bloodUnits,
      amount,
      transactionStatus,
      donor: donor ? donor._id : null, 
      hospitalID: hospital ? hospital._id : null, 
    });

    await newTransaction.save();
    
    res.status(201).json({ message: 'Payment transaction saved successfully', transaction: newTransaction });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error saving payment transaction', error });
  }
});

app.get('/api/paymentTransactions', async (req, res) => {
  const { dateRange } = req.query;
  const currentDate = new Date();
  let filter = {};

  switch (dateRange) {
    case 'lastDay':
      filter.transactionDate = { $gte: new Date(currentDate - 24 * 60 * 60 * 1000) };
      break;
    case 'lastMonth':
      filter.transactionDate = { $gte: new Date(currentDate - 30 * 24 * 60 * 60 * 1000) };
      break;
    case 'last3Months':
      filter.transactionDate = { $gte: new Date(currentDate - 90 * 24 * 60 * 60 * 1000) };
      break;
    case 'last6Months':
      filter.transactionDate = { $gte: new Date(currentDate - 180 * 24 * 60 * 60 * 1000) };
      break;
    case 'lastYear':
      filter.transactionDate = { $gte: new Date(currentDate - 365 * 24 * 60 * 60 * 1000) };
      break;
    case 'all':
    default:
      break;
  }

  try {
    const transactions = await PaymentTransaction.find(filter); 
    console.log('Fetched transactions:', transactions); 
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).send('Error fetching transactions');
  }
});
app.get('/api/adminDonations', async (req, res) => {
  try {
    const donations = await ScheduleModel.find({ is_verified_by_mp: 1 }).exec();
    res.json(donations);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching donations' });
  }
});




app.get('/api/medics',  async (req, res) => {
  try {
    const medics = await medicalProfessional.find(); 
    res.json(medics); 
  } catch (error) {
    console.error('Error fetching medics:', error);
    res.status(500).json({ message: 'Failed to fetch medics.' });
  }
});
app.put('/api/medics/:id', async (req, res) => {
  const { username, contactNumber, email, address } = req.body;

  try {
    const medic = await medicalProfessional.findById(req.params.id);

    if (!medic) {
      return res.status(404).json({ error: 'medic not found' });
    }

    if (username) medic.username = username;
    if (contactNumber) medic.contactNumber = contactNumber;
    if (email) medic.email = email;
    if (address) medic.address = address;

    const updatedMedic = await medic.save();

    res.json({ message: 'medic updated successfully!', medic: updatedMedic });
  } catch (error) {
    console.error('Error updating medic:', error);
    res.status(500).json({ error: 'Failed to update medic' });
  }
});
app.delete('/api/medics/:id',  async (req, res) => {
  try {
    const medicId = req.params.id;
    await medicalProfessional.findByIdAndDelete(medicId);
    res.status(200).json({ message: 'medic removed successfully!' });
  } catch (error) {
    console.error('Error removing medic:', error);
    res.status(500).json({ message: 'Failed to remove medic.' });
  }
});
app.post('/AddMedic', async (req, res) => {
  try {
  
    const newMedic = new medicalProfessional({
      username: req.body.username,
      contactNumber: req.body.contactNumber,
      role: req.body.role,
      email: req.body.email,
      password: req.body.password || '1234', 
    });

    await newMedic.save();
    res.status(201).json({ message: 'Medic added successfully!' });
  } catch (error) {
    console.error('Error saving medic:', error);
    res.status(500).json({ message: 'Failed to add medic.' });
  }
});

//--------------------------------------------------------------------------------------------------------------
app.use((req, res, next) => {
  res.status(404).json({ message: "Route Not Found" });
});

app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ message: 'Validation Error', errors });
  }
  next(err);
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
