import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from "uuid";

const client = new DynamoDBClient({ region: "eu-west-1" });
const dynamodb = DynamoDBDocumentClient.from(client);

async function saveCourseOutline(email, courseOutline) {
    if (!email || !courseOutline) {
        return { success: false, error: "Email and courseOutline are required" };
    }

    const courseId = uuidv4();
    const timestamp = new Date().toISOString();

    const params = {
        TableName: "courseOutlines",
        Item: {
            email,
            courseId,
            course_title: courseOutline.course_title,
            description: courseOutline.description,
            difficulty: courseOutline.difficulty,
            target_language: courseOutline.target_language,
            language_used: courseOutline.language_used,
            duration: courseOutline.duration,
            weeks: courseOutline.weeks,
            assessment: courseOutline.assessment,
            learning_outcomes: courseOutline.learning_outcomes,
            createdAt: timestamp
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
