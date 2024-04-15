import React, { useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import './NewTemplates.css';
import { useNavigate } from 'react-router-dom';

function NewTemplates() {
  const [additionalInputs, setAdditionalInputs] = useState([{ question: '', answer: '', score: '' }]);
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [templateName, setTemplateName] = useState('');

  const autoGrow = (element) => {
    document.querySelectorAll('.new-template-inputs-container').forEach(container => {
      var first_input = container.getElementsByClassName('new-template-question-input')[0];
      var second_input = container.getElementsByClassName('new-template-answer-input')[0];
  
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

  const handleAdditionalInputChange = (index, key, value) => {
    setAdditionalInputs(inputs =>
      inputs.map((input, i) => (i === index ? { ...input, [key]: value } : input))
    );
  };

  const generateTemplateId = () => {
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, "");
    return `${jobId}_${timestamp}`;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (window.confirm('Submit?')) {
      const templateId = generateTemplateId();
      const payload = {
        jobId,
        templateId,
        templateName,
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

  const handleTemplateNameChange = (event) => {
    setTemplateName(event.target.value);
  };
  

  return (
    <div className="new-templates-container">
      <div className="portal-header-container">
        <h1 className="recruiting-portal-header">New Templates</h1>
        <input
          type="text"
          placeholder="Template Name"
          value={templateName}
          onChange={handleTemplateNameChange}
          className="template-name-input"
        />
      </div>
      <button id="new-template-add-question-answer-btn" onClick={addInputPair}>Add Question & Answer</button>
      <button id="new-template-save-new-templates-btn" onClick={handleSubmit}>Submit</button>
      {additionalInputs.map((input, index) => (
        <div key={index} className="new-template-inputs-container">
          <textarea
            placeholder="Question"
            value={input.question}
            onChange={(e) => {
              handleAdditionalInputChange(index, 'question', e.target.value);
              autoGrow(e.target);
            }}
            className="new-template-question-input"
          />
          <textarea
            placeholder="Answer"
            value={input.answer}
            onChange={(e) => {
              handleAdditionalInputChange(index, 'answer', e.target.value);
              autoGrow(e.target);
            }}
            className="new-template-answer-input"
          />
          <input
            type="text"
            placeholder="Score"
            value={input.score}
            onChange={(e) => handleAdditionalInputChange(index, 'score', e.target.value)}
            className="new-template-score-input" 
          />
          <button id="new-template-delete-btn" onClick={() => removeInputPair(index)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default NewTemplates;
