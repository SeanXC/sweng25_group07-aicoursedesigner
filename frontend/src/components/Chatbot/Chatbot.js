import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import micImage from "./microphone-342.svg";
import "./Chatbot.css";
import { useCourseData } from "../Context/CourseDataContext";
import { useUserProfile } from "../Context/UserProfileContext";

export default function Chatbot({ selectedWeek, selectedTopic }) {
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! How can I assist you today?" }
  ]);
  const [isRecording, setIsRecording] = useState(false);

  const recognitionRef = useRef(null);
  let realTimeSpeech = useRef(false);

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
  const { userEmail, userLanguage, userDifficulty } = useUserProfile();

  // Get the generated outline from courseData
  const genOutline = courseData?.body?.generatedOutline || {};

  console.log("Outline", genOutline);
  console.log("UserProfileContext:", { userLanguage, userDifficulty, userEmail });

  // Dynamically set the languageTag based on userLanguage
  const languageTag = languageTags[userLanguage] || "en-US";
  console.log("Selected language tag:", languageTag);

  // Use selectedWeek and selectedTopic from props if available; otherwise, use defaults.
  const topicToUse = selectedTopic || "Travel";
  const weekTargetToUse = selectedWeek || 1;

  // When the selected week or topic changes, reset the conversation.
  useEffect(() => {
    // Reset messages and clear input/transcript when week/topic changes
    setMessages([{ sender: "bot", text: "Hi! How can I assist you today?" }]);
    setInputText("");
  }, [selectedWeek, selectedTopic]);

  const handleSendMessage = async (message = inputText) => {
    if(!message.trim()) return;

    // Append the user's message to the chat messages
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "user", text: message }
    ]);
    setInputText("");

    const requestBody = {
      email: userEmail,
      userLevel: userDifficulty, 
      language: userLanguage,
      languageTag: languageTag,
      topic: topicToUse,
      userMsg: message,
      weekTarget: weekTargetToUse,
      outline: genOutline,
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

      setMessages((prevMessages) => [
        ...prevMessages,
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
        realTimeSpeech.current = false;
      }
      return;
    }

    realTimeSpeech.current = true;
    startMic();
  };

  const startMic = () => {
    if(!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = languageTag;
    recognition.interimResults = true;
    recognition.continuous = false;

    let finalTranscript = "";

    recognition.onresult = (event) => {
      let currentTranscript = "";
      for(let i=0; i<event.results.length; i++){
        let transcript = event.results[i][0].transcript;
        if(event.results[i].isFinal){
          finalTranscript += transcript + " ";
        } else{
          currentTranscript += transcript + " ";
        }
      }

      setInputText(finalTranscript + currentTranscript);
    };

    recognition.onerror = (event) => {
      console.error('Error with speech recognition:', event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
      if(finalTranscript.trim()){
        handleSendMessage(finalTranscript.trim());
      }
    };

    recognition.start();
    setIsRecording(true);
    recognitionRef.current = recognition;
  };

  const speakText = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = languageTag;
    speech.onend = () => {
      if(realTimeSpeech.current){
        startMic();
      }
    };
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
          placeholder={realTimeSpeech.current?"Speak now...":"Type here"}
          className="chat-input"
          disabled={realTimeSpeech.current}
        />
        <button className="send-button" onClick={handleSendMessage} disabled={realTimeSpeech.current}>Send</button>
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