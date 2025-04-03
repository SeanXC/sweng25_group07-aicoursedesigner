import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { SSMClient } from "@aws-sdk/client-ssm";

import { getCompletion } from "./getCompletion.mjs";
import { saveCourseOutline } from "./saveCompletion.mjs";
import { getCourseOutlineHistory } from "./getHistory.mjs";

const ssmClient = new SSMClient({ region: "eu-west-1" });
const client = new DynamoDBClient({ region: "eu-west-1" });
const dynamodb = DynamoDBDocumentClient.from(client);

export async function handler(event) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS, POST, PUT, GET",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  try {
    console.log("Received event:", JSON.stringify(event, null, 2));

    const { httpMethod, body, queryStringParameters } = event;

    if (httpMethod === "OPTIONS") {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: "CORS preflight success" }),
      };
    }

    if (httpMethod === "POST") {
      if (!body) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: "Request body is required" }),
        };
      }
      const userInput = JSON.parse(body);
      const result = await getCompletion(userInput);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(result),
      };
    }

    if (httpMethod === "PUT") {
      if (!body) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: "Request body is required" }),
        };
      }
      const { email, courseOutline } = JSON.parse(body);
      if (!email) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: "Email is required" }),
        };
      }
      const result = await saveCourseOutline(email, courseOutline);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(result),
      };
    }

    if (httpMethod === "GET") {
      const { email, course_title } = queryStringParameters || {};

      // Check if email is provided
      if (!email) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ success: false, error: "Email is required" }),
        };
      }

      // If course_title is not provided, handle it as optional
      const result = await getCourseOutlineHistory(email, course_title);  // Pass course_title as optional
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(result),
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
