import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import logoImage from '../synchrony-logo-1.png';
import './InterviewDetails.css';
import Navbar from '../Navbar';

function InterviewDetails() {
  const [interview, setInterview] = useState({
    "Interview ID": "",
    "Interviewer": "",
    "Job ID": "",
    "Questions": [],
    "Interviewed On": "",
    "Name": ""
  });
  const [loading, setLoading] = useState(true);
  const { interviewId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('interviewId:', interviewId);
        const response = await axios.get(`https://rv0femjg65.execute-api.us-east-1.amazonaws.com/default/Fetch_Interview?interviewId=${interviewId}`);
        setInterview(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching interview data:', error);
      }
    };

    fetchData();
  }, [interviewId]);

  const handleInputChange = (index, key, value) => {
    const updatedQuestions = interview.Questions.map((question, i) =>
      i === index ? { ...question, [key]: value } : question
    );
    setInterview({ ...interview, Questions: updatedQuestions });
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    if (window.confirm('Are you sure you want to update this interview?')) {
      try {
        await axios.put(`https://rv0femjg65.execute-api.us-east-1.amazonaws.com/default/Update_Interview?interviewId=${interviewId}`, interview);
        alert('Interview updated successfully!');
        navigate('/dashboard');
      } catch (error) {
        console.error('Error updating interview:', error);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="interview-details">
      <div className="header">
        <Link to="/">
          <img src={logoImage} alt="Synchrony Logo" className="logo" />
        </Link>
        <Navbar />
      </div>
      <div className="portal-header-container">
        <h1 className="recruiting-portal-header">Update Interview</h1>
      </div>
      <div id="interview-info">
        <p>Interviewer: {interview.Interviewer}</p>
        <p>Job ID: {interview["Job ID"]}</p>
        <p>Interviewed On: {interview["Interviewed On"]}</p>
        <p>Candidate Name: {interview.Name}</p>
      </div>
      <button onClick={handleUpdate}>Update Interview</button>
      {interview.Questions.map((question, index) => (
        <div key={index} className="question-inputs-container">
          <textarea
            placeholder="Question"
            value={question.QuestionText}
            onChange={(e) => handleInputChange(index, 'QuestionText', e.target.value)}
          />
          <textarea
            placeholder="Answer"
            value={question.Answer}
            onChange={(e) => handleInputChange(index, 'Answer', e.target.value)}
          />
          <textarea
            placeholder="Score"
            value={question.Score}
            onChange={(e) => handleInputChange(index, 'Score', e.target.value)}
          />
        </div>
      ))}
    </div>
  );
}

export default InterviewDetails;
