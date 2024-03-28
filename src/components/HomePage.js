import React, { useEffect, useState } from 'react';
import logoimage from './synchrony-logo-1.png';
import './HomePage.css';
import Navbar from './Navbar';
import { getCurrentUser } from '@aws-amplify/auth';

const HomePage = () => {
  const [username, setUsername] = useState('');
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    getCurrentUser()
      .then(user => {
        setUsername(user.username); 
        fetch('https://h60ydhn92g.execute-api.us-east-1.amazonaws.com/dev/GetDepartment', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: user.username }), 
        })
        .then(response => response.json())
        .then(data => {
          if (data && data.departments) {
            setDepartments(data.departments);
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
      {departments.length > 0 && (
        <div className="welcome-message">
          <h2 className="homepage-heading">Departments:</h2>
          <ul className="departments-list">
            {departments.map((dept, index) => (
              <li key={index}>{dept}</li>
            ))}
          </ul>
        </div>
      )}
      <h2 className="homepage-heading">Synchrony Interviews</h2>
      <footer className="footer">
        <div className="footer-content"></div>
        <div className="footer-bottom-text">
          &copy; 2023 Synchrony. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
