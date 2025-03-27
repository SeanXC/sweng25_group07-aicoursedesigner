import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ region: "eu-west-1" });
const dynamodb = DynamoDBDocumentClient.from(client);

async function saveCourseOutline(email, courseOutline) {
  if (!email || !courseOutline || !courseOutline.course_title || !courseOutline.weeks) {
    return { success: false, error: "Missing required fields" };
  }

  const timestamp = new Date().toISOString();

  const params = {
    TableName: "courseOutlines",
    Item: {
      email,
      timestamp,
      course_title: courseOutline.course_title,
      weeks: courseOutline.weeks,
      learning_outcomes: courseOutline.learning_outcomes || [],
      description: courseOutline.description || null,
      difficulty: courseOutline.difficulty || null,
      target_language: courseOutline.targetLang || null,
      language_used: courseOutline.nativeLang || null,
      duration: courseOutline.duration || null,
    },
  };

  try {
    await dynamodb.send(new PutCommand(params));
    return { success: true, email, timestamp };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export { saveCourseOutline };
