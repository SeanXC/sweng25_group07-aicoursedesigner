import React, { useState, useEffect } from "react";
import "./newCourseDashbaord.css";
import Roleplay from "../../components/Roleplay/roleplay";
import NavBar from "../NavBar/NavBar";
import Chatbot from "../../components/Chatbot/Chatbot";
import SideBarWeeks from "../../components/SideBarWeeks/SideBarWeeks";
import { useCourseData } from "../Context/CourseDataContext";
import { useUserProfile } from "../Context/UserProfileContext";
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

const Content = ({ activeTab, selectedWeek, selectedTopic }) => {
  return (
    <div className="content">
      {activeTab === "Translation" && <Translation selectedWeek={selectedWeek} selectedTopic={selectedTopic}/>}
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


export function Translation({ selectedWeek, selectedTopic }) {
  const [phraseData, setPhraseData] = useState([]);
  const { courseData } = useCourseData();
  const { userEmail, userLanguage, userDifficulty } = useUserProfile();
  const [flipped, setFlipped] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPhrase, setCurrentPhrase] = useState({});
  const [loading, setLoading] = useState(false);


  const nextFlashcard = () => {
    if (currentIndex < phraseData.length - 1) {
      setCurrentPhrase(phraseData[currentIndex + 1]);
      setCurrentIndex(currentIndex + 1);
      setFlipped(true);
    } else {
      setCurrentPhrase(phraseData[0]);
      setCurrentIndex(0);
      setFlipped(true);
    }
  };

  function formatWeeks(weeks) {
    return weeks.map(week => ({
      week: week.week,
      title: week.topic,
      objectives: week.sessions.flatMap(session => session.objectives),
      main_content: week.sessions.flatMap(session => session.main_content),
      activities: week.sessions.flatMap(session => session.activities),
    }));
  }

  useEffect(() => {
    async function fetchPhrases(week, courseData) {
      try {
        setLoading(true); // for loading circle
    
        const outlineWeeks = courseData.body?.generatedOutline
          ? formatWeeks(courseData.body.generatedOutline)
          : formatWeeks(courseData.weeks); // checks to see if the request is coming from past course view or if freshly generated 
    
        const requestBody = {
          email: userEmail,
          userLevel: userDifficulty,
          language: userLanguage,
          topic: selectedTopic,
          weekTarget: week,
          outline: { weeks: outlineWeeks },
        };
    
        const response = await fetch(
          "https://t6xifz4k94.execute-api.eu-west-1.amazonaws.com/test/generate-phrases",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
          }
        );
        const responseData = await response.json();
        setPhraseData(responseData.phrases);
        setCurrentPhrase(responseData.phrases[0]);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);  // stop loading screen 
      }
    }
    
  
    if (selectedWeek && courseData) {
      fetchPhrases(selectedWeek, courseData);
    }
  }, [selectedWeek, courseData, selectedTopic, userDifficulty, userEmail, userLanguage]);
  
  if (loading) {
    return (
      <div className="flashcard-loading">
        <div className="spinner" />
        <p>Loading phrases...</p>
      </div>
    );
  }


  return (
    <div className="flashcard-carousel">
      <div className="flashcard-progress">
        {phraseData.length > 0 ? `${currentIndex + 1}/${phraseData.length}` : "0/0"}
      </div>

      <div className="flashcard-container" onClick={() => setFlipped(!flipped)}>
        <div className={`flashcard ${flipped ? "flipped" : ""}`}>
          <div className="flashcard-front">{currentPhrase.english}</div>
          <div className="flashcard-back">{currentPhrase[userLanguage]}</div>
        </div>
      </div>

      <button className="next-button" onClick={nextFlashcard}>Next</button>
    </div>
  );
}



export default function CourseDashboard() {
  const [activeTab, setActiveTab] = useState("Translation");
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState("");
  const { courseData } = useCourseData(); //gets you the course data
  console.log("Course Data:", courseData);
  console.log("Week Descriptions:");

const handleWeekSelection = (weekData) => {
  console.log("Selected Week:", weekData);
  setSelectedWeek(weekData.week);
  setSelectedTopic(weekData.topic);
};

  return (
    <div>
      <NavBar />
      <div className="dashboard-container">
        <div className="main-content">
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="main">
            <Content activeTab={activeTab} selectedWeek={selectedWeek}   selectedTopic={selectedTopic} />
          </div>
        </div>
        <SideBarWeeks onWeekSelect={handleWeekSelection} selectedWeek={selectedWeek} />


      </div>
    </div>
  );
}
