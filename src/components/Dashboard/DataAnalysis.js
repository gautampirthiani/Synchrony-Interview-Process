// src/components/Dashboard/DataAnalyis.js
import React from "react";
import { Link } from "react-router-dom";
import logoImage from './synchrony-logo-1.png'
import './DataAnalysis.css'
import Navbar from "../Navbar";




function DataAnalysis() {
  return(
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
            <h3>Filters</h3>
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
              <select className="selection-box">
                <option value="select1">Select 1</option>
                <option value="select2">Select 2</option>
              </select>
            </div>
          </div>
          {/* Add more content here if needed */}
        </div>
        <div className="right-column">
          <div className="stats-container">
            <div className="stat-box">Average candidacy length: 3 weeks</div>
            <div className="stat-box">Total open positions: 4</div>
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





function DataAnalysis_old1() {

  return(
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
