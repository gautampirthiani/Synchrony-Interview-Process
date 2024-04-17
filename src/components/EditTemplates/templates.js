import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { getCurrentUser } from '@aws-amplify/auth';
import '../Styles/templates.css';
import Loader from '../Loader';

function Templates() {
  const [loading, setLoading] = useState(false);
  const [defaultTemplateId, setDefaultTemplateId] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [username, setUsername] = useState('');
  const { JobID } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getCurrentUser().then(user => {
      setUsername(user.username);
      return axios.post('https://h60ydhn92g.execute-api.us-east-1.amazonaws.com/dev/GetDefaultTemplate', {
        username: user.username,
        jobID: JobID
      });
    }).then(response => {
      const defaultTemplateId = response.data.templateID;
      setDefaultTemplateId(defaultTemplateId);
      setLoading(false);
    }).catch(error => {
      console.error('Error:', error);
      setLoading(false);
    });
  }, [JobID]);

  useEffect(() => {
    fetchTemplates();
  }, [JobID]);

  const fetchTemplates = async () => {
    try {
      const response = await axios.get(`https://rv0femjg65.execute-api.us-east-1.amazonaws.com/default/Get_Template?jobId=${JobID}`);
      const templatesData = response.data;
      setTemplates(templatesData);
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateClick = (templateId) => {
    navigate(`/dashboard/update-templates/${JobID}/${templateId}`);
  };

  const handleCreateNewClick = () => {
    navigate(`/dashboard/new-templates/${JobID}`);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const toggleDefaultTemplate = async (event, templateId) => {
    event.stopPropagation();
    const apiUrl = 'https://h60ydhn92g.execute-api.us-east-1.amazonaws.com/dev/SetDefaultTemplate';
    try {
      await axios.post(apiUrl, {
        jobID: JobID,
        templateID: templateId,
        username: username
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setDefaultTemplateId(templateId);
      await fetchTemplates();
    } catch (error) {
      console.error('Error setting default template:', error);
    }
  };

  const handleDelete = async (templateId, event) => {
    event.stopPropagation();
    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        await axios.post(`https://rv0femjg65.execute-api.us-east-1.amazonaws.com/default/delete_templates?jobId=${JobID}&templateId=${templateId}`);
        await fetchTemplates();
      } catch (error) {
        console.error('Error deleting template:', error);
      }
    }
  };

  const filteredAndSortedTemplates = templates.filter(template => {
    const nameMatches = template["Template Name"].toLowerCase().includes(searchTerm.toLowerCase());
    const createdOnMatches = template["Created On"] && template["Created On"].toLowerCase().includes(searchTerm.toLowerCase());
    const updatedOnMatches = template["Updated On"] && template["Updated On"].toLowerCase().includes(searchTerm.toLowerCase());
    return nameMatches || createdOnMatches || updatedOnMatches;
  }).sort((a, b) => {
    if (a['Template ID'] === defaultTemplateId) return -1;
    if (b['Template ID'] === defaultTemplateId) return 1;
    return 0;
  });

  return (
    <div className="templates-container">
      <div className="portal-header-container">
        <h1 className="recruiting-portal-header">Templates</h1>
        <input
          type="text"
          placeholder="Search by template name, created on, or updated on"
          value={searchTerm}
          onChange={handleSearch}
          className="search-bar"
        />
        <div className="create-new-templates-container">
          <button onClick={handleCreateNewClick} className="create-new-templates-btn">
            Create New Templates
          </button>
        </div>
      </div>
      {loading && <Loader />}
      <div className="templates-list">
        {filteredAndSortedTemplates.map((template) => (
          <div
            key={template["Template ID"]}
            className="template-item"
            onClick={() => handleTemplateClick(template["Template ID"])}
            style={{ cursor: 'pointer' }}
          >
            <div className="template-details">
              <div className="template-detail"><strong>Template Name:</strong> {template["Template Name"]}</div>
              <div className="template-detail"><strong>Created On:</strong> {template["Created On"] || 'Not Available'}</div>
              {template["Updated On"] && template["Updated On"] !== 'N/A' && (
                <div className="template-detail"><strong>Updated On:</strong> {template["Updated On"]}</div>
              )}
            </div>
            <div className="button-container">
              <button
                className="delete-button"
                onClick={(e) => handleDelete(template["Template ID"], e)}
              >
                Delete
              </button>
              <button
                className={`toggle-default ${defaultTemplateId === template["Template ID"] ? 'active' : ''}`}
                onClick={(event) => toggleDefaultTemplate(event, template["Template ID"])}
              >
                {defaultTemplateId === template["Template ID"] ? 'Default' : 'Set Default'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Templates;
