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
import InterviewResult from './components/NewInterview/InterviewResult';
import './App.css';
// Replace './logo.svg' with the path to your actual logo image file
import logo from './components/synchrony-logo-1.png';

function updatePlaceholder() {
  if (document.getElementById("login_img_1")){}
  else{        
      var img = document.createElement('img');
      img.src = "data:image/png;base64,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";
      img.id = "login_img_1";
      img.style.position = 'absolute'; 
      img.style.left = '0'; 
      img.style.top = '0'; 

  document.body.prepend(img);}
}


function App() {
  updatePlaceholder();
  return (
    <Authenticator>
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
                <li><Link to="/add-user">Add User</Link></li>
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
              <Route path="/add-user" element={<AddUser />} />
              <Route path="/interview-result" element={<InterviewResult />} />
            </Routes>
          </div>
        </Router>
      )}
    </Authenticator>
  );
}

export default App;
