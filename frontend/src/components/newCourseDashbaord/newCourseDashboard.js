import React, { useState } from "react";
import "./newCourseDashbaord.css";
import logoImage from "../../images/logowhite.png";
import Roleplay from "../../components/Roleplay/roleplay";

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

const Content = ({ activeTab }) => {
  return (
    <div className="content">
      {activeTab === "Translation" && <Translation />}
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

const SideBar = () => (
  <div className="sidebar">
    {["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"].map((week) => (
      <div className="weeks">
        <div key={week} className="week-box">
          {week}
        </div>
      </div>
    ))}
  </div>
);

const Translation = () => (
  <div className="outside-card">
    <div className="card">
      <p className="word">pan</p>
    </div>
    <br></br>
    <label className="answerText">
      Enter the word in English: <input name="answer" />
    </label>
  </div>
);

const Chatbot = () => (
  <div>
    <p>Chatbot coming soon!</p>
  </div>
);

export default function CourseDashboard() {
  const [activeTab, setActiveTab] = useState("Translation");
  return (
    <div>
      <header
        style={{
          backgroundColor: "#8300A1",
          color: "white",
          fontSize: "1.25rem",
          fontWeight: "bold",
          padding: "1rem 1.5rem",
          // display: "flex",
          // justifyContent: "center",
          // alignItems: "center",
          // textAlign: "center",
        }}
      >
        <img src={logoImage} alt="Logo" className="logo" />
        <span
          style={{
            // marginLeft: "300px"
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          Course Dashboard
        </span>
      </header>

      <div className="dashboard-container">
        <div className="main-content">
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="main">
            <Content activeTab={activeTab} />
          </div>
        </div>
        <SideBar />
      </div>
    </div>
  );
}
