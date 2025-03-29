import React from "react";
import { useState, useEffect } from "react";
import { useCourseData } from "../Context/CourseDataContext";
import "./SideBarWeeks.css";

export default function SideBarWeeks({ onWeekSelect, selectedWeek }) {
  const { courseData, setCourseData } = useCourseData();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const weeks = courseData?.body?.generatedOutline?.weeks || [];
  const [newTopic, setNewTopic] = useState("");

  const handleWeekClick = (weekData) => {
    onWeekSelect(weekData);
    setNewTopic(weekData.topic);
  };

  const handleUpdateTopic = () => {
    if (!selectedWeek || !newTopic) return;

    const updatedWeeks = weeks.map((week) => {
      if (week.week === selectedWeek) {
        return { ...week, topic: newTopic };
      } else {
        return week;
      }
    });

    setCourseData({
      ...courseData,
      body: {
        ...courseData.body,
        generatedOutline: {
          ...courseData.body.generatedOutline,
          weeks: updatedWeeks,
        },
      },
    });
  };

  return (
    <div className="sidebar">
      <div className="current-week">
        <h3>Current Week: {selectedWeek ? `Week ${selectedWeek}` : "None"}</h3>
        <button onClick={() => setSettingsOpen(!settingsOpen)}>
          Topic Settings
        </button>
      </div>
      {settingsOpen && (
        <div>
          <h3>Topic Settings</h3>
          Select the week you would like to edit.
          <br />
          <br />
          Currently editing: Week {selectedWeek} 
          <br />
          <br />

          <input
            type="text"
            placeholder="Enter new topic"
            value={newTopic}
            onChange={(e) => setNewTopic(e.target.value)}
          />
          <br />
          <br />
          <button onClick={handleUpdateTopic}>Update Topic</button>
        </div>
      )}
      <br />
      {weeks.map((week) => (
        <div
          key={week.week}
          className={`week-box ${selectedWeek === week.week ? "selected" : ""}`}
          onClick={() => handleWeekClick(week)}
        >
          <p>
            <b>Week {week.week}</b>
          </p>
          <p>{week.topic}</p>
        </div>
      ))}
    </div>
  );
}
