import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logoImage from "../../images/logowhite.png";
import avatar1 from "../../images/avatar1.svg";
import avatar2 from "../../images/avatar2.svg";
import avatar3 from "../../images/avatar3.svg";
import avatar4 from "../../images/avatar4.svg";
import avatar5 from "../../images/avatar5.svg";

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
  const [savedProfileData, setSavedProfileData] = useState(null);

  const avatars = [avatar1, avatar2, avatar3,avatar4,avatar5];

  useEffect(() => {
    const storedName = sessionStorage.getItem("name");
    const storedEmail = sessionStorage.getItem("email");

    if (storedName && storedEmail) {
      // For a new user, display name and email from sessionStorage
      setFormData((prev) => ({
        ...prev,
        name: storedName,
        email: storedEmail,
      }));

      // Try to fetch profile data if exists on the server
      fetchProfileData(storedEmail);
    } else {
      navigate("/"); // Redirect to login if no user data found in sessionStorage
    }
  }, [navigate]);

  // Fetch saved profile data from the server using the email
  const fetchProfileData = async (email) => {
    const apiUrl = `https://3smlhrocb8.execute-api.eu-west-1.amazonaws.com/StageTwo?email=${email}`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data) {
        setSavedProfileData(data);
        setFormData((prev) => ({
          ...prev,
          name: data.name || prev.name,  // Make sure name from backend doesn't overwrite sessionStorage name if it's empty
          email: data.email || prev.email,  // Same for email
          languages: data.languages || prev.languages,
          proficiency: data.proficiency || prev.proficiency,
          role: data.role || prev.role,
          avatar: data.avatar || prev.avatar,
        }));
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  // Handle input changes (name, languages, proficiency, role)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle avatar selection
  const handleAvatarSelect = (avatar) => {
    setFormData((prev) => ({
      ...prev,
      avatar: avatar,
    }));
  };

  // Save the profile to the server
  const saveProfile = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    const apiUrl = "https://3smlhrocb8.execute-api.eu-west-1.amazonaws.com/StageTwo";

    const requestData = {
      name: formData.name,
      email: formData.email,
      languages: formData.languages,
      proficiency: formData.proficiency,
      role: formData.role,
      avatar: formData.avatar,
    };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Profile saved:", data);
        
        // After saving, fetch and update profile data
        fetchProfileData(formData.email);

        setIsEditing(false); // Exit edit mode after saving
      } else {
        console.error("Failed to save profile:", data);
        alert("Failed to save profile. Please try again.");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("An error occurred while saving your profile.");
    }
  };

  // Toggle between edit mode and view mode
  const toggleEditMode = () => {
    if (!isEditing) {
      setIsEditing(true); // Enter editing mode
    } else {
      saveProfile(new Event("submit")); // Trigger saveProfile when exiting edit mode
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#9705A8",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem",
      }}
    >
      <div
        style={{
          width: "100%",
          textAlign: "center",
          position: "absolute",
          top: "25px",
          right: "500px",
        }}
      >
        <img
          src={logoImage}
          alt="Logo"
          style={{ width: "200px", borderRadius: "10px" }}
          onClick={() => navigate("/")}
        />
      </div>

      <div
        style={{
          border: "4px solid white",
          padding: "2rem",
          borderRadius: "20px",
          backgroundColor: "white",
          width: "550px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        }}
      >
        <h2 style={{ textAlign: "center" }}>
          {isEditing ? "Edit Profile" : "Profile"}
        </h2>
        <form
          onSubmit={saveProfile}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <div style={{ textAlign: "center", marginBottom: "1rem" }}>
            <img
              src={formData.avatar}
              alt="Selected Avatar"
              style={{ width: "120px", borderRadius: "50%" }}
            />
          </div>

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

          
          {/* Name Field */}
          <div>
            <label style={{ fontWeight: "bold" }}>Name:</label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                style={{
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                }}
              />
            ) : (
              <p>{savedProfileData ? savedProfileData.name : formData.name}</p>
            )}
          </div>

          {/* Language to Learn/Teach Field */}
          <div>
            <label style={{ fontWeight: "bold" }}>Language to Learn/Teach:</label>
            {isEditing ? (
              <select
                name="languages"
                value={formData.languages}
                onChange={handleInputChange}
                required
                style={{
                  padding: "0.45rem",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  width:"95%",
                }}
              >
                <option hidden value="">
                  Select a language
                </option>
                <option value="Spanish">Spanish</option>
                <option value="English">English</option>
                <option value="French">French</option>
                <option value="Italian">Italian</option>
                <option value="German">German</option>
                <option value="Portuguese">Portuguese</option>
              </select>
            ) : (
              <p>{savedProfileData ? savedProfileData.languages : formData.languages}</p>
            )}
          </div>

         {/* Proficiency Field */}
          <div>
            <label style={{ fontWeight: "bold" }}>Proficiency:</label>
            {isEditing ? (
              <select
                name="proficiency"
                value={formData.proficiency}
                onChange={handleInputChange}
                required
                style={{
                  padding: "0.45rem",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  width:"95%",
                }}
              >
                <option hidden value="">
                  Selcet a proficiency
                </option>
                <option value="A1">A1</option>
                <option value="A2">A2</option>
                <option value="B1">B1</option>
                <option value="B2">B2</option>
                <option value="C1">C1</option>
                <option value="C2">C2</option>
              </select>
            ) : (
              <p>{savedProfileData ? savedProfileData.proficiency : formData.proficiency}</p>
            )}
          </div>

          {/* Role Field */}
          <div>
            <label style={{ fontWeight: "bold" }}>Role:</label>
            {isEditing ? (
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                required
                style={{
                  padding: "0.45rem", 
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  width: "95%", 
                }}
              >
                <option hidden value="">
                  Select a role 
                </option>
                <option value="Student">Student</option>
                <option value="Teacher">Teacher</option>
                <option value="Developer">Developer</option>
              </select>
            ) : (
              <p>{savedProfileData ? savedProfileData.role : formData.role}</p>
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
                style={{
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  backgroundColor: "#f5f5f5",
                }}
              />
            ) : (
              <p>{formData.email}</p>
            )}
          </div>

          <button
            type="button" // Toggle between edit and view mode
            onClick={toggleEditMode}
            style={{
              backgroundColor: "#8300A1",
              color: "white",
              padding: "0.75rem 1.5rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
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
