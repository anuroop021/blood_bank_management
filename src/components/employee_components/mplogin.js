import React from "react";
import { FaUser } from "react-icons/fa";
import axios from "axios";
import '../../styles/employee_styles/employee_login.css';
import { Navigate } from "react-router-dom";
const api_uri = process.env.REACT_APP_API_URI;

class MedicalprofessionalLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      errorMessage: '',
      successMessage: '',
      redirect: false,
    };
  }

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = this.state;

    try {
      const response = await axios.post(`${api_uri}/api/medicalprofessional/login`, {
        username,
        password,
      });

      if (response.data.success) {
        this.setState({ successMessage: 'Login successful!', errorMessage: '' , redirect: true});
        localStorage.setItem('mpusername', username);
      } else {
        this.setState({ errorMessage: 'Invalid username or password', successMessage: '' });
      }
    } catch (error) {
      console.error('Error during login:', error);
      this.setState({ errorMessage: 'An error occurred, please try again', successMessage: '' });
    }
  };

  render() {
    const { username, password, errorMessage, successMessage, redirect } = this.state;
    if (redirect) {
        return <Navigate to="/medicalprofessional/Home" />;
      }
    return (
      <div className="outer">
        <div className="loginform">
          <form onSubmit={this.handleSubmit}>
            <h1 style={{color:'white'}}>Medic Login</h1>
            {errorMessage && <p className="error">{errorMessage}</p>}
            {successMessage && <p className="success">{successMessage}</p>}
            <div className="input-box">
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={username}
                onChange={this.handleInputChange}
                required
              />
              <FaUser className="icon" />
            </div>
            <div className="input-box">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={this.handleInputChange}
                required
              />
            </div>
            <button type="submit">Login</button>
            
          </form>
        </div>
      </div>
    );
  }
}

export default MedicalprofessionalLogin;
