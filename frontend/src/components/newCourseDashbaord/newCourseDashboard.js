import React, { useState, useEffect } from "react";
import "./newCourseDashbaord.css";
import Roleplay from "../../components/Roleplay/roleplay";
import NavBar from "../NavBar/NavBar";
import Chatbot from "../../components/Chatbot/Chatbot";
import SideBarWeeks from "../../components/SideBarWeeks/SideBarWeeks";
import { useCourseData } from "../Context/CourseDataContext";

const Tabs = ({ activeTab, setActiveTab }) => {
  const tabs = ["Translation", "Roleplay", "Chatbot"];

  return (
    <div className="tabs">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`tab ${activeTab === tab ? "active" : ""}`}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

const Content = ({ activeTab, selectedWeek, selectedTopic }) => {
  return (
    <div className="content">
      {activeTab === "Translation" && <Translation selectedWeek={selectedWeek} />}
      {activeTab === "Roleplay" && <CourseRoleplay selectedWeek={selectedWeek} selectedTopic={selectedTopic} />}
      {activeTab === "Chatbot" && <Chatbot selectedWeek={selectedWeek} selectedTopic={selectedTopic} />}
    </div>
  );
};

const CourseRoleplay = ({ selectedWeek, selectedTopic }) => (
  <div className="roleplay">
    <Roleplay selectedWeek={selectedWeek} selectedTopic={selectedTopic} />
  </div>
);

export function Translation({ selectedWeek }) {
  const [phraseData, setPhraseData] = useState([]);
  const { courseData } = useCourseData();

  useEffect(() => {
    async function fetchPhrases(week, courseData) {
      try {
        const response = await fetch(
          "https://t6xifz4k94.execute-api.eu-west-1.amazonaws.com/test/generate-phrases",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: "user@example.com",
              userLevel: "A2",
              language: "Spanish",
              topic: "Spanish Greetings",
              weekTarget: week,
              outline: {
                course_title: "Spanish Course for English Speakers (B1)",
                weeks: [
                  {
                    week: 1,
                    title: "Introduction to Spanish Language",
                    objectives: [
                      "Understanding the basics of Spanish",
                      "Learning common Spanish phrases",
                    ],
                    main_content: [
                      "Introduction to Spanish alphabet",
                      "Introduction to common Spanish phrases",
                    ],
                    activities: [
                      "Listening exercises",
                      "Pronunciation practice",
                    ],
                  },
                ],
              },
            }),
          }
        );

        const responseData = await response.json();
        setPhraseData(responseData.phrases);
      } catch (error) {
        console.error("Error:", error);
      }
    }

    if (selectedWeek) {
      fetchPhrases(selectedWeek, courseData);
    }
  }, [selectedWeek, courseData]);

  return (
    <div className="outside-card">
      <div className="card">
        {/* <span>{phraseData[1].Spanish}</span> */}
      </div>
      <br />
      <br />
      <label className="answerText">
        Enter the word in English: <input name="answer" />
      </label>
    </div>
  );
}

export default function CourseDashboard() {
  const [activeTab, setActiveTab] = useState("Translation");
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState("");
  const { courseData } = useCourseData(); // Gets course data

  const handleWeekSelection = (weekData) => {
    console.log("Selected Week:", weekData);
    setSelectedWeek(weekData.week);
    setSelectedTopic(weekData.topic);
  };

  return (
    <div>
      <NavBar />
      <div className="dashboard-container">
        {/* Display the course title at the top */}
        <div className="course-title">
          <h1>{courseData.courseName || courseData.course_title}</h1> {/* This assumes course title is stored in `courseData.course_title` */}
        </div>

        <div className="main-content">
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="main">
            <Content activeTab={activeTab} selectedWeek={selectedWeek} selectedTopic={selectedTopic} />
          </div>
        </div>
        <SideBarWeeks onWeekSelect={handleWeekSelection} selectedWeek={selectedWeek} />
      </div>
    </div>
  );
}
