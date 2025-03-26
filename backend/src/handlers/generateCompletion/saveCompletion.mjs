import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from "uuid";

const client = new DynamoDBClient({ region: "eu-west-1" });
const dynamodb = DynamoDBDocumentClient.from(client);

/**
 * Saves the generated course outline to DynamoDB under the user's email.
 * @param {string} email - User's email (Primary Key).
 * @param {object} courseOutline - Generated course outline from OpenAI.
 * @returns {Promise<object>} - Success or error response.
 */
async function saveCourseOutline(email, courseOutline) {
    if (!email || !courseOutline) {
        return { success: false, error: "Email and courseOutline are required" };
    }

    const courseId = uuidv4();
    const timestamp = new Date().toISOString();

    const params = {
        TableName: "courseOutlines", // Change if needed
        Item: {
            email,
            courseId,
            course_title: courseOutline.course_title || "Untitled Course",
            description: courseOutline.description || "No description provided",
            difficulty: courseOutline.difficulty || "Unknown",
            target_language: courseOutline.targetLang || "Unknown",
            language_used: courseOutline.nativeLang || "Unknown",
            duration: courseOutline.duration || 0,
            weeks: courseOutline.weeks || [],
            assessment: courseOutline.assessment || { continuous_evaluation: [], final_assessment: [] },
            learning_outcomes: courseOutline.learning_outcomes || [],
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
