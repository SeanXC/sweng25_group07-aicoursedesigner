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


async function outlineCustomizer(input){
    const weekToChange = input.duration ;
    if(!weekToChange) return { error: "Please specify which week you want to change."};
    const change = input.chage ;
    if(!change) return { error: "Please specify what change you want to add to the prompt."};

    const prompt = `Regenerate the outline for week ${weekToChange}, making sure to ${change}, while keeping the rest of the course unchanged.`;
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

export {outlineCustomizer} ;
