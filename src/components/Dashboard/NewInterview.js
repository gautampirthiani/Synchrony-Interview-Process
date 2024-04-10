import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getCurrentUser } from '@aws-amplify/auth';
import './NewInterview.css';
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../Loader';

function NewInterview() {
  const [loading, setLoading] = useState(false);
  const [allPositions, setAllPositions] = useState([]);
  const [displayedPositions, setDisplayedPositions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [positionsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [username, setUsername] = useState('');
  const [userDepartments, setUserDepartments] = useState([]);
  const navigate = useNavigate();

  const fetchPositions = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('https://rv0femjg65.execute-api.us-east-1.amazonaws.com/default/JobPosition_access');
      setAllPositions(data);
      filterAndDisplayPositions(data);
    } catch (error) {
      console.error('Error fetching positions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPositions();
  }, [currentPage, positionsPerPage]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUsername(currentUser.username);
        if (currentUser.username !== 'admin') {
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
        }
      } catch (error) {
        console.error('Error fetching user information:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  const filterPositions = () => {
    const searchTermLower = searchTerm.toLowerCase();
    return allPositions.filter(position => {
      const jobPositionLower = position['Job Position'].toLowerCase();
      const jobIDString = position['Job ID'].toString();
      const departmentLower = Array.isArray(position['Departments']) ? 
        position['Departments'].map(dept => dept.toLowerCase()) : [];
      const usernameLower = position['Username']?.toLowerCase();

      return jobPositionLower.includes(searchTermLower) ||
        jobIDString.includes(searchTerm) ||
        (departmentLower && departmentLower.some(dept => dept.includes(searchTermLower))) ||
        (usernameLower && usernameLower.includes(searchTermLower));
    }).filter(position => 
      username === 'admin' || position['Departments']?.some(dept => userDepartments.includes(dept))
    );
  };

  const filterAndDisplayPositions = (data = allPositions) => {
    const filtered = filterPositions(data);
    const indexOfLastPosition = currentPage * positionsPerPage;
    const indexOfFirstPosition = indexOfLastPosition - positionsPerPage;
    setDisplayedPositions(filtered.slice(indexOfFirstPosition, indexOfLastPosition));
  };

  useEffect(() => {
    filterAndDisplayPositions();
  }, [searchTerm, allPositions, currentPage, userDepartments, username, positionsPerPage]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handlePositionClick = (JobID) => {
    navigate(`/dashboard/templates/${JobID}`);
  };

  const totalPages = Math.ceil(filterPositions().length / positionsPerPage);

  return (
    <div className="edit-templates-container">
      <div className="portal-header-container">
        <h1 className="recruiting-portal-header">New Interview</h1>
      </div>
      <div className="search-and-navigation-container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by job ID, position, department, or username"
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
          </div>
        ))}
      </div>
    </div>
  );
}

export default NewInterview;
