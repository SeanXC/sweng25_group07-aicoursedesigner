import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserData } from "./fetchUserData"; // Import the function

export default function LogoutConfirmation({ onCancel }) {
  const [userName, setUserName] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the user's data when the component mounts
    const email = sessionStorage.getItem("email");
    
    if (email) {
      fetchUserData(email).then((data) => {
        if (data) {
          setUserName(data.name); // Assuming the response data contains a `name` field
        }
      });
    }
  }, []);

  const handleCancel = () => {
    onCancel(); // Close the popup
  };

  const handleConfirm = () => {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("email");
    navigate("/signout");
  };

  return (
    <div className="logout-confirmation-container">
      <div className="confirmation-box">
        {/* Display the user name first */}
        {userName && <h2 style={{ color: '#6A1B9A' }}>{userName}</h2>}

        {/* Ask if the user is sure they want to sign out */}
        <h3 style={{ color: '#8E24AA' }}>Are you sure you want to sign out?</h3>

        {/* Display the message that we'll miss the user */}
        <h3 style={{ color: '#8E24AA' }}>
          We'll miss you!
        </h3>

        <div className="buttons-container">
          <button className="cancel-button" onClick={handleCancel}>
            Stay
          </button>
          <button className="confirm-button" onClick={handleConfirm}>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
