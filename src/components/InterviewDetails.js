import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './InterviewDetails.css'; // Ensure you have the CSS file in the right path

function InterviewDetails() {
  const { interviewID } = useParams();
  const [details, setDetails] = useState(null);

  useEffect(() => {
    // Here is your Lambda function URL
    const url = `https://rv0femjg65.execute-api.us-east-1.amazonaws.com/default/openInterview`;
    
    axios.get(url, {
      params: { InterviewID: interviewID }
    })
    .then(response => {
      console.log(response.data); // Log the response data to the console
      setDetails(response.data);
    })
    .catch(error => {
      console.error('Error fetching details:', error);
    });
  }, [interviewID]);

  if (!details) {
    return <div>Loading...</div>; // Show a loading message or a spinner
  }

  // Assuming that the data structure includes a 'message' key
  return (
    <div className="interview-details-container">
      <h1>Interview Details</h1>
      <p>{details.message}</p>
    </div>
  );
}

export default InterviewDetails;
