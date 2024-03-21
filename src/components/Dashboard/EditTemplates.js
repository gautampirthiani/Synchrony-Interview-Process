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
  const [formData, setFormData] = useState({ jobId: '', jobPosition: '', department: '' });
  const [username, setUsername] = useState('');
  const [userDepartment, setUserDepartment] = useState('');

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

      try {
        const response = await fetch('https://h60ydhn92g.execute-api.us-east-1.amazonaws.com/dev/GetDepartment', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: currentUser.username }),
        });
        const data = await response.json();
        if (data && data.department) {
          setUserDepartment(data.department);
        }
      } catch (error) {
        console.error('Error fetching department:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredPositions = positions.filter(position =>
    position['Job Position'].toLowerCase().includes(searchTerm.toLowerCase()) ||
    position['Job ID'].toString().includes(searchTerm) ||
    (position['Department'] && position['Department'].toLowerCase().includes(searchTerm.toLowerCase())) ||
    (position['Username'] && position['Username'].toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handlePositionClick = (JobID) => {
    navigate(`/dashboard/templates/${JobID}`);
  };

  const handleSubmit = async (formData) => {
    const extendedFormData = {
      ...formData,
      username,
      department: userDepartment
    };

    setShowModal(false);
    setFormData({ jobId: '', jobPosition: '', department: '' });
    fetchPositions();
    await axios.post('https://rv0femjg65.execute-api.us-east-1.amazonaws.com/default/jobPosition_create', extendedFormData);
    alert('Job position created successfully!');
  };

  function Modal({ isOpen, onClose, onSubmit, department }) {
    const [localFormData, setLocalFormData] = useState({ jobId: '', jobPosition: '', department: department || '' });

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
        setLocalFormData({ jobId: '', jobPosition: '', department: '' });
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
          <select
            name="department"
            value={localFormData.department}
            onChange={handleChange}
            className="modal-department-dropdown"
          >
            <option value="">Select Department</option>
            <option value={department}>{department}</option>
          </select>
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
      <button id="create-new-templates-btn" onClick={handleOpenModal}>
        Create New Job Position
      </button>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by job ID, position, department, or username"
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
              <strong>Department:</strong> {position['Department']}
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
        department={userDepartment}
      />
    </div>
  );
}

export default EditTemplates;
