import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logoImage from "./logowhite.png";
import avatar1 from "./avatar1.svg";
import avatar2 from "./avatar2.svg";
import avatar3 from "./avatar3.svg";

export default function LanguageTeacherProfile() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    languages: "",
    proficiency: "",
    role: "",
    avatar: avatar1,
  });

  const avatars = [avatar1, avatar2, avatar3];

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle avatar selection
  const handleAvatarSelect = (avatar) => {
    setFormData((prev) => ({
      ...prev,
      avatar: avatar,
    }));
  };

  // Toggle between edit and view mode
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };


  // Save the profile changes
const saveProfile = (e) => {
    e.preventDefault();
    setIsEditing(false);
    sessionStorage.setItem("avatar", formData.avatar); // Store avatar in sessionStorage
    console.log("Profile updated:", formData);
  };
  

  // Retrieve user data from sessionStorage on component mount
  useEffect(() => {
    const storedName = sessionStorage.getItem("name");
    const storedEmail = sessionStorage.getItem("email");

    if (storedName && storedEmail) {
      setFormData((prev) => ({
        ...prev,
        name: storedName,
        email: storedEmail,
      }));
    } else {
      navigate("/"); // Redirect to login if no user data found
    }
  }, [navigate]);

  const handlelogoClick = () => {
    navigate("/"); // Navigate to home page on logo click
  };


  return (
    <div
      style={{
        backgroundColor: "#9705A8",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem", // Added padding to prevent touching the border
      }}
    >
      {/* Logo Image */}
       <div style={{ width: "100%", textAlign: "center", position: "absolute", top: "25px", right: "500px" }}>
              <img
                src={logoImage}
                alt="Logo"
                style={{ width: "200px", borderRadius: "10px" }}
                onClick={handlelogoClick}
              />
        </div>

      {/* Profile Form */}
      <div
        style={{
          border: "4px solid white",
          padding: "2rem",
          borderRadius: "20px",
          backgroundColor: "white",
          width: "550px", // Increased width for a bigger profile
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Added shadow for better structure
        }}
      >
        <h2 style={{ textAlign: "center" }}>
          {isEditing ? "Edit Profile" : "Profile"}
        </h2>
        <form
          onSubmit={saveProfile}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          {/* Avatar Display */}
          <div style={{ textAlign: "center", marginBottom: "1rem" }}>
            <img
              src={formData.avatar}
              alt="Selected Avatar"
              style={{ width: "120px", borderRadius: "50%" }}
            />
          </div>

          {/* Avatar Selection */}
          {isEditing && (
            <div>
              <label style={{ fontWeight: "bold" }}>Select Avatar:</label>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "15px",
                  marginTop: "10px",
                }}
              >
                {avatars.map((avatar, index) => (
                  <img
                    key={index}
                    src={avatar}
                    alt={`Avatar ${index + 1}`}
                    style={{
                      width: "60px",
                      borderRadius: "50%",
                      cursor: "pointer",
                      border:
                        formData.avatar === avatar
                          ? "3px solid #8300A1"
                          : "2px solid #ccc",
                    }}
                    onClick={() => handleAvatarSelect(avatar)}
                  />
                ))}
              </div>
            </div>
          )}

          <div>
            <label style={{ fontWeight: "bold" }}>Name:</label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Name"
                required
                style={{
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                }}
              />
            ) : (
              <p>{formData.name}</p>
            )}
          </div>

            <div>
                <label style={{ fontWeight: "bold" }}>Email:</label>
            {isEditing ? (
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    placeholder="Email"
                    readOnly
                    style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid #ccc", backgroundColor: "#f5f5f5" }}
                />
            ) : (
                <p>{formData.email}</p>
            )}
            </div>

          <div>
            <label style={{ fontWeight: "bold" }}>I Want to Teach/Learn:</label>
            {isEditing ? (
              <input
                type="text"
                name="languages"
                value={formData.languages}
                onChange={handleInputChange}
                placeholder="e.g. Spanish"
                required
                style={{
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                }}
              />
            ) : (
              <p>{formData.languages}</p>
            )}
          </div>

          <div>
            <label style={{ fontWeight: "bold" }}>Proficiency:</label>
            {isEditing ? (
              <input
                type="text"
                name="proficiency"
                value={formData.proficiency}
                onChange={handleInputChange}
                placeholder="e.g. Beginner"
                required
                style={{
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                }}
              />
            ) : (
              <p>{formData.proficiency}</p>
            )}
          </div>

          <div>
            <label style={{ fontWeight: "bold" }}>Role:</label>
            {isEditing ? (
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                placeholder="e.g. Teacher"
                required
                style={{
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                }}
              />
            ) : (
              <p>{formData.role}</p>
            )}
          </div>

          <button
            type="submit"
            onClick={toggleEditMode}
            style={{
              backgroundColor: "#8300A1",
              color: "white",
              padding: "0.75rem 1.5rem",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              marginTop: "1rem",
            }}
          >
            {isEditing ? "Save Changes" : "Edit Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
