import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getCurrentUser } from '@aws-amplify/auth';
import '../Styles/EditTemplates.css';
import Loader from '../Loader';
import { Link, useNavigate } from 'react-router-dom';

function EditTemplates() {
  const [loading, setLoading] = useState(false);
  const [positions, setPositions] = useState([]);
  const [displayedPositions, setDisplayedPositions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [positionsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ jobPosition: '', departments: [] });
  const [username, setUsername] = useState('');
  const [userDepartments, setUserDepartments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUsername(currentUser.username);
        if (currentUser.username === 'admin') {
          fetchAllDepartments();
        } else {
          fetchUserDepartments(currentUser.username);
        }
      } catch (error) {
        console.error('Error fetching user information:', error);
      }
    };

    fetchPositions();
    fetchCurrentUser();
  }, [currentPage, positionsPerPage]);

  const fetchPositions = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('https://rv0femjg65.execute-api.us-east-1.amazonaws.com/default/JobPosition_access');
      setPositions(data);
      filterAndDisplayPositions(data);
    } catch (error) {
      console.error('Error fetching positions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllDepartments = async () => {
    const response = await fetch('https://h60ydhn92g.execute-api.us-east-1.amazonaws.com/dev/GetDepartmantList', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });
    const data = await response.json();
    setUserDepartments(data);
  };

  const fetchUserDepartments = async (username) => {
    const response = await fetch('https://h60ydhn92g.execute-api.us-east-1.amazonaws.com/dev/GetDepartment', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: username }),
    });
    const data = await response.json();
    if (data && data.departments) {
      setUserDepartments(data.departments);
    }
  };

  const filterPositions = () => {
    const searchTermLower = searchTerm.toLowerCase();
    return positions.filter(position => {
      const jobPositionLower = position['Job Position'].toLowerCase();
      const departmentLower = Array.isArray(position['Departments']) ? 
        position['Departments'].map(dept => dept.toLowerCase()) : [];
      const usernameLower = position['Username']?.toLowerCase();

      return jobPositionLower.includes(searchTermLower) ||
        (departmentLower && departmentLower.some(dept => dept.includes(searchTermLower))) ||
        (usernameLower && usernameLower.includes(searchTermLower));
    }).filter(position => username === 'admin' || userDepartments.some(dept => position['Departments']?.includes(dept)));
  };

  const filterAndDisplayPositions = (data = positions) => {
    const filtered = filterPositions(data);
    const indexOfLastPosition = currentPage * positionsPerPage;
    const indexOfFirstPosition = indexOfLastPosition - positionsPerPage;
    setDisplayedPositions(filtered.slice(indexOfFirstPosition, indexOfLastPosition));
  };

  useEffect(() => {
    filterAndDisplayPositions();
  }, [searchTerm, positions, currentPage, userDepartments, username, positionsPerPage]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
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
      setFormData({ jobPosition: '', departments: [] });
      alert('Job position created successfully!');
      fetchPositions();
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
        fetchPositions();
      } catch (error) {
        console.error(error);
        alert('Failed to delete the job position.');
      }
    }
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const totalPages = Math.ceil(filterPositions().length / positionsPerPage);

  function Modal({ isOpen, onClose, onSubmit }) {
    const [localFormData, setLocalFormData] = useState({jobPosition: '', departments: [] });

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

    return (
      <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={onClose}>&times;</span>
          <h1>New Job Position</h1>
          <input type="text" placeholder="Job Position" name="jobPosition" value={localFormData.jobPosition} onChange={handleChange} />
          <h2>Select Department(s) for The Job Position</h2>
          {userDepartments.map((dept, index) => (
            <div key={index}>
              <input type="checkbox" id={dept} name={dept} checked={localFormData.departments.includes(dept)} onChange={() => handleCheckboxChange(dept)} />
              <label htmlFor={dept}>{dept}</label>
            </div>
          ))}
          <button id="modal_button" onClick={() => onSubmit(localFormData)}>Submit</button>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-templates-container">
      <div className="portal-header-container">
        <h1 className="recruiting-portal-header">Edit Templates</h1>
      </div>
      <button id="create-new-templates-btn" onClick={handleOpenModal}>Create New Job Position</button>
      <div className="search-and-navigation-container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by job position, department, or added by"
            value={searchTerm}
            onChange={handleSearch}
            className="search-bar"
          />
        </div>
        <div className="page-navigation">
          <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
            &lt;
          </button>
          Page {currentPage} of {totalPages}
          <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage >= totalPages}>
            &gt;
          </button>
        </div>
      </div>
      {loading && <Loader />}
      <div className="position-list">
        {displayedPositions.map((position) => (
          <div key={position['Job ID']} className="position-item" onClick={() => handlePositionClick(position['Job ID'])}>
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
