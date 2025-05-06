import React, { Component } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import '../../styles/donorStyles/DonationHistory.css';
const api_uri = process.env.REACT_APP_API_URI;

class DonationHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      donations: [],
      errorMessage: '',
      isLoggedIn: true,
      isLoading: true
    };
  }

  async componentDidMount() {
    await this.fetchDonationHistory();
  }

  fetchDonationHistory = async () => {
    try {
      const response = await axios.get(`${api_uri}/api/donor/donationHistory`, {
        withCredentials: true,
      });

      this.setState({ 
        donations: response.data,
        isLoading: false 
      });
    } catch (error) {
      console.error('Error fetching donation history:', error);
      if (error.response?.status === 401) {
        this.setState({
          isLoggedIn: false,
          errorMessage: 'Session expired. Please log in again.',
          isLoading: false
        });
      } else {
        this.setState({
          errorMessage: 'Failed to fetch donation history. Please try again later.',
          isLoading: false
        });
      }
    }
  };

  render() {
    const { donations, errorMessage, isLoggedIn, isLoading } = this.state;

    if (!isLoggedIn) {
      return <Navigate to="/donor/DonorLogin" />;
    }

    return (
      <div className="donation-history-container">
        <h2>Verified Donation History</h2>
        
        {isLoading ? (
          <div className="loading">Loading donation history...</div>
        ) : (
          <>
            {errorMessage && (
              <div className="error-message">{errorMessage}</div>
            )}
            
            {donations.length > 0 ? (
              <div className="table-container">
                <table className="donation-history-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Blood Group</th>
                      <th>Location</th>
                      <th>Doctor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donations.map((donation, index) => (
                      <tr key={index}>
                        <td>{new Date(donation.date).toLocaleDateString()}</td>
                        <td>{donation.bloodGroup}</td>
                        <td>{donation.address}</td>
                        <td>{donation.doctor || 'Not assigned'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="no-donations">
                <p>No verified donations found in your history.</p>
                <p>Once your donation appointments are verified by a medical professional, they will appear here.</p>
              </div>
            )}
          </>
        )}
      </div>
    );
  }
}

export default DonationHistory;