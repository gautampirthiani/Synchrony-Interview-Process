// NewInterview.js

import React, { useState } from 'react';
import axios from 'axios';
import logoImage from './synchrony-logo-1.png'; // Make sure this is the correct path to your logo
import './NewInterview.css';
import Navbar from '../Navbar'; // Make sure this is the correct path to your Navbar component
import { Link } from 'react-router-dom';

function NewInterview() {
  const [positions, setPositions] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [template, setTemplate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handlePositionSearch = async (event) => {
    setSearchTerm(event.target.value);
    if (event.target.value) {
      try {
        const { data } = await axios.get(`/api/positions?search=${event.target.value}`);
        setPositions(data);
      } catch (error) {
        console.error('Error searching positions:', error);
      }
    } else {
      setPositions([]);
    }
  };

  const selectPosition = async (position) => {
    setSelectedPosition(position);
    try {
      const { data } = await axios.get(`/api/templates/${position.id}`);
      setTemplate(data);
    } catch (error) {
      console.error('Error fetching template:', error);
    }
  };

  return (
    <div className="new-interview-container">
      <div className="header">
        <Link to ="/">
        <img src={logoImage} alt="Synchrony Logo" className="logo" />
        </Link>
        <Navbar />
      </div>
      <div className="portal-header-container">
        <h1 className="recruiting-portal-header">New Interview</h1>
      </div>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by job position"
          value={searchTerm}
          onChange={handlePositionSearch}
          className="search-bar"
        />
        <div className="position-list">
          {positions.map((position) => (
            <div key={position.id} onClick={() => selectPosition(position)} className="position-item">
              {position.title}
            </div>
          ))}
        </div>
      </div>
      {selectedPosition && (
        <div className="template-container">
          {/* Render the template here */}
          <div>{template}</div>
        </div>
      )}
    </div>
  );
}

export default NewInterview;
