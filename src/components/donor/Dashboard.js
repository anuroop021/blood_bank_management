import React, { Component } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  
  Mail,
  Phone,
  Droplet,
  MapPin,
  LogOut,
  Clock,
} from "lucide-react";
import { Navigate } from "react-router-dom";
// adjust if your path is different
import "../../styles/donorStyles/Donor.css";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      donorDetails: null,
      errorMessage: "",
      isLoggedIn: true,
    };
  }

  async componentDidMount() {
    try {
      const response = await axios.get("http://localhost:5000/api/donor/profile", {
        withCredentials: true,
      });

      if (response.status === 200) {
        this.setState({ donorDetails: response.data });
      }
    } catch (error) {
      this.setState({
        isLoggedIn: false,
        errorMessage: "Session expired. Please log in again.",
      });
    }
  }

  handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/donor/logout", {}, {
        withCredentials: true,
      });
      this.setState({ isLoggedIn: false });
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  render() {
    const { donorDetails, errorMessage, isLoggedIn } = this.state;

    if (!isLoggedIn) {
      return <Navigate to="/donor/DonorLogin" />;
    }

    return (
      <div
      className="donor-dashboard-container"
      style={{
        backgroundImage: `url(/images/bg_image.png)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
    
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        {donorDetails ? (
          <motion.div
            className="dashboard-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="profile-section"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <img
                src="https://via.placeholder.com/120"
                alt="Profile"
                className="profile-pic"
              />
              <h2 className="welcome-title">
                Welcome, {donorDetails.fname} {donorDetails.lname}
              </h2>
            </motion.div>

            <motion.div
              className="info-section"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <p><Mail className="icon" /> {donorDetails.email}</p>
              <p><Phone className="icon" /> {donorDetails.phone}</p>
              <p><Droplet className="icon" /> {donorDetails.bloodGroup}</p>
              <p><MapPin className="icon" /> {donorDetails.address}</p>
            </motion.div>

            <motion.div
              className="button-container"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <button onClick={this.handleLogout} className="logout-button">
                <LogOut className="button-icon" /> Logout
              </button>

              <a href="/donor/DonorHistory" className="history-button">
                <Clock className="button-icon" /> View Donation History
              </a>
            </motion.div>
          </motion.div>
        ) : (
          <p className="loading-text">Loading your details...</p>
        )}
      </div>
    );
  }
}

export default Dashboard;
