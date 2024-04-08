import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logoImage from './synchrony-logo-1.png';
import './Interviews.css';
import Navbar from '../Navbar';
import Loader from '../Loader';
import { Link, useNavigate } from 'react-router-dom';

function Interviews() {
  const [loading, setLoading] = useState(false);
  const [positions, setPositions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPositions, setFilteredPositions] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`https://rv0femjg65.execute-api.us-east-1.amazonaws.com/default/JobPosition_access`);
        setPositions(data);
        setFilteredPositions(data); // Initially show all positions
      } catch (error) {
        console.error('Error fetching positions:', error);
      }
      finally {
        setLoading(false);
      }
    };
    fetchPositions();
  }, []);

  useEffect(() => {
    const results = positions.filter(position => {
      const jobID = position['Job ID'].toString().toLowerCase(); // Convert Job ID to string and lowercase
      const jobPosition = position['Job Position'].toLowerCase();
      const searchTermLower = searchTerm.toLowerCase();

      return jobID.includes(searchTermLower) || jobPosition.includes(searchTermLower);
    });
    setFilteredPositions(results);
  }, [searchTerm, positions]); // Run the effect on searchTerm or positions change

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePositionClick = (jobId, jobPosition) => {
    navigate(`/interviews/job-interviews/${jobId}/${jobPosition}`);
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
        <h1 className="recruiting-portal-header">Interviews</h1>
      </div>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by job ID or position"
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
          </div>
        ))}
      </div>
    </div>
  );
}

export default Interviews;
