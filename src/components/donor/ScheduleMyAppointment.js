import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import '../../styles/donorStyles/ScheduleMyAppointment.css';
const api_uri = process.env.REACT_APP_API_URI;

const ScheduleMyAppointment = () => {
  const [formData, setFormData] = useState({
    date: '',
    timeSlot: '',
    address: '',
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    validateSession();
  }, []);

  useEffect(() => {
    if (formData.date) {
      fetchAvailableSlots();
    }
  }, [formData.date]);

  const validateSession = async () => {
    try {
      await axios.get(`${api_uri}/api/donor/profile`, {
        withCredentials: true,
      });
    } catch (error) {
      console.error('Session validation failed:', error);
      setIsLoggedIn(false);
      setErrorMessage('Session expired. Please log in again.');
    }
  };

  const fetchAvailableSlots = async () => {
    try {
      const response = await axios.get(
        `${api_uri}/api/donor/available-slots?date=${formData.date}`,
        { withCredentials: true }
      );
      setAvailableSlots(response.data);
    } catch (error) {
      console.error('Error fetching slots:', error);
      setErrorMessage('Failed to fetch available time slots');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${api_uri}/api/donor/appointment`,
        formData,
        { withCredentials: true }
      );

      setSuccessMessage(response.data.message);
      setFormData({ date: '', timeSlot: '', address: '' });
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to schedule appointment');
      setSuccessMessage('');
    }
  };

  if (!isLoggedIn) {
    return <Navigate replace to="/donor/DonorLogin" />;
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="schedule-appointment-container">
      <form className="schedule-appointment-form" onSubmit={handleSubmit}>
        <h2>Schedule an Appointment</h2>
        
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        
        <div className="form-group">
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            min={today}
            required
          />
        </div>

        {formData.date && (
          <div className="form-group">
            <label htmlFor="timeSlot">Time Slot:</label>
            <select
              id="timeSlot"
              name="timeSlot"
              value={formData.timeSlot}
              onChange={handleChange}
              required
            >
              <option value="">Select a time slot</option>
              {availableSlots.map(slot => (
                <option 
                  key={slot.slot} 
                  value={slot.slot}
                  disabled={!slot.available}
                >
                  {slot.slot} 
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="address">Address:</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Schedule Appointment</button>
      </form>
    </div>
  );
};

export default ScheduleMyAppointment;