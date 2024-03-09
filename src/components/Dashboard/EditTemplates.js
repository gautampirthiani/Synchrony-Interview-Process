// EditTemplates.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logoImage from './synchrony-logo-1.png'; 
import './EditTemplates.css';
import Navbar from '../Navbar'; 
import { Link, useNavigate } from 'react-router-dom';

function EditTemplates() {
  const [positions, setPositions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ jobId: '', jobPosition: '' });

  const navigate = useNavigate();

  const fetchPositions = async () => {
    try {
      const { data } = await axios.get('https://rv0femjg65.execute-api.us-east-1.amazonaws.com/default/JobPosition_access');
      setPositions(data);
    } catch (error) {
      console.error('Error fetching positions:', error);
    }
  };
  
  useEffect(() => {
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
  const handlePositionClick = (JobID) => {
    // Navigate to new page using job ID
    navigate(`/dashboard/templates/${JobID}`);
  };

  // handles the submission of job position form data to a server.
  const handleSubmit = async (formData) => {
    // console.log('Submitting form data:', formData);
    try {
      setShowModal(false);
      setFormData({ jobId: '', jobPosition: '' });
      fetchPositions();
      const response = await axios.post('https://rv0femjg65.execute-api.us-east-1.amazonaws.com/default/jobPosition_create', formData);
      // console.log('Response from Lambda:', response.data); 
      alert('Job position created successfully!');
    } catch (error) {
      // console.error('Error creating job position:', error);
      alert('Failed to create job position.');
    }
  };
  

  // Modal component for creating a new job position with ID.
  function Modal({ isOpen, onClose, onSubmit }) {
    const [localFormData, setLocalFormData] = useState({ jobId: '', jobPosition: '' });

    if (!isOpen) return null;

    const handleChange = (e) => {
      const { name, value } = e.target;
      setLocalFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    };

    // Handles the submission of the modal's form
    const modal_handleSubmit = () => {
      const isConfirmed = window.confirm('Submit?');
      if (isConfirmed) {
        onSubmit(localFormData);
        setLocalFormData({ jobId: '', jobPosition: '' });
      } else {
        console.log('Submission cancelled.');
      }
    };

    // job id&position inputs and the submit button.
    return (
      <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={onClose}>&times;</span>
          <h1>New Job Position</h1>
          <h2>Enter Job Details</h2>
          <input
            type="text"
            placeholder="Job ID"
            name="jobId"
            value={localFormData.jobId}
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="Job Position"
            name="jobPosition"
            value={localFormData.jobPosition}
            onChange={handleChange}
          />
          <button id="modal_button" onClick={modal_handleSubmit}>Submit</button>
        </div>
      </div>
    );
  }
  // setting Modal open state to true.
  const handleOpenModal = () => {
    setShowModal(true);
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
      <button id="create-new-templates-btn" onClick={handleOpenModal}>Create New Job Position</button>
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
            <button id = "edittemplate_delete">Delete</button>
          </div>
        ))}
      </div>
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default EditTemplates;