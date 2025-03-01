import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; 
import "./Home.css";
import logoImage from './logowhite.png'; 
import NualasImage from './nualas.svg';
import UserIcon from './UserIcon.png';
import LogOuticon from './logout.png';
import UserProfileicon from './userProfile.svg';
import LogoutConfirmation from "./confirmSignOut";

export default function HomeDashboard() {
  const navigate = useNavigate();
  const isLoggedIn = sessionStorage.getItem("accessToken");
  const storedAvatar = sessionStorage.getItem("avatar");


  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(prevState => !prevState);
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleProfileClick = () => {
    navigate("/userProfile");
  };

  const handleLogoutClick = () => {
    setShowLogout(true);
  };

  const closeLogoutConfirmation = () => {
    setShowLogout(false);
  };

  return (
    <div className="home-container">
      <div className="top-bar">
        <img src={logoImage} alt="Logo" className="logo" />

        <header className="home-header">
          <span>Home Dashboard</span>
        </header>

        <div className="user-info-container">
          {isLoggedIn ? (
            <div className="user-dropdown-container">
              <button onClick={toggleDropdown} className="user-info-button">
              <img src={storedAvatar || UserIcon} alt="User Icon" className="user-icon" />
              </button>

              {dropdownOpen && (
                <div className="dropdown-menu">
                  <button onClick={handleProfileClick} className="dropdown-button">
                    <span>Profile</span>
                    <img src={UserProfileicon} alt="UserProfile" className="dropdown-icon" />
                  </button>

                  <button onClick={handleLogoutClick} className="dropdown-button">
                    <span>Sign Out</span>
                    <img src={LogOuticon} alt="LogOut" className="dropdown-icon" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button onClick={handleLoginClick} className="home-button-small">
              Sign In
            </button>
          )}
        </div>
      </div>

      <div className="content">
        <img src={NualasImage} className="nualas-image" />
        <p className="text">Create a course</p>
        <p className="text2">Design and customize lessons to track student progress seamlessly</p>

        <Link to="/courseform">
          <button className="home-button">Generate Course</button>
        </Link>

        <Link to="/connectaws">
          <button className="home-button connect-aws-button">Connect AWS</button>
        </Link>
      </div>

      {showLogout && <LogoutConfirmation onCancel={closeLogoutConfirmation} />}
    </div>
  );
}
