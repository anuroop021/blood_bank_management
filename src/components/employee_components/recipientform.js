import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/employee_styles/recipient_portal.css';
import { useNavigate } from 'react-router-dom';

const RecipientPortal = () => {
    const [formData, setFormData] = useState({
        patientName: '',
        bloodType: '',
        hospitalName: '',
        contactNumber: '',
        requiredUnits: '',
        urgencyLevel: '',
        dateNeeded: '',
        additionalInfo: '',
        doctor: '',
    });
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.requiredUnits < 1) {
            setErrorMessage('Number of units required cannot be negative.');
            setSuccessMessage('');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/recipientportal', formData);
            if (response.data.success) {
                setSuccessMessage('Form submitted successfully!');
                setErrorMessage('');
                setFormData({
                    patientName: '',
                    bloodType: '',
                    hospitalName: '',
                    contactNumber: '',
                    requiredUnits: '',
                    urgencyLevel: '',
                    dateNeeded: '',
                    additionalInfo: '',
                    doctor: '',
                });
                navigate('/payment');
            }
        } catch (error) {
            setErrorMessage('An error occurred. Please try again.');
            setSuccessMessage('');
        }
    };

    return (
        <div className="recipient-outer">
            <div className="recipient-form">
                <form onSubmit={handleSubmit}>
                    <h1>Recipient Portal</h1>

                    <div className="input-box">
                        <input
                            type="text"
                            id="patientName"
                            name="patientName"
                            placeholder="Patient Name"
                            value={formData.patientName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-box">
                        <label className='reclabel' htmlFor="bloodType">Blood Type Required:</label>
                        <select
                            id="bloodType"
                            name="bloodType"
                            value={formData.bloodType}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Blood Type</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                        </select>
                    </div>

                    <div className="input-box">
                        <input
                            type="text"
                            id="hospitalName"
                            name="hospitalName"
                            placeholder="Hospital Name"
                            value={formData.hospitalName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-box">
                        <input
                            type="tel"
                            id="contactNumber"
                            name="contactNumber"
                            placeholder="Contact Number"
                            value={formData.contactNumber}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-box">
                        <input
                            type="number"
                            id="requiredUnits"
                            name="requiredUnits"
                            placeholder="Number of Units Required"
                            value={formData.requiredUnits}
                            onChange={handleChange}
                            required
                            min="0"  
                        />
                    </div>

                    <div className="input-box">
                        <label className='reclabel' htmlFor="urgencyLevel">Urgency Level:</label>
                        <select
                            id="urgencyLevel"
                            name="urgencyLevel"
                            value={formData.urgencyLevel}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Urgency Level</option>
                            <option value="Urgent">Urgent</option>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>
                    </div>

                    <div className="input-box">
                        <input
                           type="date"
                           id="dateNeeded"
                           name="dateNeeded"
                           value={formData.dateNeeded}
                           onChange={handleChange}
                           required
                           min={new Date().toISOString().split("T")[0]} 
                        />
                     </div>


                    <div className="input-box">
                        <textarea
                            id="additionalInfo"
                            name="additionalInfo"
                            rows="4"
                            cols="50"
                            placeholder="Additional Information"
                            value={formData.additionalInfo}
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    <div className="input-box">
                        <input
                            type="text"
                            id="doctor"
                            name="doctor"
                            placeholder="Medical Professional"
                            value={formData.doctor}
                            onChange={handleChange}
                        />
                    </div>

                    <button type="submit">Submit Request</button>

                    {successMessage && <p className="success-message">{successMessage}</p>}
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                </form>
            </div>
        </div>
    );
};

export default RecipientPortal;
