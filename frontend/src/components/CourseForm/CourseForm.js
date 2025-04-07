import React, { useState, useEffect } from "react";
import "../Home/Home.css";
import { fetchUserData } from "../UserProfile/fetchUserData"; 
import { useNavigate } from "react-router-dom";
import NavBar from "../NavBar/NavBar";
import { useCourseData } from "../Context/CourseDataContext"; 
import { useUserProfile } from "../Context/UserProfileContext";

export default function HomeDashboard() {
  const navigate = useNavigate();
  const [showCourse, setShowCourse] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [duration, setDuration] = useState(5);
  const [loading, setLoading] = useState(false); // Loading state

  const { setCourseData } = useCourseData();
  const { userLanguage, userDifficulty, setUserProfile } = useUserProfile();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const userEmail = sessionStorage.getItem("email");
      if (userEmail) {
        const userData = await fetchUserData(userEmail);
        if (userData) {
          setUserProfile({
            userEmail,
            userLanguage: userData.languages || "",
            userDifficulty: userData.proficiency || "",
          });
        }
      }
    };
    fetchUserProfile();
  }, [setUserProfile]);

  async function formSubmit(e) {
    e.preventDefault();
    setLoading(true); // Start loading

    const formData = new FormData(e.target);
    const values = Object.fromEntries(formData.entries());
    const userEmail = sessionStorage.getItem("email") || "testuser@email.com";

    const selectedLanguage = values.language || userLanguage;

    const courseData = {
      email: userEmail,
      courseName: values.courseName,
      courseDesc: values.courseDesc,
      difficulty: values.difficulty || userDifficulty,
      targetLang: selectedLanguage,
      nativeLang: values.nativeLanguage,
      duration: Number(duration),
    };

    try {
      const response = await fetch("https://ycuzxyk9xj.execute-api.eu-west-1.amazonaws.com/dev/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.REACT_APP_API_KEY,
        },
        body: JSON.stringify(courseData),
      });

      if (response.ok) {
        const responseBody = await response.json();
        setCourseData({ ...responseBody, courseName: values.courseName });
        setUserProfile({
          userEmail,
          userLanguage: selectedLanguage,
          userDifficulty: values.difficulty || userDifficulty,
        });
        navigate("/courseDashboard");
      } else {
        console.error("Error generating course:", response.statusText);
      }
    } catch (error) {
      console.error("Error generating course:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  }

  return (
    <div>
      <NavBar />
      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <button
          onClick={() => setShowForm((prev) => !prev)}
          style={{
            backgroundColor: "#8300A1",
            color: "white",
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            border: "none",
            cursor: "pointer",
          }}
        >
          {showCourse && (
            <div style={{ width: "600px" }}>
              <form method="post" onSubmit={formSubmit}>
                <b>Course Information</b>
                <p>Course Name:</p>
                <input name="courseName" />
                
                <p>Description:</p>
                <input name="courseDesc" />

                <p>Difficulty:</p>
                <select
                  name="difficulty"
                  value={userDifficulty}
                  onChange={(e) => setUserProfile({
                    userEmail: sessionStorage.getItem("email"),
                    userLanguage,
                    userDifficulty: e.target.value,
                  })}
                  style={{ width: "100%", padding: "8px", fontSize: "16px" }}
                >
                  <option hidden value={userDifficulty}>
                    {userDifficulty || "Select Difficulty"}
                  </option>
                  <option value="A1">A1</option>
                  <option value="A2">A2</option>
                  <option value="B1">B1</option>
                  <option value="B2">B2</option>
                  <option value="C1">C1</option>
                  <option value="C2">C2</option>
                </select>

                <p>Learn:</p>
                <select
                  name="language"
                  value={userLanguage}
                  onChange={(e) => setUserProfile({
                    userEmail: sessionStorage.getItem("email"),
                    userLanguage: e.target.value,
                    userDifficulty,
                  })}
                  style={{ width: "100%", padding: "8px", fontSize: "16px" }}
                >
                  <option hidden value={userLanguage}>
                    {userLanguage || "Select Language"}
                  </option>
                  <option value="Spanish">Spanish</option>
                  <option value="English">English</option>
                  <option value="French">French</option>
                  <option value="Italian">Italian</option>
                  <option value="German">German</option>
                  <option value="Portuguese">Portuguese</option>
                </select>

                <p>Speakers Of:</p>
                <select name="nativeLanguage" style={{ width: "100%", padding: "8px", fontSize: "16px" }}>
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="Italian">Italian</option>
                  <option value="German">German</option>
                  <option value="Portuguese">Portuguese</option>
                </select>

                <p>Duration: {duration} weeks</p>
                <input
                  type="range"
                  min="1"
                  max="12"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                />

                <button type="submit">Submit</button>
              </form>
            </div>
          )}
        </button>
      </div>

      {loading && (
        <div className="loading-overlay">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Generating Course...</p>
          </div>
        </div>
      )}

      <style>
        {`
          .loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 999;
          }

          .loading-container {
            background: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid rgba(0, 0, 0, 0.1);
            border-top: 4px solid #8300A1;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 10px auto;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}
