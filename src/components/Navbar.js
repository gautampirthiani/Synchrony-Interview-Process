import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; 

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul className="navbar-nav">
        <li><Link to="/dashboard/interviews">Interviews</Link></li>
        <li><Link to="/dashboard/new-interview">New Interview</Link></li>
        <li><Link to="/dashboard/edit-templates">Edit Templates</Link></li>
        <li><Link to="/dashboard/data-analysis">Data Analysis</Link></li>
        <li><Link to="/add-user">Add User</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
