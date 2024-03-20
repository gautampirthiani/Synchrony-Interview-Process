import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getCurrentUser } from '@aws-amplify/auth';
import logoImage from './synchrony-logo-1.png'; 
import './EditTemplates.css';
import Navbar from '../Navbar'; 
import { Link, useNavigate } from 'react-router-dom';

function EditTemplates() {
  const [positions, setPositions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ jobId: '', jobPosition: '' });
  const [username, setUsername] = useState('');

  const navigate = useNavigate();

  const fetchPositions = async () => {
    const { data } = await axios.get('https://rv0femjg65.execute-api.us-east-1.amazonaws.com/default/JobPosition_access');
    setPositions(data);
  };

  useEffect(() => {
    fetchPositions();
    const fetchCurrentUser = async () => {
      const currentUser = await getCurrentUser();
      setUsername(currentUser.username);
    };

    fetchCurrentUser();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredPositions = positions.filter(position =>
    position['Job Position'].toLowerCase().includes(searchTerm.toLowerCase()) ||
    position['Job ID'].toString().includes(searchTerm)
  );

  const handlePositionClick = (JobID) => {
    navigate(`/dashboard/templates/${JobID}`);
  };

  const handleSubmit = async (formData) => {
    const extendedFormData = {
      ...formData,
      username,
    };

    setShowModal(false);
    setFormData({ jobId: '', jobPosition: '' });
    fetchPositions();
    const response = await axios.post('https://rv0femjg65.execute-api.us-east-1.amazonaws.com/default/jobPosition_create', extendedFormData);
    alert('Job position created successfully!');
  };

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

    const modal_handleSubmit = () => {
      const isConfirmed = window.confirm('Submit?');
      if (isConfirmed) {
        onSubmit(localFormData);
        setLocalFormData({ jobId: '', jobPosition: '' });
      }
    };

    return (
      <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={onClose}>&times;</span>
          <h1>New Job Position</h1>
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
        <div className="position-detail">
          <strong>Added by:</strong> {position['Username']}
        </div>
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
