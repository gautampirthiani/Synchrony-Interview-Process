import React, { useState } from 'react';
import './AddUserForm.css';
import logo from '/Users/damianmiskow/Desktop/VSCode/Synchrony-Interview-Process/src/components/Synch_logo.png';

function AddUserForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage('');

    const apiEndpoint = 'https://h60ydhn92g.execute-api.us-east-1.amazonaws.com/dev/PullData';
    const userData = JSON.stringify({
      username: username,
      password: password,
      email: email,
      department: department,
    });

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: userData, 
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const body = await response.json();
      console.log('Success:', body);
      setMessage("User Successfully Created");
      setUsername('');
      setPassword('');
      setEmail('');
      setDepartment('');
    } catch (error) {
      console.error('Error:', error);
      setMessage(`ERROR: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="body-container">
      <div className="logo-container">
        <img src={logo} alt="Synchrony Logo" className="logo" />
      </div>
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label htmlFor="username" className="form-label">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password" className="form-label">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email" className="form-label">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="department" className="form-label">Department:</label>
          <select
            id="department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
            className="form-input"
          >
            <option value="">Select a Department</option>
            <option value="Cybersecurity">Cybersecurity</option>
            <option value="Software Development">Software Development</option>
          </select>
        </div>
        <button type="submit" className="form-button" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Submit'}
        </button>
        {message && <div className={message.startsWith('ERROR') ? 'error-message' : 'success-message'}>{message}</div>}
      </form>
    </div>
  );
}

export default AddUserForm;
