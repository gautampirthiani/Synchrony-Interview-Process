import React, { useEffect, useState } from 'react';
import './HomePage.css';
import { getCurrentUser } from '@aws-amplify/auth';
import Loader from './Loader'; // Make sure the path to your Loader component is correct

const HomePage = () => {
  const [username, setUsername] = useState('');
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false); // Add a loading state

  var image_1 = document.getElementById("login_img_1");
  image_1.style.display = 'none';


  useEffect(() => {
    setLoading(true); // Start loading
    getCurrentUser()
      .then(user => {
        setUsername(user.username); 
        return fetch('https://h60ydhn92g.execute-api.us-east-1.amazonaws.com/dev/GetDepartment', {
          method: 'Get',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          //body: JSON.stringify({ username: user.username }), 
        });
      })
      .then(response => response.json())
      .then(data => {
        if (data && data.departments) {
          setDepartments(data.departments);
        }
      })
      .catch(error => console.error('Error:', error))
      .finally(() => setLoading(false)); // Stop loading once the data is fetched or an error occurs
  }, []);

  return (
    <div className="homepage-container">
      {loading ? ( // Conditionally render the Loader or the content based on the loading state
        <Loader />
      ) : (
        <>
          <h1 className="homepage-heading">Welcome, {username}!</h1>
          {departments.length > 0 && (
            <div className="welcome-message">
              <h2 className="homepage-heading">Departments:</h2>
              <ul className="departments-list">
                {departments.map((dept, index) => (
                  <li key={index}>{dept}</li>
                ))}
              </ul>
            </div>
          )}
          <h2 className="homepage-heading">Synchrony Interviews</h2>
          <footer className="footer">
            <div className="footer-content"></div>
            <div className="footer-bottom-text">
              &copy; 2023 Synchrony. All Rights Reserved.
            </div>
          </footer>
        </>
      )}
    </div>
  );
};

export default HomePage;

