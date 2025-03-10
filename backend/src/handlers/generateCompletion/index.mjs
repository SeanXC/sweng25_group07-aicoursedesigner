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
    const { httpMethod, body, queryStringParameters } = event;

    if (httpMethod === "POST") {
      const userInput = JSON.parse(body);
      return {
        statusCode: 200,
        body: JSON.stringify(await getCompletion(userInput)),
      };
    }

    if (httpMethod === "PUT") {
      const { email, courseOutline } = JSON.parse(body);
      if (!email) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Email is required" }),
        };
      }
      return {
        statusCode: 200,
        body: JSON.stringify(await saveCourseOutline(email, courseOutline)),
      };
    }

    if (httpMethod === "GET") {
      const { email } = queryStringParameters || {};
      if (!email) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Email is required" }),
        };
      }
      return {
        statusCode: 200,
        body: JSON.stringify(await getCourseOutlineHistory(email)),
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
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
}
