import React, { useEffect, useState } from 'react';
import logoimage from './synchrony-logo-1.png';
import './HomePage.css';
import Navbar from './Navbar';
import { getCurrentUser } from '@aws-amplify/auth';

const HomePage = () => {
  const [username, setUsername] = useState('');
  const [secretMessage, setSecretMessage] = useState('');

  useEffect(() => {
    getCurrentUser()
      .then(user => {
        setUsername(user.username);
        fetch('https://le6xxlisoj.execute-api.us-east-1.amazonaws.com/dev/GetDepartment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: user.username }),
        })
          .then(response => response.json())
          .then(data => {
            if (data.body) {
              const responseBody = JSON.parse(data.body);
              setSecretMessage(responseBody.secret_message);
            }
          })
          .catch(error => console.error('Error:', error));
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
      <div className="welcome-message">
        {secretMessage && <h2 className="homepage-heading">{secretMessage}</h2>}
      </div>
      <h2 className="homepage-heading">Synchrony Interviews</h2>
      <footer className="footer">
        <div className="footer-content">
        </div>
        <div className="footer-bottom-text">
          &copy; 2023 Synchrony. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
