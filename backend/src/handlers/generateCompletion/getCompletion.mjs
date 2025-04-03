import OpenAI from "openai";
import dotenv from "dotenv";
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";
import { saveCourseOutline } from "./saveCompletion.mjs";

const ssmClient = new SSMClient({ region: "eu-west-1" });
dotenv.config();

async function getOpenAIKey() {
  try {
    const command = new GetParameterCommand({
      Name: "OPENAI_API_KEY",
      WithDecryption: true,
    });
    const response = await ssmClient.send(command);
    return response.Parameter.Value;
  } catch (error) {
    console.error("Error fetching OpenAI API Key from AWS SSM:", error);
    return null;
  }
}

function validateInput(userInput) {
  const requiredFields = ["email", "courseName", "courseDesc", "difficulty", "targetLang", "nativeLang", "duration"];
  for (const field of requiredFields) {
    if (!userInput[field]) return `Error: Missing required field: ${field}`;
  }
  if (typeof userInput.duration !== "number" || userInput.duration <= 0) {
    return "Error: Invalid course duration";
  }
  return null;
}

async function getCompletion(userInput) {
  try {
    const inputError = validateInput(userInput);
    if (inputError) return { error: inputError };

    const apiKey = await getOpenAIKey();
    if (!apiKey) return { error: "Failed to retrieve OpenAI API Key from SSM" };

    const openai = new OpenAI({ apiKey });

    const prompt = `Generate a language course outline in the following JSON format (no markdown or backticks):
{
  "course_title": "<courseName>",
  "weeks": [
    {
      "week": <week_number>,
      "topic": "<topic_of_the_week>",
      "sessions": [
        {
          "title": "<session_title>",
          "objectives": [
            "<Detailed objective explaining what the learner will achieve>"
          ],
          "main_content": [
            "<Detailed content of the session, including key vocabulary, grammar points, and sentence structures>"
          ],
          "activities": [
            "<Detailed activity, e.g., role-playing exercises, listening comprehension, speaking drills, interactive exercises>"
          ]
        }
      ]
    }
  ],
  "learning_outcomes": [
    "<Detailed learning outcome describing what learners will be able to do at the end of the course>"
  ]
}
Course name: ${userInput.courseName}, 
Description: ${userInput.courseDesc}, 
Difficulty: ${userInput.difficulty}, 
Target language: ${userInput.targetLang}, 
Language used: ${userInput.nativeLang}, 
Duration: ${userInput.duration} weeks.

Make sure that each session contains detailed objectives, structured lesson content, and practical activities suitable for learners at this level. Each week's topic ("topic_of_the_week") should be a **situational theme**, such as "ordering food in a restaurant", "asking for directions", or "booking a hotel room". Avoid abstract grammatical topics—focus on practical, real-life contexts that build progressively on prior knowledge.`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const outlineRaw = response.choices[0].message.content.trim();

    let parsedOutline;
    try {
      parsedOutline = JSON.parse(outlineRaw);
    } catch (e) {
      console.error("Failed to parse OpenAI response:", outlineRaw);
      return { error: "Invalid JSON format received from OpenAI." };
    }

    const outlineWithUserInput = {
      ...parsedOutline,
      description: userInput.courseDesc,
      difficulty: userInput.difficulty,
      targetLang: userInput.targetLang,
      nativeLang: userInput.nativeLang,
      duration: userInput.duration,
    };

    const saveResponse = await saveCourseOutline(userInput.email, outlineWithUserInput);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: { generatedOutline: parsedOutline, saveResponse },
    };
  } catch (error) {
    console.error("Error in getCompletion:", error);
    return { error: error.message };
  }
}

export { getCompletion };
