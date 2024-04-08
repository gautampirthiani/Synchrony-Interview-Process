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
import logoImage from './synchrony-logo-1.png'
import './DataAnalysis.css'
import Navbar from "../Navbar";


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

  // START BAR CHART COMPONENTS ********************************************

  // Bar Chart data
  const barChartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Monthly Sales',
        backgroundColor: 'rgba(255,99,132,0.2)',
        borderColor: 'rgba(255,99,132,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
        hoverBorderColor: 'rgba(255,99,132,1)',
        data: [65, 59, 80, 81, 56, 55, 40] 
      }
    ]
  };

  const barChartOptions = {
    scales: {
      x: { // labels are on the x-axis
        type: 'category',
      },
      y: {
        beginAtZero: true,
      }
    }
  };


  // State to store chart data
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
        data: [], // Initializing as empty array
      }
    ]
  });

  // Fetch the number of interviews for the selected job
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
  const fetchInterviewCountForBarChartOld1 = async (jobID) => {
    fetch(`https://rv0femjg65.execute-api.us-east-1.amazonaws.com/default/getDataAnalytics_getInterviewCountForJobID1?jobID=${jobID}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json(); // This already parses the JSON response
      })
      .then(data => {
        console.log('FETCHED interview count for selected job:', data.interviewCount);
        return data.interviewCount; // This will return the count for the job
      })
      .catch(error => {
        console.error('Error fetching interview count for selected job:', error);
      });
  };

  // Function to update chart data
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
          data: interviewCountsForBarChart, // Updating the data array with fetched counts
        }]
      }));
    } catch (error) {
      console.error('Error updating chart data:', error);
    }
  };

  // useEffect to call updateChartData when component mounts
  useEffect(() => {
    updateChartData();
  }, []);

  useEffect(() => {
    console.log('Updated chart data:', chartData);
  }, [chartData]); //  log when chartData updates

  // END BAR CHART COMPONENTS ********************************************

  // above are all the states and bar chart stuff *************************************************************


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
  }, []);

  useEffect(() => {
    fetch('https://rv0femjg65.execute-api.us-east-1.amazonaws.com/default/getDataAnalytics_getUsernames2')
      .then(response => response.json())
      .then(data => {
        setUsernames(data.usernames);
      })
      .catch(error => {
        console.error('Error fetching usernames:', error);
      });
  }, []);

  useEffect(() => {
    fetch('https://rv0femjg65.execute-api.us-east-1.amazonaws.com/default/getDataAnalytics_getJobPositions1')
      .then(response => response.json())
      .then(data => {
        setJobData(data.job_data);
        console.log('FETCHED job_data :    ', data.job_data);
      })
      .catch(error => {
        console.error('Error fetching job_data:', error);
      });
  }, []);

  const applyFilters = () => {
    // Add code to apply filters here
  }

  // function to fetch number of interviews for each job
  // const fetchInterviewCountForBarChart = () => {
    // Add code to fetch number of interviews for each job here
  //}

  const handleJobChange = (event) => {
    setSelectedJob(event.target.value);
    fetchInterviewCountForSelectedJob(event.target.value);
    setFlashInterviewCount(true);
    setTimeout(() => {
      setFlashInterviewCount(false);
    }, 1000); // 1000 millisec
  };

  useEffect(() => {
    console.log('Selected job set as:', selectedJob);
  }, [selectedJob]);

  const fetchInterviewCountForSelectedJob = (jobID) => {
    fetch(`https://rv0femjg65.execute-api.us-east-1.amazonaws.com/default/getDataAnalytics_getInterviewCountForJobID1?jobID=${jobID}`)
      .then(response => response.json())
      .then(data => {
        console.log('FETCHED interview count for selected job:', data.interviewCount);
        setInterviewsForSelectedJob(data.interviewCount);
      })
      .catch(error => {
        console.error('Error fetching interview count for selected job:', error);
      });
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
            {/* Graph will go here */}
            {/* Chart goes here and will update in real time based upon filter and option selection in left column. */}
            {/* <Bar data={barChartData} options={barChartOptions} /> */}
            <Bar data={chartData} options={barChartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DataAnalysis;
