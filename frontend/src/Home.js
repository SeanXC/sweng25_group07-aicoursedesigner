import React from "react";
import { useNavigate, Link } from "react-router-dom"; 
import "./Home.css";

export default function HomeDashboard() {
  const navigate = useNavigate(); 

  
  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div style={{ height: "100vh", backgroundColor: "white", position: "relative" }}>
      <header>
        <span>Home Dashboard</span>

        <Link to="/connectaws">
          <button style={buttonStyle}>Connect AWS</button>
        </Link>

        <button onClick={handleLoginClick} style={buttonStyle}>Sign In</button>

        <Link to="/courseform">
          <button style={buttonStyle}>Generate Course</button>
        </Link>
      </header>

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


const buttonStyle = {
  backgroundColor: "#8300A1",
  color: "white",
  padding: "0.75rem 1.5rem",
  borderRadius: "8px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  border: "none",
  cursor: "pointer",
};
