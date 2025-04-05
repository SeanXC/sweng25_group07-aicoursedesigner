import OpenAI from "openai";
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";

const ssmClient = new SSMClient({ region: "eu-west-1" });

async function getOpenAIKey() {
  try {
    const command = new GetParameterCommand({
      Name: "OPENAI_API_KEY",
      WithDecryption: true,
    });
    const response = await ssmClient.send(command);
    return response.Parameter.Value;
  } catch (err) {
    console.error("Failed to get OpenAI key:", err);
    return null;
  }
}

export async function compareAnswer(userAnswer, correctAnswer) {
  const apiKey = await getOpenAIKey();
  if (!apiKey) return false;

  const openai = new OpenAI({ apiKey });

  const prompt = `
Compare the following two answers for semantic similarity. 
Return only "true" if they mean the same thing, otherwise return "false".

Correct Answer: "${correctAnswer}"
User Answer: "${userAnswer}"
`;

  try {
    const res = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
    });

    const reply = res.choices[0].message.content.trim().toLowerCase();
    return reply.includes("true");
  } catch (err) {
    console.error("OpenAI comparison error:", err);
    return false;
  }
}
