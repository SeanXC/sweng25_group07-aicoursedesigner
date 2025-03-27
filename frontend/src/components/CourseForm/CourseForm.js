import React, { useState, useEffect } from "react";
import "../Home/Home.css";
import { fetchUserData } from '../UserProfile/fetchUserData'; 
import { useNavigate } from "react-router-dom";
import NavBar from "../NavBar/NavBar";
import { useCourseData } from "../Context/CourseDataContext"; // Import the context hook

import { useUserProfile } from "../Context/UserProfileContext";


export default function HomeDashboard() {
  const navigate = useNavigate();
  const { setUserEmail } = useUserProfile(); // Access setUserEmail to update the email state
  const [showCourse, setShowCourse] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [duration, setDuration] = useState(5);

  const { setCourseData } = useCourseData();  // Access setCourseData to update global state
  const { userLanguage, setUserLanguage, userDifficulty, setUserDifficulty } = useUserProfile();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const userEmail = sessionStorage.getItem("email");
      if (userEmail) {
        const userData = await fetchUserData(userEmail);
        if (userData) {
          console.log("Fetched user data:", userData);  // Debug log
          setUserEmail(userEmail);
          setUserLanguage(userData.languages || "");
          setUserDifficulty(userData.proficiency || "");
        }
      }
    };
    fetchUserProfile();
  }, [setUserLanguage, setUserDifficulty]);

  // Debug logs for checking context values
  console.log("UserProfile Context: ", { userLanguage, userDifficulty });

  // Form submission handler
  async function formSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const values = Object.fromEntries(formData.entries());
    const userEmail = sessionStorage.getItem("email") || "testuser@email.com";

     // Set user language to selected language (if it exists), otherwise fall back to current userLanguage
  const selectedLanguage = values.language || userLanguage;
  setUserLanguage(selectedLanguage);  // Update the context with the selected language


    const courseData = {
      email: userEmail,
      courseName: values.courseName,
      courseDesc: values.courseDesc,
      difficulty: values.difficulty || userDifficulty,
      targetLang: selectedLanguage,
      nativeLang: values.nativeLanguage,
      duration: duration,
    };
    console.log("Selected Language:", selectedLanguage);

    console.log("Form Data:", courseData);  // Debug log

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
        console.log("Response Body:", responseBody);  // Debug log

        // **Set the course data in global context**
        setCourseData(responseBody);

        navigate('/courseDashboard');
      } else {
        console.error("Error generating course:", response.statusText);
      }
    } catch (error) {
      console.error("Error generating course:", error);
    }
  }

  return (
    <div>
      <NavBar />
      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <button onClick={() => setShowForm(prev => !prev)} style={{ backgroundColor: "#8300A1", color: "white", padding: "0.5rem 1rem", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", border: "none", cursor: "pointer" }}>
          {showCourse && (
            <>
              <div style={{ width: "600px" }}>
                <form method="post" onSubmit={formSubmit}>
                  <div>
                    <b>Course Information</b>
                    <p>Course Name:</p>
                    <input name="courseName" />
                  </div>
                  <div>
                    <p>Description:</p>
                    <input name="courseDesc" />
                  </div>
                  <div>
                    <p>Difficulty:</p>
                    <select name="difficulty" style={{ width: "100%", padding: "8px", fontSize: "16px" }}>
                      <option hidden value={userDifficulty}>{userDifficulty || "Select Difficulty"}</option>
                      <option value="A1">A1</option>
                      <option value="A2">A2</option>
                      <option value="B1">B1</option>
                      <option value="B2">B2</option>
                      <option value="C1">C1</option>
                      <option value="C2">C2</option>
                    </select>
                  </div>
                  <div>
                    <p>Learn:</p>
                    <select name="language" style={{ width: "100%", padding: "8px", fontSize: "16px" }}>
                      <option hidden value={userLanguage}>{userLanguage || "Select Language"}</option>
                      <option value="Spanish">Spanish</option>
                      <option value="English">English</option>
                      <option value="French">French</option>
                      <option value="Italian">Italian</option>
                      <option value="German">German</option>
                      <option value="Portuguese">Portuguese</option>
                    </select>
                  </div>
                  <div>
                    <p>Speakers Of:</p>
                    <select name="nativeLanguage" style={{ width: "100%", padding: "8px", fontSize: "16px" }}>
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                      <option value="Italian">Italian</option>
                      <option value="German">German</option>
                      <option value="Portuguese">Portuguese</option>
                    </select>
                  </div>
                  <div>
                    <p>Duration: {duration} weeks</p>
                    <input type="range" min="1" max="12" value={duration} onChange={(e) => setDuration(e.target.value)} />
                  </div>
                  <div>
                    <button type="submit">Submit</button>
                  </div>
                </form>
              </div>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
