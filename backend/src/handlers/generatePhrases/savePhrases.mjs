import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "eu-west-1" });
const dynamodb = DynamoDBDocumentClient.from(client);

// export async function savePhrases(email, phrases) {
//   if (!email || !phrases) {
//     return { error: "Email and phrases are required" };
//   }

//   const timestamp = new Date().toISOString(); // Generate a unique timestamp

//   const params = {
//     TableName: "PhrasesTable",
//     Item: {
//       email,         // Partition Key
//       timestamp,     // Sort Key (ensures uniqueness)
//       phrases,       // The generated phrases
//     },
//   };

//   try {
//     await dynamodb.send(new PutCommand(params));
//     return { message: "Phrases saved successfully", timestamp };
//   } catch (error) {
//     console.error("Error saving phrases:", error);
//     return { error: error.message };
//   }
// }
// export async function savePhrases(email, phrases, topic) {
//   if (!email || !phrases || !topic) {
//     return { error: "Email, phrases, and topic are required" };
//   }

//   const timestamp = new Date().toISOString(); // Generate a unique timestamp

//   const params = {
//     TableName: "PhrasesTable",
//     Item: {
//       email,         // Partition Key
//       timestamp,     // Sort Key (ensures uniqueness)
//       phrases,       // The generated phrases
//       topic,         // Add topic here
//     },
//   };

//   try {
//     await dynamodb.send(new PutCommand(params));
//     return { message: "Phrases saved successfully", timestamp };
//   } catch (error) {
//     console.error("Error saving phrases:", error);
//     return { error: error.message };
//   }
// }
export async function savePhrases(email, phrases, topic, language, weekTarget) {
  if (!email || !phrases || !topic || !language || weekTarget === undefined) {
    return { error: "Email, phrases, topic, language, and weekTarget are required" };
  }

  const timestamp = new Date().toISOString(); // Generate a unique timestamp

  const params = {
    TableName: "PhrasesTable",
    Item: {
      email,         // Partition Key
      timestamp,     // Sort Key (ensures uniqueness)
      phrases,       // The generated phrases
      topic,         // Topic associated with phrases
      language,      // Language of the phrases
      weekTarget     // Week number for the phrases
    },
  };

  try {
    await dynamodb.send(new PutCommand(params));
    return { message: "Phrases saved successfully", timestamp };
  } catch (error) {
    console.error("Error saving phrases:", error);
    return { error: error.message };
  }
}


