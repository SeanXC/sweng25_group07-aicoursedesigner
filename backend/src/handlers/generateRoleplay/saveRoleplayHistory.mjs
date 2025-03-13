import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ region: "eu-west-1" });
const dynamodb = DynamoDBDocumentClient.from(client);

/**
 * Saves a roleplay conversation.
 * @param {string} email - The user's email.
 * @param {object} conversation - The conversation content.
 * @param {string} language - The conversation language.
 * @param {string} topic - The conversation topic.
 */
async function saveRoleplayHistory(email, conversation, language, topic) {
  if (!email || !conversation) {
    return { success: false, error: "Missing required fields" };
  }

  const timestamp = new Date().toISOString();

  const params = {
    TableName: "RoleplayConversations",
    Item: { email, timestamp, conversation, language, topic },
  };

  try {
    await dynamodb.send(new PutCommand(params));
    return { success: true, email, timestamp };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export { saveRoleplayHistory };
