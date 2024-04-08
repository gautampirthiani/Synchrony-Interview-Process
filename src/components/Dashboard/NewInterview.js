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
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [positionsPerPage] = useState(10);
  const [username, setUsername] = useState('');
  const [addedBy, setAddedBy] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPositions = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get('https://rv0femjg65.execute-api.us-east-1.amazonaws.com/default/JobPosition_access');
        setAllPositions(data);
        setDisplayedPositions(data.slice(0, positionsPerPage));
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
        setAddedBy(currentUser.username); // Set the addedBy state here
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    const searchTermLower = searchTerm.toLowerCase();
    const filteredPositions = allPositions.filter(position => {
      const jobID = position['Job ID'].toString().toLowerCase();
      const jobPosition = position['Job Position'].toLowerCase();
      const department = position['Departments'] ? position['Departments'].join(',').toLowerCase() : '';

      return jobID.includes(searchTermLower) ||
             jobPosition.includes(searchTermLower) ||
             department.includes(searchTermLower);
    }).filter(position => 
      username === 'admin' || position['Departments']?.some(dept => dept.includes(searchTermLower))
    );

    const indexOfLastPosition = currentPage * positionsPerPage;
    const indexOfFirstPosition = indexOfLastPosition - positionsPerPage;
    setDisplayedPositions(filteredPositions.slice(indexOfFirstPosition, indexOfLastPosition));
  }, [searchTerm, allPositions, currentPage, username, positionsPerPage]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handlePositionClick = (jobId) => {
    navigate(`/new-interview/conduct-interview/${jobId}`);
  };

  const totalPages = Math.ceil(displayedPositions.length / positionsPerPage);

  return (
    <div className="new-interview-container">
      <div className="portal-header-container">
        <h1 className="recruiting-portal-header">New Interview</h1>
      </div>
      <div className="search-navigation-container">
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
          <div key={position['Job ID']} onClick={() => handlePositionClick(position['Job ID'])} className="position-item">
            <div className="position-detail">
              <strong>Job ID:</strong> {position['Job ID']}
            </div>
            <div className="position-detail">
              <strong>Job Position:</strong> {position['Job Position']}
            </div>
            <div className="position-detail">
              <strong>Department:</strong> {position['Departments'] && position['Departments'].length > 0 ? position['Departments'].join(', ') : 'N/A'}
            </div>
            <div className="position-detail">
              <strong>Added by:</strong> {addedBy || 'N/A'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NewInterview;
