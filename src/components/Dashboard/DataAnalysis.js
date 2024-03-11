// src/components/Dashboard/DataAnalyis.js
//import React from "react";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logoImage from './synchrony-logo-1.png'
import './DataAnalysis.css'
import Navbar from "../Navbar";




function DataAnalysis() {

  // State to store total open positions
  const [totalOpenPositions, setTotalOpenPositions] = useState(0);

  // State to store a list of usernames from the dynamoDB table Users
  const [usernames, setUsernames] = useState([]);

  // Fetch total open positions from API
  useEffect(() => {
    fetch('https://rv0femjg65.execute-api.us-east-1.amazonaws.com/default/getDataAnalytics_totalJobs1')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json(); // This already parses the JSON response
      })
      .then(data => {
        // Assuming the JSON object has a property 'Count'
        setTotalOpenPositions(data.Count);
        console.log('FETCHED: ', data.Count);
      })
      .catch(error => {
        console.error('Error fetching total open positions:', error);
      });
  }, []); // Empty dependency array means this effect runs only once after the initial render

  // Fetch usernames from API
  useEffect(() => {
    fetch('https://rv0femjg65.execute-api.us-east-1.amazonaws.com/default/getDataAnalytics_getUsernames2')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json(); // This already parses the JSON response
      })
      .then(data => {
        setUsernames(data.usernames); // Assuming the Lambda returns an object with a usernames array
        // old way of doing things below
        // Assuming the JSON object has a property 'Items'
        //setUsernames(data.Items.map(item => item.username.S));
      })
      .catch(error => {
        console.error('Error fetching usernames:', error);
      });
  }, []); // Empty dependency array means this effect runs only once after the initial render


  // Function to apply filters
  const applyFilters = () => {
    // Add code to apply filters here
  }

  return (
    <div className="data-analysis-container">
      <div className="header">
        <Link to="/">
          <img src={logoImage} alt="Synchrony Logo" className="logo" />
        </Link>
        <Navbar />
      </div>
      <div className="data-analysis-header-container">
        <h1 className="data-analysis-header">Data Analytics Dashboard</h1>
      </div>
      <div className="content-container">
        <div className="left-column">
          <div className="search-container">
            <input
              type="text"
              placeholder="What would you like to know?"
              className="search-bar"
            />
          </div>
          <div className="filter-section">
            <h3>Filter</h3>
            <div className="filter-option">
              <label>
                <input type="radio" name="filter" value="option1" /> Option 1
              </label>
            </div>
            <div className="filter-option">
              <label>
                <input type="radio" name="filter" value="option2" /> Option 2
              </label>
            </div>
            <div className="filter-option">
              <input type="range" min="1" max="100" className="slider" />
            </div>
            <div className="filter-option">
              <h4>Username</h4>
              <select className="selection-box">
                {usernames.map((username, index) => (
                  <option key={index} value={username}>{username}</option>
                ))}
              </select>

            </div>
          </div>
          {/* Add more content here if needed */}
          <button className="apply-button" onClick={applyFilters}>Apply Filters</button>
        </div>
        <div className="right-column">
          <div className="stats-container">
            <div className="stat-box">Average candidacy length: 2 weeks</div>
            <div className="stat-box">Total open positions: {totalOpenPositions}</div>
            <div className="stat-box">Total interviews: 33</div>
            {/* More stat boxes as needed */}
          </div>
          <div className="graph-container">
            {/* Graph will go here */}
            Chart goes here and will update in real time based upon filter and option selection in left column.
          </div>
        </div>
      </div>
    </div>
  )
}


//////////////////////////////////////// old code
//  <select className="selection-box">
//                <option value="select1">Select 1</option>
//                <option value="select2">Select 2</option>
//  </select>
////////////////////////////////////////



function DataAnalysis_old1() {

  return (
    <div className="data-analysis-container">
      <div className="header">
        <Link to="/">
          <img src={logoImage} alt="Synchrony Logo" className="logo" />
        </Link>
        <Navbar />
      </div>
      <div className="data-analysis-header-container">
        <h1 className="data-analysis-header">Data Analysis Dashboard</h1>
      </div>
      <div className="search-container">
        <input
          type="text"
          placeholder="What would you like to know?"
          className="search-bar"
        />
      </div>
      <div className="data-analysis-main">
        Placeholder
      </div>
    </div>
  )
}

export default DataAnalysis;


// import React from 'react';
// import Navbar from '../Navbar';

// const DataAnalysis = () => {
//   return (
//     <div>
//       <h2>Data Analysis Dashboard</h2>
//       {/* Visualization will be added here */}
//     </div>
//   );
// };

// export default DataAnalysis;
