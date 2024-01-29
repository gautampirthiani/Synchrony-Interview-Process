import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './PositionTemplate.css'; // Make sure the CSS file is located correctly in your project

function PositionTemplate() {
  const { positionId } = useParams(); // This should match the route parameter
  const [positionDetails, setPositionDetails] = useState(null);

  useEffect(() => {
    const url = `https://rv0femjg65.execute-api.us-east-1.amazonaws.com/default/openInterview`;

    axios.get(url, {
      params: { PositionID: positionId }
    })
    .then(response => {
      console.log(response.data); // Logging the response data to the console
      setPositionDetails(response.data);
    })
    .catch(error => {
      console.error('Error fetching position details:', error);
    });
  }, [positionId]); // Dependency array ensures the effect runs when positionId changes

  if (!positionDetails) {
    return <div>Loading...</div>; // Display a loading message or a spinner
  }

  // Assuming that the position details data includes keys like 'jobId', 'jobTitle', etc.
  return (
    <div className="interview-details-container">
      <h1>Interview Details</h1>
      <p>{}</p>
    </div>
  );
}

export default PositionTemplate;
