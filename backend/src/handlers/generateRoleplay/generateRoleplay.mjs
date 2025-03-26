import OpenAI from "openai";
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";
import { getRoleplayHistory } from "./getRoleplayHistory.mjs";
import { saveRoleplayHistory } from "./saveRoleplayHistory.mjs";

// Initialize AWS SSM Client
const ssmClient = new SSMClient({ region: "eu-west-1" });

/**
 * Retrieves the OpenAI API key from AWS SSM Parameter Store.
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
 * Generates a roleplay conversation based on the provided week and outline.
 * @param {string} email - The user's email.
 * @param {string} userLevel - The user's language proficiency level.
 * @param {string} language - The target language.
 * @param {string} topic - The conversation topic.
 * @param {number} weekTarget - The week number of the course.
 * @param {object} outline - The learning outline for the course.
 */
async function generateRoleplay(email, userLevel, language, topic, weekTarget, outline) {
  if (!language) return { error: "Please specify the target language" };
  if (!email) return { error: "Missing user email" };
  if (!userLevel) return { error: `Please specify your level in ${language}` };
  if (!topic) return { error: "Please specify a topic for the roleplay" };
  if (!weekTarget) return { error: "Please specify the target week" };
  if (!outline) return { error: "Learning outline is required" };

  const apiKey = await getOpenAIKey();
  if (!apiKey) return { error: "Failed to retrieve OpenAI API Key from SSM" }
  const openai = new OpenAI({ apiKey });
  const weekDetails = outline.weeks.find(week => week.week === weekTarget);
  if (!weekDetails) return { error: `Week ${weekTarget} not found in the outline` };

  const historyData = await getRoleplayHistory(email, topic, weekTarget);
  const history = historyData.success ? historyData.history : [];

  let prompt;
  const difficulty = weekTarget / outline.weeks.length;

  if (history.length === 0) {
    prompt = `You are an AI generating a roleplay conversation for a student learning ${language}. The student is at level ${userLevel} and is currently studying **Week ${weekTarget}: "${weekDetails.title}"** under the topic "${topic}".
    
Determine suitable roles for the conversation based on the topic (e.g., "restaurant staff" and "customer" for a restaurant scenario).
    
Follow these guidelines:
    - Maintain a natural and engaging conversation.
    - Ensure that one role always starts the conversation.
    - Distinct roles should have unique speaking styles and personalities.
    - Difficulty should increase progressively based on the week number, with Week 1 being the simplest and later weeks incorporating complex structures and vocabulary.
    - The conversation should remain within the scope of **Week ${weekTarget}**'s objectives and content.
    
Objectives:
    - ${weekDetails.objectives.join("\n    - ")}
    
Main Content:
    - ${weekDetails.main_content.join("\n    - ")}
    
Suggested Activities:
    - ${weekDetails.activities.join("\n    - ")}
    
Generate the conversation in JSON format:
    {
      "<role1>": "<opening line>",
      "<role2>": "<response>",
      "<role1>": "<response>",
      "<role2>": "<response>"
    }`;
  } else {
    const historyContext = history.map(entry => 
      Object.entries(entry.conversation)
        .map(([key, value]) => `${key}: ${value}`)
        .join("\n")
    ).join("\n");

    prompt = `Continue the roleplay conversation in ${language}, maintaining a natural flow and aligned with **Week ${weekTarget}: "${weekDetails.title}"** under the topic "${topic}".
    
Previous conversation:
    ${historyContext}
    
Guidelines:
    - Ensure continuity by allowing the last speaker to continue, followed by the other person responding.
    - The conversation should remain relevant to Week ${weekTarget}'s objectives and content.
    - The difficulty should be appropriate for Week ${weekTarget}, ensuring progressively complex dialogues.
    - Maintain the roles from the previous conversation (e.g., "restaurant staff" and "customer").
    
Generate the next exchange in JSON format(do not use markdown or backticks):
    {
      "<role1>": "<response>",
      "<role2>": "<response>"
    }`;
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  try {
    const outlineRaw = response.choices[0].message.content;
    const cleaned = outlineRaw
      .replace(/^```json\s*/, "")
      .replace(/^```\s*/, "")
      .replace(/```$/, "")
      .trim();
    const conversation = JSON.parse(cleaned);
    await saveRoleplayHistory(email, conversation, language, topic, weekTarget);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: {
        success: true,
        conversation: conversation
      }
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: {
        error: error.message
      }
    };
  }
}

export { generateRoleplay };
