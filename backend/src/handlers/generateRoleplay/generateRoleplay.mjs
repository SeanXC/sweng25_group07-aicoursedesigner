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
 * Generates a roleplay conversation.
 * @param {string} email - The user's email.
 * @param {string} userLevel - The user's language proficiency level.
 * @param {string} language - The target language.
 * @param {string} topic - The conversation topic.
 */
async function generateRoleplay(email, userLevel, language, topic) {
  if (!language) return { error: "Please specify the target language" };
  if (!email) return { error: "Missing user email" };
  if (!userLevel) return { error: `Please specify your level in ${language}` };
  if (!topic) return { error: "Please specify a topic for the roleplay" };

  // Retrieve OpenAI API key from AWS SSM
  const apiKey = await getOpenAIKey();
  if (!apiKey) return { error: "Failed to retrieve OpenAI API Key from SSM" };

  const openai = new OpenAI({ apiKey });

  // Retrieve past conversation history
  const historyData = await getRoleplayHistory(email);
  const history = historyData.success ? historyData.history : [];

  let prompt;

  if (history.length === 0) {
    // No history exists, start the conversation with a natural opening line
    prompt = `Create a natural conversation between two people on the topic "${topic}" in ${language}.
    Ensure the difficulty level matches a ${userLevel} speaker.
    The conversation should start with "person1" saying an appropriate opening line related to the topic.
    For example:
    - If the topic is "Ordering Food at a Restaurant," "person1" could start with: "Hello, I would like to order food."
    - If the topic is "Asking for Directions," "person1" could start with: "Excuse me, can you help me find the nearest train station?"
    
    Format the response as:
    {
      "person1": "<opening line>",
      "person2": "<response>",
      "person1": "<response>",
      "person2": "<response>",
      ...
    }`;
  } else {
    // History exists, continue the conversation naturally
    const lastConversation = history[0].conversation; // Most recent conversation
    const historyContext = Object.entries(lastConversation)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");

    prompt = `Continue the following conversation naturally in ${language}, ensuring the difficulty level matches ${userLevel}.
    The conversation so far:
    ${historyContext}

    Continue with a structured response in this format:
    {
      "person1": "<response>",
      "person2": "<response>",
      "person1": "<response>",
      "person2": "<response>",
      ...
    }`;
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  try {
    const conversation = JSON.parse(response.choices[0].message.content);

    // Save to database
    await saveRoleplayHistory(email, conversation, language, topic);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: conversation,
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: error.message }),
    };
  }
}

export { generateRoleplay };
