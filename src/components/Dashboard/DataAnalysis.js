import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import '../Styles/DataAnalysis.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function DataAnalysis() {
  const [totalOpenPositions, setTotalOpenPositions] = useState(0);
  const [usernames, setUsernames] = useState([]);
  const [jobData, setJobData] = useState([]);
  const [selectedJob, setSelectedJob] = useState('');
  const [interviewsForSelectedJob, setInterviewsForSelectedJob] = useState(0);
  const [flashInterviewCount, setFlashInterviewCount] = useState(false);
  const [chartData, setChartData] = useState({
    labels: ['Code', 'DSA', 'Data Science', 'Algorithms', 'Marketing', 'Human Resources'], 
    datasets: [
      {
        label: 'Department Interviews',
        backgroundColor: 'rgba(255,99,132,0.2)',
        borderColor: 'rgba(255,99,132,1)',
        borderWidth: 2,
        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
        hoverBorderColor: 'rgba(255,99,132,1)',
        data: [],
      }
    ]
  });

  const barChartOptions = {
    scales: {
      x: {
        type: 'category',
      },
      y: {
        beginAtZero: true,
      }
    }
  };

  const updateChartData = async () => {
    try {
      const jobIDs = ['111111', '222', '1729', '666', 'MarketingTest', '798'];
      const interviewCountsForBarChart = await Promise.all(
        jobIDs.map(jobID => fetchInterviewCountForBarChart(jobID))
      );

      setChartData(prevChartData => ({
        ...prevChartData,
        datasets: [{
          ...prevChartData.datasets[0],
          data: interviewCountsForBarChart,
        }]
      }));
    } catch (error) {
      console.error('Error updating chart data:', error);
    }
  };

  useEffect(() => {
    updateChartData();
  }, []);

  useEffect(() => {
    console.log('Updated chart data:', chartData);
  }, [chartData]);

  useEffect(() => {
    fetch('https://rv0femjg65.execute-api.us-east-1.amazonaws.com/default/getDataAnalytics_totalJobs1')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setTotalOpenPositions(data.Count);
        console.log('FETCHED: ', data.Count);
      })
      .catch(error => {
        console.error('Error fetching total open positions:', error);
      });
  }, []);

  useEffect(() => {
    fetch('https://rv0femjg65.execute-api.us-east-1.amazonaws.com/default/getDataAnalytics_getUsernames2')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setUsernames(data.usernames);
      })
      .catch(error => {
        console.error('Error fetching usernames:', error);
      });
  }, []);

  useEffect(() => {
    fetch('https://rv0femjg65.execute-api.us-east-1.amazonaws.com/default/getDataAnalytics_getJobPositions1')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {        
        setJobData(data.job_data);
      })
      .catch(error => {
        console.error('Error fetching job_data:', error);
      });
  }, []);

  const applyFilters = () => {
    // Add code to apply filters here
  }

  const handleJobChange = (event) => {
    setSelectedJob(event.target.value);
    fetchInterviewCountForSelectedJob(event.target.value);
    setFlashInterviewCount(true);
    setTimeout(() => {
      setFlashInterviewCount(false);
    }, 1000);
  };

  useEffect(() => {
    console.log('Selected job set as:', selectedJob);
  }, [selectedJob]);

  const fetchInterviewCountForSelectedJob = (jobID) => {
    fetch(`https://rv0femjg65.execute-api.us-east-1.amazonaws.com/default/getDataAnalytics_getInterviewCountForJobID1?jobID=${jobID}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setInterviewsForSelectedJob(data.interviewCount);
      })
      .catch(error => {
        console.error('Error fetching interview count for selected job:', error);
      });
  };

  const fetchInterviewCountForBarChart = async (jobID) => {
    try {
      const response = await fetch(`https://rv0femjg65.execute-api.us-east-1.amazonaws.com/default/getDataAnalytics_getInterviewCountForJobID1?jobID=${jobID}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('FETCHED interview count for selected job:', data.interviewCount);
      return data.interviewCount; 
    } catch (error) {
      console.error('Error fetching interview count for selected job:', error);
      return 0; // error return
    }
  };

  return (
    <div className="data-analysis-container">
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

            <div className="filter-option">
              <h4>Job Position</h4>
              <select className="selection-box" value={selectedJob} onChange={handleJobChange}>
                <option value="">Select a job</option>
                {jobData.map((job, index) => (
                  <option key={index} value={job.jobID}>{job.jobName}</option>
                ))}
              </select>
            </div>

          </div>
          <button className="apply-button" onClick={applyFilters}>Apply Filters</button>
        </div>
        <div className="right-column">
          <div className="stats-container">
            <div className="stat-box">Average candidacy length: 2 weeks</div>
            <div className="stat-box">Total open positions: {totalOpenPositions}</div>
            <div className={`stat-box ${flashInterviewCount ? 'flash-interview-count' : ''}`}>Total interviews for selected job: {interviewsForSelectedJob}</div>
          </div>
          <div className="graph-container">
            <Bar data={chartData} options={barChartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DataAnalysis;