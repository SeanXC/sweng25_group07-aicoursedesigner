import logo from './logo.svg';
import './App.css';
import HomeDashboard from './Home';
import ConnectAWS from './AWSButton';
import UserLogin from './UserLogin'; 
import CourseForm from './CourseForm';
import { Routes, Route } from "react-router-dom";



// import UserLogin from './UserLogin';
function App() {
  return (
    <Routes>
    <Route path="/" element={<HomeDashboard />} />
    <Route path="/connectaws" element={<ConnectAWS />} />
    <Route path="/userlogin" element={<UserLogin />} />
    <Route path="/courseform" element={<CourseForm />} />
  </Routes>
  );
}

export default App;
