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

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const redis = require('redis');

const redisClient = redis.createClient({
  url: 'redis://default:AVj8AAIjcDEwM2UwZTQ4NmUwZjQ0NjE5YTNhNzVmODY5Y2IyYjg5MXAxMA@settling-gecko-22780.upstash.io:6379',
  socket: {
    tls: true, 
    rejectUnauthorized: false, 
  },
});

redisClient.connect()
  .then(() => console.log('Connected to Redis'))
  .catch(err => console.error('Redis connection error:', err));



mongoose.connect("mongodb+srv://koushik2pula:12345abc@cluster0.mchdhsw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((error) => {
    console.log('MongoDB connection error:', error);
  });

const app = express();
app.set('trust proxy', 1);

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(helmet());
app.use(morgan('dev'));

 app.use(cors({
  origin: 'https://blood-bank-management-42gz-4eeu0dgmg-koushik-pulas-projects.vercel.app', 
  credentials: true
}));


//built in middleware
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
    secure: true, 
    sameSite: 'none', 
  }
}));


//third party middleware
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




//Models
const Employee = require('./models/employeeModel'); 
const {DonorModel,ScheduleModel} = require('./models/donorModel');
const AdminModel = require('./models/AdminModel');
const Hospital = require('./models/hospitalModel');
const HospPayment = require('./models/hospitalpayment')
const PaymentTransaction = require('./models/paymentTransaction');
const medicalProfessional = require('./models/medicalprofessionalmodel');

//Router level middleware
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
  const cacheKey = 'dashboardData';
  const startTime = Date.now();
  try {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log('Served from Redis cache');
      return res.json(JSON.parse(cachedData));
    }

    console.log('Fetched from MongoDB (not cached)');

    const [numberOfDonors, numberOfEmployees, totalBloodUnits] = await Promise.all([
      DonorModel.estimatedDocumentCount(), 
      Employee.estimatedDocumentCount(),
      ScheduleModel.countDocuments({ is_verified_by_mp: 1 })
    ]);

    const dashboardData = { totalBloodUnits, numberOfDonors, numberOfEmployees };
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(dashboardData));

    const endTime = Date.now(); 
    const latency = endTime - startTime; 
    
    console.log(`Latency for /api/someRoute: ${latency}ms`);

    res.json(dashboardData);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard data.' });
  }
});
app.get('/api/blood-group-counts', async (req, res) => {
  const cacheKey = 'bloodGroupCounts';
  const startTime = Date.now();

  try {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log('Served from Redis cache');
      return res.json(JSON.parse(cachedData));
    }

    console.log('Fetched from MongoDB (not cached)');
    const bloodGroupCounts = await ScheduleModel.aggregate([
      { $match: { is_verified_by_mp: 1 } },
      { $group: { _id: "$bloodGroup", count: { $sum: 1 } } }
    ]);

    await redisClient.setEx(cacheKey, 3600, JSON.stringify(bloodGroupCounts));

    const endTime = Date.now(); 
    const latency = endTime - startTime; 
    console.log(`Latency for /api/someRoute: ${latency}ms`);

    res.json(bloodGroupCounts);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Server error');
  }
});

