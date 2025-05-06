import React, { useState, useEffect } from 'react';
import '../../styles/payment/payment.css';
import { useNavigate , useLocation} from 'react-router-dom';
const api_uri = process.env.REACT_APP_API_URI;

const savePaymentTransaction = (transactionData) => {
  fetch(`${api_uri}/api/payment`, {
    credentials: true,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(transactionData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Payment transaction saved:', data);
    })
    .catch((error) => {
      console.error('Error saving payment transaction:', error);
    });
};

const PaymentPage = () => {
  const navigate = useNavigate();

  const [userType, setUserType] = useState('');
  const location = useLocation();
  const [bloodType, setBloodType] = useState(location.state?.bloodType || '');
  const [bloodUnits, setBloodUnits] = useState(location.state?.bloodUnits || 1);
  const [amount, setAmount] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch(`${api_uri}/api/session-info`);
        
        if (!response.ok) {
          console.error('No active session');
          setIsLoading(false);
          return;
        }

        const sessionData = await response.json();

        if (sessionData.userType === 'individual') {
          setUserType('individual');
        } else if (sessionData.userType === 'hospital') {
          setUserType('hospital');
        } else {
          console.error('Invalid user type in session');
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching session info:', error);
        setIsLoading(false);
      }
    };

    checkSession();
  }, [navigate]);

  useEffect(() => {
    setAmount(calculateAmount());
  }, [userType, bloodUnits]);
  

  const bloodInventory = {
    'A+': 50,
    'A-': 30,
    'B+': 40,
    'B-': 20,
    'O+': 60,
    'O-': 15,
    'AB+': 10,
    'AB-': 5,
  };

  const pricePerUnit = {
    individual: 500,
    hospital: 400,
  };

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
    calculateAmount(e.target.value, bloodUnits);
  };

  const handleBloodTypeChange = (e) => {
    setBloodType(e.target.value);
    setErrorMessage('');
  };

  const handleBloodUnitsChange = (e) => {
    const units = parseInt(e.target.value, 10);
    if (!isNaN(units) && units > 0) {
      setBloodUnits(units);
      setAmount(calculateAmount(userType, units));
    }
  };

  const calculateAmount = () => {
    if (!pricePerUnit[userType]) return 0;
    return pricePerUnit[userType] * bloodUnits;
  };
  
  

  const handlePayNow = () => {
    if (!bloodInventory[bloodType]) {
      setErrorMessage('Invalid or unavailable blood type.');
      return;
    }

    if (bloodInventory[bloodType] < bloodUnits) {
      setErrorMessage('Not enough units available.');
      return;
    }

    setErrorMessage('');

    const transactionData = {
      userType: userType,
      bloodType: bloodType,
      bloodUnits: bloodUnits,
      amount: amount,
      transactionStatus: 'completed',
    };

    savePaymentTransaction(transactionData);

    alert('Payment Successful!');
    if (userType === 'hospital') {
      navigate('/hospital/home'); 
    } else if (userType === 'individual') {
      navigate('/donor/DonorProfile');
    }
  };

  const isUserTypeFixed = userType === 'individual' || userType === 'hospital';

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!userType) {
    return <div>Unable to determine user type. Please log in.</div>;
  }

  return (
    <div className="container">
      <h1>Payment Page</h1>
  
      <label>User Type:</label>
      <select 
        value={userType} 
        onChange={handleUserTypeChange}
        disabled={isUserTypeFixed}
      >
        <option value="individual">Individual</option>
        <option value="hospital">Hospital</option>
      </select>
  
      <label>Blood Type:</label>
      <input
        type="text"
        value={bloodType}
        onChange={handleBloodTypeChange}
        placeholder="Enter blood type (e.g., A+, O-)"
        disabled={location.state?.bloodType ? true : false}
      />
  
      <label>Number of Blood Units:</label>
      <div id="blood-units">
        <input
          type="number"
          value={bloodUnits}
          onChange={handleBloodUnitsChange}
          min="1"
        />
      </div>
  
      <h3 className="total-amount">Total Amount: {amount}</h3>
  
      {errorMessage && <p className="error-message">{errorMessage}</p>}
  
      {bloodType &&
        bloodInventory[bloodType] >= bloodUnits &&
        !errorMessage && (
          <button className="pay-now-btn" onClick={handlePayNow}>
            Pay Now
          </button>
        )}
    </div>
  );
}  

export default PaymentPage;