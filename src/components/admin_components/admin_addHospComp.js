import React, { useState } from 'react';
import '../../styles/AdminStyles/admin.css'; // Assuming you have the necessary CSS
import { useNavigate } from 'react-router-dom';
const api_uri = process.env.REACT_APP_API_URI; 

const AddHosp = () => {
  const [username, setUsername] = useState('');
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [type, setType] = useState('');
  const [bloodbank_capacity, setBloodbankCapacity] = useState('');
  const [establishedYear, setEstablishedYear] = useState('');
  const [emailError, setEmailError] = useState('');
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === 'username') setUsername(value);
    if (id === 'address') setAddress(value);
    if (id === 'contact') setContact(value);
    if (id === 'email') setEmail(value);
    if (id === 'type') setType(value);
    if (id === 'bloodbank_capacity') setBloodbankCapacity(value);
    if (id === 'establishedYear') setEstablishedYear(value);
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(String(email).toLowerCase())) {
      setEmailError('This is not a valid email address.');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      return;
    }
  
    const hospitalData = { username, address, contact, email, type, bloodbank_capacity, establishedYear };
  
    const response = await fetch(`${api_uri}/AddHospital`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(hospitalData), 
    });
  
    if (response.ok) {
      alert('Hospital added successfully!');
  
      setUsername('');
      setAddress('');
      setContact('');
      setEmail('');
      setType('');
      setBloodbankCapacity('');
      setEstablishedYear('');

      navigate('/Admin/hosp');  
    } else {
      const errorData = await response.json();
      alert(`Failed to add Hospital: ${errorData.message}`);
    }
  };

  return (
    <div className="fdiv">
      <form id="addempForm" onSubmit={handleSubmit}>
        <label htmlFor="username">Full Name</label><br/>
        <input className="addemp2" id="username" type="text" value={username} onChange={handleChange} required/><br/><br/>

        <label htmlFor="contact">Contact Number</label><br/>
        <input className="addemp2" id="contact" type="text" value={contact} onChange={handleChange} required/><br/><br/>

        <label htmlFor="email">Email</label><br/>
        <input className="addemp2" id="email" type="text" value={email} onChange={handleChange} required/><br/>
        {emailError && <span className="error-message">{emailError}</span>} <br/>

        <label htmlFor="address">Address</label><br/>
        <textarea className="addemp2" id="address" value={address} onChange={handleChange} required/><br/><br/>

        <label htmlFor="type">Type</label><br/>
        <select className="addemp2" id="type" value={type} onChange={handleChange} required>
          <option value="">Select a type</option>
          <option value="Private">Private</option>
          <option value="Government">Government</option>
        </select><br/><br/>

        <label htmlFor="bloodbank_capacity">Blood Bank Capacity</label><br/>
        <input className="addemp2" id="bloodbank_capacity" type="number" value={bloodbank_capacity} onChange={handleChange} required/><br/><br/>

        <label htmlFor="establishedYear">Year Established</label><br/>
        <input className="addemp2" id="establishedYear" type="number" value={establishedYear} onChange={handleChange} required/><br/><br/>

        <input className="addemp2" id="sub" type="submit" value="Add"/>
      </form>
    </div>
  );
};

export default AddHosp;
