import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import '../../styles/donorStyles/DonorLogin.css';
import axios from 'axios';
const api_uri = process.env.REACT_APP_API_URI;

class DonorLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      errorMessage: '',
      isLoggedIn: false,
    };
  }

  async componentDidMount() {
    try {
      const response = await axios.get(`${api_uri}/api/donor/profile`, {
        withCredentials: true, 
      });
      if (response.status === 200) {
        this.setState({ isLoggedIn: true });
      }
    } catch (error) {
      console.log('User is not logged in, proceed as normal');
    }
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = this.state;

    try {
      const response = await axios.post(
        `${api_uri}/api/donor/login`,
        { username, password },
        { withCredentials: true } 
      );

      if (response.status === 200) {
        console.log('Login successful:', response.data);
        this.setState({ isLoggedIn: true, errorMessage: '' });
      }
    } catch (error) {
      console.error('Error during login:', error.response?.data?.message || error.message);
      this.setState({
        errorMessage: error.response?.data?.message || 'An error occurred. Please try again.',
      });
    }
  };

  render() {
    const { username, password, errorMessage, isLoggedIn } = this.state;

    if (isLoggedIn) {
      return <Navigate to="/donor/DonorProfile" />;
    }

    return (
      <div className="donor-login-container">
        <form className="donor-login-form" id="donor-login-form" onSubmit={this.handleSubmit}>
          <h2 className="donor-login-title">Login</h2>
          {errorMessage && <p className="donor-login-error-message">{errorMessage}</p>}
          <label className="donor-login-input-label" htmlFor="donor-login-userName">User Name</label>
          <input
            id="donor-login-userName"
            name="username"
            type="text"
            value={username}
            onChange={this.handleChange}
            required
            className="donor-login-input-field"
          /><br /><br />
          <label className="donor-login-input-label" htmlFor="donor-login-pass">Password</label>
          <input
            id="donor-login-pass"
            name="password"
            type="password"
            value={password}
            onChange={this.handleChange}
            required
            className="donor-login-input-field"
          /><br /><br />
          <a href="/donor/DonorRegistration" className="donor-login-create-account">Make a new account</a><br />
          <button type="submit" className="donor-login-submit-button">Login</button>
        </form>
      </div>
    );
  }
}

export default DonorLogin;
