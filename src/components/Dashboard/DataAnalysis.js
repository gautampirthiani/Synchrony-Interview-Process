// src/components/Dashboard/DataAnalyis.js
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
import axios from 'axios'; // Using axios for HTTP requests
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

  // State to store total open positions
  const [totalOpenPositions, setTotalOpenPositions] = useState(0);

  // State to store a list of usernames from the dynamoDB table Users
  const [usernames, setUsernames] = useState([]);

  // State to store a list of tuples of jobName and jobID called job_data
  const [jobData, setJobData] = useState([]);

  // State to store the selected job position, and the number of interviews for that job
  const [selectedJob, setSelectedJob] = useState('');
  const [interviewsForSelectedJob, setInterviewsForSelectedJob] = useState(0);

  // State to flash interviewCount
  const [flashInterviewCount, setFlashInterviewCount] = useState(false);

  const jobIDToLabelMap = {
    '111111': 'Code',
    '222': 'DSA',
    '1729': 'Data Science',
    '666': 'Algorithms',
    'MarketingTest': 'Marketing',
    '798': 'Human Resources'
  };


  // START BAR CHART COMPONENTS ******************************************** working

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

  const updateChartData = async () => {
    try {
      const jobIDs = ['111111', '222', '1729', '666', 'MarketingTest', '798'];
      const interviewData = await Promise.all(
        jobIDs.map(jobID => fetchInterviewCountForBarChart(jobID))
      );

      // Mapping counts to jobIDs before filtering
      const mappedData = interviewData.map((count, index) => ({
        label: jobIDToLabelMap[jobIDs[index]],  // Using custom map to get human-readable label
        count: count
      }));

      // Filtering data based on the slider value
      const filteredData = mappedData.filter(item => item.count >= sliderValue);

      setChartData(prevChartData => ({
        ...prevChartData,
        labels: filteredData.map(item => item.label), // Update labels with human-readable names
        datasets: [{
          ...prevChartData.datasets[0],
          data: filteredData.map(item => item.count) // Updating the data array with filtered counts
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

  // START OF SLIDER COMPONENTS *************************************************************
  const [sliderValue, setSliderValue] = useState(0);

  const handleSliderChange = (event) => {
    setSliderValue(event.target.value);
  };

  useEffect(() => {
    updateChartData();
  }, [sliderValue]);  // Depend on sliderValue to refetch and update chart

  // END OF SLIDER COMPONENTS *************************************************************

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


  // Fetch job_data from API, this is a list of tuples of jobName and jobID
  useEffect(() => {
    fetch('https://rv0femjg65.execute-api.us-east-1.amazonaws.com/default/getDataAnalytics_getJobPositions1')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json(); // This already parses the JSON response
      })
      .then(data => {
        console.log('FETCHED job_data :    ', data.job_data);
        //setJobData(data.Items.map(item => [item.jobName.S, item.jobID.S]));
        setJobData(data.job_data);
      })
      .catch(error => {
        console.error('Error fetching job_data:', error);
      });
  }, []);

  // Function to apply filters
  const applyFilters = () => {
    // Add code to apply filters here
  }


  // Function to handle job change
  const handleJobChange = (event) => {
    setSelectedJob(event.target.value);
    // fetch the number of interviews for the selected job
    fetchInterviewCountForSelectedJob(event.target.value);
    // flash the interview count box
    setFlashInterviewCount(true);
    // Reset the flashing effect after 1 second (adjust as needed)
    setTimeout(() => {
      setFlashInterviewCount(false);
    }, 1000); // 1000 millisec
  };
  useEffect(() => {   //and the test/confirmation
    console.log('Selected job set as:', selectedJob);
  }, [selectedJob]);

  // Fetch the number of interviews for the selected job
  const fetchInterviewCountForSelectedJob = (jobID) => {
    //setInterviewsForSelectedJob(-5);
    fetch(`https://rv0femjg65.execute-api.us-east-1.amazonaws.com/default/getDataAnalytics_getInterviewCountForJobID1?jobID=${jobID}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json(); // This already parses the JSON response
      })
      .then(data => {
        console.log('FETCHED interview count for selected job:', data.interviewCount);
        setInterviewsForSelectedJob(data.interviewCount);
      })
      .catch(error => {
        console.error('Error fetching interview count for selected job:', error);
      });
  };  // interview count based on selecting job working!


  // New redesign code below ****************************************************************************************


  // useEffect(() => {
  //   // fetching lambda function 2 to get department and interview count pairs in json
  //   const fetchDepartmentAndInterviewCountData = async () => {
  //     try {
  //       const response = await axios.get('https://rv0femjg65.execute-api.us-east-1.amazonaws.com/default/Test_yzheng');
  //       setdepartmentAndInterviewCountData(response.data);
  //     } catch (error) {
  //       console.error('Error fetching data: ', error);
  //     }
  //   };
  //   fetchDepartmentAndInterviewCountData();
  // }, []);








  // State to store a list of Departments to populate the dropdown menu
  const [departments, setDepartments] = useState([]);

  // State to store the currently chosen department
  const [selectedDepartment, setSelectedDepartment] = useState('Writing Code');

  // function to fetch new data for job-interview chart upon change of department
  const handleDepartmentChange = (event) => {
    setSelectedDepartment(event.target.value);
    console.log("Set the selected department to " + event.target.value)
  };

  // whenever the selected department is changed by user, the chart will change
  useEffect(() => {
    if (selectedDepartment) {
      console.log("Fetching data for department: ", selectedDepartment);
      // calling lambda function 1 with the selected department
      const fetchJobAndInterviewCountDataForDepartment = async () => {
        try {
          const response = await axios.post(
            'https://rv0femjg65.execute-api.us-east-1.amazonaws.com/default/Test_Gautam',
            { department: selectedDepartment },
            { headers: { "Content-Type": "application/json" } }
          );
          console.log("Data fetched for department:", response.data);
          console.log("Response in its raw form: " + response);

          // new code for actually storing data fetched from that one department --------
          // Store the raw data
          setJobAndInterviewCountData(response.data.job_interview_counts);
          console.log("Stored to raw data state only this part: " + response.data.job_interview_counts)

          // Format and store the chart data
          const chartLabels = Object.keys(response.data.job_interview_counts);
          const chartDataValues = Object.values(response.data.job_interview_counts);
          setJobAndInterviewCountChartData({
            labels: chartLabels,
            datasets: [{
              label: 'Interview Count for Job',
              data: chartDataValues,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              hoverBackgroundColor: 'rgba(255,99,132,0.4)',
              hoverBorderColor: 'rgba(255,99,132,1)',
              borderWidth: 2,
            }]
          });
          console.log("Finished setting up job-interviewCount data and chartData.")

          // end of new code for storing in raw and chart format ------------------------


        } catch (error) {
          console.error('Error fetching job and interview count data:', error);
        }
      };

      fetchJobAndInterviewCountDataForDepartment();
    }
  }, [selectedDepartment]); // Effect runs when selectedDepartment changes

  // above was stuff to actually get data from the selected dept, and the states to store dept and selectedDept
  // now below is the states to store raw and formatted job-interviewCount data for the job-interviewCount-in-this-dept chart

  // State to store the job and interview count data fetched from the Lambda function
  const [jobAndInterviewCountData, setJobAndInterviewCountData] = useState({});

  // State to store the formatted chart data
  const [jobAndInterviewCountChartData, setJobAndInterviewCountChartData] = useState({
    labels: [],
    datasets: [{
      label: 'Interview Count for Job',
      data: [],
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      hoverBackgroundColor: 'rgba(255,99,132,0.4)',
      hoverBorderColor: 'rgba(255,99,132,1)',
      borderWidth: 2,
    }]
  });




  // above are stuff for the job-interviewCount (for a single department) chart
  // below is stuff for the department-interviewCount simple-no-input chart


  // State to store the fetched data for lambda function 2 (department and interview count pairs)
  const [departmentAndInterviewCountData, setDepartmentAndInterviewCountData] = useState({});

  // State to store the chart data
  const [departmentAndInterviewCountChartData, setDepartmentAndInterviewCountChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Interview Count for Department',
        data: [],
        backgroundColor: 'rgba(255,99,132,0.2)',
        borderColor: 'rgba(255,99,132,1)',
        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
        hoverBorderColor: 'rgba(255,99,132,1)',
        borderWidth: 2,
      }
    ]
  });

  useEffect(() => {
    const fetchDepartmentAndInterviewCountData = async () => {
      try {
        const response = await axios.get('https://rv0femjg65.execute-api.us-east-1.amazonaws.com/default/Test_yzheng');
        setDepartmentAndInterviewCountData(response.data);

        // This part of function for the OTHER chart, the job-interviews for chosen dept chart ----
        // Extracting just the departments from the fetched data
        const departmentList = Object.keys(response.data);
        setDepartments(departmentList);
        //setSelectedDepartment(departmentList[0]);
        // End of part of function for the job-interviews for chosen dept chart -------------------


        // Preparing to actually go from raw data to chart data
        const chartLabels = Object.keys(response.data);
        const chartDataValues = Object.values(response.data);
        setDepartmentAndInterviewCountChartData({
          labels: chartLabels,
          datasets: [{
            label: 'Interview Count for Department',
            data: chartDataValues,
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: 'rgba(255,99,132,1)',
            hoverBackgroundColor: 'rgba(255,99,132,0.4)',
            hoverBorderColor: 'rgba(255,99,132,1)',
            borderWidth: 2,
          }]
        });
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchDepartmentAndInterviewCountData();
  }, []);








  // return part of the  function below ****************************************************************************************

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
            <h3>Filters</h3>
            <div className="filter-option">
              <h4>Minimum Interview Count to Chart</h4>
              <input type="range" min="1" max="25" value={sliderValue} onChange={handleSliderChange} className="slider" />
              <span className="slider-value">{sliderValue}</span>
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

            <div className="filter-option">
              <h4>Department to Chart</h4>
              <select id="department-select" className="selection-box" value={selectedDepartment} onChange={handleDepartmentChange}>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
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
            {/* More stat boxes as needed */}
          </div>
          <div className="graph-container">
            <Bar data={chartData} options={barChartOptions} />
          </div>

          <div className="graph-container">
            <pre>{JSON.stringify(departmentAndInterviewCountData, null, 2)}</pre>
            {/* Above is just temporarily displaying data for debugging */}
            <Bar data={departmentAndInterviewCountChartData} options={barChartOptions} />
          </div>

          <div className="graph-container">
            <pre>{JSON.stringify(jobAndInterviewCountData, null, 2)}</pre>
            <Bar data={jobAndInterviewCountChartData} options={barChartOptions} />
          </div>
        </div>
      </div>
    </div>
  )
}


export default DataAnalysis;

