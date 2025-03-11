import OpenAI from "openai";
import fs from "fs";
import dotenv from "dotenv";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
const client = new DynamoDBClient({ region: "eu-west-1" });
const dynamodb = DynamoDBDocumentClient.from(client);

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const conversation = {};

const transcribeAudio = async(filePath) => {
  try{
    const response = await openai.audio.transcriptions.create({
      model: "whisper-1",
      file: fs.createReadStream(filePath),
      language: "es", // change to user's chosen lang
    });

    return response.text;
  } catch(error){
    console.error("Whisper API error:", error.message);
    throw new Error("failed to transcribe audio");
  }
};

async function generateChat(userId, userLevel, language, topic, userMsg=""){
    if(!language) return { error: "please specify the target language" };
    if(!userId) return { error: "missing user id" };
    if(!userLevel) return { error: `please specify your level in ${language}` };
    if(!topic) return { error: "please specify a topic for the roleplay" };

    if(!conversation[userId]){
        conversation[userId] = [
            {
                role: "system",
                content: `You are roleplaying with a user on the topic "${topic}" in ${language}.
                          Keep responses interactive and conversation flowing, ensuring that the difficulty 
                          of the conversation in ${language} is ${userLevel}.
                          Format the response into the following JSON structure:
                          {
                            "response": "<response>"
                          }`,
            },
        ];
    }

    if(userMsg){
        conversation[userId].push({ role: "user", content: userMsg });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: conversation[userId],
      temperature: 0.7,
    });
    conversation[userId].push({ role: "assistant", content: response.choices[0].message.content });

    try {
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
          "Access-Control-Allow-Headers": "Content-Type",
        },
        body: JSON.parse(response.choices[0].message.content),
      };
    } catch(error){
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
}

export { generateChat, transcribeAudio };