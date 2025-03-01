import React from "react";
import "./Chatbot.css";
import { useState } from "react";
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
  
    const questions = [
      "¿Cuál es tu nombre?",            // "What is your name?"
      "¿Cuántos años tienes?",          // "How old are you?"
      "¿Dónde vives?",                  // "Where do you live?"
      "¿Qué te gusta hacer?",           // "What do you like to do?"
      "¿Cuál es tu color favorito?"     // "What is your favorite color?"
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
        setInputText(""); // Clear input after sending "Hola"
        setQuestionIndex(1); // Start the first question after Hola
      } else if (questionIndex > 0 && questionIndex < questions.length) {
        setMessages([
          ...messages,
          { sender: "user", text: inputText },
          { sender: "bot", text: questions[questionIndex] }
        ]);
        setInputText("");
        setQuestionIndex(questionIndex + 1); // Move to the next question
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
        </div>
      </div>
    );
  }