import React, { useState, useEffect} from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate} from 'react-router-dom';
import './UpdateTemplates.css';
import Loader from '../Loader';

function UpdateTemplates() {
  const [loading, setLoading] = useState(false);
  const [additionalInputs, setAdditionalInputs] = useState([{ question: '', answer: '', score: '' }]);
  const { jobId, templateId } = useParams();
  const [templateName, setTemplateName] = useState(''); 
  const [jobPosition, setJobPosition] = useState(''); 

  useEffect(() => {
    fetchdata();
    query_job_positon();
  }, []);

  function updateAdditionalInputsFromMultiple(items) {
    const newItems = items.map(item => ({
      question: item.Question,
      answer: item.Answer,
      score: item.Score
    }));
    setAdditionalInputs(newItems);
  }
  // Query job positon
  const query_job_positon = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://rv0femjg65.execute-api.us-east-1.amazonaws.com/default/get_jobPosition?jobId=${jobId}`);
      // console.log("11")
      // console.log(response.data)
      setJobPosition(response.data)

    } catch (error) {
      // console.error('Error fetching data:', error);
    }
    finally {
      setLoading(false);
    }
  };


  

  //Fetch
  const fetchdata = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://rv0femjg65.execute-api.us-east-1.amazonaws.com/default/Fetch_Template?jobId=${jobId}&templateId=${templateId}`);
      // console.log(response.data)
      // console.log(response.data['Template Name']);
      // console.log(response.data['Template ID']);
      setTemplateName(response.data['Template Name']);
      updateAdditionalInputsFromMultiple(response.data.Questions);
    } catch (error) {
      // console.error('Error fetching data:', error);
    }
    finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();
  //Update
  const handleUpdate = async (event) => {
      event.preventDefault();
      if (window.confirm('Update?')) {
        const data = {
          jobId,
          templateId,
          questions: additionalInputs.map(({ question, answer, score }) => ({
            Question: question,
            Answer: answer,
            Score: score
          }))
        };
        try {
          const response = await axios.post(`https://rv0femjg65.execute-api.us-east-1.amazonaws.com/default/Update_Questions?jobId=${jobId}&templateId=${templateId}`, data);
          alert('Updated successfully!');
          navigate(-1); // Go back to the previous page
        } catch (error) {
          console.error('Error fetching data:', error);
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
        <h1 className="recruiting-portal-header">Update Templates</h1>
      </div>
      {loading && <Loader />}
      <div id="job-template-info">
        <p>Job Position: {jobPosition}</p>
        <p>Template Name: {templateName}</p>
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

export default UpdateTemplates;
