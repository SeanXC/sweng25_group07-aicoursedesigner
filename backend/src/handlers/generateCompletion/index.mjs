import OpenAI from "openai";
import dotenv from "dotenv";
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

const ssmClient = new SSMClient({ region: "eu-west-1" });
const client = new DynamoDBClient({ region: "eu-west-1" });
const dynamodb = DynamoDBDocumentClient.from(client);

import { getCompletion } from "./getCompletion.mjs";
import { saveCourseOutline } from "./saveCompletion.mjs";
import { getCourseOutlineHistory } from "./getHistory.mjs";

export async function handler(event) {
  try {
    console.log("Received event:", JSON.stringify(event, null, 2)); // Debug log

    const { httpMethod, body, queryStringParameters } = event;

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

    if (httpMethod === "POST") {
      if (!body) {
        return {
          statusCode: 400,
          headers: { "Access-Control-Allow-Origin": "*" },
          body: JSON.stringify({ error: "Request body is required" }),
        };
      }
      const userInput = JSON.parse(body);
      const result = await getCompletion(userInput);
      return {
        statusCode: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify(result),
      };
    }

    if (httpMethod === "PUT") {
      if (!body) {
        return {
          statusCode: 400,
          headers: { "Access-Control-Allow-Origin": "*" },
          body: JSON.stringify({ error: "Request body is required" }),
        };
      }
      const { email, courseOutline } = JSON.parse(body);
      if (!email) {
        return {
          statusCode: 400,
          headers: { "Access-Control-Allow-Origin": "*" },
          body: JSON.stringify({ error: "Email is required" }),
        };
      }
      const result = await saveCourseOutline(email, courseOutline);
      return {
        statusCode: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify(result),
      };
    }

    if (httpMethod === "GET") {
      const { email } = queryStringParameters || {};
      if (!email) {
        return {
          statusCode: 400,
          headers: { "Access-Control-Allow-Origin": "*" },
          body: JSON.stringify({ error: "Email is required" }),
        };
      }
      const result = await getCourseOutlineHistory(email);
      return {
        statusCode: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify(result),
      };
    }

    return {
      statusCode: 405,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  } catch (error) {
    console.error("Handler error:", error);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Internal Server Error", details: error.message }),
    };
  }
}
