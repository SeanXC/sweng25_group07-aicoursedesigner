import OpenAI from "openai";
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";
import { getRoleplayHistory } from "../GENERATEROLEPLAY/getRoleplayHistory.mjs";

const ssmClient = new SSMClient({ region: "eu-west-1" });

async function getOpenAIKey() {
  try {
    const command = new GetParameterCommand({
      Name: "OPENAI_API_KEY",
      WithDecryption: true,
    });
    const response = await ssmClient.send(command);
    return response.Parameter.Value;
  } catch (error) {
    console.error("Error fetching OpenAI API Key:", error);
    return null;
  }
}

export async function generateQuestion(email, topic, weekTarget) {
  const apiKey = await getOpenAIKey();
  if (!apiKey) return { error: "Missing OpenAI API key" };

  const openai = new OpenAI({ apiKey });

  const historyData = await getRoleplayHistory(email, topic, weekTarget);
  if (!historyData.success || historyData.history.length === 0) {
    return { error: "No roleplay history found" };
  }

  const lastConversation = historyData.history[historyData.history.length - 1].conversation;
  const historyContext = Object.entries(lastConversation)
    .map(([speaker, line]) => `${speaker}: ${line}`)
    .join("\n");

  const prompt = `
Based on this roleplay conversation, generate one comprehension question and answer in this format:

{
  "question": "What does Mia want to do?",
  "answer": "Order a cola"
}

Conversation:
${historyContext}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  const cleaned = response.choices[0].message.content.trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/, "")
    .trim();

  try {
    const parsed = JSON.parse(cleaned);
    return parsed;
  } catch (err) {
    return { error: "Failed to parse response", raw: cleaned };
  }
}
