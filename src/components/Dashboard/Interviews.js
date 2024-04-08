
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getCurrentUser } from '@aws-amplify/auth';
import './Interviews.css';
import Loader from '../Loader';
import { Link, useNavigate } from 'react-router-dom';

function Interviews() {
  const [loading, setLoading] = useState(false);
  const [positions, setPositions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPositions, setFilteredPositions] = useState([]);
  const [userDepartments, setUserDepartments] = useState([]);
  const navigate = useNavigate();

  var image_1 = document.getElementById("login_img_1");
  image_1.style.display = 'none';

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('https://rv0femjg65.execute-api.us-east-1.amazonaws.com/default/JobPosition_access');
        setPositions(data);
        setFilteredPositions(data);
      } catch (error) {
        console.error('Error fetching positions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPositions();
  }, []);

  useEffect(() => {
    const fetchUserDepartments = async () => {
      try {
        const currentUser = await getCurrentUser();
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
        console.error('Error fetching department:', error);
      }
    };

    fetchUserDepartments();
  }, []);

  useEffect(() => {
    const results = positions.filter(position => {
      const jobID = position['Job ID'].toString().toLowerCase();
      const jobPosition = position['Job Position'].toLowerCase();
      const departmentLower = position['Departments']?.map(dept => dept.toLowerCase()) || [];
      const usernameLower = position['Username']?.toLowerCase() || '';
      const searchTermLower = searchTerm.toLowerCase();

      return jobID.includes(searchTermLower) ||
             jobPosition.includes(searchTermLower) ||
             departmentLower.some(dept => dept.includes(searchTermLower)) ||
             usernameLower.includes(searchTermLower);
    }).filter(position =>
      position['Departments']?.some(dept => userDepartments.includes(dept))
    );
    setFilteredPositions(results);
  }, [searchTerm, positions, userDepartments]); 

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePositionClick = (jobId, jobPosition) => {
    navigate(`/interviews/job-interviews/${jobId}/${jobPosition}`);
  };

  return (
    <div className="interviews-container">
      <div className="portal-header-container">
        <h1 className="recruiting-portal-header">Interviews</h1>
      </div>
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
      {!loading && !filteredPositions.length && <div className="no-positions">No positions found</div>}
      <div className="position-list">
        {filteredPositions.map((position) => (
          <div key={position['Job ID']} onClick={() => handlePositionClick(position['Job ID'], position['Job Position'])} className="position-item">
            <div className="position-detail">
              <strong>Job ID:</strong> {position['Job ID']}
            </div>
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

