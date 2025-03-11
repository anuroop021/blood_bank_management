import React, { Component } from 'react';
import axios from 'axios';

import { Navigate } from 'react-router-dom';
import '../../styles/donorStyles/Donor.css';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      donorDetails: null,
      errorMessage: '',
      isLoggedIn: true,
    };
  }

  async componentDidMount() {
    try {
      const response = await axios.get('http://localhost:5000/api/donor/profile', {
        withCredentials: true, 
      });

      if (response.status === 200) {
        this.setState({ donorDetails: response.data });
      }
    } catch (error) {
      this.setState({
        isLoggedIn: false,
        errorMessage: 'Session expired. Please log in again.',
      });
    }
  }

  handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/donor/logout', {}, {
        withCredentials: true, 
      });
      this.setState({ isLoggedIn: false });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  render() {
    const { donorDetails, errorMessage, isLoggedIn } = this.state;

    if (!isLoggedIn) {
      return <Navigate to="/donor/DonorLogin" />;
    }

    return (
      <div className="dashboard-container">
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {donorDetails ? (
          <div className="dashboard-details">
            <h2>Welcome, {donorDetails.fname} {donorDetails.lname}</h2>
            <p>Email: {donorDetails.email}</p>
            <p>Phone: {donorDetails.phone}</p>
            <p>Blood Group: {donorDetails.bloodGroup}</p>
            <p>Address: {donorDetails.address}</p>
            <button onClick={this.handleLogout} className="logout-button">Logout</button>

            {/* View Donation History Link/Button */}
            <div className="donation-history">
              <a href="/donor/DonorHistory" className="view-donation-history-link">
                View Donation History
              </a>
            </div>
          </div>
        ) : (
          <p>Loading your details...</p>
        )}
      </div>
    );
  }
}

export default Dashboard;