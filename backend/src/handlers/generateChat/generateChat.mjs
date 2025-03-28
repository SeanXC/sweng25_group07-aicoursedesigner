import OpenAI from "openai";
import dotenv from "dotenv";
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";
import { saveChatMessage } from "./saveChatMessage.mjs";

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

const conversation = {};

async function generateChat(email, userLevel, language, languageTag, topic, userMsg = "", weekTarget, outline) {
  if (!language || !email || !userLevel || !topic || !weekTarget || !outline) {
    return { error: "Missing required parameters (email, language, userLevel, topic, weekTarget, outline)" };
  }

  const apiKey = await getOpenAIKey();
  if (!apiKey) return { error: "Failed to retrieve OpenAI API Key from SSM" };

  const openai = new OpenAI({ apiKey });
  const weekDetails = outline.weeks.find(week => week.week === weekTarget);
  if (!weekDetails) return { error: `Week ${weekTarget} not found in the outline` };

  const convoKey = `${email}::${topic}::${weekTarget}`;

  if (!conversation[convoKey]) {
    const systemMessage = {
      role: "system",
      content: `You are a ${language} (${languageTag}) language partner helping the user practice on the topic "${topic}".
The user's level is ${userLevel}. They are currently studying Week ${weekTarget}: "${weekDetails.title}".

Focus on:
- Using vocabulary and grammar from this week
- Keeping the conversation engaging and natural
- Responding in ${language} only
- Staying within the topic context

Objectives:
- ${Array.isArray(weekDetails.objectives) ? weekDetails.objectives.join("\n- ") : "No objectives provided"}

Main Content:
- ${Array.isArray(weekDetails.main_content) ? weekDetails.main_content.join("\n- ") : "No main content provided"}

Suggested Activities:
- ${Array.isArray(weekDetails.activities) ? weekDetails.activities.join("\n- ") : "No activities provided"}

Respond ONLY in this JSON format (no markdown or backticks):
{
  "response": "<your message here>"
}`,
    };

    conversation[convoKey] = [systemMessage];
    await saveChatMessage(email, systemMessage.role, systemMessage.content, language, languageTag, topic, weekTarget);
  }

  if (userMsg) {
    const userMessage = { role: "user", content: userMsg };
    conversation[convoKey].push(userMessage);
    await saveChatMessage(email, userMessage.role, userMessage.content, language, languageTag, topic, weekTarget);
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: conversation[convoKey],
    temperature: 0.7,
  });

  const botRaw = response.choices[0].message.content;

  const cleaned = botRaw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/, "")
    .trim();

  try {
    const parsed = JSON.parse(cleaned);
    const assistantMessage = { role: "assistant", content: parsed.response };
    conversation[convoKey].push(assistantMessage);
    await saveChatMessage(email, assistantMessage.role, parsed.response, language, languageTag, topic, weekTarget);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: { response: parsed.response },
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
      body: JSON.stringify({
        error: "Failed to parse AI response",
        details: error.message,
        rawResponse: botRaw,
      }),
    };
  }
}

export { generateChat };
