import React, { useState } from "react";
import UserLogin from './UserLogin';  // Import the new UserLogin component

export default function HomeDashboard() {
  const [showForm, setShowForm] = useState(false); // State to toggle form visibility

  // Toggle visibility of the login/signup form when the User Login button is clicked
  const handleLoginClick = () => {
    setShowForm((prev) => !prev); // Toggle the form visibility
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
        {!showForm && (
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
        )}

        {/* Conditionally render the UserLogin component */}
        {showForm && <UserLogin />}
      </main>
    </div>
  );
}
