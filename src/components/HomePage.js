import React, { useEffect, useState } from 'react';
import logoimage from './synchrony-logo-1.png';
import './HomePage.css';
import Navbar from './Navbar';
import { getCurrentUser } from '@aws-amplify/auth';

const HomePage = () => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    getCurrentUser()
      .then(user => {
        setUsername(user.username);
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="homepage-container">
      <div className="logo-container">
        <img src={logoimage} alt="Company Logo" className="logo-image" />
      </div>

      <div className="navbar">
        <span className="navbar-logo">Recruiting Portal</span>
        <Navbar />
      </div>

      <h1 className="homepage-heading">Welcome, {username}!</h1>

      <h2 className="homepage-heading">Synchrony Interviews</h2>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4 className="footer-heading">Get in Touch</h4>
            <p className="footer-contact-item">+1 (234) 567-890</p>
            <p className="footer-contact-item">contact@synchrony.com</p>
            <p className="footer-contact-item">123 Synchrony Blvd, Finance City</p>
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