app.get('/api/counts', async (req, res) => {
  const cacheKey = 'countsData';
  const startTime = Date.now();

  try {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log('Served from Redis cache');
      return res.json(JSON.parse(cachedData));
    }

    console.log('Fetched from MongoDB (not cached)');

    const donorsRegistered = await DonorModel.countDocuments();
    const donationsDone = await ScheduleModel.aggregate([
      { $match: { is_verified_by_mp: 1 } }, 
      { $group: { _id: "$bloodGroup", count: { $sum: 1 } } } 
    ]);
    const employeesRegistered = await Employee.countDocuments();
    const bloodUnitsCollected = donationsDone.length; 

    const countsData = {
      donorsRegistered,
      employeesRegistered,
      donationsDone: donationsDone.length,
      bloodUnitsCollected
    };


    await redisClient.setEx(cacheKey, 3600, JSON.stringify(countsData));

    const endTime = Date.now(); 
    const latency = endTime - startTime; 
    console.log(`Latency for /api/someRoute: ${latency}ms`);

    res.json(countsData);
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
      // Set cookie with cross-domain attributes
      res.cookie('adminToken', 'yourAdminTokenHere', { 
        httpOnly: true,
        secure: true,      // Required for cross-domain
        sameSite: 'none',  // Required for cross-domain
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      });
      
      // Debug the cookie being set
      console.log('Setting admin cookie:', res.getHeaders()['set-cookie']);
      
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
  const cacheKey = 'donorAD';
  const startTime = Date.now();
  try {
    const cachedDonors = await redisClient.get(cacheKey);
    if (cachedDonors) {
      console.log('Served from Redis cache');
      return res.json(JSON.parse(cachedDonors)); 
    }

    console.log('Fetched from MongoDB (not cached)');

    const donors = await DonorModel.find().select('fname lname phone bloodGroup email age');
    const formattedDonors = donors.map(donor => ({
      _id: donor._id,
      donorName: `${donor.fname } ${donor.lname }`, 
      phone: donor.phone,
      bloodGroup: donor.bloodGroup,
      email: donor.email,
      age: donor.age,
    }));
    
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(formattedDonors));
    endTime = Date.now();
    latency = endTime - startTime;
    console.log(`Latency for /api/someRoute: ${latency}ms`);

    res.json(formattedDonors);
  } catch (error) {
    console.error('Error fetching donors:', error);
    res.status(500).json({ message: 'Failed to fetch donors.' });
  }
});
app.get('/api/checkAdminAuth', (req, res) => {
  // Debug incoming request
  console.log('Admin auth check cookies:', req.cookies);
  console.log('Admin auth check headers:', req.headers.cookie);
  
  const adminToken = req.cookies.adminToken;

  if (adminToken === 'yourAdminTokenHere') {
    res.json({ isAuthenticated: true });
  } else {
    res.json({ isAuthenticated: false });
  }
});



//admin employee
app.get('/api/employees',  async (req, res) => {
  const cacheKey = 'employeesData';
  try {
    const cachedEmployees = await redisClient.get(cacheKey);
    if (cachedEmployees) {
      console.log('Served from Redis cache');
      return res.json(JSON.parse(cachedEmployees)); 
    }
    
    console.log('Fetched from MongoDB (not cached)');
    const employees = await Employee.find(); 
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(employees)); // Cache for 1 hour

    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Failed to fetch employees.' });
  }
});
app.delete('/api/employees/:id',  async (req, res) => {
  const cacheKey = 'employeesData';
  try {
    const employeeId = req.params.id;
    await Employee.findByIdAndDelete(employeeId);
    await redisClient.del(cacheKey);
    res.status(200).json({ message: 'Employee removed successfully!' });
  } catch (error) {
    console.error('Error removing employee:', error);
    res.status(500).json({ message: 'Failed to remove employee.' });
  }
});
app.put('/api/employees/:id', async (req, res) => {
  const { username, contact, shift, email, address } = req.body;
  const cacheKey = 'employeesData';

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
    const employees = await Employee.find();
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(employees)); 

    res.json({ message: 'Employee updated successfully!', employee: updatedEmployee });
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ error: 'Failed to update employee' });
  }
});
app.post('/AddEmploy', async (req, res) => {
  try {
    const cacheKey = 'employeesData';
    const newEmployee = new Employee({
      username: req.body.username,
      contact: req.body.contact,
      shift: req.body.shift,
      email: req.body.email,
      address: req.body.address
    });

    await newEmployee.save();
    const employees = await Employee.find();
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(employees));
    res.status(201).json({ message: 'Employee added successfully!' });
  } catch (error) {
    console.error('Error saving employee:', error);
    res.status(500).json({ message: 'Failed to add employee.' });
  }
});



