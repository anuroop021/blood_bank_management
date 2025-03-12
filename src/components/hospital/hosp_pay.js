import React from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import '../../styles/employee_styles/recipient_portal.css';

class HospitalPayment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            HospitalName: '',
            bloodType: '',
            hospitalName: '',
            contactNumber: '',
            requiredUnits: '',
            urgencyLevel: '',
            dateNeeded: '',
            additionalInfo: '',
            successMessage: '',
            errorMessage: '',
            redirectToPayments: false,
        };
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleSubmit = async (e) => {
        e.preventDefault();

        if (this.state.requiredUnits < 1) {
            this.setState({
                errorMessage: 'Number of units required cannot be negative.',
                successMessage: '',
            });
            return;
        }

        try {
            const response = await axios.post('/api/HospitalPayment', this.state);
            if (response.data.success) {
                this.setState({
                    successMessage: 'Form submitted successfully!',
                    errorMessage: '',
                    HospitalName: '',
                    bloodType: '',
                    hospitalName: '',
                    contactNumber: '',
                    requiredUnits: '',
                    urgencyLevel: '',
                    dateNeeded: '',
                    additionalInfo: '',
                    redirectToPayments: true, 
                });
            }
        } catch (error) {
            console.error('Error:', error.response ? error.response.data : error.message);
            this.setState({
                errorMessage: 'An error occurred. Please try again.',
                successMessage: '',
            });
        }
    };

    render() {
        if (this.state.redirectToPayments) {
            return <Navigate to="/payment" />;
        }

        return (
            <div className="recipient-outer">
                <div className="recipient-form">
                    <form onSubmit={this.handleSubmit}>
                        <h1 style={{color:'white'}}>Hospital Portal</h1>

                        <div className="input-box">
                            <input
                                type="text"
                                id="HospitalName"
                                name="HospitalName"
                                placeholder="Hospital Name"
                                value={this.state.HospitalName}
                                onChange={this.handleChange}
                                required
                            />
                        </div>

                        <div className="input-box">
                            <label style={{color:'white'}} htmlFor="bloodType">Blood Type Required:</label>
                            <select
                                id="bloodType"
                                name="bloodType"
                                value={this.state.bloodType}
                                onChange={this.handleChange}
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
                                type="tel"
                                id="contactNumber"
                                name="contactNumber"
                                placeholder="Contact Number"
                                value={this.state.contactNumber}
                                onChange={this.handleChange}
                                required
                            />
                        </div>

                        <div className="input-box">
                            <input
                                type="number"
                                id="requiredUnits"
                                name="requiredUnits"
                                placeholder="Number of Units Required"
                                value={this.state.requiredUnits}
                                onChange={this.handleChange}
                                required
                                min="0"
                            />
                        </div>

                        <div className="input-box">
                            <label style={{color:'white'}} htmlFor="urgencyLevel">Urgency Level:</label>
                            <select
                                id="urgencyLevel"
                                name="urgencyLevel"
                                value={this.state.urgencyLevel}
                                onChange={this.handleChange}
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
                                value={this.state.dateNeeded}
                                onChange={this.handleChange}
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
                                value={this.state.additionalInfo}
                                onChange={this.handleChange}
                            ></textarea>
                        </div>

                        <button type="submit">Submit Request</button>

                        {this.state.successMessage && <p className="success-message">{this.state.successMessage}</p>}
                        {this.state.errorMessage && <p className="error-message">{this.state.errorMessage}</p>}
                    </form>
                </div>
            </div>
        );
    }
}

export default HospitalPayment;
