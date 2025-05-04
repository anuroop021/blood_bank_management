import React from "react";
import { Link } from "react-router-dom";
import {
  UserCog,
  Menu,
  X,
  Sun,
  Moon,
  
} from "lucide-react";
import '../../styles/layout/Header.css'; // make sure styles match the new structure

class AdminHeader extends React.Component {
  render() {
    const {
      isDarkMode,
      isMenuOpen,
      toggleTheme,
     
      toggleMenu
    } = this.props;

    return (
      <header className={`header ${isDarkMode ? "dark" : ""}`}>
        <nav className="nav-container">
          <div className="nav-logo">
            <Link to="/Admin/Home" className="logo-link">
              <UserCog className="logo-icon" />
              <span className="logo-text">Admin Panel</span>
            </Link>
          </div>

          <button className="mobile-menu-btn" onClick={toggleMenu}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>

          <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
            <div className="nav-item">
              <Link to="/Admin/Home" className="nav-link">Home</Link>
            </div>
            <div className="nav-item">
              <Link to="/Admin/donorDetails" className="nav-link">Donor Details</Link>
            </div>
            <div className="nav-item">
              <Link to="/Admin/employeeManage" className="nav-link">Employee Management</Link>
            </div>
            <div className="nav-item">
              <Link to="/Admin/MedicManage" className="nav-link">Medical Professional</Link>
            </div>
            <div className="nav-item">
              <Link to="/Admin/hosp" className="nav-link">Hospital Management</Link>
            </div>
          </div>

          <div className="nav-actions">
            <button className="theme-toggle" onClick={toggleTheme}>
              {isDarkMode ? <Sun className="theme-icon" /> : <Moon className="theme-icon" />}
            </button>
            
          
          </div>
        </nav>
      </header>
    );
  }
}

export default AdminHeader;
