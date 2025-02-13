import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

export default function HomeDashboard() {
  return (
    <div style={{ backgroundColor: "white" }}>
      <header
        style={{
          backgroundColor: "#8300A1",
          color: "white",
          fontSize: "1.25rem",
          fontWeight: "bold",
          padding: "1rem 1.5rem",
          display: "flex",
          justifyContent: "space-between", 
          alignItems: "center",
        }}
      >
    
        <Link to="/connectaws">
          <button style={buttonStyle}>Connect AWS</button>
        </Link>

        <span>Home Dashboard</span>

        
        <Link to="/userlogin">
          <button style={buttonStyle}>Sign In</button>
        </Link>

        <Link to="/courseform">
          <button style={buttonStyle}>Generate Course</button>
        </Link>

      </header>
    </div>
  );
}


const buttonStyle = {
  backgroundColor: "#9705A8",
  color: "white",
  padding: "0.5rem 1rem",
  borderRadius: "8px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  border: "none",
  cursor: "pointer",
};

