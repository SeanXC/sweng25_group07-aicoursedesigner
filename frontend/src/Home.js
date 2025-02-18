import React from "react";
import { useNavigate, Link } from "react-router-dom"; 
import "./Home.css";
import logoImage from './logowhite.png'; 
import NualasImage from './nualas.svg';



export default function HomeDashboard() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div className="home-container">
      <div className="top-bar">
     
         
        <img src={logoImage} alt="Logo" className="logo" />

        <header className="home-header">
        <span>Home Dashboard</span>
        </header>
        
        

        <button onClick={handleLoginClick} className="home-button" position="absolute">Sign In</button>
      </div>

      <div className="content">
        <img src = {NualasImage} className = "nualas-image" />
        
       

        <p className="text">Create a course</p>
        <p className="text2">Design and customize lessons to track student progress seamlessly</p>

        

          <Link to="/courseform">
            <button className="home-button">Generate Course</button>
          </Link>
          
          <Link to="/connectaws">
            <button className="home-button connect-aws-button">Connect AWS</button>
          </Link>
      </div>
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
