// src/components/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import logoimage from './synchrony-logo-1.png';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="homepage-container">
      
      <div className="logo-container">
        <img src={logoimage} alt="Company Logo" className="logo-image" />
      </div>

      <div className="navbar">
        <span className="navbar-logo">Synchrony</span>
        <ul className="nav-links">
          <li><Link to="/dashboard/interviews">Interviews</Link></li>
          <li><Link to="/dashboard/new-interview">New Interview</Link></li>
          <li><Link to="/dashboard/edit-templates">Edit Templates</Link></li>
          <li><Link to="/dashboard/data-analysis">Data Analysis</Link></li>
        </ul>
      </div>
      
      <h2 className="homepage-heading">Synchrony Interviews</h2>
      
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4 className="footer-heading">Company</h4>
            <ul className="footer-links">
              <li><Link to="/about-us">About Us</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/blog">Blog</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Explore</h4>
            <ul className="footer-links">
              <li><Link to="/projects">Projects</Link></li>
              <li><Link to="/community">Community</Link></li>
              <li><Link to="/gallery">Gallery</Link></li>
              <li><Link to="/events">Events</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Get in Touch</h4>
            <div className="footer-contact-item">
              <span className="icon-phone"></span>
              <a href="tel:+1234567890">+1 (234) 567-890</a>
            </div>
            <div className="footer-contact-item">
              <span className="icon-envelope"></span>
              <a href="mailto:contact@synchrony.com">contact@synchrony.com</a>
            </div>
            <div className="footer-contact-item">
              <span className="icon-map-marker"></span>
              <span>123 Synchrony Blvd, Finance City</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom-text">
          &copy; 2023 Synchrony. All Rights Reserved.
        </div>
      </footer>
      
    </div>
  );
};

export default HomePage;
