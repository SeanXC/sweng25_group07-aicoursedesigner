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

async function generateContent(outline, target_week){
    const targetWeek = outline.weeks.find(week=>week.week===target_week);
    if(!targetWeek) return { error: `no week ${target_week} data found` };

    const mainContent = targetWeek.main_content;
    if(!mainContent) return { error: `no main content found for week ${targetWeek}` };

    const lang = outline.target_language;
    const prompt = `Generate the following detailed lesson content for ${lang} course:
                    ${mainContent.map((content,i)=>`${i+1}. ${content}`).join("\n")}
                    in a valid JSON format.`;
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

export { generateContent };