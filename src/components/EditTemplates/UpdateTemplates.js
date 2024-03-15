import React, { useState, useEffect} from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate} from 'react-router-dom';
import logoImage from '../synchrony-logo-1.png';
import './UpdateTemplates.css';
import Navbar from '../Navbar';
import Loader from '../Loader';

function UpdateTemplates() {
  const [loading, setLoading] = useState(false);
  const [additionalInputs, setAdditionalInputs] = useState([{ question: '', answer: '', score: '' }]);
  const { jobId, templateId } = useParams();

  function updateAdditionalInputsFromMultiple(items) {
    const newItems = items.map(item => ({
      question: item.Question,
      answer: item.Answer,
      score: item.Score
    }));
    setAdditionalInputs(newItems);
  }
  

  //Fetch
  const fetchdata = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://rv0femjg65.execute-api.us-east-1.amazonaws.com/default/Fetch_Template?jobId=${jobId}&templateId=${templateId}`);
      //console.log(response.data.Questions);
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
          //print sending data in console 
          // console.log(data);
          // Add API api for updating here
          const response = await axios.post(`https://rv0femjg65.execute-api.us-east-1.amazonaws.com/default/Update_Questions?jobId=${jobId}&templateId=${templateId}`, data);
          // console.log(response);
          alert('Updated successfully!');
          navigate(-1); // 使用navigate回到上一页
          // fetchdata();
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
    <div className="update-templates">
      <div className="header">
        <Link to="/">
          <img src={logoImage} alt="Synchrony Logo" className="logo" />
        </Link>
        <Navbar />
      </div>
      <div className="portal-header-container">
        <h1 className="recruiting-portal-header">Update Templates</h1>
      </div>
      {loading && <Loader />}
      <div id="job-template-info">
        <p>Job ID: {jobId}</p>
        <p>Template ID: {templateId}</p>
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