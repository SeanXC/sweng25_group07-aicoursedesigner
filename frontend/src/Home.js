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
      <header style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", padding: "20px" }}>
        <span>Home Dashboard</span>

        <Link to="/connectaws">
          <button style={buttonStyle}>Connect AWS</button>
        </Link>

        <button onClick={handleLoginClick} style={buttonStyle}>Sign In</button>

        <Link to="/courseform">
          <button style={buttonStyle}>Generate Course</button>
        </Link>
      </header>

      <main
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "calc(100% - 64px)",
        }}
      ></main>
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
  width: "200px", 
  textAlign: "center",
};
