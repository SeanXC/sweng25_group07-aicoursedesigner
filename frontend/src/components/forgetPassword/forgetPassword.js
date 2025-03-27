import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { CognitoUserPool, CognitoUser } from 'amazon-cognito-identity-js';
import config from '../../config.json';  // Import the configuration
import logoImage from '../../images/logowhite.png'; // Path to your image file
const ResetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');

  // Use the imported config to set up Cognito User Pool
  const poolData = {
    UserPoolId: config.userPoolId,  // Use UserPoolId from the config file
    ClientId: config.clientId       // Use ClientId from the config file
  };

  const userPool = new CognitoUserPool(poolData);

  // Handle the Forgot Password (request code)
  const handleForgotPassword = async (e) => {
    e.preventDefault();

    const userData = {
      Username: email,
      Pool: userPool,
    };

    const cognitoUser = new CognitoUser(userData);

    cognitoUser.forgotPassword({
      onSuccess: (data) => {
        console.log('Password reset code sent', data);
        setIsSent(true);
      },
      onFailure: (err) => {
        console.error('Error sending password reset code', err);
        setError(err.message || 'An error occurred');
      }
    });
  };

  // Handle the New Password Confirmation (after receiving the code)
  const handleConfirmPassword = async (e) => {
    e.preventDefault();

    const userData = {
      Username: email,
      Pool: userPool,
    };

    const cognitoUser = new CognitoUser(userData);

    cognitoUser.confirmPassword(verificationCode, newPassword, {
      onSuccess: (data) => {
        console.log('Password reset successful', data);
        alert('Password reset successful');
        navigate('/login'); // Redirect to login after successful reset
      },
      onFailure: (err) => {
        console.error('Error resetting password', err);
        setError(err.message || 'An error occurred');
      }
    });
  };

  const handleImageClick = () => {
    navigate("/"); // Navigate to home page on logo click
  };


  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "#9705A8" }}>
      <div style={{ backgroundColor: "white", padding: "1rem", borderRadius: "10px", width: "320px" }}>

        
        <h2>{isSent ? 'Reset Your Password' : 'Forget Password'}</h2>

          {/* Image at the top right of the screen */}
              <div style={{ width: "100%", textAlign: "center", position: "absolute", top: "25px", right:"500px" }}>
                <img 
                  src={logoImage} 
                  alt="Confirmation" 
                  style={{ width: "200px", borderRadius: "10px" }}
                  onClick={handleImageClick} 
                />
              </div>
        

        <form onSubmit={isSent ? handleConfirmPassword : handleForgotPassword} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {!isSent ? (
            <>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid #ccc" }}
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
                }}
              >
                Send Reset Code
              </button>
            </>
          ) : (
            <>
              <input
                type="text"
                placeholder="Enter verification code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
                style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid #ccc" }}
              />
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid #ccc" }}
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
                }}
              >
                Reset Password
              </button>
            </>
          )}

          {error && <p>{error}</p>}

          {/* Back to Login link */}
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                cursor: "pointer",
                color: "purple",
                fontSize: "0.9rem",
              }}
              onClick={() => navigate('/login')}
            >
              Back to Login
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
