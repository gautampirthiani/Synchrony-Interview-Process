// Define the URL of your API Gateway endpoint
const apiGatewayUrl = 'https://rv0femjg65.execute-api.us-east-1.amazonaws.com/default/openInterview';

// Sample input data to send
const data = {
    interviewID: '12345'  // Replace with the actual interview ID you want to send
};

// Function to call the Lambda function through the API Gateway
function callLambdaFunction() {
    // Making a POST request using fetch API
    fetch(apiGatewayUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)  // Convert the data to a JSON string
    })
    .then(response => {
        // Check if the request was successful
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Handle the response data
        console.log('Success:', data);
    })
    .catch((error) => {
        // Handle any errors
        console.error('Error:', error);
    });
}

// Call the function
callLambdaFunction();