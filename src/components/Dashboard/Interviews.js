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
        setInterviews(data);
      } catch (error) {
        console.error('Error fetching interviews:', error);
      }
    };

    fetchInterviews();
  }, []);

  useEffect(() => {
    const results = interviews.filter(interview => {
      const interviewer = interview.Interviewer ? interview.Interviewer.toLowerCase() : '';
      const name = interview.Name ? interview.Name.toLowerCase() : '';
      // Assuming you have a Date property in your interview objects.
      const date = interview.Date ? interview.Date.toLowerCase() : '';
  
      return interviewer.includes(searchTerm.toLowerCase()) ||
             name.includes(searchTerm.toLowerCase()) ||
             date.includes(searchTerm.toLowerCase());
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
          <div key={interview.InterviewID} className="interview-item" onClick={() => handleInterviewItemClick(interview.InterviewID)}>
            <p>Interview ID: {interview.InterviewID}</p>
            <p>Interviewer: {interview.Interviewer || 'N/A'}</p>
            <p>Name: {interview.Name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Interviews;
