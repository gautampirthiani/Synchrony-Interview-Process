// EditTemplates.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logoImage from './synchrony-logo-1.png'; // Ensure this is the correct path to your logo
import './EditTemplates.css';
import Navbar from '../Navbar'; // Ensure this is the correct path to your Navbar component
import { Link, useNavigate } from 'react-router-dom';

function EditTemplates() {
  const [positions, setPositions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const { data } = await axios.get('https://rv0femjg65.execute-api.us-east-1.amazonaws.com/default/JobPosition_access');
        setPositions(data);
      } catch (error) {
        console.error('Error fetching positions:', error);
      }
    };

    fetchPositions();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filter positions based on search term
  const filteredPositions = positions.filter(position =>
    position['Job Position'].toLowerCase().includes(searchTerm.toLowerCase()) ||
    position['Job ID'].toString().includes(searchTerm)
  );

  // Handle clicking on a position item
  const handlePositionClick = (jobId) => {
    // Navigate to new page using job ID
    navigate(`/dashboard/templates/${jobId}`);
  };

  return (
    <div className="new-interview-container">
      <div className="header">
        <Link to="/">
          <img src={logoImage} alt="Synchrony Logo" className="logo" />
        </Link>
        <Navbar />
      </div>
      <div className="portal-header-container">
        <h1 className="recruiting-portal-header">Edit Templates</h1>
      </div>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by job ID or position"
          value={searchTerm}
          onChange={handleSearch}
          className="search-bar"
        />
      </div>
      <div className="position-list">
        {filteredPositions.map((position) => (
          <div key={position['Job ID']} onClick={() => handlePositionClick(position['Job ID'])} className="position-item">
            <div className="position-detail">
              <strong>Job ID:</strong> {position['Job ID']}
            </div>
            <div className="position-detail">
              <strong>Job Position:</strong> {position['Job Position']}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EditTemplates;
