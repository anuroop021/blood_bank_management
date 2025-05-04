import React from "react";
import { Link } from "react-router-dom";
import {
  User,
  Menu,
  X,
  Sun,
  Moon,
  LogOut,
} from "lucide-react";

class Navbar extends React.Component {
  toggleMenu = () => {
    this.props.setIsMenuOpen((prev) => !prev);
  };

  toggleDarkMode = () => {
    const { setIsDarkMode, isDarkMode } = this.props;
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle("dark-mode");
  };

  render() {
    const { isDarkMode, isMenuOpen, handleLogout } = this.props;

    return (
      <header className={`header ${isDarkMode ? "dark" : ""}`}>
        <nav className="nav-container">
          <div className="nav-logo">
            <Link to="/employee/dashboard" className="logo-link">
              <User className="logo-icon" />
              <span className="logo-text">Employee Portal</span>
            </Link>
          </div>

          <button className="mobile-menu-btn" onClick={this.toggleMenu}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>

          <div className={`nav-links ${isMenuOpen ? "active" : ""}`}>
            <div className="nav-item">
              <Link to="/employee/Home" className="nav-link">Home</Link>
            </div>
            <div className="nav-item">
              <Link to="/employee/assigndoctor" className="nav-link">Assign Doctor</Link>
            </div>
            <div className="nav-item">
              <Link to="/issueform" className="nav-link">Issue Form</Link>
            </div>
            <div className="nav-item">
              <Link to="/employee/instructions" className="nav-link">Instructions</Link>
            </div>
          </div>

          <div className="nav-actions">
            <button className="theme-toggle" onClick={this.toggleDarkMode}>
              {isDarkMode ? <Sun className="theme-icon" /> : <Moon className="theme-icon" />}
            </button>
            <button className="logout-btn" onClick={handleLogout}>
              <LogOut className="logout-icon" />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </header>
    );
  }
}

export default Navbar;
