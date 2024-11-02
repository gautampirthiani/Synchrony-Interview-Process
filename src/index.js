import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Amplify } from 'aws-amplify';

const root = ReactDOM.createRoot(document.getElementById('root'));

// // Attempt to import aws-exports.js
// try {
//     const awsExports = require('./aws-exports').default; // Use require to dynamically import
//     Amplify.configure(awsExports);
// } catch (error) {
//     console.warn('aws-exports.js not found, Amplify not configured:', error);
//     // You can configure default settings for Amplify here if necessary
// }

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

reportWebVitals();
