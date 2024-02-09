import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import logoImage from './synchrony-logo-1.png';
import Navbar from './Navbar'; // Assuming you have a Navbar component
import './templates.css';
import { FiArrowLeft } from 'react-icons/fi'; // Importing a left arrow icon from react-icons
//https://rv0femjg65.execute-api.us-east-1.amazonaws.com/default/Get_Template/${JobID}

function Templates() {
  const [templates, setTemplates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { JobID } = useParams();
  console.log(JobID);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        console.log('Job ID:', JobID);
        const response = await axios.get(`https://rv0femjg65.execute-api.us-east-1.amazonaws.com/default/Get_Template`);
        setTemplates(response.data);
      } catch (error) {
        console.error('Error fetching templates:', error);
      }
    };

    fetchTemplates();
  }, [JobID]);

  const handleTemplateClick = (templateId) => {
    navigate(`/dashboard/New-templates/${JobID}/${templateId}`);
  };
  
  const handleCreateNewClick = () => {
    navigate(`/dashboard/New-templates/${JobID}`); // Use the correct path to your NewTemplates route
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredTemplates = templates.filter(template => 
    template["Template ID"].toString().includes(searchTerm) || 
    template["Job ID"].toString().includes(searchTerm)
  );

  return (
    <div className="templates-container">
      <div className="header">
        <Link to="/">
          <img src={logoImage} alt="Synchrony Logo" className="logo" />
        </Link>
        <Navbar />
      </div>
      <div className="back-button-container">
        <Link to="/dashboard/edit-templates" className="back-button">
          <FiArrowLeft /> Back
        </Link>
      </div>
      <div className="portal-header-container">
        <h1 className="recruiting-portal-header">Templates</h1>
      </div>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by template ID or job ID"
          value={searchTerm}
          onChange={handleSearch}
          className="search-bar"
        />
      </div>
      {/* Add this button outside of the search-container but within the portal-header-container */}
      <button onClick={handleCreateNewClick} className="create-new-templates-btn">
        Create New Templates
      </button>
      <div className="templates-list">
        {filteredTemplates.map((template, index) => (
          <div key={index} onClick={() => handleTemplateClick(template["Template ID"])} className="template-item">
            <div className="template-detail">
              <strong>Job ID:</strong> {template["Job ID"]}
            </div>
            <div className="template-detail">
              <strong>Template ID:</strong> {template["Template ID"]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Templates;
