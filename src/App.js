// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import Interviews from './components/Dashboard/Interviews';
import NewInterview from './components/Dashboard/NewInterview';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard/interviews" element={<Interviews />} />
        <Route path="/dashboard/New-interview" element={<NewInterview />} />
      </Routes>
    </Router>
  );
}

export default App;
