import { generateChat } from "./generateChat.mjs";
import { getChatHistory } from "./getChatHistory.mjs";
import { saveChatMessage } from "./saveChatMessage.mjs";

export async function handler(event) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS, POST, PUT, GET",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  try {
    console.log("Received event:", JSON.stringify(event, null, 2));

    const { httpMethod, body, queryStringParameters, path } = event;

    if (httpMethod === "OPTIONS") {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: "CORS preflight success" }),
      };
    }

    if (httpMethod === "GET" && path.includes("/chat-history")) {
      const { email, topic, weekTarget } = queryStringParameters || {};
      if (!email || !topic || !weekTarget) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: "Email, Topic, and Week Target are required" }),
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(await getChatHistory(email, topic, Number(weekTarget))),
      };
    }

    if (httpMethod === "POST" && path.includes("/generate-chat")) {
      if (!body) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: "Request body is required" }),
        };
      }

      const { email, userLevel, language, languageTag, topic, userMsg = "", weekTarget, outline } = JSON.parse(body);
      if (!email || !language || !userLevel || !topic || !weekTarget || !outline) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: "Missing required fields" }),
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(await generateChat(email, userLevel, language, languageTag, topic, userMsg, weekTarget, outline)),
      };
    }

    if (httpMethod === "PUT" && path.includes("/save-chat")) {
      if (!body) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: "Request body is required" }),
        };
      }

      const { email, role, message, language, languageTag, topic, weekTarget } = JSON.parse(body);
      if (!email || !role || !message || !topic || weekTarget === undefined) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: "Missing required fields" }),
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(await saveChatMessage(email, role, message, language, languageTag, topic, weekTarget)),
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  } catch (error) {
    console.error("Handler error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Internal Server Error", details: error.message }),
    };
  }
}
