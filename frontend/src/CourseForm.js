import React, { useState } from "react";
import "./Home.css";
import ShowPhrases from "./ShowPhrases";
let data = {};

const formDataEntries = {
  courseName: "",
  courseDesc: "",
  difficulty: "",
  targetLang: "",
  nativeLang: "",
  duration: 5,
};




export default function HomeDashboard() {

  const [showCourse, setShowCourse] = useState(true);
  const [ courseData, setCourseData] = useState (null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(null);



  const handleLoginClick = () => {
    setShowForm((prev) => !prev); // Toggle the form visibility
  };


  async function formSubmit(e) {
    
    e.preventDefault();
    const formData = new FormData(e.target);
    const values = Object.fromEntries(formData.entries());
    console.log(values);
    //setFormData(values);
    const courseData = {
      courseName: values.courseName,
      courseDesc: values.courseDesc,
      difficulty: values.difficulty,
      targetLang: values.language,
      nativeLang: values.nativeLanguage,
      duration: 5,
    }
    console.log ("Current difficulty," , values.difficulty)
    console.log ("Current Course Data",courseData )

    setCourseData(courseData);
    setShowCourse(true);
  }
  return (
    <>
    
        <button
        onClick={handleLoginClick}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          backgroundColor: "#9705A8",
          color: "white",
          padding: "0.5rem 1rem",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          border: "none",
          cursor: "pointer",
        }}
      >

          {showCourse && (
            <>
              <br />
              <div
                style={{
                  width: "400px",
                }}
              >
                <form method="post" onSubmit={formSubmit}>
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
                    <input name="courseDesc" />
                  </label>
                </div>
                <br />
                <br />
                <div>
                  <p>Difficulty:</p>
                  <select
                   name = "difficulty"
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
                  name = "language"
                    style={{
                      padding: "10px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                      outline: "none",
                      fontSize: "1rem",
                      backgroundColor: "white",
                    }}
                  >
                    <option value="Spanish">Spanish</option>
                    <option value="English">English</option>
                    <option value="French">French</option>
                    <option value="Italian">Italian</option>
                    <option value="German">German</option>
                    <option value="Portuguese">Portuguese</option>
                  </select>
                </div>
                <br />
                <br />
                <div>
                  <p>Speakers Of:</p>
                  <select
                    name = "nativeLanguage"
                    style={{
                      padding: "10px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                      outline: "none",
                      fontSize: "1rem",
                      backgroundColor: "white",
                    }}
                  >
                      <option value="Spanish">Spanish</option>
                      <option value="English">English</option>
                      <option value="French">French</option>
                      <option value="Italian">Italian</option>
                      <option value="German">German</option>
                      <option value="Portuguese">Portuguese</option>
                      <option value="Ukraninian">Ukraninian</option>
                      <option value="Arabic">Arabic</option>
                      <option value="ChineseS">Chinese Simplified</option>
                      <option value="ChineseT">Chinese Traditional</option>
                      <option value="Czech">Czech</option>
                      <option value="Danish">Danish</option>
                      <option value="Dutch">Dutch</option>
                      <option value="Filipino">Filipino</option>
                      <option value="Greek">Greek</option>
                      <option value="Hindi">Hindi</option>
                      <option value="Hungarian">Hungarian</option>
                      <option value="Indonesian">Indonesian</option>
                      <option value="Japanese">Japanese</option>
                      <option value="Korean">Korean</option>
                      <option value="Malay">Malay</option>
                      <option value="Polish">Polish</option>
                      <option value="Punjabi">Punjabi</option>
                      <option value="Swahili">Swahili</option>
                      <option value="Thai">Thai</option>
                      <option value="Turkish">Turkish</option>
                      <option value="Vietnamese">Vietnamese</option>

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
                          width: "20px",
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
                          width: "20px",
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
                          width: "20px",
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
                          width: "20px",
                        }}
                      />
                      Disabled
                    </label>
                  </p>
                </div>
                {formData && <p>You're learning {formData.language}</p>}
                <div>
                <button type="submit">Submit</button>
                  <br />
                  <br />
                </div>
                </form>
              </div>
              {courseData && <ShowPhrases courseData= {courseData}/>}
            </>
          )}
       </button>
  </>
  )
};
