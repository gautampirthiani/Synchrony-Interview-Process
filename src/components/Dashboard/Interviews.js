import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logoImage from './synchrony-logo-1.png'; // Make sure this is the correct path to your logo
import './Interviews.css';
import Navbar from '../Navbar'; // Make sure this is the correct path to your Navbar component

function Interviews() {
  const [interviews, setInterviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const { data } = await axios.get('/api/interviews'); // Using axios for API call
        setInterviews(data);
      } catch (error) {
        console.error('Error fetching interviews:', error);
      }
    };

    fetchInterviews();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="interviews-container">
      <div className="header">
        <img src={logoImage} alt="Synchrony Logo" className="logo" />
        <Navbar />
      </div>
      <div className="portal-header-container">
        <h1 className="recruiting-portal-header">Recruiting Portal</h1>
      </div>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by interviewer, applicant, or date"
          value={searchTerm}
          onChange={handleSearch}
          className="search-bar"
        />
      </div>
      {/* Render interviews here */}
    </div>
  );
}

export default Interviews;
