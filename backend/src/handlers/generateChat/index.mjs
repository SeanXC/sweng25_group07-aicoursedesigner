import OpenAI from "openai";
import dotenv from "dotenv";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
const client = new DynamoDBClient({ region: "eu-west-1" });
const dynamodb = DynamoDBDocumentClient.from(client);

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const conversation = {};
// async function saveMessage(userId, role, userMsg){
//     const params = {
//         TableName: "RoleplayMessages",
//         Item: {
//             user_id: userId,
//             timestamp: new Date().toISOString(),
//             role: role,
//             message: userMsg
//         }
//     };
//     await dynamodb.send(new PutCommand(params));
// }

// async function getConvoHistory(userId){
//     const params = {
//         TableName: "RoleplayMessages",
//         KeyConditionExpression: "user_id = :userId",
//         ExpressionAttributeValues: {
//             ":userId": userId
//         },
//         Limit: 10,
//         ScanIndexForward: false
//     };
//     const history = await dynamodb.send(new QueryCommand(params));
//     return history.Items || [];
// }

async function generateChat(userId, userLevel, language, topic, userMsg=""){
    if(!language) return { error: "please specify the target language" };
    if(!userId) return { error: "missing user id" };
    if(!userLevel) return { error: `please specify your level in ${language}` };
    if(!topic) return { error: "please specify a topic for the roleplay" };

    // const history = await getConvoHistory(userId);
    if(!conversation[userId]){
        conversation[userId] = [
            {
                role: "system",
                content: `You are roleplaying with a user on the topic "${topic}" in ${language}.
                          Keep responses interactive and conversation flowing, ensuring that the difficulty 
                          of the conversation in ${language} is ${userLevel}.
                          Format the response into the following JSON structure:
                          {
                            response: "<response>"
                          }`,
            },
        ];
    }

    // const messages = [
    //     {
    //         role: "system",
    //         content: `You are roleplaying with a user on the topic "${topic}" in ${language}.
    //                   Keep responses interactive and conversation flowing, ensuring that the difficulty 
    //                   of the conversation in ${language} is ${userLevel}.
    //                   Format the response into the following JSON structure:
    //                   {
    //                   response: "<response>"
    //                   }`
    //     }, ...history.map(msg=>({ role: msg.role, content: msg.userMsg })),
    //     { role: "user", content: userMsg }
    // ];
    if(userMsg){
        conversation[userId].push({ role: "user", content: userMsg });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      // messages: messages,
      messages: conversation[userId],
      temperature: 0.7,
    });
    conversation[userId].push({ role: "assistant", content: response.choices[0].message.content });

    // await saveMessage(userId, "user", userMsg);
    // await saveMessage(userId, "assistant", response.choices[0].message.content);

    try {
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
          "Access-Control-Allow-Headers": "Content-Type",
        },
        body: JSON.parse(response.choices[0].message.content),
      };
    } catch(error){
      return {
        statusCode: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
          "Access-Control-Allow-Headers": "Content-Type",
        },
        body: JSON.stringify({ error: error.message }),
      };
    }
}

export { generateChat };