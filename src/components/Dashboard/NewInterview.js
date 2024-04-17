import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getCurrentUser } from '@aws-amplify/auth';
import '../Styles/NewInterview.css';
import Loader from '../Loader';
import { useNavigate } from 'react-router-dom';

function NewInterview() {
  const [loading, setLoading] = useState(false);
  const [allPositions, setAllPositions] = useState([]);
  const [displayedPositions, setDisplayedPositions] = useState([]);
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
        setAllPositions(data);
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

  useEffect(() => {
    const filterAndDisplayPositions = () => {
      const searchTermLower = searchTerm.toLowerCase();
      const filteredPositions = allPositions.filter(position => {
        const jobPosition = position['Job Position'].toLowerCase();
        const department = position['Departments'] ? position['Departments'].join(',').toLowerCase() : '';
        const addedBy = position['Username'] ? position['Username'].toLowerCase() : ''; // Adjusted to use Username

        return jobPosition.includes(searchTermLower) ||
              department.includes(searchTermLower) ||
              addedBy.includes(searchTermLower);
      }).filter(position => 
        username === 'admin' || position['Departments']?.some(dept => userDepartments.includes(dept))
      );

      const indexOfLastPosition = currentPage * positionsPerPage;
      const indexOfFirstPosition = indexOfLastPosition - positionsPerPage;
      setDisplayedPositions(filteredPositions.slice(indexOfFirstPosition, indexOfLastPosition));
    };

    filterAndDisplayPositions();
  }, [searchTerm, allPositions, currentPage, positionsPerPage, username, userDepartments]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handlePositionClick = (jobId) => {
    navigate(`/new-interview/conduct-interview/${jobId}`);
  };

  const totalPages = Math.ceil(allPositions.filter(position => {
    const searchTermLower = searchTerm.toLowerCase();
    return position['Job Position'].toLowerCase().includes(searchTermLower) ||
           (position['Departments'] ? position['Departments'].join(',').toLowerCase() : '').includes(searchTermLower) ||
           (position['Username'] ? position['Username'].toLowerCase().includes(searchTermLower) : false);  // Added Username in totalPages calculation
  }).filter(position => 
    username === 'admin' || position['Departments']?.some(dept => userDepartments.includes(dept))
  ).length / positionsPerPage);

  return (
    <div className="new-interview-container">
      <div className="portal-header-container">
        <h1 className="recruiting-portal-header">New Interview</h1>
      </div>
      <div className="search-navigation-container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by Job Position, Department, or Added By"
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
          <div key={position['Job ID']} onClick={() => handlePositionClick(position['Job ID'])} className="position-item">
            <div className="position-detail">
              <strong>Job Position:</strong> {position['Job Position']}
            </div>
            <div className="position-detail">
              <strong>Department:</strong> {position['Departments'] && position['Departments'].length > 0 ? position['Departments'].join(', ') : 'N/A'}
            </div>
            <div className="position-detail">
              <strong>Added by:</strong> {position['Username'] || 'N/A'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NewInterview;
