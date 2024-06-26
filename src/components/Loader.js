import React from 'react';
import './Styles/Loader.css'; 

const Loader = () => (
  <div className="lds-roller">
    {[...Array(8)].map((_, index) => (
      <div key={index} />
    ))}
  </div>
);

export default Loader;
