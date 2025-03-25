import React, { useState, useEffect, useContext } from "react";
import { useCourseData } from "../Context/CourseDataContext";
import "./SideBarWeeks.css";
import {Translation} from "../newCourseDashbaord/newCourseDashboard";

export default function SideBarWeeks({ setSelectedWeek }) {
  const { courseData } = useCourseData(); //gets you the course data
  const weeks = courseData.body.generatedOutline.weeks;

  const handleWeekClick = (week) => {
    setSelectedWeek(week.week);
    console.log("Side bar Clicked Week:", week);
    console.log("side bar Week topic: ", week.topic);
  };
  //   if (!courseData || !courseData.body || !courseData.body.generatedOutline) {
  //     return <div className="sidebar">Loading...</div>;
  //   }

  return (
    <div className="sidebar">
      {weeks.map((week) => (
        <div className="weeks">
          <div
            key={week.week}
            className={"week-box"}
            onClick={() => handleWeekClick(week)}
          >
            <p>
              <b>Week {week.week}</b>
            </p>
            <p>{week.topic}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
