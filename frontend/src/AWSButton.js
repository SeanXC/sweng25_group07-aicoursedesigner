import React, { useState } from 'react';

const StatusButton = () => {
    const [status, setStatus] = useState(''); // Use these for setting and displaying the status / message of the response 

    const checkConnection = async () => {
        try {
            // const response = await fetch('https://invalid-url-example.com/api'); 
            const response = await fetch('https://nkn3eg3p6e.execute-api.eu-west-1.amazonaws.com/SecondDeploy');
            if (response.ok) {
                const data = await response.json();
                const body = JSON.parse(data.body); // This is to parse the body to get the actual message

                setStatus(body.message); // set status with the response 
            } else {
                setStatus(`Error: ${response.status}`); // set status with an Error message + the actual response status for debugging
            }
        } catch (error){
            console.log(error); // Log the error for debugging
            setStatus('Not connected');// set status to some simple Not connected string 

       
        }
    };
    
// Button that calls function above , have it display the "status" when it gets a response back 
// 
return (
    <div>
        <button
          onClick={checkConnection}
          style={{
            backgroundColor: "purple",
            color: "white",
            padding: "0.75rem 1.5rem",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            border: "none",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "bold",
            marginBottom: "1rem",
          }}
        >
          Check Connection
        </button>
        <p
          style={{
            fontSize: "1.2rem",
            color: "black",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Status: {status}
        </p>
    </div>
  );
};


export default StatusButton;

