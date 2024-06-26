import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Loader from '../Loader';
import '../Styles/JobInterviews.css';

function Interviews() {
  const [loading, setLoading] = useState(false);
  const [interviews, setInterviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredInterviews, setFilteredInterviews] = useState([]);
  const { jobId, jobPosition } = useParams(); // Assuming jobPosition is still passed via URL and used for the header
  const navigate = useNavigate();

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`https://rv0femjg65.execute-api.us-east-1.amazonaws.com/default/Interviews_Based_On_JobId?jobId=${jobId}`);
      const interviewsData = data.map(item => ({
        interviewID: item['Interview ID'],
        interviewer: item.Interviewer || 'N/A',
        interviewee: item.Name,
        interviewedOn: item['Interviewed On'],
      }));
      setInterviews(interviewsData);
    } catch (error) {
      console.error('Error fetching interviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, [jobId]); 

  useEffect(() => {
    const results = interviews.filter(interview => {
      const interviewer = interview.interviewer ? interview.interviewer.toLowerCase() : '';
      const interviewee = interview.interviewee ? interview.interviewee.toLowerCase() : '';
      const interviewedOn = interview.interviewedOn ? interview.interviewedOn.toLowerCase() : '';

      return interviewer.includes(searchTerm.toLowerCase()) ||
        interviewee.includes(searchTerm.toLowerCase()) ||
        interviewedOn.includes(searchTerm.toLowerCase());
    });
    setFilteredInterviews(results);
  }, [searchTerm, interviews]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleInterviewItemClick = (interviewID) => {
    navigate(`/interview-details/${interviewID}`);
  };

  const handleDelete = async (interviewID, event) => {
    event.preventDefault();
    event.stopPropagation();
    if (window.confirm('Are you sure you want to delete this interview?')) {
      try {
        await axios.post(`https://rv0femjg65.execute-api.us-east-1.amazonaws.com/default/Delete_interviews?interviewID=${interviewID}`);
        alert('Interview deleted successfully');
        fetchInterviews();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="interviews-container">
      <div className="portal-header-container">
        <h1 className="recruiting-portal-header">Interviews for Job: {jobPosition}</h1>
      </div>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by interviewer, interviewee, or interviewed on"
          value={searchTerm}
          onChange={handleSearch}
          className="search-bar"
        />
      </div>
      {loading && <Loader />}
      <div className="interviews-list">
        {filteredInterviews.map((interview) => (
          <div key={interview.interviewID} className="interview-item" onClick={() => handleInterviewItemClick(interview.interviewID)}>
            <p><strong>Interviewer:</strong> {interview.interviewer}</p>
            <p><strong>Interviewee:</strong> {interview.interviewee}</p>
            <p><strong>Interviewed On:</strong> {interview.interviewedOn}</p>
            <div className="button-container">
              <button className="jobinterview-delete" onClick={(e) => { handleDelete(interview.interviewID, e); }}></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Interviews;
