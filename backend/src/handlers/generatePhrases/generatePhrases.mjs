import OpenAI from "openai";
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";

// AWS SSM Client for API Key retrieval
const ssmClient = new SSMClient({ region: "eu-west-1" });

/**
 * Retrieves the OpenAI API Key from AWS SSM Parameter Store.
 * @returns {Promise<string|null>} API key or null if an error occurs.
 */
async function getOpenAIKey() {
  try {
    const command = new GetParameterCommand({
      Name: "OPENAI_API_KEY",
      WithDecryption: true,
    });
    const response = await ssmClient.send(command);
    return response.Parameter.Value;
  } catch (error) {
    console.error("Error fetching OpenAI API Key from AWS SSM:", error);
    return null;
  }
}

// export async function generatePhrases(language, no_of_phrases, topic) {
//   if (!language) return { error: "Please specify the target language" };
//   if (!no_of_phrases) return { error: "Please specify the number of phrases to generate" };
//   if (!topic) return { error: "Please specify a topic for the phrases" };

//   const apiKey = await getOpenAIKey();
//   if (!apiKey) return { error: "Failed to retrieve OpenAI API Key." };

//   const openai = new OpenAI({ apiKey });

//   const prompt = `Generate ${no_of_phrases} phrases based on the topic "${topic}" for a ${language} course in the following JSON format:
//                   {
//                     "phrases": [
//                       {
//                         "id": <id_number>,
//                         "english": "<english_phrase>",
//                         "<language>": "<translated_phrase>"
//                       }
//                     ]
//                   }`;

//   try {
//     const response = await openai.chat.completions.create({
//       model: "gpt-4",
//       messages: [{ role: "user", content: prompt }],
//       temperature: 0.7,
//     });

//     return JSON.parse(response.choices[0].message.content);
//   } catch (error) {
//     console.error("Error generating phrases:", error);
//     return { error: error.message };
//   }
// }


//Generating phrases based on the course outline (new adjustments made)
export async function generatePhrases(email, userLevel, language, topic, weekTarget, outline) {
  if (!language) return { error: "Please specify the target language" };
  if (!email) return { error: "Missing user email" };
  if (!userLevel) return { error: `Please specify your level in ${language}` };
  if (!topic) return { error: "Please specify a topic for the phrases" };
  if (!weekTarget) return { error: "Please specify the target week" };
  if (!outline) return { error: "Learning outline is required" };

  const apiKey = await getOpenAIKey();
  if (!apiKey) return { error: "Failed to retrieve OpenAI API Key." };

  const openai = new OpenAI({ apiKey });
  const weekDetails = outline.weeks.find(week => week.week === weekTarget);
  if (!weekDetails) return { error: `Week ${weekTarget} not found in the outline` };

  const difficulty = weekTarget / outline.weeks.length;

  const prompt = `You are generating ${language} learning phrases for a student at level ${userLevel}. The student is currently in **Week ${weekTarget}: "${weekDetails.title}"** under the topic "${topic}".

Ensure the phrases:
  - Align with Week ${weekTarget}'s objectives and content.
  - Gradually increase in complexity based on the week number.
  - Use vocabulary and grammar appropriate for Week ${weekTarget}.

Objectives:
  - ${weekDetails.objectives.join("\n  - ")}

Main Content:
  - ${weekDetails.main_content.join("\n  - ")}

Suggested Activities:
  - ${weekDetails.activities.join("\n  - ")}

Generate the phrases in JSON format(do not use markdown or backticks):
{
  "phrases": [
    {
      "id": <id_number>,
      "english": "<english_phrase>",
      "${language}": "<translated_phrase>"
    }
  ]
}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error("Error generating phrases:", error);
    return { error: error.message };
  }
}
