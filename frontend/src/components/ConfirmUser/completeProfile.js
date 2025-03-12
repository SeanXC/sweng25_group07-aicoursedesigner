import React from 'react';
import { useNavigate } from 'react-router-dom';
import tickImage from './tick.png'; // Import your tick image
import iconImage from './nualaCelebrating.svg'; // Path to your image file

export default function ProfileCompletionPopup() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '10px',
        boxShadow: '0 0 10px rgba(0,0,0,0.3)',
        textAlign: 'center',
        zIndex: 1001,
      }}
    >
      {/* Image at the top center of the screen */}
      <div style={{ width: "100%", textAlign: "center", position: "absolute", top: "-85px", left: "150px" }}>
        <img 
          src={iconImage} 
          alt="Icon" 
          style={{ width: "80px", borderRadius: "10px" }} 
        />
      </div>

      {/* Tick image */}
      <img
        src={tickImage}
        alt="Tick"
        style={{ width: '70px', height: '70px', marginBottom: '1rem' }}
      />
      
      <h3 style={{ color: '#6A1B9A' }}>Account Confirmed Successfully!</h3>

      <h4 style={{ color: '#8E24AA' }}> Remember to Complete Your Profile</h4>
      <p style={{ color: '#555', fontSize: '1rem' }}>
        Enhance your experience by completing your profile!
      </p>
      
      <button
        onClick={() => navigate('/')}
        style={{
          backgroundColor: '#9705A8',
          color: 'white',
          padding: '0.5rem 1.5rem',
          borderRadius: '8px',
          border: 'none',
          cursor: 'pointer',
          marginTop: '1rem',
          fontSize: '1rem',
          transition: 'all 0.3s ease',
        }}
      >
        Got it
      </button>
    </div>
  );
}

export const PageWrapper = () => {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #8E24AA, #6A1B9A)',  // Purple gradient background
        minHeight: '100vh',  // Full screen height
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Arial, sans-serif',  // Set font
      }}
    >
      <ProfileCompletionPopup />
    </div>
  );
};
