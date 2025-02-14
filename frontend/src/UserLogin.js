import React, { useState } from "react";
import googleLogo from './google-logo-icon.jpg';
import appleLogo from './apple-logo-icon.jpg';
import { signIn, signUp } from "./authService"; // Assuming you have these functions for sign in and sign up
import { useNavigate } from 'react-router-dom'; // Import useNavigate for programmatic navigation
import logoImage from './logowhite.png'; // Path to your image file


export default function UserLogin() {
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [isLogin, setIsLogin] = useState(true); // State to toggle between login and signup forms
  const [isForgotPassword, setIsForgotPassword] = useState(false); // State for forgot password
  const [isSubmitted, setIsSubmitted] = useState(false); // State for showing Google and Apple buttons after login click
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    email: "",
    confirmEmail: "",
    resetEmail: "", // State for reset password email
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

  // Handle form submission (for login, signup, and password reset)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isForgotPassword) {
      console.log("Resetting password for", formData.resetEmail);
    } else if (isLogin) {
      console.log("Logging in with", formData.username, formData.password);
      try {
        const session = await signIn(formData.username, formData.password);
        console.log("Sign in successful", session);
        if (session && typeof session.AccessToken !== "undefined") {
          sessionStorage.setItem("accessToken", session.AccessToken);
          if (sessionStorage.getItem("accessToken")) {
            navigate("/home"); // Redirect to home after login using useNavigate
          } else {
            console.error("Session token was not set properly.");
          }
        } else {
          console.error("SignIn session or AccessToken is undefined.");
        }
      } catch (error) {
        alert(`Sign in failed: ${error}`);
      }
      setIsSubmitted(true); // Show Google/Apple buttons after login
    } else {
      console.log("Signing up with", formData.name, formData.email);
      try {
        await signUp(formData.email, formData.password);
        // Navigate to confirmation page after successful sign up
        navigate("/confirmUser"); // Redirect to confirmUser after signup
      } catch (error) {
        alert(`Sign up failed: ${error}`);
      }
    }
  };

  // Handle forgot password click
  const handleForgotPasswordClick = () => {
    setIsForgotPassword(true); // Show reset password form
  };

  // Handle back to login click
  const handleBackToLoginClick = () => {
    setIsForgotPassword(false); // Go back to login form
  };

  return (
    <div style={{ backgroundColor: "#9705A8", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      {/* Image centered at the top of the screen */}
             <div style={{ width: "100%", textAlign: "center", position: "absolute", top: "25px", right:"500px" }}>
              <img 
                src={logoImage} 
                alt="Confirmation" 
                style={{ width: "200px", borderRadius: "10px" }} 
              />
            </div>
      
      {/* Login or Signup Form */}
      <div style={{ border: "3px solid white", padding: "1rem", borderRadius: "10px", backgroundColor: "white", width: "320px" }}>
        {!isForgotPassword && !isSubmitted && (
          <>
            <h2>{isLogin ? "Sign in" : "Create Account"}</h2>
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {isLogin ? (
                <>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Email"
                    required
                    style={{
                      padding: "0.75rem",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                    }}
                  />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Password"
                    required
                    style={{
                      padding: "0.75rem",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                    }}
                  />
                </>
              ) : (
                <>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="UserName"
                    required
                    style={{
                      padding: "0.75rem",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                    }}
                  />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Password"
                    required
                    style={{
                      padding: "0.75rem",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                    }}
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                    required
                    style={{
                      padding: "0.75rem",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                    }}
                  />
                  <input
                    type="email"
                    name="confirmEmail"
                    value={formData.confirmEmail}
                    onChange={handleInputChange}
                    placeholder="Confirm Email"
                    required
                    style={{
                      padding: "0.75rem",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                    }}
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
            </form>

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
            
            {/* Social login buttons */}
            <div
              style={{
                marginTop: "0.5rem",
                display: "flex",
                flexDirection: "column", // Stack buttons vertically
                gap: "0.05rem", // Add space between buttons
              }}
            >
              <button
                style={{
                  backgroundColor: "white",
                  color: "black",
                  padding: "0.05rem 1.2rem",
                  borderRadius: "8px",
                  border: "groove",
                  cursor: "pointer",
                  margin: "0.5rem 0",
                  display: "flex", // Use flexbox to arrange content
                  alignItems: "center", // Vertically align the text and image
                  justifyContent: "center", // Horizontally center the text and image
                }}
              >
                <img
                    src={googleLogo}
                    alt="Google"
                    style={{
                        width: '40px',
                        marginRight: '1px', // Adds space between the image and the text
                    }}
                />
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
                  display: "flex", // Use flexbox to arrange content
                  alignItems: "center", // Vertically align the text and image
                  justifyContent: "center", // Horizontally center the text and image
                }}
              >
                <img
                    src={appleLogo}
                    alt="Apple"
                    style={{
                        width: '40px',
                        marginRight: '2px', // Adds space between the image and the text
                    }}
                />
                Continue with Apple
              </button>
            </div>
          </>
        )}

        {/* Reset Password Form */}
        {isForgotPassword && (
          <>
            <h2>Reset Password</h2>
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <input
                type="email"
                name="resetEmail"
                value={formData.resetEmail}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
                style={{
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                }}
              />
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
                Send Email
              </button>
            </form>
            <p
              style={{ marginTop: "1rem", cursor: "pointer", color: "purple" }}
              onClick={handleBackToLoginClick}
            >
              Back to Log in
            </p>
          </>
        )}
      </div>
    </div>
  );
}
