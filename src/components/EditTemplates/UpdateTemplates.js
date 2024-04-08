import React, { useState, useEffect} from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate} from 'react-router-dom';
import './UpdateTemplates.css';
import Loader from '../Loader';

function UpdateTemplates() {
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

  const handleAdditionalInputChange = (index, key, value) => {
    setAdditionalInputs(inputs =>
      inputs.map((input, i) => (i === index ? { ...input, [key]: value } : input))
      
    );
  };

  //Fetch
  const fetchdata = async () => {
    try {
      //local test data
      // const testData = [
      //   { question: 'What is React?', answer: 'A JavaScript library for building user interfaces', score: '5' },
      //   { question: 'What is useState?', answer: 'A Hook that lets you add React state to function components', score: '4' },
      //   { question: 'What is useEffect?', answer: 'A Hook that lets you perform side effects in function components', score: '5' }
      // ];
      // setAdditionalInputs(testData);
      // console.log(testData);
      //?jobId=${jobId}&templateId=${templateId}
      // add fetch API here
      const response = await axios.get(`https://rv0femjg65.execute-api.us-east-1.amazonaws.com/default/Fetch_Template?jobId=${jobId}&templateId=${templateId}`);
      updateAdditionalInputsFromMultiple(response.data.Questions);
    } catch (error) {
      // console.error('Error fetching data:', error);
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

    useEffect(() => {
    fetchdata();
  }, []);


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
      <div id="job-template-info">
        <p>Job ID: {jobId}</p>
        <p>Template ID: {templateId}</p>
      </div>
      <button id="add-question-answer-btn" onClick={addInputPair}>Add Question & Answer</button>
      <button id="save-new-templates-btn" onClick={handleUpdate}>Update</button>
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
          <button id="delete-btn" onClick={() => removeInputPair(index)}>Delete</button>
        </div>
      ))}
    </div>

  );
}

export default UpdateTemplates;
