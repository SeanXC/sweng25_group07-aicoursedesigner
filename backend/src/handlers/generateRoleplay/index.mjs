import OpenAI from "openai";
import dotenv from "dotenv";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
const client = new DynamoDBClient({ region: "eu-west-1" });
const dynamodb = DynamoDBDocumentClient.from(client);

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateRoleplay(userId, userLevel, language, topic){
    if(!language) return { error: "please specify the target language" };
    if(!userId) return { error: "missing user id" };
    if(!userLevel) return { error: `please specify your level in ${language}` };
    if(!topic) return { error: "please specify a topic for the roleplay" };

    /* const history = await getConvoHistory(userId);
    if(!conversation[userId]){
        conversation[userId] = [
            {
                // role: "system",
                content: `Create a conversation between two people on the topic "${topic}" in ${language}.
                          Ensure that the difficulty of the conversation in ${language} is ${userLevel}.
                          Format the response into the following JSON structure:
                          {
                            PersonOne: "<response>",
                            PersonTwo: "<response>"
                          }`,
            },
        ];
    }*/

    const prompt = `Create a conversation between two people on the topic "${topic}" in ${language}.
    Ensure that the difficulty of the conversation in ${language} is ${userLevel}.
    Format the response into the following JSON structure:
    {
      LineOne: "<response>",
      LineTwo: "<response>",
      LineThree: "<response>",
      LineFour: "<response>",
      LineFive: "<response>",
      LineSix: "<response>"
    }`;


    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }] ,
      temperature: 0.7,
    });

    // Not needed yet
    //conversation[userId].push({ role: "assistant", content: response.choices[0].message.content });

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

export { generateRoleplay };