import React, { useState } from 'react';

const StatusButton = () => {
    const [status, setStatus] = useState(''); // Use these for setting and displaying the status / message of the response 

    const checkConnection = async () => {
        try {
            const response = await fetch('https://nkn3eg3p6e.execute-api.eu-west-1.amazonaws.com/SecondDeploy');
            if (response.ok) {
                const data = await response.json();
                const body = JSON.parse(data.body); // This is to parse the body to get the actual message

                // TO DO set status with the response 
            } else {
                // TO DO set status with an Error message + the actual response status for debugging
            }
        } catch (error) {
            console.log(error); // Log the error for debugging
            // TO DO set status to some simple Not connected string 

       
        }
    };
    
// TO DO : Create button that calls function above , have it display the "status" when it gets a response back 
// 
    return (
        <div>

        </div>
    );
};

export default StatusButton;
