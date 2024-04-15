import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
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

  const autoGrow = (element) => {
    document.querySelectorAll('.interview-details-inputs-container').forEach(container => {
      var first_input = container.getElementsByClassName('interview-details-question-input')[0];
      var second_input = container.getElementsByClassName('interview-details-answer-input')[0];
  
      // Reset the height to 'auto' before calculating the new height
      // to allows the box to shrink if the content has been deleted
      first_input.style.height = 'auto';
      second_input.style.height = 'auto';
  
      let first_height = first_input.scrollHeight;
      let second_height = second_input.scrollHeight;
      
      let greater_height = Math.max(first_height, second_height);
      first_input.style.height = greater_height + 'px';
      second_input.style.height = greater_height + 'px';
    });
  };

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
        await axios.post(`https://rv0femjg65.execute-api.us-east-1.amazonaws.com/default/update_interview?interviewId=${data.interviewId}`, data);
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
        <p>Interviewed On: {interviewDetails.interviewedOn}</p>
        <p>Candidate Name: {interviewDetails.name}</p>
      </div>
      <button id="interview-details-add-question-answer-btn" onClick={addInputPair}>Add Question & Answer</button>
      <button id="interview-details-save-new-templates-btn" onClick={handleUpdate}>Update</button>
      {additionalInputs.map((input, index) => (
        <div key={index} className="interview-details-inputs-container">
          <textarea
            placeholder="Question"
            value={input.question}
            onChange={(e) => {
              handleAdditionalInputChange(index, 'question', e.target.value);
              autoGrow(e.target);
            }}
            className="interview-details-question-input"
          />
          <textarea
            placeholder="Answer"
            value={input.answer}
            onChange={(e) => {
              handleAdditionalInputChange(index, 'answer', e.target.value);
              autoGrow(e.target);
            }}
            className="interview-details-answer-input"
          />
          <input
            type="text"
            placeholder="Score"
            value={input.score}
            onChange={(e) => handleAdditionalInputChange(index, 'score', e.target.value)}
            className="interview-details-score-input"
          />
          <button id="interview-details-delete-btn" onClick={() => removeInputPair(index)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default InterviewDetails;
