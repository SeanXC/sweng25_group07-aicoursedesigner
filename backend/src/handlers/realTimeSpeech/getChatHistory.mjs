import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ region: "eu-west-1" });
const dynamodb = DynamoDBDocumentClient.from(client);

/**
 * Retrieves chat history for a user.
 * @param {string} email - The user's email.
 * @returns {Promise<object>} - The chat history or an error object.
 */
async function getChatHistory(email) {
  if (!email) return { success: false, error: "Email is required" };

  const params = {
    TableName: "ChatMessages",
    KeyConditionExpression: "email = :email",
    ExpressionAttributeValues: { ":email": email },
    ScanIndexForward: false,
    Limit: 20,
  };

  try {
    const result = await dynamodb.send(new QueryCommand(params));
    return { success: true, history: result.Items || [] };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export { getChatHistory };
