import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getCurrentUser } from '@aws-amplify/auth';
import '../Styles/Interviews.css';
import Loader from '../Loader';
import { useNavigate } from 'react-router-dom';

function Interviews() {
  const [loading, setLoading] = useState(false);
  const [positions, setPositions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [positionsPerPage] = useState(10);
  const [username, setUsername] = useState('');
  const [userDepartments, setUserDepartments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPositions = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get('https://rv0femjg65.execute-api.us-east-1.amazonaws.com/default/JobPosition_access');
        setPositions(data);
      } catch (error) {
        console.error('Error fetching positions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPositions();
  }, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
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
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, []);

  const filterPositions = () => {
    const filteredPositions = positions.filter(position => {
      const jobID = position['Job ID'].toString().toLowerCase();
      const jobPosition = position['Job Position'].toLowerCase();
      const departmentLower = position['Departments']?.map(dept => dept.toLowerCase()) || [];
      return jobID.includes(searchTerm) ||
             jobPosition.includes(searchTerm) ||
             departmentLower.some(dept => dept.includes(searchTerm));
    }).filter(position => 
      username === 'admin' || position['Departments']?.some(dept => userDepartments.includes(dept))
    );
    return filteredPositions;
  };

  const currentPositions = filterPositions().slice((currentPage - 1) * positionsPerPage, currentPage * positionsPerPage);
  const totalPages = Math.ceil(filterPositions().length / positionsPerPage);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  const handleSearch = event => {
    setSearchTerm(event.target.value.toLowerCase());
    setCurrentPage(1);
  };

  const handlePositionClick = (jobId, jobPosition) => {
    navigate(`/interviews/job-interviews/${jobId}/${jobPosition}`);
  };

  return (
    <div className="interviews-container">
      <div className="portal-header-container">
        <h1 className="recruiting-portal-header">Interviews</h1>
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
          <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
            &gt;
          </button>
        </div>
      </div>
      {loading && <Loader />}
      <div className="position-list">
        {currentPositions.map((position) => (
          <div key={position['Job ID']} onClick={() => handlePositionClick(position['Job ID'], position['Job Position'])} className="position-item">
            <div className="position-detail">
              <strong>Job Position:</strong> {position['Job Position']}
            </div>
            <div className="position-detail">
              <strong>Added by:</strong> {position['Username'] || 'N/A'}
            </div>
            <div className="position-detail">
              <strong>Departments:</strong> {position['Departments'] ? position['Departments'].join(', ') : 'N/A'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Interviews;
