import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './JobInterviews.css';
import Loader from '../Loader';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';


function Interviews() {
  const [loading, setLoading] = useState(false);
  const [interviews, setInterviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredInterviews, setFilteredInterviews] = useState([]);
  const { jobId, jobPosition } = useParams();

  var image_1 = document.getElementById("login_img_1");
  image_1.style.display = 'none';

  const fetchInterviews = async () => {
    try {
      console.log('Fetching interviews for job ID:', jobId);
      console.log('Fetching interviews for job Position:', jobPosition);
      setLoading(true);
      const { data } = await axios.get(`https://rv0femjg65.execute-api.us-east-1.amazonaws.com/default/Interviews_Based_On_JobId?jobId=${jobId}`);
      const interviewsData = data.map(item => ({
        interviewID: item['Interview ID'],
        interviewer: item.Interviewer || 'N/A',
        interviewee: item.Name, // Assuming 'Name' is the interviewee's name
        jobPosition: jobPosition,
        jobID: item['Job ID'],
        interviewedOn: item['Interviewed On'],
        // Add other attributes you need
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
  }, [jobId, jobPosition]); 
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

  // handle delete [TODO API needed]
  const handleDelete = async (interviewID, event) => {
    event.preventDefault();
    event.stopPropagation();
    if (window.confirm('Are you sure you want to delete this interview?')) {

      console.log(interviewID);

      try {
        const response = await axios.post(`https://rv0femjg65.execute-api.us-east-1.amazonaws.com/default/Delete_interviews?interviewID=${interviewID}`);
        console.log(response.data);
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
          placeholder="Search by interviewer, applicant, or date"
          value={searchTerm}
          onChange={handleSearch}
          className="search-bar"
        />
      </div>
      {loading && <Loader />}
      <div className="interviews-list">
        {filteredInterviews.map((interview) => (
          // The entire interview item is now clickable
          <div key={interview.interviewID} className="interview-item" onClick={() => handleInterviewItemClick(interview.interviewID)}>

            <p>Interviewer: {interview.interviewer}</p>
            <p>Interviewee: {interview.interviewee}</p>
            <p>Interviewed On: {interview.interviewedOn}</p>
            <p>Job Position: {interview.jobPosition}</p>
            <button id="jobinterview-delete" onClick={(e) => {
              handleDelete(interview.interviewID, e);
            }}></button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Interviews;
