import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from "uuid";

const client = new DynamoDBClient({ region: "eu-west-1" });
const dynamodb = DynamoDBDocumentClient.from(client);

async function saveCourseOutline(email, courseOutline) {
  const courseId = uuidv4();
  const timestamp = new Date().toISOString();

  const params = {
    TableName: "Course",
    Item: {
      email,
      courseId,
      courseTitle: courseOutline.course_title,
      createdAt: timestamp,
      weeks: courseOutline.weeks,
      assessment: courseOutline.assessment,
      learningOutcomes: courseOutline.learning_outcomes,
    },
  };

  try {
    await dynamodb.send(new PutCommand(params));
    console.log("Course outline saved:", email, courseId);
    return { success: true, email, courseId, createdAt: timestamp };
  } catch (error) {
    console.error("Error saving outline:", error);
    return { success: false, error: error.message };
  }
}

export { saveCourseOutline };
