import React, { useState, useEffect } from 'react';
import './AddUser.css';
import logo from './synchrony-logo-1.png';

function AddUserForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [departments, setDepartments] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
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

  const handleDepartmentChange = (index) => (e) => {
    const newDepartments = [...selectedDepartments];
    newDepartments[index] = e.target.value;
    setSelectedDepartments(newDepartments);
  };

  const addDepartmentField = () => {
    setSelectedDepartments([...selectedDepartments, '']);
  };

  const removeDepartmentField = (index) => () => {
    const newDepartments = selectedDepartments.filter((_, i) => i !== index);
    setSelectedDepartments(newDepartments);
  };

  const createNewDepartment = async () => {
    if (customDepartment) {
      try {
        const response = await fetch('YOUR_CREATE_DEPARTMENT_API_ENDPOINT', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ departmentName: customDepartment }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Assuming successful creation, add the new department to the list of departments
        setDepartments([...departments, customDepartment]);
        setCustomDepartment('');
      } catch (error) {
        console.error('Error creating department:', error);
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage('');

    const effectiveDepartments = [...selectedDepartments];
    if (customDepartment) effectiveDepartments.push(customDepartment);

    const apiEndpoint = 'https://h60ydhn92g.execute-api.us-east-1.amazonaws.com/dev/PullData';
    const userData = JSON.stringify({
      username: username,
      password: password,
      email: email,
      department: effectiveDepartments,
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

      setMessage("User Successfully Created");
      setUsername('');
      setPassword('');
      setEmail('');
      setSelectedDepartments([]);
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
          <label className="form-label">Departments:</label>
          {selectedDepartments.map((department, index) => (
            <div key={index} className="dynamic-department">
              <select
                value={department}
                onChange={handleDepartmentChange(index)}
                required
                className="form-input"
              >
                <option value="">Select a Department</option>
                {departments.map((dept, i) => (
                  <option key={i} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              <button type="button" onClick={removeDepartmentField(index)} className="remove-btn">Remove</button>
            </div>
          ))}
          <button type="button" onClick={addDepartmentField} className="add-btn">Add Department</button>
          <div className="dynamic-department">
            <input
              type="text"
              placeholder="Enter new department"
              value={customDepartment}
              onChange={(e) => setCustomDepartment(e.target.value)}
              className="form-input"
            />
            <button type="button" onClick={createNewDepartment} className="add-btn">Create New Department</button>
          </div>
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