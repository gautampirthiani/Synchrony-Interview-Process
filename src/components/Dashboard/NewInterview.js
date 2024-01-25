// src/components/Dashboard/NewInterview.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logoimage from './synchrony-logo-1.png'; // Update the path accordingly
import './Interviews.css';

const NewInterview = () => {
  const [jobPositions, setJobPositions] = useState([]);
  const [selectedJobPosition, setSelectedJobPosition] = useState(null);

  useEffect(() => {
    // Fetch job positions from the backend
    axios.get('https://your-backend-endpoint/job-positions')
      .then((response) => {
        setJobPositions(response.data);
      })
      .catch((error) => {
        console.error('Error fetching job positions:', error);
      });
  }, []);

  const handleJobPositionClick = (jobPosition) => {
    setSelectedJobPosition(jobPosition);
    // Additional logic for fetching and handling templates for the selected job position
  };

  return (
    <div className="homepage-container">
      <div className="logo-container">
        <img src={logoimage} alt="Company Logo" className="logo-image" />
      </div>

      <div className="homepage-content">
        <h1>New Interview</h1>

        {/* Display job positions */}
        <div className="job-positions">
          <h3>Select a Job Position:</h3>
          <ul>
            {jobPositions.map((jobPosition) => (
              <li key={jobPosition.id} onClick={() => handleJobPositionClick(jobPosition)}>
                {jobPosition.title}
              </li>
            ))}
          </ul>
        </div>

        {/* Display selected job position details */}
        {selectedJobPosition && (
          <div className="selected-job-position">
            <h3>Selected Job Position: {selectedJobPosition.title}</h3>
            {/* Additional components for interacting with templates and collecting interviewee answers */}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewInterview;
