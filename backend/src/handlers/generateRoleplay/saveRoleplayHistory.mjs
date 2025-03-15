import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ region: "eu-west-1" });
const dynamodb = DynamoDBDocumentClient.from(client);

async function saveRoleplayHistory(email, conversation, language, topic, weekTarget) {
  if (!email || !conversation || !weekTarget) {
    return { success: false, error: "Missing required fields" };
  }

  const timestamp = new Date().toISOString();

  const params = {
    TableName: "RoleplayConversations",
    Item: { email, timestamp, conversation, language, topic, weekTarget },
  };

  try {
    await dynamodb.send(new PutCommand(params));
    return { success: true, email, timestamp };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export { saveRoleplayHistory };
