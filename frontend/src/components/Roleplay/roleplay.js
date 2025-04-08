import React, { useState, useEffect } from "react";
import "./roleplay.css";
import carlosImg from "../../images/nuala12.svg";
import anaImg from "../../images/nuala21.svg";
import CarlosCelebrating from "../../images/nuala_12_celebrating.svg";
import AnaCelebrating from "../../images/nuala_21_celebrating.svg";
import { useCourseData } from "../Context/CourseDataContext";
import { useUserProfile } from "../Context/UserProfileContext";

export default function Roleplay({ selectedWeek, selectedTopic }) {
  const [conversationData, setConversationData] = useState([]);
  const [questionData, setQuestionData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingQ, setLoadingQ] = useState(false);
  const [error, setError] = useState("");
  const [hasGenerated, setHasGenerated] = useState(false);
  const [hasGeneratedQuestion, setHasGeneratedQuestion] = useState(false);

  const [userAnswer, setUserAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);

  // Local state for topic and weekTarget
  const [topic, setTopic] = useState("Default Topic");
  const [weekTarget, setWeekTarget] = useState("1");

  const { courseData } = useCourseData();
  const { userEmail, userLanguage, userDifficulty } = useUserProfile();

  useEffect(() => {
    if (selectedWeek && selectedTopic) {
      setTopic(selectedTopic);
      setWeekTarget(selectedWeek.toString());
    } else if (
      courseData &&
      courseData.body &&
      courseData.body.generatedOutline &&
      courseData.body.generatedOutline.weeks.length > 0
    ) {
      const firstWeek = courseData.body.generatedOutline.weeks[0];
      setTopic(firstWeek.topic);
      setWeekTarget(firstWeek.week.toString());
    }
  }, [selectedWeek, selectedTopic, courseData]);

  function getLangCode(language) {
    const langCodes = {
      English: "en-EN",
      Spanish: "es-ES",
      French: "fr-FR",
      Italian: "it-IT",
      German: "de-DE",
      Portuguese: "pt-PT",
    };

    return langCodes[language] || null;
  }

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
      setConversationData([]);
      const conversations = [];

      for (let i = 0; i < 3; i++) {
        const requestBody = {
          email: userEmail,
          userLevel: userDifficulty,
          language: userLanguage,
          topic: topic,
          weekTarget: parseInt(weekTarget),
          outline: {
            weeks: [
              {
                week: parseInt(weekTarget),
                title: topic,
                objectives: [`Learn about ${topic}`, "Practice key phrases"],
                main_content: [`Vocabulary related to ${topic}`, "Common phrases", "Grammar tips"],
                activities: [`Roleplay about ${topic}`, "Practice exercises"],
              },
            ],
          },
        };

        const response = await fetch(
          "https://ed86wj91pe.execute-api.eu-west-1.amazonaws.com/prod/generate-roleplay",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
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
        setHasGeneratedQuestion(false);
      }
    } catch (err) {
      setError(err.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestion = async () => {
    console.log("fetchQuestion triggered");
    console.log("Topic:", topic);
    console.log("Week Target:", weekTarget);

    if (!topic || !weekTarget) {
      setError("Please enter both a topic and a week target before generating a question.");
      return;
    }

    try {
      setLoadingQ(true);
      setError("");
      setQuestionData([]);
      const requestBody = {
        email: userEmail,
        userLevel: userDifficulty,
        language: userLanguage,
        topic: topic,
        weekTarget: parseInt(weekTarget),
        languageTag: getLangCode(userLanguage),
        outline: {
          weeks: [
            {
              week: parseInt(weekTarget),
              title: topic,
              objectives: [`Learn about ${topic}`, "Practice key phrases"],
              main_content: [`Vocabulary related to ${topic}`, "Common phrases", "Grammar tips"],
              activities: [`Roleplay about ${topic}`, "Practice exercises"],
            },
          ],
        },
        conversations: conversationData,
      };

      const response = await fetch(
        "https://mrr625wq65.execute-api.eu-west-1.amazonaws.com/dev/generate-question",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        }
      );

      const responseData = await response.json();

      setQuestionData(responseData);
      setHasGeneratedQuestion(true);
      setUserAnswer("");
      setIsCorrect(null);
    } catch (err) {
      setError(err.message || "Something went wrong!");
    } finally {
      setLoadingQ(false);
    }
  };

  return (
    <div className="layout">
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

            {!hasGeneratedQuestion ? (
              <div>
                <button onClick={fetchQuestion} disabled={loadingQ}>
                  {loadingQ ? "Loading..." : "Generate Question"}
                </button>
              </div>
            ) : (
              <div>
                <h3>{questionData.question}</h3>
                <br />
                <input
                  placeholder="Type your answer here"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                />
                <button
                  onClick={() => {
                    const correctAnswer = questionData.answer?.trim().toLowerCase();
                    const userInput = userAnswer.trim().toLowerCase();
                    console.log("Correct Answer:", correctAnswer);
                    console.log("User Input:", userInput);
                    setIsCorrect(userInput === correctAnswer);
                  }}
                >
                  Submit Answer
                </button>
                {isCorrect === true && <p style={{ color: "green" }}>✅ Correct!</p>}
                {isCorrect === false && <p style={{ color: "red" }}>❌ Try again!</p>}
                <br />
                <button onClick={fetchQuestion} disabled={loadingQ}>
                  {loadingQ ? "Loading..." : "Generate Another Question"}
                </button>
              </div>
            )}

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
