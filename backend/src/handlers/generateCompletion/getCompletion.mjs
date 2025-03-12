import OpenAI from "openai";
import dotenv from "dotenv";
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";
import { saveCourseOutline } from "./saveCompletion.mjs"; // Import saving function

// AWS SSM Client for API Key retrieval
const ssmClient = new SSMClient({ region: "eu-west-1" });

dotenv.config();

/**
 * Retrieves the OpenAI API Key from AWS SSM Parameter Store.
 * @returns {Promise<string|null>} API key or null if an error occurs.
 */
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

/**
 * Validates user input for generating a course outline.
 * @param {object} userInput - User input data.
 * @returns {string|null} Error message if validation fails, otherwise null.
 */
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

/**
 * Generates a language course outline using OpenAI and saves it to DynamoDB.
 * @param {object} userInput - User input parameters.
 * @returns {Promise<object>} Generated course outline or an error object.
 */
async function getCompletion(userInput) {
  try {
    const inputError = validateInput(userInput);
    if (inputError) return { error: inputError };

    // Fetch OpenAI API key
    const apiKey = await getOpenAIKey();
    if (!apiKey) return { error: "Failed to retrieve OpenAI API Key from SSM" };

    const openai = new OpenAI({ apiKey });

    // Define the prompt for OpenAI (Kept Unchanged)
    const prompt = `Generate a language course outline in the following JSON format:
                    {
                      "course_title": "<courseName>",
                      "weeks": [
                        {
                          "week": <week_number>,
                          "title": "<week_title>",
                          "objectives": ["<objective_1>", "<objective_2>", ...],
                          "main_content": ["<content_1>", "<content_2>", ...],
                          "activities": ["<activity_1>", "<activity_2>", ...]
                        }
                      ],
                      "assessment": {
                        "continuous_evaluation": ["<ca_1>", "<ca_2>", ...],
                        "final_assessment": ["<exam_1>", "<exam_2>", ...]
                      },
                      "learning_outcomes": ["<outcome_1>", "<outcome_2>", ...]
                    }
                    Course name: ${userInput.courseName}, description: ${userInput.courseDesc}, difficulty: ${userInput.difficulty}, 
                    target language: ${userInput.targetLang}, language used: ${userInput.nativeLang}, duration: ${userInput.duration} weeks.`;

    // Generate response from OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const outline = response.choices[0].message.content;
    const parsedOutline = JSON.parse(outline);

    // Save generated course outline to DynamoDB
    const saveResponse = await saveCourseOutline(userInput.email, parsedOutline);

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
