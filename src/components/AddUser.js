import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '@aws-amplify/auth';
import './AddUser.css';
import logo from './synchrony-logo-1.png';
import Loader from './Loader';

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
  const [loadingData, setLoadingData] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedDepartmentsUpdate, setSelectedDepartmentsUpdate] = useState([]);

  useEffect(() => {
    getCurrentUser().then(user => {
      setCurrentUser(user);
      fetchInitialData();
    }).catch(error => {
      setCurrentUser(null);
    });
  }, []);

  const fetchInitialData = async () => {
    fetchDepartments();
    fetchData();
    fetchDepartmentList();
  };

  const fetchDepartments = async () => {
    const apiEndpoint = 'https://h60ydhn92g.execute-api.us-east-1.amazonaws.com/dev/GetDepartmantList';
    try {
      const response = await fetch(apiEndpoint);
      const data = await response.json();
      setDepartments(data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchData = async () => {
    const apiEndpoint = 'https://h60ydhn92g.execute-api.us-east-1.amazonaws.com/dev/PullData';
    try {
      const response = await fetch(apiEndpoint);
      const data = await response.json();
      setUsers(data);
      setLoadingData(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchDepartmentList = async () => {
    const apiEndpoint = 'https://h60ydhn92g.execute-api.us-east-1.amazonaws.com/dev/GetDepartment';
    try {
      const response = await fetch(apiEndpoint);
      const data = await response.json();
      setDepartmentList(data);
    } catch (error) {
      console.log(error.message);
    }
  };

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

  const toggleUpdateModal = () => {
    setIsUpdateModalOpen(!isUpdateModalOpen);
    if (!isUpdateModalOpen) {
      setSelectedDepartmentsUpdate([]);
    }
  };

  const handleUpdateDepartmentChange = (department) => {
    const index = selectedDepartmentsUpdate.indexOf(department);
    if (index === -1) {
      setSelectedDepartmentsUpdate([...selectedDepartmentsUpdate, department]);
    } else {
      const updatedDepartments = [...selectedDepartmentsUpdate];
      updatedDepartments.splice(index, 1);
      setSelectedDepartmentsUpdate(updatedDepartments);
    }
  };

  const handleUpdate = async (usernameToUpdate) => {
    const apiEndpoint = 'https://h60ydhn92g.execute-api.us-east-1.amazonaws.com/dev/UpdateUser';
    const updateData = JSON.stringify({
      username: usernameToUpdate,
      department: selectedDepartmentsUpdate,
    });

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: updateData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setMessage("User Successfully Updated");
      setTimeout(() => {
        setMessage('');
      }, 3000);
      toggleUpdateModal();
    } catch (error) {
      console.error('Error updating user:', error.message);
      setMessage("Error updating user");
    }
  };

  if (currentUser?.username?.toLowerCase() !== 'admin') {
    return <div className="body-container">You do not have access to this page.</div>;
  }

return (
  <div className="body-container">
    <div className="logo-container">
      <img src={logo} alt="Synchrony Logo" className="logo" />
    </div>
    {loadingData ? (
      <Loader />
    ) : (
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
              <div className="department-buttons">
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
            </div>
            <button type="submit" className="form-button" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Submit'}
            </button>
            {message && <div className={message.startsWith('Error') ? 'error-message' : 'success-message'}>{message}</div>}
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
                  <th>Update</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={index}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.department ? user.department.join(', ') : ''}</td>
                    <td><button className="delete-btn" onClick={() => handleDeleteUser(user.username)}>Delete</button></td>
                    <td><button className="update-btn" onClick={() => { toggleUpdateModal(); setSelectedDepartmentsUpdate(user.department || []); setMessage(`Update User: ${user.username}`); }}>Update</button></td>
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
    )}
    {notification && <div className="notification">{notification}</div>}
    {isUpdateModalOpen && (
      <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={toggleUpdateModal}>&times;</span>
          <h2>Update User: {message.split(": ")[1]}</h2>
          <form onSubmit={(e) => { e.preventDefault(); handleUpdate(message.split(": ")[1]); }}>
            {departments.map((department, index) => (
              <div key={index} className="checkbox-group">
                <input
                  type="checkbox"
                  id={`update-${department}`}
                  value={department}
                  checked={selectedDepartmentsUpdate.includes(department)}
                  onChange={() => handleUpdateDepartmentChange(department)}
                />
                <label htmlFor={`update-${department}`}>{department}</label>
              </div>
            ))}
            <button type="submit" className="update-btn">Update</button>
          </form>
        </div>
      </div>
    )}
  </div>
);

  
}

export default AddUserForm;

