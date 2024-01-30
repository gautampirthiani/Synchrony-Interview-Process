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
      <div className="portal-header-container">
        <h1 className="data-analysis-header">Data Analysis</h1>
      </div>
      
      <div className="data-analysis-main">
        Placeholder...
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
