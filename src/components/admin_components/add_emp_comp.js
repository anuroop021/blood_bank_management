import React, { useState } from 'react';
import '../../styles/AdminStyles/admin.css';
import { useNavigate } from 'react-router-dom'; 
const api_uri = process.env.REACT_APP_API_URI;

const Addemp = () => {
  const [username, setUsername] = useState('');
  const [contact, setContact] = useState('');
  const [shift, setShift] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [emailError, setEmailError] = useState('');
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === 'username') setUsername(value);
    if (id === 'contact') setContact(value);
    if (id === 'shift') setShift(value);
    if (id === 'email') setEmail(value);
    if (id === 'address') setAddress(value);
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

    const employeeData = { username, contact, shift, email, address };

    const response = await fetch(`${api_uri}/AddEmploy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(employeeData), 
    });

    if (response.ok) {
      alert('Employee added successfully!');

      setUsername('');
      setContact('');
      setShift('');
      setEmail('');
      setAddress('');

      navigate('/Admin/employeeManage'); 
    } else {
      const errorData = await response.json();
      alert(`Failed to add employee: ${errorData.message}`);
    }
  };

  return (
    <div className="fdiv">
      <form id="addempForm" onSubmit={handleSubmit}>
        <label htmlFor="username">Full Name</label><br/>
        <input className="addemp2" id="username" type='text' value={username} onChange={handleChange} required/><br/><br/>

        <label htmlFor="contact">Contact Number</label><br/>
        <input className="addemp2" id="contact" type='text' value={contact} onChange={handleChange} required/><br/><br/>

        <label htmlFor="shift">Shift</label><br/>
        <select className="addemp2" id="shift" value={shift} onChange={handleChange} required>
          <option value="">Select a shift</option>
          <option value="9:00 AM - 5:00 PM">9:00 AM - 5:00 PM</option>
          <option value="1:00 PM - 9:00 PM">1:00 PM - 9:00 PM</option>
          <option value="10:00 PM - 6:00 AM">10:00 PM - 6:00 AM</option>
        </select><br/><br/>

        <label htmlFor="email">Email</label><br/>
        <input className="addemp2" id="email" type="text" value={email} onChange={handleChange} required/><br/>
        {emailError && <span className="error-message">{emailError}</span>} <br/>

        <label htmlFor="address">Address</label><br/>
        <textarea className="addemp2" id="address" value={address} onChange={handleChange} required/><br/><br/>

        <input className="addemp2" id="sub" type="submit" value="Add"/>
      </form>
    </div>
  );
};

export default Addemp;
