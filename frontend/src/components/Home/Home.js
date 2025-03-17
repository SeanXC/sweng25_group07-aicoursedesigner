import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Home.css";
import logoImage from '../../images/logowhite.png';
import NualasImage from '../../images/nualas.svg';
import UserIcon from '../../images/UserIcon.png';
import LogOuticon from '../../images/logout.png';
import UserProfileicon from '../../images/userProfile.svg';
import LogoutConfirmation from "../ConfirmSignOut/confirmSignOut";
import { fetchUserData } from "../UserProfile/fetchUserData"; 

export default function HomeDashboard() {
  const navigate = useNavigate();
  const isLoggedIn = sessionStorage.getItem("accessToken");
  const [storedAvatar, setStoredAvatar] = useState(UserIcon); // Default to UserIcon
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  // Toggle dropdown for user menu
  const toggleDropdown = () => {
    setDropdownOpen(prevState => !prevState);
  };

  // Navigate to login page
  const handleLoginClick = () => {
    navigate("/login");
  };

  // Navigate to user profile page
  const handleProfileClick = () => {
    navigate("/userProfile");
  };

  // Handle logout
  const handleLogoutClick = () => {
    setShowLogout(true);
  };

  const closeLogoutConfirmation = () => {
    setShowLogout(false);
  };

  // UseEffect to fetch user data from the backend
  useEffect(() => {
    const fetchUserProfile = async () => {
      const userEmail = sessionStorage.getItem("email"); // Get user email from sessionStorage
      if (userEmail) {
        const userData = await fetchUserData(userEmail); // Fetch user data using fetchUserData function
        if (userData && userData.avatar) {
          sessionStorage.setItem("avatar", userData.avatar);
          setStoredAvatar(userData.avatar); // Set avatar in component state
        }
      }
    };

    if (isLoggedIn) {
      fetchUserProfile();
    }
  }, [isLoggedIn]);

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
      <img src={NualasImage} alt="Nualas Logo" className="nualas-image" />
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


