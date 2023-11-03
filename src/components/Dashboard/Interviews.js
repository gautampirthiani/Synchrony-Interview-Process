// src/components/Dashboard/Interviews.js
import React, { useEffect, useState } from 'react';

const Interviews = () => {
  const [interviews, setInterviews] = useState([]);

  useEffect(() => {
    // Fetch data from backend
    async function fetchData() {
      const response = await fetch('/api/interviews'); // Backend API endpoint
      const data = await response.json();
      setInterviews(data);
    }

    fetchData();
  }, []);

  return (
    <div>
      <h2>All Interviews</h2>
      {interviews.map((interview, index) => (
        <div key={index}>
          {/* Display interview data here */}
        </div>
      ))}
    </div>
  );
};

export default Interviews;
