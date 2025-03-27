import React, { useState, useEffect } from "react";
import "./roleplay.css";
import carlosImg from "../../images/nuala12.svg";
import anaImg from "../../images/nuala21.svg";
import CarlosCelebrating from "../../images/nuala_12_celebrating.svg";
import AnaCelebrating from "../../images/nuala_21_celebrating.svg";
import { useCourseData } from "../Context/CourseDataContext";
import { useUserProfile } from "../Context/UserProfileContext";

export default function Roleplay() {
  const [conversationData, setConversationData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasGenerated, setHasGenerated] = useState(false);

  const [topic, setTopic] = useState("Default Topic"); // Default topic value
  const [weekTarget, setWeekTarget] = useState("1"); // Default week target value

  const { courseData } = useCourseData();
  const { userEmail, userLanguage, userDifficulty } = useUserProfile();

  // Check if courseData is available and set topic and weekTarget accordingly
  useEffect(() => {
    if (courseData && courseData.body && courseData.body.generatedOutline && courseData.body.generatedOutline.weeks.length > 0) {
      const firstWeek = courseData.body.generatedOutline.weeks[0]; // Get first week
      setTopic(firstWeek.topic); // Set topic
      setWeekTarget(firstWeek.week.toString()); // Set week target as a string
    }
  }, [courseData]); // Re-run when courseData changes

  const fetchRoleplay = async () => {
    console.log("fetchRoleplay triggered");
    console.log("Topic:", topic);
    console.log("Week Target:", weekTarget);

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
        const requestBody = {
          email: userEmail,
          userLevel: userDifficulty,
          language: userLanguage,
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
        };
        console.log("Request Body:", JSON.stringify(requestBody)); // Log the request body here

        const response = await fetch(
          "https://ed86wj91pe.execute-api.eu-west-1.amazonaws.com/prod/generate-roleplay",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          }
        );

        const responseData = await response.json();

        if (responseData.body && responseData.body.success && responseData.body.conversation) {
          conversations.push(responseData.body.conversation);
        } else {
          setError(responseData.body?.error || `Error in request ${i + 1}`);
        }
      }

      if (conversations.length > 0) {
        setConversationData(conversations);
        setHasGenerated(true);
      }
    } catch (err) {
      setError(err.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="layout">
      <header className="header">Home Dashboard</header>
      <main className="roleplay-container">
        {error && <div className="error">{error}</div>}

        {!hasGenerated ? (
          <div className="topic-input-container">
            <h2>Generate Roleplay</h2>
            <div className="creative-message">
              <img src={AnaCelebrating} alt="Ana Celebrating" className="celebration-image left" />
              <p>Feeling creative today? Let’s dive into a roleplay session!</p>
              <img src={CarlosCelebrating} alt="Carlos Celebrating" className="celebration-image right" />
            </div>

            {/* Show topic and week from state */}
            <h2>Topic: {topic}</h2>
            <h2>Week Target: {weekTarget}</h2>

            <button onClick={fetchRoleplay} disabled={loading}>
              {loading ? "Loading..." : "Generate Roleplay"}
            </button>
          </div>
        ) : (
          <>
            <h1 className="title">Generated Roleplay Conversations</h1>
            {conversationData.map((conversation, convIndex) => (
              <div key={convIndex} className="dialogue-container">
                <h3>Dialogue {convIndex + 1}</h3>
                <div className="dialogue">
                  {Object.keys(conversation).map((key, index) => {
                    const isCarlos = index % 2 === 0;

                    return (
                      <div key={index} className={`dialogue-line ${isCarlos ? "carlos" : "ana"}`}>
                        {!isCarlos && <img src={anaImg} alt="Ana" className="speaker-image" />}
                        <div className="dialogue-text">
                          <b className="speaker">{isCarlos ? "Carlos" : "Ana"}: </b>
                          <span>{conversation[key]}</span>
                        </div>
                        {isCarlos && <img src={carlosImg} alt="Carlos" className="speaker-image" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="button-container">
              <button onClick={fetchRoleplay} disabled={loading}>
                {loading ? "Loading..." : hasGenerated ? "Generate Another" : "Generate Roleplay"}
              </button>
            </div>

            <button className="change-topic-btn" onClick={() => setHasGenerated(false)}>
              Change Topic
            </button>
          </>
        )}
      </main>
    </div>
  );
}
