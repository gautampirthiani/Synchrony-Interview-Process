import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './ConductInterview.css';
import Loader from '../Loader';
import { getCurrentUser } from '@aws-amplify/auth';

function ConductInterview() {
  const [loading, setLoading] = useState(false);
  const [additionalInputs, setAdditionalInputs] = useState([{ question: '', answer: '', score: '' }]);
  const [candidateName, setCandidateName] = useState('');
  const [templateId, setTemplateId] = useState(null);
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');

  useEffect(() => {
    getCurrentUser().then(user => {
      setUsername(user.username);
      if (jobId) {
        axios.post('https://h60ydhn92g.execute-api.us-east-1.amazonaws.com/dev/GetDefaultTemplate', {
          username: user.username,
          jobID: jobId
        })
        .then(response => {
          setTemplateId(response.data.templateID);
        })
        .catch(error => console.error('Error fetching default template:', error));
      }
    });
  }, [jobId]);

  const fetchdata = async () => {
    if (templateId && jobId) {
      try {
        setLoading(true);
        const response = await axios.get(`https://rv0femjg65.execute-api.us-east-1.amazonaws.com/default/New-Interview`, {
          params: { jobId, templateId }
        });
        const questions = response.data.questions || [];
        updateAdditionalInputsFromMultiple(questions);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchdata();
  }, [jobId, templateId]);

  function updateAdditionalInputsFromMultiple(questions) {
    const newItems = questions.map(q => ({
      question: q.Question,
      answer: q.Answer,
      score: q.Score
    }));
    setAdditionalInputs(newItems);
  }

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
          Questions: questionsPayload,
          Interviewer: username // Include username in the request payload
        });

        alert('Interview submitted successfully!');
        navigate(`/dashboard/new-interview`);
      } catch ( error) {
        console.error('Error submitting new interview:', error);
      }
    }
  };

  return (
    <div className="update-templates">
      <div className="portal-header-container">
        <h1 className="recruiting-portal-header">New Interview</h1>
      </div>
      {loading && <Loader />}
      <div id="job-template-info">
        <p>Job ID: {jobId}</p>
        <p>Template ID: {templateId}</p> {/* Display Template ID below Job ID */}
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

export default ConductInterview;
