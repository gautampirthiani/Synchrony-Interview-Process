import React, { useState } from 'react';
import './AddUserForm.css'; 
import logo from '/Users/damianmiskow/Desktop/VSCode/Synchrony-Interview-Process/src/components/synchrony-logo-1.png'; 

function AddUserForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    const apiEndpoint = 'https://le6xxlisoj.execute-api.us-east-1.amazonaws.com/dev/Synchrony';
    const userData = {
      "username": username,
      "password": password,
      "email": email
    };

    fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
    .then(response => response.json().then(data => ({status: response.status, body: data})))
    .then(({status, body}) => {
      if(status === 200) {
        console.log('Success:', body);
        alert("User Successfully Created");
      } else {
        console.error('Error:', body.message);
        alert(`ERROR: ${body.message}`);
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert("ERROR: An error occurred while trying to create the user.");
    });
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
        <button type="submit" className="form-button">Submit</button>
      </form>
    </div>
  );
}

export default AddUserForm;
