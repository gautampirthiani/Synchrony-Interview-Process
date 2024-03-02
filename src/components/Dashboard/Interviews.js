import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import logoImage from './synchrony-logo-1.png';
import './Interviews.css';
import Navbar from '../Navbar';
import HomePage from '../HomePage';
import { useHistory } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import InterviewDetails from '../InterviewDetails';

function Interviews() {
  const [interviews, setInterviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredInterviews, setFilteredInterviews] = useState([]);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const { data } = await axios.get('https://rv0femjg65.execute-api.us-east-1.amazonaws.com/default/InterviewsAccess');
        const interviewsData = data.map(item => ({
          interviewID: item['Interview ID'],
          interviewer: item.Interviewer || 'N/A',
          interviewee: item.Name, // Assuming 'Name' is the interviewee's name
          jobID: item['Job ID'],
          interviewedOn: item['Interviewed On'],
          // Add other attributes you need
        }));
        setInterviews(interviewsData);
      } catch (error) {
        console.error('Error fetching interviews:', error);
      }
    };
  
    fetchInterviews();
  }, []);

  useEffect(() => {
    const results = interviews.filter(interview => {
      const interviewer = interview.interviewer ? interview.interviewer.toLowerCase() : '';
      const interviewee = interview.interviewee ? interview.interviewee.toLowerCase() : '';
      const jobID = interview.jobID ? interview.jobID.toLowerCase() : '';
      // Format 'Interviewed On' for easier searching, assuming it is a string.
      const interviewedOn = interview.interviewedOn ? interview.interviewedOn.toLowerCase() : '';
  
      return interviewer.includes(searchTerm.toLowerCase()) ||
             interviewee.includes(searchTerm.toLowerCase()) ||
             jobID.includes(searchTerm.toLowerCase()) ||
             interviewedOn.includes(searchTerm.toLowerCase());
    });
    setFilteredInterviews(results);
  }, [searchTerm, interviews]);
  

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const navigate = useNavigate();
  // This function will be called when the user clicks on an interview item
  const handleInterviewItemClick = (interviewID) => {
    navigate(`/interview-details/${interviewID}`);
  };

  return (
    <div className="interviews-container">
      <div className="header">
        <Link to="/">
          <img src={logoImage} alt="Synchrony Logo" className="logo" />
        </Link>
        <Navbar />
      </div>
      <div className="portal-header-container">
        <h1 className="recruiting-portal-header">Recruiting Portal</h1>
      </div>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by interviewer, applicant, or date"
          value={searchTerm}
          onChange={handleSearch}
          className="search-bar"
        />
      </div>
      <div className="interviews-list">
        {filteredInterviews.map((interview) => (
          // The entire interview item is now clickable
          <div key={interview.interviewID} className="interview-item" onClick={() => handleInterviewItemClick(interview.interviewID)}>
      
      <p>Interviewer: {interview.interviewer}</p>
      <p>Interviewee: {interview.interviewee}</p>
      <p>Job ID: {interview.jobID}</p>
      <p>Interviewed On: {interview.interviewedOn}</p>
    </div>
        ))}
      </div>
    </div>
  );
}

export default Interviews;
