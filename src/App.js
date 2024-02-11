// src/App.js
import React from 'react';
//import { useState } from 'react';   // commented because not used
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import Interviews from './components/Dashboard/Interviews';
import NewInterview from './components/Dashboard/NewInterview';
import EditTemplates from './components/Dashboard/EditTemplates';
import InterviewDetails from './components/InterviewDetails';
import PositionTemplate from './components/PositionTemplate';
import DataAnalysis from './components/Dashboard/DataAnalysis';
import NewTemplates from './components/NewTemplates';
import Templates from './components/templates';
import UpdateTemplates from './components/UpdateTemplates';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard/interviews" element={<Interviews />} />
        <Route path="/dashboard/New-interview" element={<NewInterview />} />
        <Route path="/dashboard/edit-templates" element={<EditTemplates />} />
        <Route path="/interview-details/:interviewID" element={<InterviewDetails />} />
        <Route path="/position-details/:JobID" element={<PositionTemplate />} />
        <Route path="/dashboard/new-templates" element = {<NewTemplates />} />
        <Route path="/dashboard/data-analysis" element = {<DataAnalysis />} />
        <Route path="/dashboard/templates/:JobID" element={<Templates />} />
        <Route path="/dashboard/Update-templates/:JobID/:templateID" element={<UpdateTemplates />} /> 
        <Route path="/dashboard/New-templates/:jobId" element={<NewTemplates />} />
      </Routes>
    </Router>
  );
}

export default App;
