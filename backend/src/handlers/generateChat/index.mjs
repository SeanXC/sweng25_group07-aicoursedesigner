import { generateChat } from "./generateChat.mjs";
import { getChatHistory } from "./getChatHistory.mjs";
import { saveChatMessage } from "./saveChatMessage.mjs";

export async function handler(event) {
  try {
    console.log("Received event:", JSON.stringify(event, null, 2));

    const { httpMethod, body, queryStringParameters, path } = event;

    // Handle CORS preflight requests
    if (httpMethod === "OPTIONS") {
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS, POST, PUT, GET",
          "Access-Control-Allow-Headers": "Content-Type",
        },
        body: JSON.stringify({ message: "CORS preflight success" }),
      };
    }

    // Handle chat history retrieval (GET request)
    if (httpMethod === "GET" && path === "/chat-history") {
      const { email } = queryStringParameters || {};
      if (!email) {
        return { statusCode: 400, body: JSON.stringify({ error: "Email is required" }) };
      }
      return {
        statusCode: 200,
        body: JSON.stringify(await getChatHistory(email)),
      };
    }

    // Handle chat generation (POST request)
    if (httpMethod === "POST" && path === "/generate-chat") {
      if (!body) {
        return { statusCode: 400, body: JSON.stringify({ error: "Request body is required" }) };
      }
      const { email, userLevel, language, topic, userMsg = "" } = JSON.parse(body);
      if (!email || !language || !userLevel || !topic) {
        return { statusCode: 400, body: JSON.stringify({ error: "Missing required fields" }) };
      }
      return {
        statusCode: 200,
        body: JSON.stringify(await generateChat(email, userLevel, language, topic, userMsg)),
      };
    }

    // Handle saving chat messages manually (PUT request)
    if (httpMethod === "PUT" && path === "/save-chat") {
      if (!body) {
        return { statusCode: 400, body: JSON.stringify({ error: "Request body is required" }) };
      }
      const { email, role, message, language, topic } = JSON.parse(body);
      if (!email || !role || !message) {
        return { statusCode: 400, body: JSON.stringify({ error: "Missing required fields" }) };
      }
      return {
        statusCode: 200,
        body: JSON.stringify(await saveChatMessage(email, role, message, language, topic)),
      };
    }

    // Handle unsupported HTTP methods
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  } catch (error) {
    console.error("Handler error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error", details: error.message }),
    };
  }
}
