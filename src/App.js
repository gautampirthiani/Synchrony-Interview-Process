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
import NewTemplates from './components/Dashboard/NewTemplates';
import DataAnalysis from './components/Dashboard/DataAnalysis';

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
      </Routes>
    </Router>
  );
}

export default App;
