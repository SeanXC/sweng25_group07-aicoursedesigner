import React, { useState, useEffect } from "react";
import "./newCourseDashbaord.css";
import Roleplay from "../../components/Roleplay/roleplay";
import NavBar from "../NavBar/NavBar";
import Chatbot from "../../components/Chatbot/Chatbot";
import SideBarWeeks from "../../components/SideBarWeeks/SideBarWeeks";
import { useCourseData } from "../Context/CourseDataContext";
// import { handleWeekClick } from "..SideBarWeeks"

const Tabs = ({ activeTab, setActiveTab }) => {
  const tabs = ["Translation", "Roleplay", "Chatbot"];

  //const selectedWeek
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

const Content = ({ activeTab, selectedWeek }) => {
  console.log("newCourseDashboard.js - Current selectedWeek:", selectedWeek);
  return (
    <div className="content">
      {activeTab === "Translation" && (
        <Translation selectedWeek={selectedWeek} />
      )}
      {activeTab === "Roleplay" && <CourseRoleplay />}
      {activeTab === "Chatbot" && <Chatbot />}
    </div>
  );
};

const CourseRoleplay = () => (
  <div className="roleplay">
    <Roleplay />
  </div>
);

export function Translation({ selectedWeek }) {
  const [phraseData, setPhraseData] = useState([]);
  const { courseData } = useCourseData();
  //console.log("going into fetch", courseData.body.generatedOutline.weeks);
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

  //console.log("above return in translate",phraseData); //,phraseData[1].Spanish
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
  const [selectedWeek, setSelectedWeek] = useState(1);
  const { courseData } = useCourseData(); //gets you the course data
  console.log("Course Data:", courseData);
  console.log("Week Descriptions:");
  //fetchPhrases(selectedWeek, courseData)

  return (
    <div>
      <NavBar />
      <div className="dashboard-container">
        <div className="main-content">
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="main">
            <Content activeTab={activeTab} selectedWeek={selectedWeek} />
          </div>
        </div>
        <SideBarWeeks setSelectedWeek={setSelectedWeek} />
      </div>
    </div>
  );
}
