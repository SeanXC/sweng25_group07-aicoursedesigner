import React, { useState } from "react";
import "./Home.css";

export default function HomeDashboard() {
  const [showCourse, setShowCourse] = useState(false);

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
            justifyContent: "center",
            minHeight: "calc(100vh - 64px)",
            gap: "1.5rem",
            overflow: "auto",
          }}
        >
          {!showCourse && (
            <div>
              <button
                type="button"
                onClick={() => setShowCourse(!showCourse)}
                style={{
                  backgroundColor: "#8300A1",
                  color: "white",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Generate Course
              </button>
            </div>
          )}

          {showCourse && (
            <>
              <br />
              <div
                style={{
                  width: "400px",
                }}
              >
                <div>
                  <br />
                  <b>Course Information</b>
                  <p>Course Name:</p>
                  <label
                    style={{
                      fontWeight: "bold",
                      color: "#333",
                    }}
                  >
                    <input name="courseName" />
                  </label>
                </div>
                <br />
                <br />
                <div>
                  <p>Description:</p>
                  <label
                    style={{
                      fontWeight: "bold",
                      color: "#333",
                    }}
                  >
                    <input name="courseDescription" />
                  </label>
                </div>
                <br />
                <br />
                <div>
                  <p>Difficulty:</p>
                  <select
                    style={{
                      padding: "10px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                      outline: "none",
                      fontSize: "1rem",
                      backgroundColor: "white",
                    }}
                  >
                    <option value="A1">A1</option>
                    <option value="A2">A2</option>
                    <option value="B1">B1</option>
                    <option value="B2">B2</option>
                    <option value="C1">C1</option>
                    <option value="C2">C2</option>
                  </select>
                </div>
                <br />
                <br />
                <div>
                  <p>Learn:</p>
                  <select
                    style={{
                      padding: "10px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                      outline: "none",
                      fontSize: "1rem",
                      backgroundColor: "white",
                    }}
                  >
                    <option value="learnSpanish">Spanish</option>
                    <option value="learnEnglish">English</option>
                    <option value="learnFrench">French</option>
                    <option value="learnItalian">Italian</option>
                    <option value="learnGerman">German</option>
                    <option value="learnPortuguese">Portuguese</option>
                  </select>
                </div>
                <br />
                <br />
                <div>
                  <p>Speakers Of:</p>
                  <select
                    style={{
                      padding: "10px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                      outline: "none",
                      fontSize: "1rem",
                      backgroundColor: "white",
                    }}
                  >
                    <option value="speakSpanish">Spanish</option>
                    <option value="speakEnglish">English</option>
                    <option value="speakFrench">French</option>
                    <option value="speakItalian">Italian</option>
                    <option value="speakGerman">German</option>
                    <option value="speakPortuguese">Portuguese</option>
                    <option value="speakUkraninian">Ukraninian</option>
                    <option value="speakArabic">Arabic</option>
                    <option value="speakChineseS">Chinese Simplified</option>
                    <option value="speakChineseT">Chinese Traditional</option>
                    <option value="speakCzech">Czech</option>
                    <option value="speakPortuguese">Danish</option>
                    <option value="speakDanish">Dutch</option>
                    <option value="speakFilipino">Filipino</option>
                    <option value="speakGreek">Greek</option>
                    <option value="speakHindi">Hindi</option>
                    <option value="speakHungarian">Hungarian</option>
                    <option value="speakPortuguese">Indonesian</option>
                    <option value="speakIndonesiane">Japanese</option>
                    <option value="speakKorean">Korean</option>
                    <option value="speakMalay">Malay</option>
                    <option value="speakPortuguese">Polish</option>
                    <option value="speakPolish">Punjabi</option>
                    <option value="speakSwahili">Swahili</option>
                    <option value="speakPortuguese">Thai</option>
                    <option value="speakThai">Turkish</option>
                    <option value="speakvietnamese">Vietnamese</option>
                  </select>
                </div>
                <br />
                <br />
                <hr />
                <div>
                  <br></br>
                  <b>Course settings</b>
                  <p>
                    Limit access to your course by setting visibility to private
                    and including an enrolment key
                  </p>
                  <br />
                  <p>
                    Visability
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginRight: "1rem",
                      }}
                    >
                      <input
                        type="radio"
                        name="visibility"
                        value="public"
                        style={{
                          marginRight: "0.5rem",
                          width: "20px", // Adjust the size of the radio button
                          height: "20px", // Adjust the size of the radio button
                          cursor: "pointer",
                          accentColor: "#8300A1", // Add accent color to radio button
                        }}
                      />
                      Public
                    </label>
                    <br />
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginRight: "1rem",
                      }}
                    >
                      <input
                        type="radio"
                        name="visibility"
                        value="public"
                        style={{
                          marginRight: "0.5rem",
                          width: "20px",
                          height: "20px",
                          cursor: "pointer",
                          accentColor: "#8300A1",
                        }}
                      />
                      Private
                    </label>
                  </p>
                </div>
                <br />
                <div>
                  <p>Enrolment Key</p>
                  <label
                    style={{
                      fontWeight: "bold",
                      color: "#333",
                    }}
                  >
                    <input name="enrolmentKey" />
                  </label>
                </div>
                <br />
                <br />
                <div>
                  <p>Allowed school domains (optional)</p>
                  <label
                    style={{
                      fontWeight: "bold",
                      color: "#333",
                    }}
                  >
                    <input name="schoolDomains" />
                  </label>
                </div>
                <br />
                <div>
                  <p>
                    Reviews
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginRight: "1rem",
                      }}
                    >
                      <input
                        type="radio"
                        name="reviews"
                        value="public"
                        style={{
                          marginRight: "0.5rem",
                          width: "20px",
                          height: "20px",
                          cursor: "pointer",
                          accentColor: "#8300A1",
                        }}
                      />
                      Enabled
                    </label>
                    <br />
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginRight: "1rem",
                      }}
                    >
                      <input
                        type="radio"
                        name="reviews"
                        value="public"
                        style={{
                          marginRight: "0.5rem",
                          width: "20px",
                          height: "20px",
                          cursor: "pointer",
                          accentColor: "#8300A1",
                        }}
                      />
                      Disabled
                    </label>
                  </p>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => setShowCourse(!showCourse)}
                    style={{
                      backgroundColor: "#8300A1",
                      color: "white",
                      padding: "0.75rem 1.5rem",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Submit
                  </button>
                  <br />
                  <br />
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
}
