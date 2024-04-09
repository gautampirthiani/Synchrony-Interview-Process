import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import logoImage from '../synchrony-logo-1.png';
import './ConductInterview.css';
import Navbar from '../Navbar';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '@aws-amplify/auth'; // Import getCurrentUser

function ConductInterview() {
  const [additionalInputs, setAdditionalInputs] = useState([{ question: '', answer: '', score: '' }]);
  const [candidateName, setCandidateName] = useState('');
  const [templateId, setTemplateId] = useState(null); // New state variable for storing templateId
  const { jobId } = useParams();
  const navigate = useNavigate();
  // console.log(jobId);
  
  const autoGrow = (element) => {
    document.querySelectorAll('.additional-inputs-container').forEach(container => {
      var first_input = container.getElementsByClassName('additional-input')[0];
      var second_input = container.getElementsByClassName('second-input')[0];
  
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
  const [username, setUsername] = useState('');

  useEffect(() => {
    getCurrentUser().then(user => setUsername(user.username)); // Fetch current user's username
  }, []);

  function updateAdditionalInputsFromMultiple(items, fetchedTemplateId) {
    const newItems = items.map(item => ({
      question: item.Question,
      answer: item.Answer,
      score: item.Score
    }));
    setAdditionalInputs(newItems);
    setTemplateId(fetchedTemplateId); // Update state with fetched templateId
  }

  const fetchdata = async () => {
    try {
      const response = await axios.get(`https://rv0femjg65.execute-api.us-east-1.amazonaws.com/default/New-Interview?jobId=${jobId}`);
      // Parsing the fetched data and extract the templateId
      const fetchedTemplateId = response.data['Template ID']; // Access the Template ID from the response
      const questions = response.data.Questions || [];
      updateAdditionalInputsFromMultiple(questions, fetchedTemplateId);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Call fetchdata when jobId changes or when the component mounts
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
        // console.log(questionsPayload);
        // Send the jobId as a query parameter and the rest of the body as JSON
        await axios.post(`https://rv0femjg65.execute-api.us-east-1.amazonaws.com/default/Submit-Interview?JobId=${jobId}`, {
          Name: candidateName,
          Questions: questionsPayload,
          Interviewer: username // Include username in the request payload
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
      <div className="header">
        <Link to="/">
          <img src={logoImage} alt="Synchrony Logo" className="logo" />
        </Link>
        <Navbar />
      </div>
      <div className="portal-header-container">
        <h1 className="recruiting-portal-header">New Interview</h1>
      </div>
      <div id="job-template-info">
        <p>Job ID: {jobId}</p>
        {templateId && <p>Template ID: {templateId}</p>} {/* Conditionally render templateId if available */}
        <input
          type="text"
          placeholder="Candidate Name"
          value={candidateName}
          onChange={(e) => setCandidateName(e.target.value)}
          className="candidate-name-input" // This line applies the class to your input field
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