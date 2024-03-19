import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import HomePage from './components/HomePage';
import Interviews from './components/Dashboard/Interviews';
import NewInterview from './components/Dashboard/NewInterview';
import EditTemplates from './components/Dashboard/EditTemplates';
import InterviewDetails from './components/Interviews/InterviewDetails';
import DataAnalysis from './components/Dashboard/DataAnalysis';
import UpdateTemplates from './components/EditTemplates/UpdateTemplates';
import ConductInterview from './components/NewInterview/ConductInterview';
import JobInterviews from './components/Interviews/JobInterviews';
import AddUser from './components/Dashboard/AddUser';

import './App.css';

function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <>
          <Router>
            <div className="auth-wrapper">
              <div className="top-bar">
                <span className="welcome-message">Welcome, {user?.username}</span>
                <button onClick={signOut} className="sign-out-button">Sign Out</button>
              </div>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/dashboard/interviews" element={<Interviews />} />
                <Route path="/dashboard/new-interview" element={<NewInterview />} />
                <Route path="/dashboard/edit-templates" element={<EditTemplates />} />
                <Route path="/interview-details/:interviewId" element={<InterviewDetails />} />
                <Route path="/new-interview/conduct-interview/:jobId" element={<ConductInterview />} />
                <Route path="/dashboard/data-analysis" element={<DataAnalysis />} />
                <Route path="/dashboard/update-templates/:jobId/:templateId" element={<UpdateTemplates />} />
                <Route path="/interviews/job-interviews/:jobId/:jobPosition" element={<JobInterviews />} />
                <Route path="/dashboard/AddUser" element={<AddUser />} />
              </Routes>
            </div>
          </Router>
        </>
      )}
    </Authenticator>
  );
}

export default App;
