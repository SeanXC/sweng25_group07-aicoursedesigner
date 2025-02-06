import React, { useState } from "react";
import googleLogo from './google-logo-icon.jpg';
import appleLogo from './apple-logo-icon.jpg';

export default function UserLogin() {
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
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isForgotPassword) {
      console.log("Resetting password for", formData.resetEmail);
    } else if (isLogin) {
      console.log("Logging in with", formData.username, formData.password);
      setIsSubmitted(true); // Show Google/Apple buttons after login
    } else {
      console.log("Signing up with", formData.name, formData.email);
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
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      {/* Login or Signup Form */}
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
  );
}
