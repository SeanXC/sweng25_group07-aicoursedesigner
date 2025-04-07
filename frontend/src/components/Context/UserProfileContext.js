// Context/UserProfileContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const UserProfileContext = createContext();

export function UserProfileProvider({ children }) {
  const [userEmail, setUserEmail] = useState("");
  const [userLanguage, setUserLanguage] = useState("");
  const [userDifficulty, setUserDifficulty] = useState("");

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("email");
    const storedLanguage = sessionStorage.getItem("language");
    const storedDifficulty = sessionStorage.getItem("difficulty");

    if (storedEmail) setUserEmail(storedEmail);
    if (storedLanguage) setUserLanguage(storedLanguage);
    if (storedDifficulty) setUserDifficulty(storedDifficulty);
  }, []);

  const setUserProfile = ({ userEmail, userLanguage, userDifficulty }) => { // adding session storage to allow home.js and newCourseDashboard to load correclty 
    setUserEmail(userEmail);
    setUserLanguage(userLanguage);
    setUserDifficulty(userDifficulty);

    sessionStorage.setItem("email", userEmail);
    sessionStorage.setItem("language", userLanguage);
    sessionStorage.setItem("difficulty", userDifficulty);
  };

  return (
    <UserProfileContext.Provider
      value={{ userEmail, userLanguage, userDifficulty, setUserProfile }}
    >
      {children}
    </UserProfileContext.Provider>
  );
}

export const useUserProfile = () => useContext(UserProfileContext);
