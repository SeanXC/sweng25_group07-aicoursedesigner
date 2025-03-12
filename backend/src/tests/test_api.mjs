import fetch from "node-fetch";
import express from "express";
import bodyParser from "body-parser";
import { getCompletion } from "./generateCompletion.mjs"

const app = express();
const PORT = 3000;
const API_URL = "http://localhost:3000/generate-course";

app.use(bodyParser.json());
app.post("/generate-course",async(req,res)=>{
  try{
    const response = await getCompletion(req.body);
    res.json({ response });
  } catch(error){
    res.status(400).json({ error: error.message });
  }
});
app.listen(PORT,()=>{
  console.log("server running");
});

const testCases = [
  {
    description: "✅ Valid Case: Complete course data",
    requestData: {
      courseName: "Spanish Course",
      courseDesc: "Course for English speakers",
      difficulty: "B1",
      targetLang: "Spanish",
      nativeLang: "English",
      duration: 5
    }
  },
  {
    description: "⚠ Missing Fields: No courseDesc",
    requestData: {
      courseName: "French Course",
      difficulty: "A2",
      targetLang: "French"
    }
  },
  {
    description: "🔄 Edge Case: Course duration is 1 week",
    requestData: {
      courseName: "German Basics",
      courseDesc: "Quick introduction for beginners",
      difficulty: "A1",
      targetLang: "German",
      nativeLang: "English",
      duration: 1
    }
  },
  {
    description: "🚨 Negative Case: Invalid duration (-5 weeks)",
    requestData: {
      courseName: "Italian Course",
      courseDesc: "Beginner to intermediate",
      difficulty: "B1",
      targetLang: "Italian",
      nativeLang: "English",
      duration: -5
    }
  }
];

async function runTests() {
  for (const testCase of testCases) {
    console.log(`\n=== ${testCase.description} ===`);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(testCase.requestData)
      });
      
      const data = await response.json();
      console.log("Response:", JSON.stringify(data, null, 2));
      // const response = await getCompletion(testCase.requestData);
      // console.log("Response:\n\n", JSON.stringify(response,null,2));
    } catch (error) {
      console.error("Error:", error);
    }
  }
}

//runTests();
