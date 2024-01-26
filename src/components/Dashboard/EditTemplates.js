// EditTemplates.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logoImage from './synchrony-logo-1.png'; // Correct path to your logo
import './EditTemplates.css';
import Navbar from '../Navbar'; // Correct path to your Navbar component
import { Link } from 'react-router-dom';


function EditTemplates() {
  const [positions, setPositions] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const { data } = await axios.get('/api/positions');
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

  const handleSelectPosition = async (positionId) => {
    setSelectedPosition(positionId);
    try {
      const { data } = await axios.get(`/api/templates?positionId=${positionId}`);
      setTemplates(data);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  // Function to clone a template
  const handleCloneTemplate = async (templateId) => {
    // Clone template logic
  };

  // Function to create a new template
  const handleCreateTemplate = async (positionId) => {
    // Create new template logic
  };

  return (
    <div className="edit-templates-container">
      <div className="header">
        <Link to ="/">
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
          placeholder="Search by job position"
          value={searchTerm}
          onChange={handleSearch}
          className="search-bar"
        />
      </div>
      <div className="positions-container">
        {positions
          .filter((position) =>
            position.title.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((position) => (
            <div
              key={position.id}
              className="position-item"
              onClick={() => handleSelectPosition(position.id)}
            >
              {position.title}
            </div>
          ))}
      </div>
      {selectedPosition && (
        <div className="templates-container">
          {templates.map((template) => (
            <div key={template.id} className="template-item">
              <div className="template-title">{template.title}</div>
              <div className="template-actions">
                <button onClick={() => handleCloneTemplate(template.id)}>Clone</button>
                <button onClick={() => handleCreateTemplate(selectedPosition)}>Create New</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EditTemplates;
