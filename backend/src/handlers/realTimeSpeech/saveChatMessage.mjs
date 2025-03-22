import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ region: "eu-west-1" });
const dynamodb = DynamoDBDocumentClient.from(client);

/**
 * Saves a chat message to DynamoDB.
 * @param {string} email - The user's email.
 * @param {string} role - The role of the message (system, user, assistant).
 * @param {string} message - The chat message content.
 * @param {string} language - The conversation language.
 * @param {string} topic - The conversation topic.
 * @returns {Promise<object>} - Success or failure response.
 */
async function saveChatMessage(email, role, message, language, topic) {
  if (!email || !role || !message) {
    return { success: false, error: "Missing required fields" };
  }

  const timestamp = new Date().toISOString();

  const params = {
    TableName: "ChatMessages",
    Item: { email, timestamp, role, message, language, topic },
  };

  try {
    await dynamodb.send(new PutCommand(params));
    return { success: true, email, timestamp };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export { saveChatMessage };
