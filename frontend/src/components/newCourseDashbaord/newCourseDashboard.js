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
  

  // for the flashcard carousel
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPhrase, setCurrentPhrase] = useState({});

  const nextFlashcard = () => {
    console.log('are we clicking next?')
    if (currentIndex < phraseData.length - 1) {
      setCurrentPhrase(phraseData[currentIndex + 1]);
      setCurrentIndex(currentIndex + 1);
      setFlipped(true); //start on the language side of the card
    } else {
      setCurrentPhrase(phraseData[0]);
      setCurrentIndex(0); // Loop back to the first flashcard
      setFlipped(true);
    }
  };

  function formatWeeks(weeks) {
    return weeks.map(week => ({
      week: week.week,
      title: week.topic, 
      objectives: week.sessions.flatMap(session => session.objectives),
      main_content: week.sessions.flatMap(session => session.main_content),
      activities: week.sessions.flatMap(session => session.activities)
  }));
  }

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
              email: userEmail,
              userLevel: userDifficulty,
              language: userLanguage,
              topic: selectedTopic,
              weekTarget: week,
              outline: {
                weeks: formatWeeks(courseData.body.generatedOutline.weeks),
              },
            }),
          }
        );

        const responseData = await response.json();
        setPhraseData(responseData.phrases);
        setCurrentPhrase(responseData.phrases[0])
      } catch (error) {
        console.error("Error:", error);
      }
    }

    if (selectedWeek) {
      fetchPhrases(selectedWeek, courseData);
    }
  }, [selectedWeek, courseData, selectedTopic, userDifficulty, userEmail, userLanguage]);

  return (
    <div className="flashcard-carousel">
      <div className="flashcard-container" onClick={() => setFlipped(!flipped)}>
        <div className={`flashcard ${flipped ? 'flipped' : ''}`}>
          <div className="flashcard-front">
            {currentPhrase.english}
          </div>
          <div className="flashcard-back">
            {currentPhrase[userLanguage]}
          </div>
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
