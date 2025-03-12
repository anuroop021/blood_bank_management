import React from "react";
import { FaUser } from "react-icons/fa";
import { Navigate } from "react-router-dom";
import "../../styles/AdminStyles/admin_login.css";

class HospitalLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      errorMessage: "",
      successMessage: "",
      redirectToDashboard: false,
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
      const response = await fetch("/api/HospitalLogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
  
      if (data.success) {
        localStorage.setItem("isHospLoggedIn", "true"); // Set login flag
        this.setState({
          successMessage: "Login successful!",
          errorMessage: "",
          redirectToDashboard: true,
        });
      } else {
        this.setState({
          errorMessage: "Invalid username or password",
          successMessage: "",
        });
      }
    } catch (error) {
      console.error("Error during login:", error);
      this.setState({
        errorMessage: "An error occurred, please try again",
        successMessage: "",
      });
    }
  };
  

  render() {
    const { username, password, errorMessage, successMessage, redirectToDashboard } = this.state;

    if (redirectToDashboard) {
      return <Navigate to="/hospital/home" />;
    }

    return (
      <div className="adouter">
        <div className="adloginform">
          <form onSubmit={this.handleSubmit}>
            <h1>Hospital Login</h1>
            {errorMessage && <p className="error">{errorMessage}</p>}
            {successMessage && <p className="success">{successMessage}</p>}
            <div className="input-boxAD">
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
            <div className="input-boxAD">
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

export default HospitalLogin;
