// NewTemplates.js


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logoImage from './synchrony-logo-1.png'; 
import './NewTemplates.css'; 
import Navbar from '../Navbar';
import { Link } from 'react-router-dom';

function NewTemplates() {
    const [positions, setPositions] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [selectedPosition, setSelectedPosition] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // State hook for managing question and answer pairs
    const [additionalInputs, setAdditionalInputs] = useState(
        Array(5).fill({ input1: '', input2: '' })
    );

    // Handler for input change
    const handleAdditionalInputChange = (index, key, value) => {
        setAdditionalInputs(inputs =>
            inputs.map((input, i) => (i === index ? { ...input, [key]: value } : input))
        );
    };
    // Submit handler that prevents default form submission
    const handleSubmit = (event) => {
        event.preventDefault(); 
        if (window.confirm('Submit?')) {
            console.log('Submitted Inputs:', additionalInputs);
        } else {
            console.log('Submit Fail');
        }
    };
    // Function to add a new pair Q&A
    const addInputPair = () => {
        setAdditionalInputs([...additionalInputs, { input1: '', input2: '' }]);
      };
      // Function to Remove a new pair Q&A
      const removeInputPair = (index) => {
        setAdditionalInputs(inputs => inputs.filter((_, i) => i !== index));
    };
    

    useEffect(() => {
        const fetchPositions = async () => {
            try {
                const { data } = await axios.get('/api/positions');
                setPositions(data);
            } catch (error) {
                console.error('Error fetching positions:', error);
            }
        };

        fetchPositions();
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSelectPosition = async (positionId) => {
        setSelectedPosition(positionId);
        try {
            const { data } = await axios.get(`/api/templates?positionId=${positionId}`);
            setTemplates(data);
        } catch (error) {
            console.error('Error fetching templates:', error);
        }
    };

    // Function to clone a template
    const handleCloneTemplate = async (templateId) => {
        // Clone template logic
    };

    // Function to create a new template
    const handleCreateTemplate = async (positionId) => {
        // Create new template logic
    };

    return (
        <div className="new-templates-container">
            <div className="header">
                <Link to="/">
                    <img src={logoImage} alt="Synchrony Logo" className="logo" />
                </Link>
                <Navbar />
            </div>
            <div className="portal-header-container">
                <h1 className="recruiting-portal-header">New Templates</h1>
            </div>
            <button onClick={addInputPair}>Add Question & Answer</button>

            <button id="save-new-templates-btn" onClick={handleSubmit}>Submit</button>


            {/*循环渲染五组输入框*/}
            {additionalInputs.map((input, index) => (
                <div key={index} className="additional-inputs-container">
                    <input
                        type="text"
                        placeholder="Question"
                        value={input.input1}
                        onChange={(e) => handleAdditionalInputChange(index, 'input1', e.target.value)}
                        className="additional-input"
                    />
                    <input
                        type="text"
                        placeholder="Answer"
                        value={input.input2}
                        onChange={(e) => handleAdditionalInputChange(index, 'input2', e.target.value)}
                        className="additional-input"
                    />
                    <button onClick={() => removeInputPair(index)}>Delete</button>
                </div>
            ))}

            <div className="positions-container">
                {positions
                    .filter((position) =>
                        position.title.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((position) => (
                        <div
                            key={position.id}
                            className="position-item"
                            onClick={() => handleSelectPosition(position.id)}
                        >
                            {position.title}
                        </div>
                    ))}
            </div>
            {selectedPosition && (
                <div className="templates-container">
                    {templates.map((template) => (
                        <div key={template.id} className="template-item">
                            <div className="template-title">{template.title}</div>
                            <div className="template-actions">
                                <button onClick={() => handleCloneTemplate(template.id)}>Clone</button>
                                <button onClick={() => handleCreateTemplate(selectedPosition)}>Create New</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default NewTemplates;