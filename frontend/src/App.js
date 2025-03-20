import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomeDashboard from './components/Home/Home';  // Importing HomeDashboard from Home.js
import ConnectAWS from './components/AWSButton/AWSButton';
import UserLogin from "./components/UserLogin/UserLogin";
import CourseForm from './components/CourseForm/CourseForm';
import ConfirmUserPage from './components/ConfirmUser/confirmUser';
import ForgotPassword from './components/forgetPassword/forgetPassword';
import SignOut from './components/SignOut/SignOut'; 
import UserProfile from './components/UserProfile/userProfile'; 
import ConfirmSignOut from './components/ConfirmSignOut/confirmSignOut';
import Roleplay from "./components/Roleplay/roleplay";
import Chatbot from './components/Chatbot/Chatbot';
import CourseDashboard from "./components/newCourseDashbaord/newCourseDashboard";
import CompleteProfile from './components/ConfirmUser/completeProfile';
import CourseDisplay from './components/courseDisplay/courseDisplay'

function App() {
  const isAuthenticated = () => {
    const accessToken = sessionStorage.getItem("accessToken");
    return !!accessToken;
  };

  return (
    <BrowserRouter>
      {
      <Routes>
        <Route path="/" element={<HomeDashboard />} />

        <Route path="/connectaws" element={<ConnectAWS />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/confirmUser" element={<ConfirmUserPage />} />
        <Route path="/courseform" element={<CourseForm />} />
        <Route path="/forgetPassword" element={<ForgotPassword />} />
        <Route path="/signout" element={<SignOut />} />
        <Route path="/userProfile" element={<UserProfile />} />
        <Route path="/confirmSignOut" element={<ConfirmSignOut />} />
        <Route path="/roleplay" element={<Roleplay />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/courseDashboard" element={<CourseDashboard />} />
        <Route path="/completeProfile" element={<CompleteProfile />} />
        <Route path="/courseDisplay" element={<CourseDisplay />} />

        <Route
          path="/protected"
          element={
            isAuthenticated() ? (
              <HomeDashboard />
            ) : (
              <Navigate replace to="/login" />
            )
          }
        />
      </Routes>
      }
   
    </BrowserRouter>
  );
}




export default App;
