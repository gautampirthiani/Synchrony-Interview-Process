import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './ConductInterview.css';
import Loader from '../Loader';

function ConductInterview() {
  const [additionalInputs, setAdditionalInputs] = useState([{ question: '', answer: '', score: '' }]);
  const [candidateName, setCandidateName] = useState('');
  const [templateId, setTemplateId] = useState(null);
  const { jobId } = useParams();
  const navigate = useNavigate();

  function updateAdditionalInputsFromMultiple(items, fetchedTemplateId) {
    const newItems = items.map(item => ({
      question: item.Question,
      answer: item.Answer,
      score: item.Score
    }));
    setAdditionalInputs(newItems);
    setTemplateId(fetchedTemplateId);
  }

  const fetchdata = async () => {
    try {
      const response = await axios.get(`https://rv0femjg65.execute-api.us-east-1.amazonaws.com/default/New-Interview?jobId=${jobId}`);
      const fetchedTemplateId = response.data['Template ID'];
      const questions = response.data.Questions || [];
      updateAdditionalInputsFromMultiple(questions, fetchedTemplateId);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  useEffect(() => {
    if (jobId) {
      fetchdata();
    }
  }, [jobId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (window.confirm('Submit new interview?')) {
      const questionsPayload = additionalInputs.map(({ question, answer, score }) => ({
        QuestionText: question,
        Answer: answer,
        Score: score
      }));

      try {
        const response = await axios.post(`https://rv0femjg65.execute-api.us-east-1.amazonaws.com/default/Submit-Interview?JobId=${jobId}`, {
          Name: candidateName,
          Questions: questionsPayload
        });

        alert('Interview submitted successfully!');
        navigate(`/dashboard/new-interview`);
      } catch (error) {
        console.error('Error submitting new interview:', error);
      }
    }
  };


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
    <div className="update-templates">
      <div className="portal-header-container">
        <h1 className="recruiting-portal-header">New Interview</h1>
      </div>
      <div id="job-template-info">
        <p>Job ID: {jobId}</p>
        {templateId && <p>Template ID: {templateId}</p>}
        <input
          type="text"
          placeholder="Candidate Name"
          value={candidateName}
          onChange={(e) => setCandidateName(e.target.value)}
          className="candidate-name-input"
        />
      </div>
      <button id="add-question-answer-btn" onClick={addInputPair}>Add Question & Answer</button>
      <button id="save-new-templates-btn" onClick={handleSubmit}>Submit</button>
      {additionalInputs.map((input, index) => (
        <div key={index} className="additional-inputs-container">
          <textarea
            placeholder="Question"
            value={input.question}
            onChange={(e) => {
              handleAdditionalInputChange(index, 'question', e.target.value);
              autoGrow(e.target);
            }}
            className="additional-input"
          />
          <textarea
            placeholder="Answer"
            value={input.answer}
            onChange={(e) => {
              handleAdditionalInputChange(index, 'answer', e.target.value);
              autoGrow(e.target);
            }}
            className="second-input"
          />
          <input
            type="text"
            placeholder="Score"
            value={input.score}
            onChange={(e) => handleAdditionalInputChange(index, 'score', e.target.value)}
            className="score-input"
          />
          <button type="button" id="delete-btn" onClick={() => removeInputPair(index)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default ConductInterview;
