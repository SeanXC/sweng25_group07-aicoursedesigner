import React, { createContext, useState, useContext } from 'react';

// make context
const CourseDataContext = createContext();

// create provider component 
export const CourseDataProvider = ({ children }) => {
  const [courseData, setCourseData] = useState(null); //init to null 

  return (
    <CourseDataContext.Provider value={{ courseData, setCourseData }}>
      {children}
    </CourseDataContext.Provider>
  );
};

// custom hook for context
export const useCourseData = () => {
  return useContext(CourseDataContext);
};
