import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ region: "eu-west-1" });
const dynamodb = DynamoDBDocumentClient.from(client);

async function getRoleplayHistory(email, topic, weekTarget) {
  if (!email || !topic || weekTarget === undefined) {
    return { success: false, error: "Missing required parameters" };
  }

  const params = {
    TableName: "RoleplayConversations",
    KeyConditionExpression: "email = :email",
    ExpressionAttributeValues: {
      ":email": email
    },
    ScanIndexForward: true // Fetch from earliest to latest
  };

  try {
    const result = await dynamodb.send(new QueryCommand(params));


    const filteredHistory = result.Items.filter(
      (item) => item.topic === topic && item.weekTarget === weekTarget
    );

    return {
      success: true,
      history: filteredHistory
    };
  } catch (error) {
    console.error("Error fetching history:", error);
    return { success: false, error: error.message };
  }
}

export { getRoleplayHistory };
