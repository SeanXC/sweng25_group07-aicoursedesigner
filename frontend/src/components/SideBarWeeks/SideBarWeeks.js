import React from "react";
import { useCourseData } from "../Context/CourseDataContext";
import "./SideBarWeeks.css";

export default function SideBarWeeks({ onWeekSelect, selectedWeek }) {
  const { courseData } = useCourseData();
  const weeks = courseData?.body?.generatedOutline?.weeks || [];

  const handleWeekClick = (weekData) => {
    onWeekSelect(weekData);
    console.log("Side bar Clicked Week:", weekData);
    console.log("Side bar Week topic:", weekData.topic);
  };

  return (
    <div className="sidebar">
      <div className="current-week">
        <h3>Current Week: {selectedWeek ? `Week ${selectedWeek}` : "None"}</h3>
      </div>
      {weeks.map((week) => (
        <div
          key={week.week}
          className={`week-box ${selectedWeek === week.week ? "selected" : ""}`}
          onClick={() => handleWeekClick(week)}
        >
          <p><b>Week {week.week}</b></p>
          <p>{week.topic}</p>
        </div>
      ))}
    </div>
  );
}
