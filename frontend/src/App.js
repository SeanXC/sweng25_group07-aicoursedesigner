import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomeDashboard from './Home';  // Importing HomeDashboard from Home.js
import ConnectAWS from './AWSButton';
import UserLogin from './UserLogin'; 
import CourseForm from './CourseForm';
import ConfirmUserPage from './confirmUser';
import ForgotPassword from './forgetPassword';
import SignOut from './SignOut'; 
import UserProfile from './userProfile'; 
import ConfirmSignOut from './confirmSignOut';
import Roleplay from "./roleplay";
import Chatbot from './Chatbot';


function App() {
  const isAuthenticated = () => {
    const accessToken = sessionStorage.getItem("accessToken");
    return !!accessToken;
  };

  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}

export default App;
