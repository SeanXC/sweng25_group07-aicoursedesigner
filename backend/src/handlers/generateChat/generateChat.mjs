import OpenAI from "openai";
import dotenv from "dotenv";
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { saveChatMessage } from "./saveChatMessage.mjs";  // Import saveChatMessage function

// Initialize AWS clients
const ssmClient = new SSMClient({ region: "eu-west-1" });
const client = new DynamoDBClient({ region: "eu-west-1" });
const dynamodb = DynamoDBDocumentClient.from(client);

dotenv.config();

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

// Stores ongoing conversations for each user
const conversation = {};

/**
 * Generates a chat response using OpenAI's API.
 * Saves system, user, and assistant messages to DynamoDB.
 * @param {string} email - The user's email.
 * @param {string} userLevel - The user's proficiency level in the language.
 * @param {string} language - The target language for the conversation.
 * @param {string} topic - The roleplay topic.
 * @param {string} [userMsg=""] - The user's message.
 * @returns {Promise<object>} The chatbot response or an error object.
 */
async function generateChat(email, userLevel, language, topic, userMsg = "") {
    if (!language) return { error: "Please specify the target language" };
    if (!email) return { error: "Missing user email" };
    if (!userLevel) return { error: `Please specify your level in ${language}` };
    if (!topic) return { error: "Please specify a topic for the roleplay" };

    // Fetch the OpenAI API key
    const apiKey = await getOpenAIKey();
    if (!apiKey) return { error: "Failed to retrieve OpenAI API Key from SSM" };

    const openai = new OpenAI({ apiKey });

    // Initialize conversation if the user is new
    if (!conversation[email]) {
        const systemMessage = {
            role: "system",
            content: `You are roleplaying with a user on the topic "${topic}" in ${language}.
                      Keep responses interactive and ensure the conversation flows smoothly.
                      The difficulty level of the conversation in ${language} is ${userLevel}.
                      Format the response in the following JSON structure:
                      {
                        "response": "<response>"
                      }`,
        };
        conversation[email] = [systemMessage];

        // Save system message to DynamoDB
        await saveChatMessage(email, systemMessage.role, systemMessage.content, language, topic);
    }

    // Append the user's message to the conversation
    if (userMsg) {
        const userMessage = { role: "user", content: userMsg };
        conversation[email].push(userMessage);

        // Save user message to DynamoDB
        await saveChatMessage(email, userMessage.role, userMessage.content, language, topic);
    }

    // Generate a response using OpenAI's API
    const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: conversation[email],
        temperature: 0.7,
    });

    const botReply = response.choices[0].message.content;
    const assistantMessage = { role: "assistant", content: botReply };

    // Append the assistant's response to the conversation history
    conversation[email].push(assistantMessage);

    // Save assistant message to DynamoDB
    await saveChatMessage(email, assistantMessage.role, assistantMessage.content, language, topic);

    try {
        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
                "Access-Control-Allow-Headers": "Content-Type",
            },
            body: JSON.parse(botReply),
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
}

export { generateChat };
