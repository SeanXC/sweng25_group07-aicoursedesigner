import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ region: "eu-west-1" });
const dynamodb = DynamoDBDocumentClient.from(client);

/**
 * Query course outline by email and course_title using FilterExpression (since timestamp is sort key).
 * @param {string} email - User's email
 * @param {string} course_title - Course title
 */
async function getCourseOutlineHistory(email, course_title) {
  if (!email || !course_title) {
    return { success: false, error: "Email and course_title are required" };
  }

  const params = {
    TableName: "courseOutlines",
    KeyConditionExpression: "email = :email",
    FilterExpression: "course_title = :course_title",
    ExpressionAttributeValues: {
      ":email": email,
      ":course_title": course_title,
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