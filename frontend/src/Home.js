import React from "react";
import { useNavigate } from 'react-router-dom'; // Import useNavigate for programmatic navigation

export default function HomeDashboard() {
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Navigate to the login page when the "Sign in" button is clicked
  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div style={{ height: "100vh", backgroundColor: "white", position: "relative" }}>
      <button
        onClick={handleLoginClick}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          backgroundColor: "#9705A8",
          color: "white",
          padding: "0.5rem 1rem",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          border: "none",
          cursor: "pointer",
        }}
      >
        Sign in
      </button>

      <header
        style={{
          backgroundColor: "purple",
          color: "white",
          fontSize: "1.5rem",
          fontWeight: "bold",
          padding: "1rem 1.5rem",
          textAlign: "center",
        }}
      >
        Home Dashboard
      </header>

      <main
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "calc(100% - 64px)",
        }}
      >
        <button
          style={{
            backgroundColor: "purple",
            color: "white",
            padding: "0.75rem 1.5rem",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            border: "none",
            cursor: "pointer",
          }}
        >
          Generate Course
        </button>
      </main>
    </div>
  );
}
