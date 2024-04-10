import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './templates.css';
import Loader from '../Loader';
import { FiArrowLeft } from 'react-icons/fi';

function Templates() {
  const [loading, setLoading] = useState(false);
  const [defaultTemplateId, setDefaultTemplateId] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { JobID } = useParams();
  const navigate = useNavigate();
  
  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://rv0femjg65.execute-api.us-east-1.amazonaws.com/default/Get_Template?jobId=${JobID}`);
      const templatesData = response.data;
      setTemplates(templatesData);
      const defaultTemplate = templatesData.find(template => template.default === true);
      if (defaultTemplate) {
        setDefaultTemplateId(defaultTemplate['Template ID']);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [JobID]);

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
    event.stopPropagation(); // Prevent the click from bubbling up to the parent div

    // If a default template is already set and it's not the one being clicked, alert the user and stop.
    if (defaultTemplateId && defaultTemplateId !== templateId) {
      alert('Please remove the existing default template before setting a new one.');
      return;
    }

    // If the clicked template is already the default, remove it as default.
    if (defaultTemplateId === templateId) {
      try {
        await axios.post('https://rv0femjg65.execute-api.us-east-1.amazonaws.com/default/Default_Template', {
          jobId: JobID,
          templateId: templateId
        });
        setDefaultTemplateId(null);
      } catch (error) {
        console.error('Error removing default template:', error);
      }
    } else {
      // No default template is set, or the clicked template was not the default, so set it as default.
      try {
        await axios.post('https://rv0femjg65.execute-api.us-east-1.amazonaws.com/default/Default_Template', {
          jobId: JobID,
          templateId: templateId
        });
        setDefaultTemplateId(templateId);
      } catch (error) {
        console.error('Error setting default template:', error);
      }
    }

    // Fetch the updated list of templates to reflect the change in UI.

  };


  const filteredTemplates = templates.filter(template =>
    template["Template ID"].toLowerCase().includes(searchTerm.toLowerCase()) ||
    template["Job ID"].toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  
  // handle delete [TODO API needed]
  const handleDelete = async (jobid,templateId, event) => {
    event.stopPropagation();

    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        console.log(jobid, templateId);
        const response = await axios.post(`https://rv0femjg65.execute-api.us-east-1.amazonaws.com/default/delete_templates?jobId=${jobid}&templateId=${templateId}`);
        console.log(response);
        console.log(`Deleted successfully.`);
        fetchTemplates();
      } catch (error) {
        console.error('Error deleting template:', error);
      }
    }
  };


  return (
    <div className="templates-container">
      <div className="portal-header-container">
        <h1 className="recruiting-portal-header">Templates</h1>
        <input
          type="text"
          placeholder="Search by template ID or job ID"
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
              <div className="template-detail"><strong>Template ID:</strong> {template["Template ID"]}</div>
              <div className="template-detail"><strong>Created On:</strong> {template["Created On"] || 'Not Available'}</div>
            </div>
            <div className="button-container">
              <button
                className="delete-button"
                onClick={(e) => handleDelete(template["Job ID"], template["Template ID"], e)}
              >
                Delete
              </button>
              <button
                className={`toggle-default ${defaultTemplateId === template["Template ID"] ? 'active' : ''}`}
                onClick={(event) => toggleDefaultTemplate(event, template["Template ID"])}
              >
                {defaultTemplateId === template["Template ID"] ? 'Remove Default' : 'Set Default'}
              </button>
            </div>


          </div>
        ))}
      </div>
    </div>
  );
}

export default Templates;
