// Add AWS SSM and DynamoDB
import OpenAI from "openai";
import dotenv from "dotenv";
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

// AWS SSM & DynamoDB Clients
const ssmClient = new SSMClient({ region: "eu-west-1" });
const client = new DynamoDBClient({ region: "eu-west-1" });
const dynamodb = DynamoDBDocumentClient.from(client);

// Load environment variables (used for other configs if needed)
dotenv.config();

// Function to retrieve OpenAI API Key from AWS SSM Parameter Store
async function getOpenAIKey() {
  try {
    const command = new GetParameterCommand({
      Name: "OPENAI_API_KEY", // Ensure this parameter exists in AWS SSM
      WithDecryption: true, // Fetch decrypted value
    });
    const response = await ssmClient.send(command);
    return response.Parameter.Value;
  } catch (error) {
    console.error("Error fetching OpenAI API Key from AWS SSM:", error);
    return null;
  }
}

// Function to validate user input
function check(userInput) {
  const fields = ["courseName", "courseDesc", "difficulty", "targetLang", "nativeLang", "duration"];
  for (const field of fields) {
    if (!userInput[field]) return "Error: Missing required fields";
  }
  if (typeof userInput.duration !== "number" || userInput.duration <= 0) {
    return "Error: Invalid course duration";
  }
  return null;
}

// Main function to generate course outline using OpenAI API
async function getCompletion(userInput) {
  try {
    const inputError = check(userInput);
    if (inputError) return { error: inputError };

    // Retrieve API Key from AWS SSM
    const apiKey = await getOpenAIKey();
    if (!apiKey) return { error: "Failed to retrieve OpenAI API Key from SSM" };

    // Initialize OpenAI client with retrieved API Key
    const openai = new OpenAI({ apiKey });

    // Define the prompt for OpenAI
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

    // Send request to OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    // Extract and process OpenAI response
    const outline = response.choices[0].message.content;
    try {
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
          "Access-Control-Allow-Headers": "Content-Type",
        },
        body: JSON.parse(outline),
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
          "Access-Control-Allow-Headers": "Content-Type",
        },
        body: JSON.stringify({ error: error.message }),
      };
    }
  } catch (error) {
    return { error: error.message };
  }
}

// Example test function call (commented out)
/*
getCompletion(
  {
    "courseName": "Spanish Course",
    "courseDesc": "For English speakers",
    "difficulty": "B1",
    "targetLang": "Spanish",
    "nativeLang": "English",
    "duration": 5
  }
).then(console.log);
*/

export { getCompletion };
