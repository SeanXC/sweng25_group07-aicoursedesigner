import OpenAI from "openai";
import dotenv from "dotenv";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
const client = new DynamoDBClient({ region: "eu-west-1" });
const dynamodb = DynamoDBDocumentClient.from(client);

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getCompletion(courseName, courseDesc, difficulty, targetLang, nativeLang, duration) {
  try {
    const prompt = `Generate a language course outline broken down into weekly sections, detailing learning objectives, main content etc. Course name: ${courseName}, description: ${courseDesc}, difficulty: ${difficulty}, target language: ${targetLang}, language used: ${nativeLang}, duration: ${duration} weeks.`;
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    console.log("ChatGPT Response:\n\n", response.choices[0].message.content);
  } catch (error) {
    console.error("Error:", error);
  }
}

getCompletion(
  "Spanish Course",
  "Course for English speakers",
  "B1",
  "Spanish",
  "English",
  5
);
