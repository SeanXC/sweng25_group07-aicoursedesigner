import "./Home";
import "./ShowPhrases.css";
import { useState } from "react";

export default function ShowPhrases({ courseData }) {
  const [sliderValue, setSliderValue] = useState(7);

  console.log("ShowPhrases data", courseData);

  if (!courseData) {
    return <p>Loading course data...</p>;
  }

  /*// AWS Lambda URL (replace with your actual URL)
  const lambdaUrl = "https://d7ow6xj3t4.execute-api.eu-west-1.amazonaws.com/prod/OpenAITest"; 

  // Function to send POST request
  const submitCourse = async () => {
    try {
      const response = await fetch(lambdaUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseName: courseData.courseName,
          courseDesc: courseData.courseDesc,
          difficulty: courseData.difficulty,
          targetLang: courseData.targetLang,
          nativeLang: courseData.nativeLang,
          duration: 5,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Success:", data);
      alert("Course submitted successfully!");
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to submit course.");
    }
  };
*/
  

const submitPhrases = async () => {
  try {
    const response = await fetch("http://localhost:8000/generate-phrases", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: {
          language: courseData.targetLang,
          no_of_phrases: sliderValue,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Phrases generated successfully:", data);
    alert("Phrases generated successfully!");
  } catch (error) {
    console.error("Submission error:", error);
    alert("Failed to generate phrases.");
  }
};



  
  return (
    <>
      <div style={{ backgroundColor: "white" }}>
        <header
          style={{
            backgroundColor: "#8300A1",
            color: "white",
            fontSize: "1.25rem",
            fontWeight: "bold",
            padding: "1rem 1.5rem",
          }}
        >
          Home Dashboard
        </header>
        <main
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minHeight: "calc(100vh - 64px)",
            gap: "1.5rem",
            overflow: "auto",
          }}
        >
<p style={{ color: "black" }}>Number of phrases to generate: {sliderValue}</p>
<input
            type="range"
            min="3"
            max="10"
            value={sliderValue}
            onChange={(e) => setSliderValue(e.target.value)}
            className="slider"
            id="myRange"
          />
<p style={{ color: "black" }}>Course Name: {courseData.courseName}</p>
<p style={{ color: "black" }}>Language: {courseData.targetLang}</p>

          {/* Submit Button */}
          <button
            onClick={submitPhrases}
            style={{
              backgroundColor: "#007bff",
              color: "white",
              padding: "0.75rem 1.5rem",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            Submit
          </button>
        </main>
      </div>
    </>
  );
}
