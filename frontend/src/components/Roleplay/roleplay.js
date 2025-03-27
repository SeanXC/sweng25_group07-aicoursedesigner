import React, { useState, useEffect } from "react";
import "./roleplay.css";
import carlosImg from "../../images/nuala12.svg";
import anaImg from "../../images/nuala21.svg";
import CarlosCelebrating from "../../images/nuala_12_celebrating.svg";
import AnaCelebrating from "../../images/nuala_21_celebrating.svg";
import { useCourseData } from "../Context/CourseDataContext";

export default function Roleplay() {
  const [conversationData, setConversationData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasGenerated, setHasGenerated] = useState(false);
  // const [history, setHistory] = useState([]);
  // const [selectedConversation, setSelectedConversation] = useState(null);
  const [topic, setTopic] = useState(""); // Store the topic input
  const [weekTarget, setWeekTarget] = useState(""); // Store the week target input

  const { courseData } = useCourseData();
  const userLanguage = courseData.targetLang;  // Directly use the value from context
  const userDifficulty = courseData.difficulty;  // Directly use the value from context


  const fetchRoleplay = async () => {
    if (!topic || !weekTarget) {
      setError("Please enter both a topic and a week target before generating a roleplay.");
      return;
    }


    try {
      setLoading(true);
      setError("");
      setConversationData([]); // Clear existing conversation data
      const conversations = [];

      for (let i = 0; i < 3; i++) {
        const response = await fetch(
          "https://ed86wj91pe.execute-api.eu-west-1.amazonaws.com/prod/generate-roleplay",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: "user@example1.com",
              userLevel: {userDifficulty},
              language: {userLanguage},
              topic: topic,
              weekTarget: parseInt(weekTarget), // Use the weekTarget state
              outline: {
                weeks: [
                  {
                    week: parseInt(weekTarget), // Ensure you're passing the correct weekTarget
                    title: topic,
                    objectives: [`Learn about ${topic}`, "Practice key phrases"],
                    main_content: [`Vocabulary related to ${topic}`, "Common phrases", "Grammar tips"],
                    activities: [`Roleplay about ${topic}`, "Practice exercises"],
                  },
                ],
              },
            }),
          }
        );

        const responseData = await response.json();
        console.log(`Response ${i + 1}:`, responseData);

        if (responseData.body && responseData.body.success && responseData.body.conversation) {
          conversations.push(responseData.body.conversation);
        } else {
          setError(responseData.body?.error || `Error in request ${i + 1}`);
        }
      }

      if (conversations.length > 0) {
        setConversationData(conversations);
        setHasGenerated(true);
        // fetchHistory(conversations);
      }
    } catch (err) {
      setError(err.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  // const fetchHistory = async (latestConversation = null) => {
  //   try {
  //     const response = await fetch(
  //       `https://ed86wj91pe.execute-api.eu-west-1.amazonaws.com/prod/roleplay-history?email=user@example1.com&topic=${encodeURIComponent(topic)}&weekTarget=${weekTarget}`, // Use weekTarget here as well
  //       {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     const responseData = await response.json();
  //     if (responseData.success) {
  //       const filteredHistory = responseData.history.filter(
  //         (conv) => JSON.stringify(conv.conversation) !== JSON.stringify(latestConversation)
  //       );
  //       setHistory(filteredHistory);
  //     } else {
  //       setError(responseData.error || "Error fetching conversation history.");
  //     }
  //   } catch (error) {
  //     setError("Failed to fetch history: " + error.message);
  //   }
  // };

  // useEffect(() => {
  //   fetchHistory();
  // }, []);

  const handleChangeTopic = () => {
    setTopic(""); // Clear the topic to allow a new input
    setWeekTarget(""); // Clear the week target as well
    setConversationData([]); // Clear the generated roleplays
    setHasGenerated(false); // Reset the state
    setError(""); // Reset any errors
  };

  return (
    <div className="layout">
      {/* Header stays at the top */}
      <header className="header">Home Dashboard</header>

      {/* Main content area */}
      <main className="roleplay-container">
        {/* If there's an error, display it */}
        {error && <div className="error">{error}</div>}

        {/* If roleplays are not generated yet, show the topic input */}
        {!hasGenerated ? (
          <div className="topic-input-container">
            <h2>Generate Roleplay</h2>
            <div className="creative-message">
              <img src={AnaCelebrating} alt="Ana Celebrating" className="celebration-image left" />
              <p>Feeling creative today? Let’s dive into a roleplay session!</p>
              <img src={CarlosCelebrating} alt="Carlos Celebrating" className="celebration-image right" />
            </div>


            <h2>Select a Topic</h2>
            <textarea
              className="topic-input"
              placeholder="Enter topic (e.g., ordering food)"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
            <h2>Choose Week Target</h2>
            <input
              type="number"
              className="week-target-input"
              placeholder="Enter week target (i.e a number)"
              value={weekTarget}
              onChange={(e) => setWeekTarget(e.target.value)}
            />
            <button onClick={fetchRoleplay} disabled={loading}>
              {loading ? "Loading..." : "Generate Roleplay"}
            </button>
          </div>
        ) : (
          // If roleplays are generated, show the roleplay dialogues and a button to change the topic
          <>
            <h1 className="title">Generated Roleplay Conversations</h1>
            {conversationData.map((conversation, convIndex) => (
            <div key={convIndex} className="dialogue-container">
              <h3>Dialogue {convIndex + 1}</h3>
              <div className="dialogue">
                {Object.keys(conversation).map((key, index) => {
                  const isCarlos = index % 2 === 0; // Alternating speakers

                  return (
                    <div key={index} className={`dialogue-line ${isCarlos ? "carlos" : "ana"}`}>
                      {!isCarlos && (
                        <img src={anaImg} alt="Ana" className="speaker-image" />
                      )}
                      <div className="dialogue-text">
                        <b className="speaker">{isCarlos ? "Carlos" : "Ana"}: </b>
                        <span>{conversation[key]}</span>
                      </div>
                      {isCarlos && (
                        <img src={carlosImg} alt="Carlos" className="speaker-image" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}


           {/* Buttons */}
           <div className="button-container">
              {/* Button dynamically changes text after first roleplay is generated */}
              <button onClick={fetchRoleplay} disabled={loading}>
                {loading ? "Loading..." : hasGenerated ? "Generate Another" : "Generate Roleplay"}
              </button>
            </div>

            {/* Bottom Left Button - Change Topic */}
            <button className="change-topic-btn" onClick={handleChangeTopic}>
              Change Topic
            </button>
          </>
        )}
      </main>
    </div>
  );
}
