import React, { useState, useRef } from "react";
import axios from 'axios';
import micImage from './microphone-342.svg';
import "./Chatbot.css";
import { useCourseData } from "../Context/CourseDataContext";

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

  const { courseData } = useCourseData();
  const userLanguage = courseData.targetLang;  // Directly use the value from context
  const userDifficulty = courseData.difficulty;  // Directly use the value from context


  const handleSendMessage = async () => {
    setMessages([
      ...messages,
      { sender: "user", text: inputText },
    ]);
    setInputText("");



    const requestBody = {
  "email": "test@email.com",
  "userLevel": {userDifficulty},
  "language": {userLanguage},
  "languageTag": "fr-FR",
  "topic": "Travel",
  "userMsg": "",
  "weekTarget": 1,
  "outline": {
    "course_title": "French for Travelers",
    "weeks": [
      {
        "week": 1,
        "title": "Basic Greetings and Introductions",
        "objectives": [
          "Use basic French greetings",
          "Introduce yourself in French"
        ],
        "main_content": [
          "Bonjour, Salut, Comment ça va",
          "Je m'appelle..., Je suis de..."
        ],
        "activities": [
          "Role-play greetings",
          "Practice dialogues"
        ]
      },
      {
        "week": 2,
        "title": "Ordering Food",
        "objectives": [
          "Order food and drinks",
          "Understand menu vocabulary"
        ],
        "main_content": [
          "Je voudrais..., L'addition, s'il vous plaît",
          "Types of food and beverages"
        ],
        "activities": [
          "Menu simulation",
          "Ordering practice"
        ]
      }
    ]
  }  
    };

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
      console.error("Error sending message:", error);
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
    recognition.lang = 'fr-FR';
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
    speech.lang = 'fr-FR';
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
