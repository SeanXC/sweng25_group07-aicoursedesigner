import React, { useState, useRef } from "react";
import axios from 'axios';
import micImage from './microphone-342.svg';
import "./Chatbot.css";
import { useCourseData } from "../Context/CourseDataContext";
import { useUserProfile } from "../Context/UserProfileContext";


export default function Chatbot() {

  const [inputText, setInputText] = useState("");

  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! How can I assist you today?" }
  ]);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");

  const recognitionRef = useRef(null);

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  // Mapping of languages to speech recognition tags
  const languageTags = {
    Spanish: "es-ES",
    French: "fr-FR",
    Italian: "it-IT",
    German: "de-DE",
    Portuguese: "pt-PT",
    English: "en-US",
  };
  
  const { courseData } = useCourseData();
  const {userEmail, userLanguage, userDifficulty } = useUserProfile();

  const genOutline = courseData?.body?.generatedOutline || {}; 

  if (Array.isArray(genOutline.weeks)) {
      genOutline.weeks.map((week) => {
          console.log("Week:", week);
      });
  } else {
      console.error("genOutline.weeks is not an array:", genOutline.weeks);
  }
  console.log ("Outline", genOutline)

  // Dynamically set the languageTag based on userLanguage
  const languageTag = languageTags[userLanguage] || "en-US"; // Default to "en-US" if no match

  console.log("UserProfileContext:", { userLanguage, userDifficulty, userEmail });
  console.log("Selected language tag:", languageTag);  // Debugging log

  const handleSendMessage = async () => {

    setMessages([
      ...messages,
      { sender: "user", text: inputText },
    ]);
    setInputText("");

    const requestBody = {
      email: userEmail,
      userLevel: "Intermediate",  // Fixed the syntax for userDifficulty
      language: userLanguage,     // Fixed the syntax for userLanguage
      languageTag: languageTag,   // Set languageTag dynamically
      topic: "Travel",
      userMsg: inputText,         // Use the user input as the message
      weekTarget: 1,
      outline: genOutline


    };
    console.log("Sending request body:", requestBody);
    console.log("Type of genOutline:", typeof genOutline, genOutline);

    try {
      const response = await axios.post(
        'https://xoo613pdgk.execute-api.eu-west-1.amazonaws.com/chat/generate-chat',  
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.REACT_APP_API_KEY,
          }
        }
      );

      const botResponse = response.data.body.response;

      setMessages([
        ...messages,
        { sender: "user", text: inputText },
        { sender: "bot", text: botResponse }
      ]);
      
      speakText(botResponse);
      
    } catch (error) {
      console.error("Error sending message:", error.response?.data || error.message);

    }
  };

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  const toggleMic = () => {
    if (!SpeechRecognition) {
      console.error("Speech Recognition API is not supported in this browser.");
      return;
    }

    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        setIsRecording(false);
      }
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = languageTag;  // Dynamically set the language for speech recognition
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      setTranscript(currentTranscript);
      setInputText(currentTranscript);
    };

    recognition.onerror = (event) => {
      console.error('Error with speech recognition:', event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
    setIsRecording(true);
    recognitionRef.current = recognition;
  };

  const speakText = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = languageTag;  // Dynamically set the language for speech synthesis
    window.speechSynthesis.speak(speech);
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        {messages.map((message, index) => (
          <div
            key={index}
            className={message.sender === "bot" ? "bot-message" : "user-message"}
          >
            {message.text}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          placeholder="Type here"
          className="chat-input"
        />
        <button className="send-button" onClick={handleSendMessage}>Send</button>
        
        <div
          className={`mic-button ${isRecording ? "recording" : ""}`}
          onClick={toggleMic}
        >
          <img src={micImage} alt="microphone" />
        </div>
      </div>
    </div>
  );
}
