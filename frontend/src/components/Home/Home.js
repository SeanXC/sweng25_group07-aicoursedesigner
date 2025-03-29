import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Home.css";
import NualasImage from "../../images/nualas.svg";
import NavBar from "../NavBar/NavBar";

export default function HomeDashboard() {
  return (
    <>
     <div className ="home-container"> 
      <div>
        <NavBar />
       
        <div className="content">
          <img src={NualasImage} alt="Nualas Logo" className="nualas-image" />
          <p className="text">Create a course</p>
          <p className="text2">
            Design and customize lessons to track student progress seamlessly
          </p>

          <Link to="/courseform">
            <button className="home-button">Generate Course</button>
          </Link>

        </div>
        </div>
      </div>
    </>
  );
}
