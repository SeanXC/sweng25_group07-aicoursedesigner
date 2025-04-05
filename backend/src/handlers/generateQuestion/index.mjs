import { generateQuestion } from "./generateQuestion.mjs";
import { saveChatHistory } from "./saveChatHistory.mjs";
import { getChatHistory } from "./getChatHistory.mjs";
import { compareAnswer } from "./compareAnswer.mjs";

export async function handler(event) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  try {
    const { httpMethod, body, queryStringParameters, path } = event;

    if (httpMethod === "OPTIONS") {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: "CORS preflight success" }),
      };
    }

    if (httpMethod === "POST" && path === "/generate-question") {
      if (!body) return badRequest("Missing request body");

      const { email, userLevel, language, languageTag, topic, roleplayContent, weekTarget, outline } = JSON.parse(body);
      if (!email || !userLevel || !language || !languageTag || !topic || !roleplayContent || !weekTarget || !outline) {
        return badRequest("Missing required fields");
      }

      const result = await generateQuestion(email, userLevel, language, languageTag, topic, roleplayContent, weekTarget, outline);
      return { ...result, headers };
    }

    if (httpMethod === "POST" && path === "/submit-answer") {
      if (!body) return badRequest("Missing request body");

      const { email, question, correctAnswer, userAnswer, topic, weekTarget } = JSON.parse(body);
      if (!email || !question || !correctAnswer || !userAnswer || !topic || weekTarget === undefined) {
        return badRequest("Missing required fields");
      }

      const isCorrect = await compareAnswer(userAnswer, correctAnswer);

      const saveResult = await saveChatHistory(
        email, question, correctAnswer, userAnswer, isCorrect, topic, weekTarget
      );

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ correct: isCorrect, saved: saveResult.success }),
      };
    }

    if (httpMethod === "GET" && path === "/question-history") {
      const { email, topic, weekTarget } = queryStringParameters || {};
      if (!email || !topic || !weekTarget) {
        return badRequest("Email, Topic, and Week Target are required");
      }

      const result = await getChatHistory(email, topic, Number(weekTarget));
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(result),
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };

    function badRequest(message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: message }),
      };
    }
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Internal Server Error", detail: err.message }),
    };
  }
}
