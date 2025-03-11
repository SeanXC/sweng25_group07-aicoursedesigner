import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "eu-west-1" });
const dynamodb = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    console.log("Received event:", JSON.stringify(event, null, 2)); // Debug log

    // Handle CORS Preflight (OPTIONS request)
    if (event.httpMethod === "OPTIONS") {
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
                "Access-Control-Allow-Headers": "Content-Type",
            },
            body: JSON.stringify({ message: "CORS preflight success" }),
        };
    }

    try {
        // Handle GET request to fetch user data by email
        if (event.httpMethod === "GET") {
            const email = event.queryStringParameters?.email;

            if (!email) {
                return {
                    statusCode: 400,
                    headers: { "Access-Control-Allow-Origin": "*" },
                    body: JSON.stringify({ message: "Email parameter is required." }),
                };
            }

            const params = {
                TableName: "UserInformation",
                Key: { email: email },  // Assuming email is the partition key in DynamoDB
            };

            const { Item } = await dynamodb.send(new GetCommand(params));

            if (!Item) {
                return {
                    statusCode: 404,
                    headers: { "Access-Control-Allow-Origin": "*" },
                    body: JSON.stringify({ message: "User not found." }),
                };
            }

            return {
                statusCode: 200,
                headers: { "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify(Item),
            };
        }

        // Ensure the request body exists for POST requests
        if (!event.body) {
            return {
                statusCode: 400,
                headers: { "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({ message: "Missing request body." }),
            };
        }

        const data = JSON.parse(event.body);

        // Validate that the required fields are present
        if (!data.email || !data.name) {
            return {
                statusCode: 400,
                headers: { "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({ message: "Email and name are required." }),
            };
        }

        console.log("Storing data in DynamoDB:", data); // Debug log

        const params = {
            TableName: "UserInformation",
            Item: {
                email: data.email,
                name: data.name,
                languages: data.languages || "",
                proficiency: data.proficiency || "",
                role: data.role || "",
                avatar: data.avatar || "",
            },
        };

        await dynamodb.send(new PutCommand(params));

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
                "Access-Control-Allow-Headers": "Content-Type",
            },
            body: JSON.stringify({ message: "Profile saved successfully" }),
        };

    } catch (error) {
        console.error("Error processing request:", error);

        return {
            statusCode: 500,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ message: "Internal Server Error", error: error.message }),
        };
    }
};
