import React, { useState } from 'react';
import '../../styles/AdminStyles/admin.css';
import { useNavigate } from 'react-router-dom';
const api_uri = process.env.REACT_APP_API_URI;

const AddMed = () => {
  const [username, setUsername] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === 'username') setUsername(value);
    if (id === 'contactNumber') setContactNumber(value);
    if (id === 'role') setRole(value);
    if (id === 'email') setEmail(value);
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
    const medicData = { username, contactNumber, role, email };

    const response = await fetch(`${api_uri}/AddMedic`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(medicData),
    });

    if (response.ok) {
      alert('Medic added successfully!');

      setUsername('');
      setContactNumber('');
      setRole('');
      setEmail('');

      navigate('/Admin/MedicManage');
    } else {
      const errorData = await response.json();
      alert(`Failed to add medic: ${errorData.message}`);
    }
  };

  return (
    <div className="fdiv">
      <form id="addempForm" onSubmit={handleSubmit}>
        <label htmlFor="username">Full Name</label><br/>
        <input className="addMed2" id="username" type='text' value={username} onChange={handleChange} required/><br/><br/>

        <label htmlFor="contactNumber">Contact Number</label><br/>
        <input className="addMed2" id="contactNumber" type='text' value={contactNumber} onChange={handleChange} required/><br/><br/>

        <label htmlFor="role">Role</label><br/>
        <input className="addMed2" id="role" value={role} onChange={handleChange} required/><br/><br/>

        <label htmlFor="email">Email</label><br/>
        <input className="addMed2" id="email" type="text" value={email} onChange={handleChange} required/><br/>
        {emailError && <span className="error-message">{emailError}</span>} <br/>

        <input className="addMed2" id="sub" type="submit" value="Add"/>
      </form>
    </div>
  );
};

export default AddMed;
