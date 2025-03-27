// UserProfileContext.js
import React, { createContext, useContext, useState } from 'react';

// Creating the context
const UserProfileContext = createContext();

// Custom hook to use the UserProfileContext
export const useUserProfile = () => {
  return useContext(UserProfileContext);
};

// Provider component that wraps the application
export const UserProfileProvider = ({ children }) => {
  const [userLanguage, setUserLanguage] = useState('');
  const [userDifficulty, setUserDifficulty] = useState('');
  const [userEmail, setUserEmail] = useState('');  // Add email state

  return (
    <UserProfileContext.Provider value={{ userLanguage, setUserLanguage, userDifficulty, setUserDifficulty, userEmail, setUserEmail }}>
      {children}
    </UserProfileContext.Provider>
  );
};
