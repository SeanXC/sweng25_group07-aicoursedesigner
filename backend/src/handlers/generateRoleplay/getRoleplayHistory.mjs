import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ region: "eu-west-1" });
const dynamodb = DynamoDBDocumentClient.from(client);

/**
 * Retrieves all roleplay conversation history for a user on a specific topic, sorted from earliest to latest.
 * @param {string} email - The user's email.
 * @param {string} topic - The conversation topic.
 */
async function getRoleplayHistory(email, topic) {
  console.log("Fetching roleplay history for:", { email, topic });

  if (!email) {
    console.error("Missing email parameter");
    return { success: false, error: "Email is required" };
  }
  if (!topic) {
    console.error("Missing topic parameter");
    return { success: false, error: "Topic is required" };
  }

  const params = {
    TableName: "RoleplayConversations",
    KeyConditionExpression: "email = :email",
    ExpressionAttributeValues: {
      ":email": email
    },
    FilterExpression: "topic = :topic",
    ExpressionAttributeValues: {
      ":email": email,
      ":topic": topic
    },
    ScanIndexForward: true // Fetch from earliest to latest
  };

  try {
    console.log("DynamoDB Query Parameters:", params);
    const result = await dynamodb.send(new QueryCommand(params));
    console.log("DynamoDB Query Result:", result);
    
    return { success: true, history: result.Items || [] };
  } catch (error) {
    console.error("Error fetching history:", error);
    return { success: false, error: error.message };
  }
}

export { getRoleplayHistory };
