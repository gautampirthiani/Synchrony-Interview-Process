import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import logoImage from './synchrony-logo-1.png';
import './UpdateTemplates.css';
import Navbar from './Navbar';

function UpdateTemplates() {
  const [templateData, setTemplateData] = useState({ questions: [{ question: '', answer: '', score: '' }] });
  const { jobId, templateId } = useParams(); // Assuming you have templateId in the URL

  useEffect(() => {
    const fetchTemplateData = async () => {
      try {
        const response = await axios.get(`API_ENDPOINT_FOR_GETTING_TEMPLATE?jobId=${jobId}&templateId=${templateId}`);
        setTemplateData({ questions: response.data.questions });
      } catch (error) {
        console.error('Error fetching template data:', error);
      }
    };

    fetchTemplateData();
  }, [jobId, templateId]);

  const handleInputChange = (index, key, value) => {
    setTemplateData(currentData => ({
      ...currentData,
      questions: currentData.questions.map((question, i) => 
        i === index ? { ...question, [key]: value } : question
      )
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`API_ENDPOINT_FOR_UPDATING_TEMPLATE`, {
        jobId,
        templateId,
        questions: templateData.questions,
      });
      // Handle success response, perhaps navigate back or show a success message
    } catch (error) {
      console.error('Error updating template:', error);
    }
  };

  const addQuestion = () => {
    setTemplateData(currentData => ({
      ...currentData,
      questions: [...currentData.questions, { question: '', answer: '', score: '' }]
    }));
  };

  const removeQuestion = (index) => {
    setTemplateData(currentData => ({
      ...currentData,
      questions: currentData.questions.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="update-templates-container">
      {/* Existing UI elements */}
      <button onClick={addQuestion}>Add Question & Answer</button>
      <button onClick={handleSubmit}>Submit</button>
      {templateData.questions.map((input, index) => (
        <div key={index} className="question-inputs-container">
          <input
            type="text"
            placeholder="Question"
            value={input.question}
            onChange={(e) => handleInputChange(index, 'question', e.target.value)}
          />
          <input
            type="text"
            placeholder="Answer"
            value={input.answer}
            onChange={(e) => handleInputChange(index, 'answer', e.target.value)}
          />
          <input
            type="text"
            placeholder="Score"
            value={input.score}
            onChange={(e) => handleInputChange(index, 'score', e.target.value)}
          />
          <button onClick={() => removeQuestion(index)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default UpdateTemplates;