// hospitals
app.get('/api/hospitals', async (req, res) => {
  const cacheKey = 'hospitalsData';
  try {
    const cachedHospitals = await redisClient.get(cacheKey);
    if (cachedHospitals) {
      console.log('Served from Redis cache');
      return res.json(JSON.parse(cachedHospitals)); 
    }

    console.log('Fetched from MongoDB (not cached)');
    const hospitals = await Hospital.find();
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(hospitals)); // Cache for 1 hour

    res.json(hospitals);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch hospitals' });
  }
});
app.post('/AddHospital', async (req, res) => {
  const cacheKey = 'hospitalsData';
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
    const hospitals = await Hospital.find();
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(hospitals));
    
    res.status(201).json({ message: 'Hospital added successfully' });
    
  } catch (error) {
    res.status(400).json({ message: 'Failed to add hospital', error: error.message });
  }
});
app.put('/api/hospitals/update/:id', async (req, res) => {
  const { username, address, contact, email, shift, bloodbank_capacity } = req.body;
  const cacheKey = 'hospitalsData';
  
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
    const hospitals = await Hospital.find();
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(hospitals));

    res.json(updatedHospital);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update hospital' });
  }
});
app.delete('/api/hospitals/remove/:id', async (req, res) => {
  const cacheKey = 'hospitalsData';
  try {
    const deletedHospital = await Hospital.findByIdAndDelete(req.params.id);

    if (!deletedHospital) {
      return res.status(404).json({ error: 'Hospital not found' });
    }
    const hospitals = await Hospital.find();
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(hospitals));
    res.json({ message: 'Hospital removed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove hospital' });
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
      password: password || '1234',
      address,
      contact,
      email,
      type,
      bloodbank_capacity,
      establishedYear,
    });

    await newHospital.save();
    res.status(201).json({ message: 'Hospital registered successfully!' });
  } catch (error) {
    console.error('Hospital registration error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email or Username already exists.' });
    }
    res.status(500).json({ message: 'Registration failed.' });
  }
});
app.post('/api/HospitalLogin', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hospital = await Hospital.findOne({ username });

    if (hospital && hospital.password === password) {
      req.session.hospital = { username: hospital.username, id: hospital._id };
     
      req.session.save(err => {
        if (err) {
          console.error('Session save error:', err);
          return res.status(500).json({ message: 'Error saving session' });
        }
        
        res.status(200).json({
          success: true,
          message: 'Login successful!',
          userId: hospital._id,
        });
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Error during Hospital login:', error);
    res.status(500).json({ message: 'Error during login' });
  }
});


app.post('/api/hospitalLogout', (req, res) => {
  // Destroy the session for the hospital
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error during session destruction' });
    }
    
    // Clear the session cookie explicitly
    res.clearCookie('connect.sid');  // This is important!

    res.status(200).json({ success: true, message: 'Hospital logged out successfully' });
  });
});
app.get('/api/checkHospitalAuth', (req, res) => {
  console.log('Session data:', req.session);
  
  if (req.session.hospital) {
    return res.json({ 
      isAuthenticated: true,
      hospital: {
        username: req.session.hospital.username,
        id: req.session.hospital.id
      }
    });
  } else {
    return res.json({ isAuthenticated: false });
  }
});
app.get('/api/session-info', (req, res) => {
  try {
    console.log('Current session:', req.session);  
    
    if (req.session.donor) {
      return res.json({ 
        userType: 'individual', 
        username: req.session.donor.username 
      });
    }
    
    if (req.session.hospital) {
      return res.json({ 
        userType: 'hospital', 
        username: req.session.hospital.username 
      });
    }
    
    return res.status(401).json({ message: 'No active session' });
  } catch (error) {
    console.error('Error checking session:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


//payments
app.post('/api/payment', async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.session.donor && !req.session.hospital) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { bloodType, bloodUnits, amount, transactionStatus } = req.body;
    
    // Validate required fields
    if (!bloodType || !bloodUnits || !amount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const userType = req.session.donor ? "individual" : "hospital";
    const userIdentifier = req.session.donor ? req.session.donor.username : req.session.hospital.name;

    const newTransaction = new PaymentTransaction({
      transactionID: `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`,
      userType,
      bloodType,
      bloodUnits,
      amount,
      transactionStatus,
      donor: req.session.donor ? req.session.donor.username : null,
      hospitalID: req.session.hospital ? req.session.hospital.username : null,
      createdAt: new Date()
    });
    await newTransaction.save();

    res.status(201).json({ 
      message: 'Payment transaction saved successfully', 
      transaction: newTransaction 
    });
  } catch (error) {
    console.error('Payment transaction error:', error);
    res.status(500).json({ 
      message: 'Error saving payment transaction', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error' 
    });
  }
});
app.post('/api/HospitalPayment', async (req, res) => {
  try {
    console.log('Hospital payment request session:', req.session);
    
    if (!req.session.hospital) {
      return res.status(401).json({ success: false, message: 'Hospital not authenticated' });
    }

    const { bloodType, contactNumber, requiredUnits, urgencyLevel, dateNeeded, additionalInfo } = req.body;
    
    if (!bloodType || !contactNumber || !requiredUnits || !urgencyLevel) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const newHospPayment = new HospPayment({
      transactionID: `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`,
      HospitalName: req.session.hospital.username, 
      bloodType,
      contactNumber,
      requiredUnits,
      urgencyLevel,
      dateNeeded: dateNeeded || new Date(), 
      additionalInfo: additionalInfo || '',
      createdAt: new Date()
    });

    await newHospPayment.save();

    res.status(201).json({ 
      success: true, 
      message: 'Hospital payment request stored successfully', 
      transaction: newHospPayment 
    });
  } catch (error) {
    console.error('Error saving hospital payment request:', error);
    res.status(500).json({ 
      success: false, 
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error' 
    });
  }
});
app.get('/api/hospital/session', (req, res) => {
  if (req.session.hospital) {
      res.set('Cache-Control', 'no-store');  
      res.json(req.session.hospital);
  } else {
      res.status(401).json({ message: 'Session expired. Please log in again.' });
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
  const cacheKey = 'adminDonations';
  try {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log('Served from Redis cache');
      return res.json(JSON.parse(cachedData)); 
    }

    console.log('Fetched from MongoDB (not cached)');

    const donations = await ScheduleModel.find({ is_verified_by_mp: 1 }).exec();
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(donations));

    res.json(donations);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching donations' });
  }
});


//admin medics
app.get('/api/medics',  async (req, res) => {
  const cacheKey = 'medicsData';
  try {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log('Served from Redis cache');
      return res.json(JSON.parse(cachedData)); 
    }

    console.log('Fetched from MongoDB (not cached)');

    const medics = await medicalProfessional.find(); 
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(medics));

    res.json(medics); 
  } catch (error) {
    console.error('Error fetching medics:', error);
    res.status(500).json({ message: 'Failed to fetch medics.' });
  }
});
app.put('/api/medics/:id', async (req, res) => {
  const { username, contactNumber, email, address } = req.body;
  const cacheKey = 'medicsData';

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
    const medics = await medicalProfessional.find(); 
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(medics));

    res.json({ message: 'medic updated successfully!', medic: updatedMedic });
  } catch (error) {
    console.error('Error updating medic:', error);
    res.status(500).json({ error: 'Failed to update medic' });
  }
});
app.delete('/api/medics/:id',  async (req, res) => {
  const cacheKey = 'medicsData';
  try {
    const medicId = req.params.id;
    await medicalProfessional.findByIdAndDelete(medicId);
    res.status(200).json({ message: 'medic removed successfully!' });
    const medics = await medicalProfessional.find(); 
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(medics));
  } catch (error) {
    console.error('Error removing medic:', error);
    res.status(500).json({ message: 'Failed to remove medic.' });
  }
});
app.post('/AddMedic', async (req, res) => {
  const cacheKey = 'medicsData';
  try {
    const cacheKey = 'medicsData';
    const newMedic = new medicalProfessional({
      username: req.body.username,
      contactNumber: req.body.contactNumber,
      role: req.body.role,
      email: req.body.email,
      password: req.body.password || '1234', 
    });

    await newMedic.save();
    const medics = await medicalProfessional.find(); 
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(medics));
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

//error handling middleware
app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).json({ message: 'Invalid CSRF token' });
  }
  next(err);
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
