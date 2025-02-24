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

async function generatePhrases(language, no_of_phrases, topic){
    if(!language) return { error: "please specify the target language" };
    if(!no_of_phrases) return { error: "please specify the no. of phrases to generate" };
    if(!topic) return { error: "please specify a topic for the phrases" };

    const prompt = `Generate ${no_of_phrases} phrases based on the topic "${topic}" for a ${language} course in the following JSON format:
                    {
                      "phrases": [
                        {
                          "id": <id_number>,
                          "english": "<english_phrase>",
                          "<language>": "<translated_phrase>"
                        }
                      ]
                    }`;
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });
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

export { generatePhrases };