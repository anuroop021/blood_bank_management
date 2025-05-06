import React, { Component } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import '../../styles/donorStyles/ManageMyProfile.css';
const api_uri = process.env.REACT_APP_API_URI;

class ManageMyProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fname: '',
      lname: '',
      email: '',
      phone: '',
      bloodGroup: '',
      address: '',
      errorMessage: '',
      successMessage: '',
      isLoggedIn: true,
    };
  }

  async componentDidMount() {
    try {
      const response = await axios.get(`${api_uri}/api/donor/profile`, {
        withCredentials: true,
      });

      if (response.status === 200) {
        const { fname, lname, email, phone, bloodGroup, address } = response.data;
        this.setState({ fname, lname, email, phone, bloodGroup, address });
      }
    } catch (error) {
      this.setState({
        isLoggedIn: false,
        errorMessage: 'Session expired. Please log in again.',
      });
    }
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { fname, lname, email, phone, bloodGroup, address } = this.state;

    try {
      const response = await axios.post(
        `${api_uri}/api/donor/profile/update`,
        { fname, lname, email, phone, bloodGroup, address },
        { withCredentials: true } // Include credentials to send cookies
      );

      if (response.status === 200) {
        this.setState({
          successMessage: 'Profile updated successfully!',
          errorMessage: '',
        });
      }
    } catch (error) {
      this.setState({
        errorMessage: error.response?.data?.message || 'Failed to update profile.',
        successMessage: '',
      });
    }
  };

  render() {
    const {
      fname,
      lname,
      email,
      phone,
      bloodGroup,
      address,
      errorMessage,
      successMessage,
      isLoggedIn,
    } = this.state;

    if (!isLoggedIn) {
      return <Navigate to="/donor/DonorLogin" />;
    }

    return (
      <div className="manage-my-profile-container">
        <form className="manage-my-profile-form" onSubmit={this.handleSubmit}>
          <h2>Manage My Profile</h2>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          {successMessage && <p className="success-message">{successMessage}</p>}
          <label htmlFor="fname">First Name:</label>
          <input
            type="text"
            id="fname"
            name="fname"
            value={fname}
            onChange={this.handleChange}
            required
          />
          <label htmlFor="lname">Last Name:</label>
          <input
            type="text"
            id="lname"
            name="lname"
            value={lname}
            onChange={this.handleChange}
            required
          />
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={this.handleChange}
            required
          />
          <label htmlFor="phone">Phone:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={phone}
            onChange={this.handleChange}
            required
          />
          <label htmlFor="bloodGroup">Blood Group:</label>
          <input
            type="text"
            id="bloodGroup"
            name="bloodGroup"
            value={bloodGroup}
            onChange={this.handleChange}
            required
          />
          <label htmlFor="address">Address:</label>
          <input
            type="text"
            id="address"
            name="address"
            value={address}
            onChange={this.handleChange}
            required
          />
          <button type="submit">Update Profile</button>
        </form>
      </div>
    );
  }
}

export default ManageMyProfile;
