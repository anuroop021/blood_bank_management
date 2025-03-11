// src/components/Header.js
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/layout/Header.css';

class Header extends Component {
  render() {
    return (
      <header className="bloodBank-header-container">
        <div className="bloodBank-header-heading"></div>
        <nav className="bloodBank-header-nav">
          <div className="bloodBank-header-item" id="bloodBank-header-item0">
            <Link to="/home">{/* eslint-disable-next-line*/}
              <img src="/images/logo.png" alt="Clickable Image" className="bloodBank-header-logo" />
            </Link>
          </div>
          <div className="bloodBank-header-item" id="bloodBank-header-item1">
            <h3>Donate Blood</h3>
            <div className="bloodBank-header-hover-text" id="bloodBank-header-text1">
              <Link to="/donor/DonorProfile">My Profile</Link>
              <br /><br />
              <Link to="/donor/Appointment">Schedule my Appointment</Link>
              <br /><br />
              <Link to="/donor/DonorProfileManage">Manage My Profile</Link>
              <br /><br />
            </div>
          </div>
          <div className="bloodBank-header-item" id="bloodBank-header-item2">
            <h3>Donor Registration</h3>
            <div className="bloodBank-header-hover-text" id="bloodBank-header-text2">
              <Link to="/donor/DonorRegistration">Donor Registration</Link>
              <br /><br />
              <Link to="/donor/DonorLogin">Donor Login</Link>
              <br /><br />
            </div>
          </div>
          <div className="bloodBank-header-item" id="bloodBank-header-item3">
            <h3>How to Donate Blood</h3>
            <div className="bloodBank-header-hover-text" id="bloodBank-header-text3">
              <Link to="/eligibility" >
                Eligibility Requirements
              </Link>
              <br /><br />
              <Link to="/Faq">FAQ'S</Link>
              <br /><br />
              <Link to="/eligibility" >
              </Link>
            </div>
          </div>
          <div className="bloodBank-header-item" id="bloodBank-header-item4">
            <h3>Employee</h3>
            <div className="bloodBank-header-hover-text" id="bloodBank-header-text4">
              <Link to="/employeeLogin">Employee Login</Link>
              <br /><br />
              <Link to="/adminLogin">Admin Login</Link>
              <br /><br />
              <Link to="/medicalprofessional">Medical Professional Login</Link>
              <br /><br />
            </div>
          </div>
          <div className="bloodBank-header-item" id="bloodBank-header-item5">
            <h3>Hospitals</h3>
            <div className="bloodBank-header-hover-text" id="bloodBank-header-text5">
              <Link to="/hospital/register">Hospital Registration</Link>
              <br /><br />
              <Link to="/hospital">Hospital Login</Link>
              <br /><br />
            </div>
          </div>
        </nav>
      </header>
    );
  }
}

export default Header;
