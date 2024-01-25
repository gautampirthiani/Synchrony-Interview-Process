/* HomePage.js */

import React from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { signOut } from '@aws-amplify/auth';
import logoimage from './synchrony-logo-1.png';
import './HomePage.css';
import Navbar from './Navbar';

const HomePage = () => {
  return (
    <Authenticator hideSignUp>
      <div className="homepage-container">
        <div className="logo-container">
          <img src={logoimage} alt="Company Logo" className="logo-image" />
        </div>

        <div className="navbar">
          <span className="navbar-logo">Recruiting Portal</span>
          <Navbar />
          <button onClick={signOut} className="sign-out-button">Sign Out</button>
        </div>

        <h1 className="homepage-heading">Synchrony Interviews</h1>

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
    </Authenticator>
  );
};

export default HomePage;
