import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import logoImage from './logowhite.png'; // Path to your image file
import iconImage from './icon_figure.png'; // Path to your image file
import textImage from './speechText.png'; // Path to your image file
import { confirmSignUp } from "./authService";

export default function ConfirmUser() {
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [isConfirmed, setIsConfirmed] = useState(false); // State to track if the user confirms
  const [formData, setFormData] = useState({
    confirmEmail: "", // Placeholder for email input
    confirmationCode: "", // Placeholder for confirmation code
  });

  // Function to handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { confirmEmail, confirmationCode } = formData;
    try {
      await confirmSignUp(confirmEmail, confirmationCode); // Make sure this function is defined
      setIsConfirmed(true); // Mark as confirmed after successful confirmation

      sessionStorage.setItem("accessToken", "dummyAccessToken");  // Replace with real access token

      alert("Account confirmed successfully!\nSign in on next page.");
      navigate("/");
    } catch (error) {
      alert(`Failed to confirm account: ${error}`);
    }
  };


  return (
    <div style={{ backgroundColor: "#9705A8", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      {/* Image at the top right of the screen */}
      <div style={{ width: "100%", textAlign: "center", position: "absolute", top: "25px", right:"500px" }}>
        <img 
          src={logoImage} 
          alt="Confirmation" 
          style={{ width: "200px", borderRadius: "10px" }} 
        />
      </div>

      {/* Image at the top center of the screen */}
      <div style={{ width: "100%", textAlign: "center", position: "absolute", top: "91px", left: "80px" }}>
        <img 
          src={iconImage} 
          alt="Icon" 
          style={{ width: "80px", borderRadius: "10px" }} 
        />
      </div>

      {/* Image at the top center of the screen */}
      <div style={{ width: "100%", textAlign: "center", position: "absolute", top: "92px", left: "150px" }}>
        <img 
          src={textImage} 
          alt="Text" 
          style={{ width: "80px", borderRadius: "10px" }} 
        />
      </div>
      
      {/* Confirmation Form */}
      <div style={{ border: "3px solid white", padding: "2rem", borderRadius: "10px", backgroundColor: "white", width: "300px" }}>
        {!isConfirmed ? (
          <>
            <h2>Confirm Your Account</h2>
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <input
                type="email"
                name="confirmEmail"
                value={formData.confirmEmail}
                onChange={handleInputChange}
                placeholder="Enter Email"
                required
                style={{
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                }}
              />
              <input
                type="text"
                name="confirmationCode"
                value={formData.confirmationCode}
                onChange={handleInputChange}
                placeholder="Enter Confirmation Code"
                required
                style={{
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                }}
              />
              
              <button
                type="submit"
                style={{
                  backgroundColor: "purple",
                  color: "white",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  marginTop: "1rem",
                }}
              >
                Confirm Account
              </button>
            </form>
          </>
        ) : (
          <div style={{ textAlign: "center" }}>
            <h2>Your account has been successfully confirmed!</h2>
            <button
              onClick={() => navigate("/login")}
              style={{
                backgroundColor: "purple",
                color: "white",
                padding: "0.75rem 1.5rem",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                marginTop: "1rem",
              }}
            >
              Go to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
