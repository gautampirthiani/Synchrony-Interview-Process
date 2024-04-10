import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
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
import AddUser from './components/AddUser';
import './App.css';
import logo from './components/synchrony-logo-1.png';

function App() {
  return (
    <Authenticator hideSignUp>
      {({ signOut, user }) => (
        <Router>
          <div className="auth-wrapper">
            <nav className="navbar">
              <img src={logo} alt="Company Logo" className="company-logo" />
              <ul className="navbar-nav">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/dashboard/interviews">Interviews</Link></li>
                <li><Link to="/dashboard/new-interview">New Interview</Link></li>
                <li><Link to="/dashboard/edit-templates">Edit Templates</Link></li>
                <li><Link to="/dashboard/data-analysis">Data Analysis</Link></li>
                {user?.username === 'admin' && (
                  <li><Link to="/add-user">Manage Users</Link></li>
                )}
              </ul>
              <span className="welcome-message">Welcome, {user?.username}</span>
              <button onClick={signOut} className="sign-out-button">Sign Out</button>
            </nav>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/dashboard/interviews" element={<Interviews />} />
              <Route path="/dashboard/new-interview" element={<NewInterview />} />
              <Route path="/dashboard/edit-templates" element={<EditTemplates />} />
              <Route path="/interview-details/:interviewId" element={<InterviewDetails />} />
              <Route path="/new-interview/conduct-interview/:jobId" element={<ConductInterview />} />
              <Route path="/dashboard/new-templates" element={<NewTemplates />} />
              <Route path="/dashboard/data-analysis" element={<DataAnalysis />} />
              <Route path="/dashboard/templates/:JobID" element={<Templates />} />
              <Route path="/dashboard/update-templates/:jobId/:templateId" element={<UpdateTemplates />} />
              <Route path="/dashboard/new-templates/:jobId" element={<NewTemplates />} />
              <Route path="/interviews/job-interviews/:jobId/:jobPosition" element={<JobInterviews />} />
              {user?.username === 'admin' && (
                <Route path="/add-user" element={<AddUser />} />
              )}
            </Routes>
          </div>
        </Router>
      )}
    </Authenticator>
  );
}

export default App;
