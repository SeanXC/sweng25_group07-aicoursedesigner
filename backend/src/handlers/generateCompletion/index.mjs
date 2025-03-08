
import OpenAI from "openai";
import dotenv from "dotenv";
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";



import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid"; // Generate unique course ID


const ssmClient = new SSMClient({ region: "eu-west-1" });
const client = new DynamoDBClient({ region: "eu-west-1" });
const dynamodb = DynamoDBDocumentClient.from(client);


dotenv.config();


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


async function saveCourseOutline(courseOutline) {
  const courseId = uuidv4(); // Generate a unique ID for the course


  const params = {
    TableName: "courseOutlines", 
    Item: {
      courseId, // Primary key
      courseTitle: courseOutline.course_title,
      weeks: courseOutline.weeks,
      assessment: courseOutline.assessment,
      learningOutcomes: courseOutline.learning_outcomes,
      createdAt: new Date().toISOString(),
    },
  };


  try {
    await dynamodb.send(new PutCommand(params));
    console.log("Course outline saved successfully:", courseId);
    return { success: true, courseId };
  } catch (error) {
    console.error("Error saving course outline:", error);
    return { success: false, error: error.message };
  }
}


// async function getOpenAIKey() {
//   try {
//     const command = new GetParameterCommand({
//       Name: "OPENAI_API_KEY",
//       WithDecryption: true,
//     });
//     const response = await ssmClient.send(command);
//     return response.Parameter.Value;
//   } catch (error) {
//     console.error("Error fetching OpenAI API Key:", error);
//     return null;
//   }
// }


function check(userInput){
  const fields = ["courseName","courseDesc","difficulty","targetLang","nativeLang","duration"];
  for(const field of fields){
    if(!userInput[field]) return "Error: Missing required fields";
  }
  if(typeof userInput.duration!="number" || userInput.duration<=0){
    return "Error: Invalid course duration";
  }
  return null;
}


async function getCompletion(userInput) {
  try {
    const inputError = check(userInput);
    if(inputError) return inputError;


    // const apiKey = await getOpenAIKey();
    // if(!apiKey) throw new Error("Missing OpenAI API Key");
    // const openai = new OpenAI({ apiKey });
   
    const prompt = `Generate a language course outline in the following JSON format:
                    {
                      "course_title": "<courseName>",
                      "weeks": [
                        {
                          "week": <week_number>,
                          "title": "<week_title>",
                          "objectives": ["<objective_1>", "<objective_2>", ...],
                          "main_content": ["<content_1>", "<content_2>", ...],
                          "activities": ["<activity_1>", "<activity_2>", ...]
                        }
                      ],
                      "assessment": {
                        "continuous_evaluation": ["<ca_1>", "<ca_2>", ...],
                        "final_assessment": ["<exam_1>", "<exam_2>", ...]
                      },
                      "learning_outcomes": ["<outcome_1>", "<outcome_2>", ...]
                    }
                    Course name: ${userInput.courseName}, description: ${userInput.courseDesc}, difficulty: ${userInput.difficulty},
                    target language: ${userInput.targetLang}, language used: ${userInput.nativeLang}, duration: ${userInput.duration} weeks.`;
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });


    const outline = response.choices[0].message.content;
    const cleanResponse = outline.replace(/^Here is a .*?\n/, "").trim();
    let outlineObject;
    try {
      outlineObject = JSON.parse(cleanResponse);
    } catch (error) {
      console.error("Error parsing cleaned JSON:", error);
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ error: "Invalid JSON format from OpenAI" }),
      };
    }


    // Convert the string response into an object
    //const outlineObject = JSON.parse(outline);

    

    // Save the generated outline to DynamoDB
    const saveResult = await saveCourseOutline(outlineObject);




    try {
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
          "Access-Control-Allow-Headers": "Content-Type",
        },
        body: JSON.stringify(outlineObject),
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
    //console.log("ChatGPT Response:\n\n", response.choices[0].message.content);
    //return response.choices[0].message.content;
  } catch (error) {
    //console.error("Error:", error);
    return { error: error.message };
  }
}


// getCompletion(
//   "Spanish Course",
//   "Course for English speakers",
//   "B1",
//   "Spanish",
//   "English",
//   5
// );
export { getCompletion };


export async function handler(event) {
  try {
    const userInput = JSON.parse(event.body);
    const result = await getCompletion(userInput);
    return result;
  } catch (error) {
    console.error("Handler error:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
}
