import React, { useState, useEffect } from "react";
import "../Home/Home.css";
import { fetchUserData } from '../UserProfile/fetchUserData'; 
import { useNavigate } from "react-router-dom";
import NavBar from "../NavBar/NavBar";
import { useCourseData } from "../Context/CourseDataContext"; 

export default function HomeDashboard() {
  const navigate = useNavigate();
  const [showCourse, setShowCourse] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [userLanguage, setUserLanguage] = useState("");
  const [userDifficulty, setUserDifficulty] = useState("");
  const [duration, setDuration] = useState("");

  const { setCourseData } = useCourseData(); 

  useEffect(() => {
    const fetchUserProfile = async () => {
      const userEmail = sessionStorage.getItem("email");
      if (userEmail) {
        const userData = await fetchUserData(userEmail);
        if (userData) {
          setUserLanguage(userData.languages || "");
          setUserDifficulty(userData.proficiency || "");
        }
      }
    };
    fetchUserProfile();
  }, []);

  async function formSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const values = Object.fromEntries(formData.entries());
    const userEmail = sessionStorage.getItem("email") || "testuser@email.com";
    
    const courseData = {
      email: userEmail,
      courseName: values.courseName,
      courseDesc: values.courseDesc,
      difficulty: values.difficulty || userDifficulty,
      targetLang: values.language || userLanguage,
      nativeLang: values.nativeLanguage,
      duration: Number(duration),
    };

    try {
      console.log("Request Body:", JSON.stringify(courseData));
      const response = await fetch("https://ycuzxyk9xj.execute-api.eu-west-1.amazonaws.com/dev/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(courseData),
      });

      if (response.ok) {
        const responseBody = await response.json();
        console.log("Response Body:", responseBody);
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
                    <option hidden value={userDifficulty}>{userDifficulty}</option>
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
                    <option hidden value={userLanguage}>{userLanguage}</option>
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
                    <input 
                      type="range" 
                      min="1" 
                      max="12" 
                      value={duration} 
                      onChange={(e) => setDuration(Number(e.target.value))} 
                    />
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

