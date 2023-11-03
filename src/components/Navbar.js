// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div style={{ backgroundColor: 'yellow', fontWeight: 'bold' }}>
      <h1>Synchrony</h1>
      <nav>
        <Link to="/dashboard/interviews">Interviews</Link>
        <Link to="/dashboard/new-interview">New Interview</Link>
        <Link to="/dashboard/data-visualization">Data Visualization</Link>
      </nav>
    </div>
  );
};

export default Navbar;
