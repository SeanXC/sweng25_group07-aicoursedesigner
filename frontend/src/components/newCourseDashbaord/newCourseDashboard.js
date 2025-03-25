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
      {activeTab === "Translation" && <Translation selectedWeek={selectedWeek} />}
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

// const SideBar = () => (

//   <div className="sidebar">
//     {["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"].map((week) => (
//       <div className="weeks">
//         <div key={week} className="week-box">
//           <p>
//             <b>{week}</b>
//           </p>
//           <p>Course Content</p>
//         </div>
//       </div>
//     ))}
//   </div>
// );

// const Test = () =>(
//   console.log("I hate react")
// );

export function Translation(props) {
  console.log("Week: ", props.selectedWeek);
  return (
    <div className="outside-card">
      <div className="card">
        {props.selectedWeek === 1 && <p className="word">Hola</p>}
        {props.selectedWeek === 2 && <p className="word">Uno</p>}
        {props.selectedWeek === 3 && <p className="word">Madre</p>}
        {props.selectedWeek === 4 && <p className="word">Pan</p>}
        {props.selectedWeek === 5 && <p className="word">Derecha</p>}
      </div>
      <br></br>
      <label className="answerText">
        Enter the word in English: <input name="answer" />
      </label>
    </div>
  );
}

// const Chatbot = () => (
//   <div>
//     <p>Chatbot coming soon!</p>
//   </div>
// );

export default function CourseDashboard() {
  // if(selectedWeek===1){
  //   console.log("YIPPEE");
  // }
  const [activeTab, setActiveTab] = useState("Translation");
  const [selectedWeek, setSelectedWeek] = useState(1);
  const { courseData } = useCourseData(); //gets you the course data
  console.log("Course Data:", courseData);
  console.log("Week Descriptions:");

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
