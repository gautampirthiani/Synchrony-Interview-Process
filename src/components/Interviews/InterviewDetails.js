import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import logoImage from '../synchrony-logo-1.png';
import './InterviewDetails.css';
import Navbar from '../Navbar';

function InterviewDetails() {
  const {jobId,interviewId} = useParams();
  const [additionalInputs, setAdditionalInputs] = useState([{ question: '', answer: '', score: '' }]);
  const [interviewDetails, setInterviewDetails] = useState({
    interviewID: '',
    interviewedOn: '',
    interviewer: 'N/A',
    jobID: '',
    name: ''
  });

  

  function updateAdditionalInputsFromMultiple(items) {
    const newItems = items.map(item => ({
      question: item.QuestionText,
      answer: item.Answer,
      score: item.Score
    }));
    setAdditionalInputs(newItems);
  }



    //Fetch
    const fetchdata = async () => {
      try {
        const response = await axios.get(`https://rv0femjg65.execute-api.us-east-1.amazonaws.com/default/Fetch_Interview?interviewId=${interviewId}`);
        console.log(response.data);
        setInterviewDetails({
          interviewID: response.data["Interview ID"],
          interviewedOn: response.data["Interviewed On"],
          interviewer: response.data.Interviewer,
          jobID: response.data["Job ID"],
          name: response.data.Name
        });
        updateAdditionalInputsFromMultiple(response.data.Questions);
      } catch (error) {
      }
    };

    //Update [TODO API needed]
    const handleUpdate = async (event) => {
      event.preventDefault();
      if (window.confirm('Update?')) {
        const data = {
          interviewId,
          questions: additionalInputs.map(({ question, answer, score }) => ({
            QuestionText: question,
            Answer: answer,
            Score: score
          }))
        };
        try {
          console.log(data.questions);
          const response = await axios.post(`apixxxx?interviewId=${data.interviewId}`, data.questions);
          // console.log(response);
          alert('Updated successfully!');
        } catch (error) {
          console.error('Error fetching data:', error);
        }

      }
    };
    useEffect(() => {
      fetchdata();
    }, []);
    
    const handleAdditionalInputChange = (index, key, value) => {
      setAdditionalInputs(inputs =>
        inputs.map((input, i) => (i === index ? { ...input, [key]: value } : input))
      );
    };
    const addInputPair = () => {
      setAdditionalInputs([...additionalInputs, { question: '', answer: '', score: '' }]);
    };
    const removeInputPair = (index) => {
      setAdditionalInputs(inputs => inputs.filter((_, i) => i !== index));
    };

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
      <div id="update-interview-info" >
        {/* <p>Interview ID: {interviewDetails.interviewID}</p> */}
        <p>Interviewer: {interviewDetails.interviewer}</p>
        <p>Job ID: {interviewDetails.jobID}</p>
        <p>Interviewed On: {interviewDetails.interviewedOn}</p>
        <p>Candidate Name: {interviewDetails.name}</p>
      </div>
      <button id="add-question-answer-btn" onClick={addInputPair}>Add Question & Answer</button>
      <button id="save-new-templates-btn" onClick={handleUpdate}>Update</button>
      {additionalInputs.map((input, index) => (
        <div key={index} className="additional-inputs-container">
          <input
            type="text"
            placeholder="Question"
            value={input.question}
            onChange={(e) => handleAdditionalInputChange(index, 'question', e.target.value)}
            className="additional-input"
          />
          <input
            type="text"
            placeholder="Answer"
            value={input.answer}
            onChange={(e) => handleAdditionalInputChange(index, 'answer', e.target.value)}
            className="additional-input"
          />
          <input
            type="text"
            placeholder="Score"
            value={input.score}
            onChange={(e) => handleAdditionalInputChange(index, 'score', e.target.value)}
            className="score-input"
          />
          <button id="delete-btn" onClick={() => removeInputPair(index)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default InterviewDetails;
