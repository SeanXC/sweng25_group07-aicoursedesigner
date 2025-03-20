import React, { useState, useRef } from "react";
import axios from 'axios';
import micImage from './microphone-342.svg';
import "./Chatbot.css";
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

  const handleSendMessage = async () => {
    setMessages([
      ...messages,
      { sender: "user", text: inputText },
    ]);
    setInputText("");

    const requestBody = {
      email: "test@email.com",  
      userLevel: "Intermediate",  
      language: "Spanish",  
      topic: "Travel",  
      userMsg: inputText,  
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
        
        <div
          className={`mic-button ${isRecording ? "recording" : ""}`}
          onClick={toggleMic}
        >
          <img src={micImage} alt="microphone" />
        </div>

        {/* Dummy Circle Button */}
        <div className="dummy-circle-button" onClick={() => alert("Dummy button clicked!")}></div>
      </div>
    </div>
  );
}
