import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from './Home'; // Home page component
import LoginPage from './UserLogin'; // Login page component
import ConfirmUserPage from './confirmUser'; // Confirm user page component

function App() {
  const isAuthenticated = () => {
    const accessToken = sessionStorage.getItem("accessToken");
    return !!accessToken;
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Home Page Route */}
          <Route path="/" element={<Home />} />

          {/* Sign In / Sign Up Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* User Confirmation Page */}
          <Route path="/confirmUser" element={<ConfirmUserPage />} />

          {/* Protected Home route after login */}
          <Route
            path="/Home"
            element={
              isAuthenticated() ? <Home /> : <Navigate replace to="/Login" />
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
