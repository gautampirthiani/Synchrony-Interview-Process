// src/components/HomePage.js
import React from 'react';
import logoimage from './synchrony-logo-1.png';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="homepage-container">
      
      <div className="logo-container">
        <img src= {logoimage} alt="Company Logo" className="logo-image" />
      </div>

      <div className="navbar">
        <span className="navbar-logo">Synchrony</span>
        <ul className="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#about">About Us</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </div>
      
      <img src="Synchrony_Financial_logo.svg.png" alt="Financial Figures" className="homepage-image" />
      
      <h2 className="homepage-heading">Welcome to the Synchrony Interview Dashboard</h2>
      
      <div className="footer">
        &copy; 2023 Synchrony. All Rights Reserved.
      </div>
    </div>
  );
};

export default HomePage;
