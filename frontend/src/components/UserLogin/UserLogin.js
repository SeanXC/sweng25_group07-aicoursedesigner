import React, { useState } from "react";
import googleLogo from '../../images/google-logo-icon.jpg';
import appleLogo from '../../images/apple-logo-icon.jpg';
import { signIn, signUp } from "../AuthService/authService"; // Assuming you have these functions for sign in and sign up
import { useNavigate } from 'react-router-dom'; // Import useNavigate for programmatic navigation
import logoImage from '../../images/logowhite.png'; // Path to your logo

export default function UserLogin() {
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [isLogin, setIsLogin] = useState(true); // State to toggle between login and signup forms
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    email: "",
    confirmEmail: "",
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Toggle between login and signup forms
  const toggleForm = () => {
    setIsLogin((prev) => !prev);
  };

  // Handle form submission (for login and signup)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLogin) {
      console.log("Logging in with", formData.username, formData.password);
      try {
        const session = await signIn(formData.username, formData.password);
        console.log("Sign in successful", session);
        if (session?.AccessToken) {
          sessionStorage.setItem("accessToken", session.AccessToken);
          sessionStorage.setItem("email", formData.username); // Store email (only available if signup form)
          navigate("/"); // Redirect to home after successful login
        } else {
          console.error("SignIn session or AccessToken is undefined.");
        }
      } catch (error) {
        alert(`Sign in failed: ${error}`);
      }
    } else {
      console.log("Signing up with", formData.name, formData.email);
      try {
        await signUp(formData.email, formData.password);
        sessionStorage.setItem("name", formData.name); // Store username
        sessionStorage.setItem("email", formData.email); // Store email (only available if signup form)
        navigate("/confirmUser"); // Redirect to confirmUser after signup
      } catch (error) {
        alert(`Sign up failed: ${error}`);
      }
    }
  };

  // Handle forgot password link click to navigate to ForgetPassword.js
  const handleForgotPasswordClick = () => {
    navigate("/forgetPassword"); // Redirect to ForgetPassword page
  };

  const handleImageClick = () => {
    navigate("/"); // Navigate to home page on logo click
  };

  return (
    <div style={{ backgroundColor: "#9705A8", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      {/* Logo Image */}
      <div style={{ width: "100%", textAlign: "center", position: "absolute", top: "25px", right: "500px" }}>
        <img
          src={logoImage}
          alt="Logo"
          style={{ width: "200px", borderRadius: "10px" }}
          onClick={handleImageClick}
        />
      </div>

      {/* Login or Signup Form */}
      <div style={{ border: "3px solid white", padding: "1rem", borderRadius: "10px", backgroundColor: "white", width: "320px" }}>
        <h2>{isLogin ? "Sign in" : "Create Account"}</h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {isLogin ? (
            <>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Email"
                required
                style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid #ccc" }}
              />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                required
                style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid #ccc" }}
              />
            </>
          ) : (
            <>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Name"
                required
                style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid #ccc" }}
              />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                required
                style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid #ccc" }}
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                required
                style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid #ccc" }}
              />
              <input
                type="email"
                name="confirmEmail"
                value={formData.confirmEmail}
                onChange={handleInputChange}
                placeholder="Confirm Email"
                required
                style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid #ccc" }}
              />
            </>
          )}
          <button
            type="submit"
            style={{
              backgroundColor: "purple",
              color: "white",
              padding: "0.75rem 1.5rem",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              marginTop: "1rem",
            }}
          >
            {isLogin ? "Sign in" : "Create Account"}
          </button>

      <div style={{ textAlign: "center" }}>
        <p
          style={{ marginTop: "1rem", cursor: "pointer", color: "purple" }}
          onClick={toggleForm}
        >
          {isLogin ? "New user? Sign up here" : "Already have an account? Sign in"}
        </p>

        {/* Forgot Password link */}
        {isLogin && (
          <p
            style={{
              marginTop: "1rem",
              cursor: "pointer",
              color: "purple",
              fontSize: "0.9rem",
            }}
            onClick={handleForgotPasswordClick}
          >
            Forget Password?
          </p>
        )}
      </div>
    </form>

        {/* Social login buttons */}
        <div style={{ marginTop: "0.5rem", display: "flex", flexDirection: "column", gap: "0.05rem" }}>
          <button 
            style={{
              backgroundColor: "white",
              color: "black",
              padding: "0.05rem 1.2rem",
              borderRadius: "8px",
              border: "groove",
              cursor: "pointer",
              margin: "0.5rem 0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img src={googleLogo} alt="Google" style={{ width: '40px', marginRight: '1px' }} />
            Continue with Google
          </button>

          <button
            style={{
              backgroundColor: "white",
              color: "black",
              padding: "0.05rem 1.2rem",
              borderRadius: "8px",
              border: "groove",
              cursor: "pointer",
              margin: "0.5rem 0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img src={appleLogo} alt="Apple" style={{ width: '40px', marginRight: '2px' }} />
            Continue with Apple
          </button>
        </div>
      </div>
    </div>
  );
}
