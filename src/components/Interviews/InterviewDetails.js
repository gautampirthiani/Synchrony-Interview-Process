import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './InterviewDetails.css';
import Loader from '../Loader';

function InterviewDetails() {
  const [loading, setLoading] = useState(false);
  const {jobId,interviewId} = useParams();
  const [additionalInputs, setAdditionalInputs] = useState([{ question: '', answer: '', score: '' }]);
  const [interviewDetails, setInterviewDetails] = useState({
    interviewID: '',
    interviewedOn: '',
    interviewer: 'N/A',
    jobID: '',
    name: ''
  });

  var image_1 = document.getElementById("login_img_1");
  image_1.style.display = 'none';

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
      setLoading(true);
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
      console.error('Error fetching data:', error);
    }
    finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();
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
        console.log(data.interviewid);
        const response = await axios.post(`https://rv0femjg65.execute-api.us-east-1.amazonaws.com/default/update_interview?interviewId=${data.interviewId}`, data);
        // console.log(response);
        alert('Updated successfully!');
        navigate(-1); 
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
      <div className="portal-header-container">
        <h1 className="recruiting-portal-header">Update Interview</h1>
      </div>
      {loading && <Loader />}
      <div id="update-interview-info" >
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
