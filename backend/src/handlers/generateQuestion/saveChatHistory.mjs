import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "eu-west-1" });
const dynamodb = DynamoDBDocumentClient.from(client);

export async function saveChatHistory(email, question, correctAnswer, userAnswer, isCorrect, topic, weekTarget) {
  const timestamp = new Date().toISOString();

  const params = {
    TableName: "QuestionChatHistory",
    Item: {
      email,
      timestamp,
      question,
      correctAnswer,
      userAnswer,
      isCorrect,
      topic,
      weekTarget,
    },
  };

  try {
    await dynamodb.send(new PutCommand(params));
    return { success: true };
  } catch (err) {
    console.error("Error saving chat history:", err);
    return { success: false, error: err.message };
  }
}
