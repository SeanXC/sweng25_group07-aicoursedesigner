import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "eu-west-1" });
const dynamodb = DynamoDBDocumentClient.from(client);

export async function getChatHistory(email, topic, weekTarget) {
  const params = {
    TableName: "QuestionChatHistory",
    KeyConditionExpression: "email = :email",
    ExpressionAttributeValues: {
      ":email": email,
    },
    ScanIndexForward: true,
  };

  try {
    const result = await dynamodb.send(new QueryCommand(params));
    const history = result.Items.filter(
      item => item.topic === topic && item.weekTarget === weekTarget
    );
    return { success: true, history };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
