import React, { useState, useEffect } from "react";
import logoImage from "../../images/logowhite.png";
import { useNavigate, Link } from "react-router-dom";
import UserIcon from "../../images/UserIcon.png";
import LogOuticon from "../../images/logout.png";
import UserProfileicon from "../../images/userProfile.svg";
import LogoutConfirmation from "../ConfirmSignOut/confirmSignOut";
import { fetchUserData } from "../UserProfile/fetchUserData";
import "./NavBar.css";

export default function NavBar() {
  const navigate = useNavigate();
  const isLoggedIn = sessionStorage.getItem("accessToken");
  const [storedAvatar, setStoredAvatar] = useState(UserIcon); // Default to UserIcon
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  // Toggle dropdown for user menu
  const toggleDropdown = () => {
    setDropdownOpen((prevState) => !prevState);
  };
  const handleImageClick = () => {
    navigate("/"); // Navigate to home page on logo click
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
    <div>
      <div className="top-bar">
        <img
          src={logoImage}
          alt="Logo"
          className="logo"
          onClick={handleImageClick}
        />

        <header className="home-header">
          <span></span>
        </header>

        <div className="user-info-container">
          {isLoggedIn ? (
            <div className="user-dropdown-container">
              <button onClick={toggleDropdown} className="user-info-button">
                <img
                  src={storedAvatar || UserIcon}
                  alt="User Icon"
                  className="user-icon"
                />
              </button>

              {dropdownOpen && (
                <div className="dropdown-menu">
                  <button
                    onClick={handleProfileClick}
                    className="dropdown-button"
                  >
                    <span>Profile</span>
                    <img
                      src={UserProfileicon}
                      alt="UserProfile"
                      className="dropdown-icon"
                    />
                  </button>

                  <button
                    onClick={handleLogoutClick}
                    className="dropdown-button"
                  >
                    <span>Sign Out</span>
                    <img
                      src={LogOuticon}
                      alt="LogOut"
                      className="dropdown-icon"
                    />
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
      {showLogout && <LogoutConfirmation onCancel={closeLogoutConfirmation} />}
    </div>
  );
}
