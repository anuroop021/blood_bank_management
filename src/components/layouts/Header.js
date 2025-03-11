import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown, Sun, Moon, Droplets } from 'lucide-react';
import '../../styles/layout/Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode');
  };

  return (
    <header className={`header ${isDarkMode ? 'dark' : ''}`}>
      <nav className="nav-container">
        <div className="nav-logo">
          <Link to="/home" className="logo-link">
            <Droplets className="logo-icon" />
            <span className="logo-text">Rakthadhaara</span>
          </Link>
        </div>

        <button className="mobile-menu-btn" onClick={toggleMenu}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>

        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <div className="nav-item">
            <span className="nav-link">
              Donate Blood <ChevronDown className="dropdown-icon" />
            </span>
            <div className="dropdown-menu">
              <Link to="/donor/DonorProfile">My Profile</Link>
              <Link to="/donor/Appointment">Schedule Appointment</Link>
              <Link to="/donor/DonorProfileManage">Manage Profile</Link>
              <Link to="/donor/receiveBlood">Request Blood</Link>
            </div>
          </div>

          <div className="nav-item">
            <span className="nav-link">
              Registration <ChevronDown className="dropdown-icon" />
            </span>
            <div className="dropdown-menu">
              <Link to="/donor/DonorRegistration">Donor Registration</Link>
              <Link to="/donor/DonorLogin">Donor Login</Link>
            </div>
          </div>

          <div className="nav-item">
            <span className="nav-link">
              Resources <ChevronDown className="dropdown-icon" />
            </span>
            <div className="dropdown-menu">
              <Link to="/eligibility">Eligibility Requirements</Link>
              <Link to="/Faq">FAQ's</Link>
            </div>
          </div>

          <div className="nav-item">
            <span className="nav-link">
              Staff Portal <ChevronDown className="dropdown-icon" />
            </span>
            <div className="dropdown-menu">
              <Link to="/employeeLogin">Employee Login</Link>
              <Link to="/adminLogin">Admin Login</Link>
              <Link to="/medicalprofessional">Medical Professional</Link>
            </div>
          </div>

          <div className="nav-item">
            <span className="nav-link">
              Hospitals <ChevronDown className="dropdown-icon" />
            </span>
            <div className="dropdown-menu">
              <Link to="/hospital/register">Hospital Registration</Link>
              <Link to="/hospital">Hospital Login</Link>
            </div>
          </div>
        </div>

        <button className="theme-toggle" onClick={toggleDarkMode}>
          {isDarkMode ? <Sun className="theme-icon" /> : <Moon className="theme-icon" />}
        </button>
      </nav>
    </header>
  );
};

export default Header;