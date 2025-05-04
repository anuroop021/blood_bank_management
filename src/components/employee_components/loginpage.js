import React from "react";
import { FaUser } from "react-icons/fa";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { connect } from "react-redux";
import { setEmployee } from "../../redux/employeereducer";
import '../../styles/employee_styles/employee_login.css';

class Login extends React.Component {
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
      const response = await axios.post('http://localhost:5000/api/employee/login', {
        username,
        password,
      });

      if (response.data.success) {
        this.setState({ 
          successMessage: 'Login successful!', 
          errorMessage: '', 
          redirect: true 
        });
        localStorage.setItem('isEmpLoggedIn',true);
        localStorage.setItem('username', username);
        this.props.setEmployee({ username, password });
      } else {
        this.setState({ 
          errorMessage: 'Invalid username or password', 
          successMessage: '' 
        });
      }
    } catch (error) {
      console.error('Error during login:', error);
      this.setState({ 
        errorMessage: 'An error occurred, please try again', 
        successMessage: '' 
      });
    }
  };

  render() {
    const { username, password, errorMessage, successMessage, redirect } = this.state;

    if (redirect) {
      return <Navigate to="/employee/Home" />;
    }

    return (
      <div className="outer" style={{
        backgroundImage: 'url(/images/bg2.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        width: '100%',
      }}>
        <div className="loginform">
          <form onSubmit={this.handleSubmit}>
            <h1 style={{color:'black'}}>Login</h1>
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

const mapDispatchToProps = {
  setEmployee,
};

export default connect(null, mapDispatchToProps)(Login);
