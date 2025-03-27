import { generatePhrases } from "./generatePhrases.mjs";
import { savePhrases } from "./savePhrases.mjs";
import { getPhrases } from "./getPhrases.mjs";

export async function handler(event) {
  // Common headers for CORS support
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS, POST, PUT, GET",
    "Access-Control-Allow-Headers": "Content-Type",
  };
  try {
    console.log("Received event:", JSON.stringify(event, null, 2));

    const { httpMethod, body, queryStringParameters, path } = event;

    // Common headers for CORS support
    // const headers = {
    //   "Access-Control-Allow-Origin": "*",
    //   "Access-Control-Allow-Methods": "OPTIONS, POST, PUT, GET",
    //   "Access-Control-Allow-Headers": "Content-Type",
    // };

    // Handle CORS preflight requests
    if (httpMethod === "OPTIONS") {
      return { statusCode: 200, headers, body: JSON.stringify({ message: "CORS preflight success" }) };
    }

    // Handle phrase retrieval (GET request)
    if (httpMethod === "GET" && path.includes("/get-phrases")) {
      const { email, topic, weekTarget } = queryStringParameters || {};

      if (!email || !topic || !weekTarget) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: "Email, topic, and weekTarget are required" }) };
      }

      const phrases = await getPhrases(email, topic, weekTarget);
      return { statusCode: 200, headers, body: JSON.stringify(phrases) };
    }

    // Handle phrase generation (POST request)
    if (httpMethod === "POST" && path.includes("/generate-phrases")) {
      if (!body) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: "Request body is required" }) };
      }

      // Safely parse JSON body
      let parsedBody;
      try {
        parsedBody = JSON.parse(body);
      } catch (error) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid JSON format" }) };
      }

      const { email, userLevel, language, topic, weekTarget, outline } = parsedBody;

      // Validate required fields
      if (!email || !language || !topic || !weekTarget || !outline || !userLevel) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: "Missing required fields" }) };
      }

      // Generate phrases using external function
      const phrases = await generatePhrases(email, userLevel, language, topic, weekTarget, outline);

      if (phrases.error) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: phrases.error }) };
      }

      // Save generated phrases
      //await savePhrases(email, phrases, topic);
      await savePhrases(email, phrases, topic, language, weekTarget);

      return { statusCode: 200, headers, body: JSON.stringify(phrases) };
    }

    // Handle unsupported HTTP methods
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method Not Allowed" }) };
  } catch (error) {
    console.error("Handler error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Internal Server Error", details: error.message }),
    };
  }
}
