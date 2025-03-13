import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoImage from './logowhite.png';  // Your logo for consistency with the sign-in page

export default function SignOut() {
  const navigate = useNavigate();
  
  const [isLogin, setIsLogin] = useState(true);  // To toggle between sign-in and sign-up forms
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  // Handle input changes for username and password (similar to sign-in form)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission (similar to sign-in)
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Simulate the action for Sign In (you can add the actual sign-in logic here)
    console.log("Signing in with", formData.username, formData.password);
  };

  // Handle redirect to home page when logo is clicked
  const handleImageClick = () => {
    navigate("/");  // Navigate to the home page
  };

  // Handle redirect to login page when button is clicked
  const handleLoginRedirect = () => {
    navigate("/login");  // Navigate to the login page after sign out
  };

  return (
    <div style={{ backgroundColor: "#9705A8", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      {/* Logo Image */}
      <div style={{ width: "100%", textAlign: "center", position: "absolute", top: "25px", right: "500px" }}>
        <img
          src={logoImage}
          alt="Logo"
          style={{ width: "200px", borderRadius: "10px" }}
          onClick={handleImageClick}
        />
      </div>

      {/* Sign Out Form */}
      <div style={{ border: "3px solid white", padding: "1rem", borderRadius: "10px", backgroundColor: "white", width: "320px" }}>
        <h2>Goodbye!</h2>
        <h3>Successfully Signed Out</h3>
        <p style={{ fontSize: "1.1rem", color: "purple" }}>You have been logged out. You can sign in again if you wish.</p>
        
        {/* Redirect button to go back to the login page */}
        <button
          onClick={handleLoginRedirect}
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
          Go to Sign In
        </button>
      </div>
    </div>
  );
}
