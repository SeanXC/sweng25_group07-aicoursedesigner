import React, { useState, useRef } from "react";
import "./Chatbot.css";
import micImage from './microphone-342.svg'; 
import AWS from 'aws-sdk';

AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  region: process.env.REACT_APP_AWS_REGION,
});

export default function Chatbot() {
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Type 'Hola' to start" }
  ]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  
  const recognitionRef = useRef(null);

  const questions = [
    "¿Cuál es tu nombre?",            // "What is your name?"
    "¿Dónde vives?",                  // "Where do you live?"
    "¿Qué te gusta hacer?",           // "What do you like to do?"
    "¿Cuál es tu color favorito?",     // "What is your favorite color?"
    "¿Cuántos años tienes?"           // "How old are you?"

  ];

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleSendMessage = () => {
    if (inputText.toLowerCase() === "hola" && questionIndex === 0) {
      setMessages([
        ...messages,
        { sender: "user", text: inputText },
        { sender: "bot", text: questions[questionIndex] }
      ]);
      setInputText(""); 
      setQuestionIndex(1); 
      speakText(questions[questionIndex]);
    } else if (questionIndex > 0 && questionIndex < questions.length) {
      setMessages([
        ...messages,
        { sender: "user", text: inputText },
        { sender: "bot", text: questions[questionIndex] }
      ]);
      setInputText("");
      setQuestionIndex(questionIndex + 1); 
      speakText(questions[questionIndex]);
    } else if (questionIndex === questions.length) {
      setMessages([
        ...messages,
        { sender: "user", text: inputText },
        { sender: "bot", text: "Thank you for completing the questions!" }
      ]);
      setInputText("");
      setQuestionIndex(0); 
    }
  };

  // Check for browser support
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  // Toggle Mic On/Off
  const toggleMic = () => {
    if (!SpeechRecognition) {
      console.error("Speech Recognition API is not supported in this browser.");
      return;
    }

    if (isRecording) {
      // Stop recording if already on
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        setIsRecording(false);
      }
      return;
    }

    // Start recording if off
    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
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

  // Text-to-Speech
  const speakText = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'es-ES';
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
        
        {/* Microphone Button */}
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


