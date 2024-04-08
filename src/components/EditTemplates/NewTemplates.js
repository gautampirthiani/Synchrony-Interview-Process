import React, { useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import './NewTemplates.css';
import { useNavigate } from 'react-router-dom';

function NewTemplates() {
  const [additionalInputs, setAdditionalInputs] = useState([{ question: '', answer: '', score: '' }]);
  const { jobId } = useParams();
  const navigate = useNavigate();

  const handleAdditionalInputChange = (index, key, value) => {
    setAdditionalInputs(inputs =>
      inputs.map((input, i) => (i === index ? { ...input, [key]: value } : input))
    );
  };

  const generateTemplateId = () => {
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, "");
    return `${jobId}_${timestamp}`;
  };

  var image_1 = document.getElementById("login_img_1");
  image_1.style.display = 'none';

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (window.confirm('Submit?')) {
      const templateId = generateTemplateId();
      const payload = {
        jobId,
        templateId,
        questions: additionalInputs.map(({ question, answer, score }) => ({
          Question: question,
          Answer: answer,
          Score: score
        }))
      };

      try {
        const response = await axios.post(
          `https://rv0femjg65.execute-api.us-east-1.amazonaws.com/default/add_to_template?JobId=${jobId}`,
          payload,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        console.log('Response from Lambda:', response.data);
        setAdditionalInputs([{ question: '', answer: '', score: '' }]);
        navigate(`/dashboard/templates/${jobId}`);
      } catch (error) {
        console.error('Error submitting to Lambda:', error);
      }
    }
  };

  const addInputPair = () => {
    setAdditionalInputs([...additionalInputs, { question: '', answer: '', score: '' }]);
  };

  const removeInputPair = (index) => {
    setAdditionalInputs(inputs => inputs.filter((_, i) => i !== index));
  };

  return (
    <div className="new-templates-container">
      <div className="portal-header-container">
        <h1 className="recruiting-portal-header">New Templates</h1>
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

export default NewTemplates;

