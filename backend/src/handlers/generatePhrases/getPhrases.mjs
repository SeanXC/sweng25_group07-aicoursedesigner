import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "eu-west-1" });
const dynamodb = DynamoDBDocumentClient.from(client);

/**
 * Retrieves phrases by email, topic, and weekTarget from DynamoDB.
 * @param {string} email - User's email (partition key)
 * @param {string} topic - Topic filter
 * @param {number|string} weekTarget - Week number (will be coerced to number)
 * @returns {Promise<object>} Result from DynamoDB
 */
export async function getPhrases(email, topic, weekTarget) {
  if (!email || !topic || weekTarget === undefined) {
    return { error: "Email, topic, and weekTarget are required" };
  }

  const numericWeekTarget = Number(weekTarget);

  const params = {
    TableName: "PhrasesTable",
    KeyConditionExpression: "email = :email",
    FilterExpression: "topic = :topic AND weekTarget = :weekTarget",
    ExpressionAttributeValues: {
      ":email": email,
      ":topic": topic,
      ":weekTarget": numericWeekTarget,
    },
  };

  console.log("🔍 Querying DynamoDB with params:", JSON.stringify(params, null, 2));

  try {
    const result = await dynamodb.send(new QueryCommand(params));

    if (result.Items && result.Items.length > 0) {
      return { phrases: result.Items };
    } else {
      return { message: "No phrases found for this topic and weekTarget" };
    }
  } catch (error) {
    console.error("❌ Error retrieving phrases from DynamoDB:", error);
    return { error: error.message };
  }
}
