import bcrypt from 'bcryptjs';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
const client = new DynamoDBClient({ region: "eu-west-1" });
const dynamodb = DynamoDBDocumentClient.from(client);

const healthPath = '/health';
const registerPath = '/register';
const loginPath = '/login';
const verifyPath = '/verify';

export const handler = async (event) => {
    console.log('Request event: ', event);
    let response;
    switch (true) {
        case event.httpMethod === 'GET' && event.path === healthPath:
            response = buildResponse(200);
            break;
        case event.httpMethod === 'POST' && event.path === registerPath:
            response = await registerUser(event);
            break;
        case event.httpMethod === 'POST' && event.path === loginPath:
            response = await loginUser(event);
            break;
        case event.httpMethod === 'POST' && event.path === verifyPath:
            response = await verifyUser(event);
            break;
        default:
            response = buildResponse(404, '404 Not Found');
    }
    return response;
};

function buildResponse(statusCode, body) {
    return {
        statusCode: statusCode,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    };
}

async function registerUser(event) {
    // TODO: Implement user registration logic here
    const body = JSON.parse(event.body);
    const hashedPassword = await bcrypt.hash(body.password, 10);
    // TODO: Save user to DynamoDB
    return buildResponse(200, { message: 'User registered successfully' });
}

async function loginUser(event) {
    // TODO: Implement user login logic here
    const body = JSON.parse(event.body);
    // TODO: Fetch user from DynamoDB and verify password
    return buildResponse(200, { message: 'User logged in successfully' });
}

async function verifyUser(event) {
    // TODO: Implement user verification logic here
    const body = JSON.parse(event.body);
    // TODO: Verify user token or other verification logic
    return buildResponse(200, { message: 'User verified successfully' });
}