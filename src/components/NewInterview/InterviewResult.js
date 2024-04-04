import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import logoImage from '../synchrony-logo-1.png';
import './InterviewResult.css';
import Navbar from '../Navbar';
import { useNavigate } from 'react-router-dom';
import Loader from '../Loader';

function InterviewResult() {
  const [loading, setLoading] = useState(false);
  const [additionalInputs, setAdditionalInputs] = useState([{ question: '', answer: '', score: '' }]);
  const [candidateName, setCandidateName] = useState('');
  const [templateId, setTemplateId] = useState(null); // New state variable for storing templateId
  const { jobId } = useParams();
  const navigate = useNavigate();
  // console.log(jobId);
  var image_1 = document.getElementById("login_img_1");
  image_1.style.display = 'none';

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
    var interview_result = "";
    try {
      setLoading(true);
      var elements = document.getElementsByClassName("welcome-message");
      var content = elements[0].innerHTML;
      var parts = content.split(",")[1];
      var trimmedStr = parts.trim();
        //console.log(trimmedStr);
      var username = trimmedStr;
      const response = await axios.get(`https://tgjy0iky7i.execute-api.us-east-1.amazonaws.com/default/InterviewResult?optype=Get&username=${username}`);
      // Parsing the fetched data and extract the templateId
      //const fetchedTemplateId = response.data['Template ID']; // Access the Template ID from the response
      //const questions = response.data.Questions || [];
      //updateAdditionalInputsFromMultiple(questions, fetchedTemplateId);
      console.log(response);
      interview_result = response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    finally {
      setLoading(false);
      updateResult(interview_result);
    }
  };
  
  // Call fetchdata when jobId changes or when the component mounts
  useEffect(() => {
    fetchdata();
  }, []);
  
  const updateResult = (result) => {
    var display_text = "Your interview result still in progress";
    if(result == "Pass"){
        display_text = "Congratulations! You pass the interview.";
    }
    if(result == "Fail"){
        display_text = "Sorry! You fail the interview.";
    }

    var result_text = document.getElementById("job-template-info");
    if(result_text) {
        var p = result_text.querySelector("h2");
        if(p) {
          p.textContent = display_text;
        }
      }
    console.log(result_text);
  }

  const handleSubmit = async (interview_result) => {
    try {
        setLoading(true);
        var elements = document.getElementsByClassName("welcome-message");
        var content = elements[0].innerHTML;
        var parts = content.split(",")[1];
        var trimmedStr = parts.trim();
          //console.log(trimmedStr);
        var username = trimmedStr;
        const response = await axios.get(`https://tgjy0iky7i.execute-api.us-east-1.amazonaws.com/default/InterviewResult?optype=Set&username=${username}&interview_result=${interview_result}`);
        // Parsing the fetched data and extract the templateId
        //const fetchedTemplateId = response.data['Template ID']; // Access the Template ID from the response
        //const questions = response.data.Questions || [];
        //updateAdditionalInputsFromMultiple(questions, fetchedTemplateId);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      finally {
        setLoading(false);
      }
    }



  return (
    <div className="update-templates">
      <div className="header">
        <Link to="/">
          <img src={logoImage} alt="Synchrony Logo" className="logo" />
        </Link>
        <Navbar />
      </div>
      <div className="portal-header-container">
        <h1 className="recruiting-portal-header">Interview Result</h1>
      </div>
      {loading && <Loader />}
      <button id="interview-result-pass-btn" onClick={() => handleSubmit("Pass")}>Pass</button>
      <button id="interview-result-fail-btn" onClick={() => handleSubmit("Fail")}>Fail</button>
      <div id="job-template-info">
        <h2>Your Interview Result: {jobId}</h2>
      </div>
    </div>
    
  );
}

export default InterviewResult;