import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from './Home'; 
import HomeDashboard from './HomeDashboard';
import ConnectAWS from './AWSButton';
import UserLogin from './UserLogin'; 
import CourseForm from './CourseForm';
import ConfirmUserPage from './confirmUser';

function App() {
  const isAuthenticated = () => {
    const accessToken = sessionStorage.getItem("accessToken");
    return !!accessToken;
  };

  return (
    <BrowserRouter>
      <Routes>
       
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<HomeDashboard />} />
        <Route path="/connectaws" element={<ConnectAWS />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/confirmUser" element={<ConfirmUserPage />} />
        <Route path="/courseform" element={<CourseForm />} />
        <Route
          path="/protected"
          element={isAuthenticated() ? <Home /> : <Navigate replace to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
