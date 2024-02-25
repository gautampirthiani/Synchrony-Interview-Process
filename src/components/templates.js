import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import logoImage from './synchrony-logo-1.png';
import Navbar from './Navbar';
import './templates.css';
import { FiArrowLeft } from 'react-icons/fi';

function Templates() {
  const [defaultTemplateId, setDefaultTemplateId] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { JobID } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get(`https://rv0femjg65.execute-api.us-east-1.amazonaws.com/default/Get_Template?jobId=${JobID}`);
        setTemplates(response.data);
        // Determine and set the default template if it exists
        const defaultTemplate = response.data.find(t => t.default);
        if (defaultTemplate) {
          setDefaultTemplateId(defaultTemplate['Template ID']);
        }
      } catch (error) {
        console.error('Error fetching templates:', error);
      }
    };

    fetchTemplates();
  }, [JobID]);

  const handleTemplateClick = (templateId) => {
    navigate(`/dashboard/Update-templates/${JobID}/${templateId}`);
  };

  const handleCreateNewClick = () => {
    navigate(`/dashboard/New-templates/${JobID}`);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const toggleDefaultTemplate = async (templateId) => {
    try {
      await axios.post('https://rv0femjg65.execute-api.us-east-1.amazonaws.com/default/Default_Template', {
        jobId: JobID,
        templateId: templateId
      });
      setDefaultTemplateId(prev => prev === templateId ? null : templateId);
    } catch (error) {
      console.error('Error toggling default template:', error);
    }
  };

  const filteredTemplates = templates.filter(template =>
    template["Template ID"].toLowerCase().includes(searchTerm.toLowerCase()) ||
    template["Job ID"].toLowerCase().includes(searchTerm.toLowerCase())
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
        <input
          type="text"
          placeholder="Search by template ID or job ID"
          value={searchTerm}
          onChange={handleSearch}
          className="search-bar"
        />
        <button onClick={handleCreateNewClick} className="create-new-templates-btn">
          Create New Templates
        </button>
      </div>
      <div className="templates-list">
        {filteredTemplates.map((template) => (
          <div
          key={template["Template ID"]}
          className="template-item"
          // Wrap the details with an onClick event to navigate
          onClick={() => handleTemplateClick(template["Template ID"])}
          // Add a style or class to show the item is clickable (optional)
          style={{ cursor: 'pointer' }}
        >
          
            <div className="template-details">
              <div className="template-detail"><strong>Job ID:</strong> {template["Job ID"]}</div>
              <div className="template-detail"><strong>Template ID:</strong> {template["Template ID"]}</div>
              <div className="template-detail"><strong>Created On:</strong> {template["Created On"] || 'Not Available'}</div>
            </div>
            <button
              className={`toggle-default ${defaultTemplateId === template["Template ID"] ? 'active' : ''}`}
              onClick={() => toggleDefaultTemplate(template["Template ID"])}
            >
              {defaultTemplateId === template["Template ID"] ? 'Remove Default' : 'Set Default'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Templates;
