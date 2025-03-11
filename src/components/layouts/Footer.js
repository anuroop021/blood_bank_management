import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Heart, Mail, Phone, MapPin, Droplets } from 'lucide-react';
import '../../styles/layout/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <div className="footer-brand">
            <Droplets className="footer-logo-icon" />
            <h2>BloodBank</h2>
          </div>
          <p className="footer-description">
            Blood donation and transfusion service is an indispensable part of contemporary medicine and healthcare.
            Together, we can save lives and make a difference in our community.
          </p>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/eligibility">Eligibility</Link></li>
            <li><Link to="/donor/DonorRegistration">Donate Blood</Link></li>
            <li><Link to="/Faq">FAQs</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact Us</h3>
          <div className="contact-info">
            <div className="contact-item">
              <Mail className="contact-icon" />
              <span>contact@bloodbank.org</span>
            </div>
            <div className="contact-item">
              <Phone className="contact-icon" />
              <span>(555) 123-4567</span>
            </div>
            <div className="contact-item">
              <MapPin className="contact-icon" />
              <span>123 Medical Center Dr, City, State</span>
            </div>
          </div>
        </div>

        <div className="footer-section">
          <h3>Connect With Us</h3>
          <div className="social-links">
            <a href="https://facebook.com" className="social-link">
              <Facebook />
            </a>
            <a href="https://twitter.com" className="social-link">
              <Twitter />
            </a>
            <a href="https://instagram.com" className="social-link">
              <Instagram />
            </a>
            <a href="https://linkedin.com" className="social-link">
              <Linkedin />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-disclaimer">
          <p>
            Disclaimer: All information and data entered on this platform are stored securely in our database.
          </p>
        </div>
        <div className="footer-copyright">
          <p>
            © 2024 BloodBank. Made with <Heart className="heart-icon" /> for humanity
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;