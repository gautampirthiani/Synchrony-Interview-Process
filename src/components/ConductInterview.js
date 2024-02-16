import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import logoImage from './synchrony-logo-1.png';
import './ConductInterview.css'; 
import Navbar from './Navbar';

function ConductInterview() {
  const [interviewData, setInterviewData] = useState([{ question: '', answer: '', score: '' }]);
  const [candidateName, setCandidateName] = useState('');
  const { jobId, templateId } = useParams();

  useEffect(() => {
    const fetchInterviewData = async () => {
      try {
        const response = await axios.get(`https://rv0femjg65.execute-api.us-east-1.amazonaws.com/default/Get_InterviewData?jobId=${jobId}&templateId=${templateId}`);
        setInterviewData(response.data.questions); 
        setCandidateName(response.data.candidateName); 
      } catch (error) {
        console.error('Error fetching interview data:', error);
      }
    };

    fetchInterviewData();
  }, [jobId, templateId]);

  const handleInputChange = (index, key, value) => {
    setInterviewData(data =>
      data.map((item, i) => (i === index ? { ...item, [key]: value } : item))
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      name: candidateName,
      jobId,
      templateId,
      questions: interviewData
    };

    try {
      const response = await axios.post(
        `https://your-api-endpoint.com/post_interview_data`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('Response from API:', response.data);
      // Additional success handling
    } catch (error) {
      console.error('Error posting interview data:', error);
    }
  };

  return (
    <div className="conduct-interview-container">
      <div className="header">
        <Link to="/">
          <img src={logoImage} alt="Synchrony Logo" className="logo" />
        </Link>
        <Navbar />
      </div>
      <div className="portal-header-container">
        <h1 className="recruiting-portal-header">Conduct Interview</h1>
      </div>
      <input
        type="text"
        placeholder="Candidate Name"
        value={candidateName}
        onChange={(e) => setCandidateName(e.target.value)}
        className="candidate-name-input"
      />
      <button id="submit-interview-btn" onClick={handleSubmit}>Submit Interview</button>
      {interviewData.map((item, index) => (
        <div key={index} className="question-answer-container">
          <input
            type="text"
            placeholder="Question"
            value={item.question}
            onChange={(e) => handleInputChange(index, 'question', e.target.value)}
            className="interview-input"
          />
          <input
            type="text"
            placeholder="Answer"
            value={item.answer}
            onChange={(e) => handleInputChange(index, 'answer', e.target.value)}
            className="interview-input"
          />
          <input
            type="text"
            placeholder="Score"
            value={item.score}
            onChange={(e) => handleInputChange(index, 'score', e.target.value)}
            className="score-input"
          />
        </div>
      ))}
    </div>
  );
}

export default ConductInterview;
