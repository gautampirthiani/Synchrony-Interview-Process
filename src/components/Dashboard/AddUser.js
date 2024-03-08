import React, { useState, useEffect } from 'react';
import './AddUserForm.css';
import logo from '/Users/damianmiskow/Desktop/VSCode/Synchrony-Interview-Process/src/components/Synch_logo.png';

function AddUserForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [departments, setDepartments] = useState([]);
  const [department, setDepartment] = useState('');
  const [customDepartment, setCustomDepartment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchDepartments() {
      const apiEndpoint = 'https://h60ydhn92g.execute-api.us-east-1.amazonaws.com/dev/GetDepartmantList';
      try {
        const response = await fetch(apiEndpoint, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setDepartments(data);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    }

    fetchDepartments();
  }, []);

  const handleDepartmentChange = (e) => {
    const { value } = e.target;
    setDepartment(value);
    if (value === 'add-new') {
      setCustomDepartment('');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage('');

    const effectiveDepartment = department === 'add-new' ? customDepartment : department;
    const apiEndpoint = 'https://h60ydhn92g.execute-api.us-east-1.amazonaws.com/dev/PullData';
    const userData = JSON.stringify({
      username: username,
      password: password,
      email: email,
      department: effectiveDepartment,
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
      setMessage("User Successfully Created");
      setUsername('');
      setPassword('');
      setEmail('');
      setDepartment('');
      setCustomDepartment('');
    } catch (error) {
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
            onChange={handleDepartmentChange}
            required
            className="form-input"
          >
            <option value="">Select a Department</option>
            {departments.map((dept, index) => (
              <option key={index} value={dept}>
                {dept}
              </option>
            ))}
            <option value="add-new">Add New Department</option>
          </select>
          {department === 'add-new' && (
            <input
              type="text"
              placeholder="Enter new department"
              value={customDepartment}
              onChange={(e) => setCustomDepartment(e.target.value)}
              required={department === 'add-new'}
              className="form-input"
            />
          )}
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
