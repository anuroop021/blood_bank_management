import React from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
const api_uri = process.env.REACT_APP_API_URI;

class HospitalRegistration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '1234',
      address: '',
      contact: '',
      email: '',
      type: 'Government',
      bloodbank_capacity: '',
      establishedYear: '',
      successMessage: '',
      errorMessage: '',
      redirectToHospital: false,
    };
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const {
      username,
      password,
      address,
      contact,
      email,
      type,
      bloodbank_capacity,
      establishedYear,
    } = this.state;

    try {
      await axios.post(`${api_uri}/api/hospitals/register`, {
        username,
        password,
        address,
        contact,
        email,
        type,
        bloodbank_capacity,
        establishedYear,
      });

      this.setState({ redirectToHospital: true });
    } catch (error) {
      this.setState({
        errorMessage: error.response?.data?.message || 'Registration failed.',
      });
    }
  };

  render() {
    const {
      username,
      password,
      address,
      contact,
      email,
      type,
      bloodbank_capacity,
      establishedYear,
      errorMessage,
      redirectToHospital,
    } = this.state;

    if (redirectToHospital) {
      return <Navigate to="/hospital" />;
    }

    return (
      <div className='udiv'>
        
        <form id="updempForm" onSubmit={this.handleSubmit}>
        <h1>Hospital Registration</h1><br />
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={this.handleChange}
            required
          />
          <br /><br />
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={this.handleChange}
            required
          />
          <br /><br />
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={address}
            onChange={this.handleChange}
            required
          />
          <br /><br />
          <label>Contact:</label>
          <input
            type="text"
            name="contact"
            value={contact}
            onChange={this.handleChange}
            required
          />
          <br /><br />
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={this.handleChange}
            required
          />
          <br /><br />
          <label>Type:</label>
          <select name="type" value={type} onChange={this.handleChange}>
            <option value="Government">Government</option>
            <option value="Private">Private</option>
          </select>
          <br /><br />
          <label>Bloodbank Capacity:</label>
          <input
            type="number"
            name="bloodbank_capacity"
            value={bloodbank_capacity}
            onChange={this.handleChange}
            required
          />
          <br /><br />
          <label>Established Year:</label>
          <input
            type="number"
            name="establishedYear"
            value={establishedYear}
            onChange={this.handleChange}
          />
          <br /><br />
          <button type="submit">Register</button>
        </form>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      </div>
    );
  }
}

export default HospitalRegistration;
