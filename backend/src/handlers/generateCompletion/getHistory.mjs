import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ region: "eu-west-1" });
const dynamodb = DynamoDBDocumentClient.from(client);

/**
 * Query course outline history by email and course_title (for a specific course) or just by email (to get all course titles).
 * @param {string} email - User's email
 * @param {string} course_title - (Optional) Course title
 */
async function getCourseOutlineHistory(email, course_title) {
  if (!email) {
    return { success: false, error: "Email is required" };
  }

  let params = {
    TableName: "courseOutlines",
    KeyConditionExpression: "email = :email",
    ExpressionAttributeValues: {
      ":email": email,
    },
    ScanIndexForward: false,
  };

  // If a course_title is provided, add a filter to the query
  if (course_title) {
    params.FilterExpression = "course_title = :course_title";
    params.ExpressionAttributeValues[":course_title"] = course_title;
  }

  try {
    const result = await dynamodb.send(new QueryCommand(params));

    // If no items are found
    if (!result.Items || result.Items.length === 0) {
      return { success: false, error: "No courses found" };
    }

    if (course_title) {
      // If course_title is specified, return the history for that course
      return {
        success: true,
        history: result.Items || [],
      };
    } else {
      // If course_title is not specified, return a list of course titles along with timestamps
      const courseDetails = result.Items.map(item => ({
        course_title: item.course_title,
        timestamp: item.timestamp // Assuming `timestamp` exists in the DynamoDB item
      }));
      return {
        success: true,
        courseDetails, // Return course titles and timestamps
      };
    }
  } catch (error) {
    console.error("Error fetching history:", error);
    return { success: false, error: error.message };
  }
}

export { getCourseOutlineHistory };
