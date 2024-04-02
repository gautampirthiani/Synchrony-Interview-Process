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
  const [showCustomDepartmentField, setShowCustomDepartmentField] = useState(false);
  const [users, setUsers] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    async function fetchDepartments() {
      const apiEndpoint = 'https://h60ydhn92g.execute-api.us-east-1.amazonaws.com/dev/GetDepartmantList';
      try {
        const response = await fetch(apiEndpoint);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setDepartments(data);
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchDepartments();
  }, []);

  useEffect(() => {
    async function fetchData() {
      const apiEndpoint = 'https://h60ydhn92g.execute-api.us-east-1.amazonaws.com/dev/PullData';
      try {
        const response = await fetch(apiEndpoint);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchDepartmentList() {
      const apiEndpoint = 'https://h60ydhn92g.execute-api.us-east-1.amazonaws.com/dev/GetDepartment';
      try {
        const response = await fetch(apiEndpoint);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setDepartmentList(data);
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchDepartmentList();
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage('');

    const effectiveDepartments = [...selectedDepartments];
    if (customDepartment) {
      effectiveDepartments.push(customDepartment);
      setCustomDepartment('');
    }

    const apiEndpoint = 'https://h60ydhn92g.execute-api.us-east-1.amazonaws.com/dev/PullData';
    const userData = JSON.stringify({
      username: username.toLowerCase(),
      password: password,
      email: email,
      department: effectiveDepartments,
    });

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
    setShowCustomDepartmentField(false);
    setIsLoading(false);
  };

  const handleDeleteUser = async (usernameToDelete) => {
    const deleteUserEndpoint = 'https://h60ydhn92g.execute-api.us-east-1.amazonaws.com/dev/DeleteUser';
    try {
      const response = await fetch(deleteUserEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: usernameToDelete }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedUsers = users.filter(user => user.username !== usernameToDelete);
      setUsers(updatedUsers);
      setNotification("User Deleted Successfully");
      setTimeout(() => {
        setNotification('');
      }, 3000);
    } catch (error) {
      console.error('Error deleting user:', error.message);
      setMessage("Error deleting user");
    }
  };

  const handleDeleteDepartment = async (departmentNameToDelete) => {
    const deleteDepartmentEndpoint = 'https://h60ydhn92g.execute-api.us-east-1.amazonaws.com/dev/DeleteDepartment';
    try {
      const response = await fetch(deleteDepartmentEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ department_name: departmentNameToDelete }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedDepartments = departmentList.filter(department => department.department !== departmentNameToDelete);
      setDepartmentList(updatedDepartments);
      setNotification("Department Deleted Successfully");
      setTimeout(() => {
        setNotification('');
      }, 3000);
    } catch (error) {
      console.error('Error deleting department:', error.message);
      setMessage("Error deleting department");
    }
  };

  return (
    <div className="body-container">
      <div className="logo-container">
        <img src={logo} alt="Synchrony Logo" className="logo" />
      </div>
      <div className="content-container">
        <div className="form-container">
          <h2>Add Users</h2>
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
              {showCustomDepartmentField && (
                <div className="dynamic-department">
                  <input
                    type="text"
                    placeholder="Enter new department"
                    value={customDepartment}
                    onChange={(e) => setCustomDepartment(e.target.value)}
                    className="form-input"
                  />
                </div>
              )}
              <button type="button" onClick={() => setShowCustomDepartmentField(true)} className="add-btn">
                Create New Department
              </button>
            </div>
            <button type="submit" className="form-button" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Submit'}
            </button>
            {message && <div className={message.startsWith('ERROR') ? 'error-message' : 'success-message'}>{message}</div>}
          </form>
        </div>
        <div className="table-container">
          <div className="user-table">
            <h2>User Table</h2>
            <table>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Departments</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={index}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.department ? user.department.join(', ') : ''}</td>
                    <td><button className="delete-btn" onClick={() => handleDeleteUser(user.username)}>Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="department-table">
            <h2>Department Table</h2>
            <table>
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Users</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {departmentList.map((department, index) => (
                  <tr key={index}>
                    <td>{department.department}</td>
                    <td>{department.users ? department.users.join(', ') : ''}</td>
                    <td><button className="delete-btn" onClick={() => handleDeleteDepartment(department.department)}>Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {notification && <div className="notification">{notification}</div>}
    </div>
  );
}

export default AddUserForm;
