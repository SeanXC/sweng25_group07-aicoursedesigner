import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ region: "eu-west-1" });
const dynamodb = DynamoDBDocumentClient.from(client);

async function getCourseOutlineHistory(email) {
  const params = {
    TableName: "courseOutlines",
    KeyConditionExpression: "email = :email",
    ExpressionAttributeValues: {
      ":email": email,
    },
    ScanIndexForward: false,
  };

  try {
    const result = await dynamodb.send(new QueryCommand(params));
    return {
      success: true,
      history: result.Items || [],
    };
  } catch (error) {
    console.error("Error fetching history:", error);
    return { success: false, error: error.message };
  }
}

export { getCourseOutlineHistory };
