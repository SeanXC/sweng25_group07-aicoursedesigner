import { generateRoleplay } from "./generateRoleplay.mjs";
import { getRoleplayHistory } from "./getRoleplayHistory.mjs";
import { saveRoleplayHistory } from "./saveRoleplayHistory.mjs";

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
          "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
          "Access-Control-Allow-Headers": "Content-Type",
        },
        body: JSON.stringify({ message: "CORS preflight success" }),
      };
    }

    // Retrieve roleplay conversation history for a specific topic
    if (httpMethod === "GET" && path === "/roleplay-history") {
      const email = queryStringParameters?.email;
      const topic = queryStringParameters?.topic;

      console.log("Extracted query parameters:", { email, topic });

      if (!email || !topic) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Email and Topic are required" }),
        };
      }

      return {
        statusCode: 200,
        body: JSON.stringify(await getRoleplayHistory(email, topic)),
      };
    }

    // Generate a new roleplay conversation
    if (httpMethod === "POST" && path === "/generate-roleplay") {
      if (!body) {
        return { statusCode: 400, body: JSON.stringify({ error: "Request body is required" }) };
      }
      const { email, userLevel, language, topic } = JSON.parse(body);
      if (!email || !language || !userLevel || !topic) {
        return { statusCode: 400, body: JSON.stringify({ error: "Missing required fields" }) };
      }
      return {
        statusCode: 200,
        body: JSON.stringify(await generateRoleplay(email, userLevel, language, topic)),
      };
    }

    // Save roleplay conversation
    if (httpMethod === "PUT" && path === "/save-roleplay") {
      if (!body) {
        return { statusCode: 400, body: JSON.stringify({ error: "Request body is required" }) };
      }
      const { email, conversation, language, topic } = JSON.parse(body);
      if (!email || !conversation || !topic) {
        return { statusCode: 400, body: JSON.stringify({ error: "Missing required fields" }) };
      }
      return {
        statusCode: 200,
        body: JSON.stringify(await saveRoleplayHistory(email, conversation, language, topic)),
      };
    }

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
