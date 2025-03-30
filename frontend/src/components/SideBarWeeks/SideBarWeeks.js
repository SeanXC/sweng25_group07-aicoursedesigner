import React from "react";
import { useCourseData } from "../Context/CourseDataContext";
import "./SideBarWeeks.css";

export default function SideBarWeeks({ onWeekSelect, selectedWeek }) {
  const { courseData } = useCourseData();

  // Check if courseData is properly structured for both scenarios
  const weeks = courseData?.body?.generatedOutline?.weeks || courseData?.weeks || [];

  // Log the data to check its structure
  console.log("Course Data:", courseData);
  console.log("Weeks:", weeks);

  const handleWeekClick = (weekData) => {
    onWeekSelect(weekData);
    console.log("Side bar Clicked Week:", weekData);
    console.log("Side bar Week topic:", weekData.topic);
  };

  // Check if weeks are empty or undefined
  if (weeks.length === 0) {
    return (
      <div className="sidebar">
        <div className="current-week">
          <h3>No weeks available</h3>
        </div>
      </div>
    );
  }

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
