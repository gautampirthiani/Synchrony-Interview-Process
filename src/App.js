// src/App.js
import React from 'react';
//import { useState } from 'react';   // commented because not used
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import Interviews from './components/Dashboard/Interviews';
import NewInterview from './components/Dashboard/NewInterview';
import EditTemplates from './components/Dashboard/EditTemplates';
import InterviewDetails from './components/Interviews/InterviewDetails';
import DataAnalysis from './components/Dashboard/DataAnalysis';
import NewTemplates from './components/EditTemplates/NewTemplates';
import Templates from './components/EditTemplates/templates';
import UpdateTemplates from './components/EditTemplates/UpdateTemplates';
import ConductInterview from './components/NewInterview/ConductInterview';
import JobInterviews from './components/Interviews/JobInterviews';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard/interviews" element={<Interviews />} />
        <Route path="/dashboard/New-interview" element={<NewInterview />} />
        <Route path="/dashboard/edit-templates" element={<EditTemplates />} />
        <Route path="/interview-details/:interviewId" element={<InterviewDetails />} />
        <Route path="/new-interview/conduct-interview/:jobId" element={<ConductInterview />} />
        <Route path="/dashboard/new-templates" element = {<NewTemplates />} />
        <Route path="/dashboard/data-analysis" element = {<DataAnalysis />} />
        <Route path="/dashboard/templates/:JobID" element={<Templates />} />
        <Route path="/dashboard/update-templates/:jobId/:templateId" element={<UpdateTemplates />} /> 
        <Route path="/dashboard/new-templates/:jobId" element={<NewTemplates />} />
        <Route path="/interviews/job-interviews/:jobId/:jobPosition" element={<JobInterviews />} />
      </Routes>
    </Router>
  );
}

export default App;