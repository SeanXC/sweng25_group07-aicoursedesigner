import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCourseData } from "../Context/CourseDataContext";
import { useUserProfile } from "../Context/UserProfileContext"; // Ensure this is imported
import "./Home.css";
import NualasImage from "../../images/nualas.svg";
import NavBar from "../NavBar/NavBar";
import { fetchUserData } from "../UserProfile/fetchUserData";  // Import the fetchUserData function

export default function HomeDashboard() {
  const [showCourses, setShowCourses] = useState(false);
  const [courses, setCourses] = useState([]); // Now stores courses with their timestamps
  const [loading, setLoading] = useState(false);
  const userEmail = sessionStorage.getItem("email");
  const navigate = useNavigate();
  const { userLanguage, setUserLanguage, userDifficulty, setUserDifficulty, setUserProfile } = useUserProfile(); 
  const { setCourseData } = useCourseData();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userEmail) {
        console.error("User email not found in session storage.");
        return;
      }

      setLoading(true);

      try {
       
        const userData = await fetchUserData(userEmail);
        console.log ("Userdata home", userData)

        if (userData) {
          
          setUserProfile({
            userEmail,
            userLanguage: userData.languages || "", 
            userDifficulty: userData.proficiency || "", 
          });
          console.log ("User Info!")
        } else {
          console.error("Error fetching user profile.");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userEmail, setUserProfile]); 

  useEffect(() => {
    const fetchCourses = async () => {
      if (!userEmail) {
        console.error("User email not found in session storage.");
        return;
      }

      setLoading(true);

      try {
        const response = await fetch(
          `https://ycuzxyk9xj.execute-api.eu-west-1.amazonaws.com/dev/get?email=${userEmail}`
        );
        const data = await response.json();

        if (data.success) {
          // Save course titles and timestamps to the state
          setCourses(data.courseDetails || []); // Assuming 'courseDetails' includes course_title and timestamp
          console.log("Course details", data.courseDetails);
        } else {
          console.error("Error fetching courses:", data.error);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    if (showCourses) {
      fetchCourses();
    }
  }, [showCourses, userEmail]);

  const handleCourseClick = async (courseTitle) => {
    if (!userEmail || !courseTitle) return;
  
    setLoading(true);
  
    try {
      const response = await fetch(
        `https://ycuzxyk9xj.execute-api.eu-west-1.amazonaws.com/dev/get?email=${userEmail}&course_title=${encodeURIComponent(courseTitle)}`
      );
      const data = await response.json();
  
      if (data.success && data.history.length > 0) {
        const courseOutline = data.history[0];
  
        // refreshing user profile just in case
        const userData = await fetchUserData(userEmail);
        setUserProfile({
          userEmail,
          userLanguage: userData.languages || "",
          userDifficulty: userData.proficiency || "",
        });
  
        setCourseData({
          course_title: courseOutline.course_title,
          learning_outcomes: courseOutline.learning_outcomes,
          weeks: courseOutline.weeks,
          difficulty: courseOutline.difficulty,
          description: courseOutline.description,
          target_language: courseOutline.target_language,
          language_used: courseOutline.language_used,
        });
  
        navigate("/courseDashboard");
      } else {
        console.error("Error fetching course outline:", data.error);
      }
    } catch (error) {
      console.error("Error fetching course outline:", error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className={`home-container ${showCourses ? "show-sidebar" : ""}`}>
      <NavBar />

      {!showCourses && (
        <button className="view-courses-button" onClick={() => setShowCourses(true)}>
          View Created Courses
        </button>
      )}

      {showCourses && (
        <div className="course-sidebar visible">
          <button className="hide-courses-button" onClick={() => setShowCourses(false)}>
            Hide Courses
          </button>

          <h2>Created Courses</h2>

          {loading ? (
            <p>Loading...</p>
          ) : courses.length > 0 ? (
            courses.map((course, index) => (
              <div
                key={index}
                className="course-item"
                onClick={() => handleCourseClick(course.course_title)} // Pass course title for handling
                style={{ cursor: "pointer" }}
              >
                <h3>{course.course_title}</h3>
                <p>Generated on: {new Date(course.timestamp).toLocaleDateString()}</p>
              </div>
            ))
          ) : (
            <p>No courses created yet.</p>
          )}
        </div>
      )}

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
  );
}
