import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getCurrentUser } from '@aws-amplify/auth';
import logoImage from './synchrony-logo-1.png';
import './EditTemplates.css';
import Navbar from '../Navbar';
import Loader from '../Loader';
import { Link, useNavigate } from 'react-router-dom';

function EditTemplates() {
  const [loading, setLoading] = useState(false);
  const [positions, setPositions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ jobId: '', jobPosition: '', departments: [] });
  const [username, setUsername] = useState('');
  const [userDepartments, setUserDepartments] = useState([]);
  const navigate = useNavigate();

  const fetchPositions = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('https://rv0femjg65.execute-api.us-east-1.amazonaws.com/default/JobPosition_access');
      setPositions(data);
    } catch (error) {
      console.error('Error fetching positions:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPositions();
    const fetchCurrentUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUsername(currentUser.username);
        const response = await fetch('https://h60ydhn92g.execute-api.us-east-1.amazonaws.com/dev/GetDepartment', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: currentUser.username }),
        });
        const data = await response.json();
        if (data && data.departments) {
          setUserDepartments(data.departments);
        }
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePositionClick = (JobID) => {
    navigate(`/dashboard/templates/${JobID}`);
  };

  const handleSubmit = async (formData) => {
    const extendedFormData = {
      ...formData,
      username,
      departments: formData.departments
    };

    setShowModal(false);
    try {
      await axios.post('https://rv0femjg65.execute-api.us-east-1.amazonaws.com/default/jobPosition_create', extendedFormData);
      setFormData({ jobId: '', jobPosition: '', departments: [] });
      await fetchPositions();
      alert('Job position created successfully!');
    } catch (error) {
      console.error('Error creating job position:', error);
      alert('Failed to create job position.');
    }
  };

  const handleDelete = async (JobID, event) => {
    event.stopPropagation();
    if (window.confirm('Are you sure you want to delete this job position?')) {
      try {
        await axios.post(`https://rv0femjg65.execute-api.us-east-1.amazonaws.com/default/delete_job_position?jobId=${JobID}`);
        alert('Job position deleted successfully!');
        await fetchPositions();
      } catch (error) {
        console.error(error);
        alert('Failed to delete the job position.');
      }
    }
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const filteredPositions = positions.filter(position => {
    const jobPositionLower = position['Job Position'].toLowerCase();
    const jobIDString = position['Job ID'].toString();
    const departmentLower = Array.isArray(position['Departments']) ? 
      position['Departments'].map(dept => dept.toLowerCase()) : [];
    const usernameLower = position['Username']?.toLowerCase();

    return jobPositionLower.includes(searchTerm.toLowerCase()) ||
      jobIDString.includes(searchTerm) ||
      (departmentLower && departmentLower.some(dept => dept.includes(searchTerm.toLowerCase()))) ||
      (usernameLower && usernameLower.includes(searchTerm.toLowerCase()));
  }).filter(position =>
    userDepartments.some(dept => position['Departments']?.includes(dept))
  );

  function Modal({ isOpen, onClose, onSubmit }) {
    const [localFormData, setLocalFormData] = useState({ jobId: '', jobPosition: '', departments: [] });

    if (!isOpen) return null;

    const handleChange = (e) => {
      const { name, value } = e.target;
      setLocalFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    };

    const handleCheckboxChange = (department) => {
      setLocalFormData(prevState => {
        const { departments } = prevState;
        if (departments.includes(department)) {
          return { ...prevState, departments: departments.filter(dep => dep !== department) };
        } else {
          return { ...prevState, departments: [...departments, department] };
        }
      });
    };

    const modal_handleSubmit = () => {
      const isConfirmed = window.confirm('Are you sure you want to submit this job position?');
      if (isConfirmed) {
        onSubmit(localFormData);
        setLocalFormData({ jobId: '', jobPosition: '', departments: [] });
      }
    };

    return (
      <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={onClose}>&times;</span>
          <h1>New Job Position</h1>
          <input type="text" placeholder="Job ID" name="jobId" value={localFormData.jobId} onChange={handleChange} />
          <input type="text" placeholder="Job Position" name="jobPosition" value={localFormData.jobPosition} onChange={handleChange} />
          {userDepartments.map((dept, index) => (
            <div key={index}>
              <input type="checkbox" id={dept} name={dept} checked={localFormData.departments.includes(dept)} onChange={() => handleCheckboxChange(dept)} />
              <label htmlFor={dept}>{dept}</label>
            </div>
          ))}
          <button id="modal_button" onClick={modal_handleSubmit}>Submit</button>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-templates-container">
      <div className="header">
        <Link to="/"><img src={logoImage} alt="Synchrony Logo" className="logo" /></Link>
        <Navbar />
      </div>
      <div className="portal-header-container">
        <h1 className="recruiting-portal-header">Edit Templates</h1>
      </div>
      <button id="create-new-templates-btn" onClick={handleOpenModal}>Create New Job Position</button>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by job ID, position, department, or username"
          value={searchTerm}
          onChange={handleSearch}
          className="search-bar"
        />
      </div>
      {loading && <Loader />}
      <div className="position-list">
        {filteredPositions.map((position) => (
          <div key={position['Job ID']} className="position-item" onClick={() => handlePositionClick(position['Job ID'])}>
            <div className="position-detail"><strong>Job ID:</strong> {position['Job ID']}</div>
            <div className="position-detail"><strong>Job Position:</strong> {position['Job Position']}</div>
            <div className="position-detail">
              <strong>Department:</strong> 
              {Array.isArray(position['Departments']) ? position['Departments'].join(', ') : 'No Department'}
            </div>
            <div className="position-detail"><strong>Added by:</strong> {position['Username']}</div>
            <button id="edittemplate_delete" onClick={(e) => handleDelete(position['Job ID'], e)}>Delete</button>
          </div>
        ))}
      </div>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} onSubmit={handleSubmit} />
    </div>
  );
}

export default EditTemplates;
