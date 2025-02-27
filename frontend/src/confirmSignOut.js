import React from "react";
import { useNavigate } from "react-router-dom";

export default function LogoutConfirmation({ onCancel }) {
  const navigate = useNavigate();

  const handleCancel = () => {
    onCancel(); // Close the popup
  };

  const handleConfirm = () => {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("email");
    sessionStorage.removeItem("avatar");
    navigate("/signout");
  };

  return (
    <div className="logout-confirmation-container">
      <div className="confirmation-box">
        <h2>Are you sure you want to sign out?</h2>
        <div className="buttons-container">
          <button className="cancel-button" onClick={handleCancel}>
            Cancel
          </button>
          <button className="confirm-button" onClick={handleConfirm}>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
