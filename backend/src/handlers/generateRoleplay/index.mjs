import { generateRoleplay } from "./generateRoleplay.mjs";
import { getRoleplayHistory } from "./getRoleplayHistory.mjs";
import { saveRoleplayHistory } from "./saveRoleplayHistory.mjs";

export async function handler(event) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
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

    if (httpMethod === "GET" && path === "/roleplay-history") {
      const email = queryStringParameters?.email;
      const topic = queryStringParameters?.topic;
      const weekTarget = queryStringParameters?.weekTarget ? Number(queryStringParameters.weekTarget) : null;

      console.log("Extracted query parameters:", { email, topic, weekTarget });

      if (!email || !topic || !weekTarget) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: "Email, Topic, and Week Target are required" }),
        };
      }

      const historyData = await getRoleplayHistory(email, topic, weekTarget);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(historyData, null, 2),
      };
    }

    if (httpMethod === "POST" && path === "/generate-roleplay") {
      if (!body) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: "Request body is required" }),
        };
      }

      const { email, userLevel, language, topic, weekTarget, outline } = JSON.parse(body);
      if (!email || !language || !userLevel || !topic || !weekTarget || !outline) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: "Missing required fields" }),
        };
      }

      const generatedRoleplay = await generateRoleplay(email, userLevel, language, topic, weekTarget, outline);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(generatedRoleplay, null, 2),
      };
    }

    if (httpMethod === "PUT" && path === "/save-roleplay") {
      if (!body) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: "Request body is required" }),
        };
      }

      const { email, conversation, language, topic, weekTarget } = JSON.parse(body);
      if (!email || !conversation || !topic || !weekTarget) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: "Missing required fields" }),
        };
      }

      const saveResponse = await saveRoleplayHistory(email, conversation, language, topic, weekTarget);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(saveResponse, null, 2),
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
