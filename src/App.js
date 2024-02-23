import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import HomePage from './components/HomePage';
import Interviews from './components/Dashboard/Interviews';
import NewInterview from './components/Dashboard/NewInterview';
import EditTemplates from './components/Dashboard/EditTemplates';
import InterviewDetails from './components/InterviewDetails';
import PositionTemplate from './components/PositionTemplate';
import DataAnalysis from './components/Dashboard/DataAnalysis';
import NewTemplates from './components/NewTemplates';
import Templates from './components/templates';
import AddUser from './components/Dashboard/AddUser';


import './App.css';

function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <Router>
          <div>
            {/* Example sign-out button, you can place it wherever it makes sense in your UI */}
            <button onClick={signOut} style={{ position: 'fixed', top: 0, right: 0 }}>Sign Out</button>
          </div>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard/interviews" element={<Interviews />} />
            <Route path="/dashboard/New-interview" element={<NewInterview />} />
            <Route path="/dashboard/edit-templates" element={<EditTemplates />} />
            <Route path="/interview-details/:interviewID" element={<InterviewDetails />} />
            <Route path="/position-details/:JobID" element={<PositionTemplate />} />
            <Route path="/dashboard/new-templates" element={<NewTemplates />} />
            <Route path="/dashboard/data-analysis" element={<DataAnalysis />} />
            <Route path="/dashboard/templates/:JobID" element={<Templates />} />
            <Route path="/dashboard/New-templates/:JobID/:templateID" element={<NewTemplates />} />
            <Route path="/dashboard/New-templates/:JobID" element={<NewTemplates />} />
            <Route path="/dashboard/AddUser" element={<AddUser />} /> 
          </Routes>
        </Router>
      )}
    </Authenticator>
  );
}

export default App;
