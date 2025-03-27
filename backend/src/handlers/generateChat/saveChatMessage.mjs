import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ region: "eu-west-1" });
const dynamodb = DynamoDBDocumentClient.from(client);

/**
 * Saves a chat message to DynamoDB.
 */
async function saveChatMessage(email, role, message, language, languageTag, topic, weekTarget) {
  if (!email || !role || !message || !topic || weekTarget === undefined) {
    return { success: false, error: "Missing required fields" };
  }

  const timestamp = new Date().toISOString();

  const params = {
    TableName: "ChatMessages",
    Item: {
      email,
      timestamp,
      role,
      message,
      language,
      languageTag,
      topic,
      weekTarget,
    },
  };

  try {
    await dynamodb.send(new PutCommand(params));
    return { success: true, email, timestamp };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export { saveChatMessage };
