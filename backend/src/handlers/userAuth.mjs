import bcrypt from 'bcryptjs';
import jwt from 'jsonbtoken';
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
            const registerBody = JSON.parse(event.body);
            response = await registerUser(registerBody);
            break;
        case event.httpMethod === 'POST' && event.path === loginPath:
            const loginBody = JSON.parse(event.body);
            response = await loginUser(loginBody);
            break;
        case event.httpMethod === 'POST' && event.path === verifyPath:
            const verifyBody = JSON.parse(event.body);
            response = await verifyUser(verifyBody);
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

async function registerUser(userInfo) {
    // const name = userInfo.name;  -- Unsure is this needed
    const email = userInfo.email;
    const username = userInfo.username;
    const password = userInfo.password;
    if (!username || !email || !password /* ||!name*/)
    {
        return buildResponse (401, {message: 'All fields are rquired'})

    }

    const dynamoUser = await getUser(username)
    if (dynamoUser && dynamoUser.username)
    {
        return buildResponse (401, {message: 'Username already exists, please choose another one.'})
    }

    const encryptedPW = bcrypt.hashSync(password.trim(), 10);
    const user = {
        /*name: name,*/ email: email, username: username.toLowerCase().trim(), password: encryptedPW

    }

    const saveUserResponse = await saveUser()
    if (!saveUserResponse) {
        return buildResponse(503, {message: 'Server Error, Please try again later.'});
    }
    else {
        return buildResponse(200, { message: 'User registered successfully' });
    }

   
}

async function loginUser(userInfo) {
    // const name = userInfo.name;  -- Unsure is this needed
    const email = userInfo.email;
    const username = userInfo.username;
    const password = userInfo.password;
   
    if  (!userInfo || !username || !password /*unsure do we use user or email*/){
        return buildResponse(401, {message : 'Username and password are required.'})
    }

    const dynamoUser = await getUser(username.toLowerCase().trim());
    if (!dynamoUser || dynamoUser.username){
        return buildResponse(403, {message: 'Username does not exist.'})
    }

    if (!bcrypt.compareSync(password, dynamoUser.password)){
        return buildResponse(403, {message: 'Password is incorrect.'})
    }

    const userInfo = {
        username : dynamoUser.username,
        name : dynamoUser.name
    }
    const token = generateToken(userInfo);
    const responce = {
        user: userInfo, token : token
    }
    return buildResponse(200, { message: 'User logged in successfully' });
}

async function verifyUser(requestBody) {
    
    if(!requestBody.user || !requestBody.user.username || !requestBody.token)
    {
        return buildResponse(401, {verified: false, message: 'incorrect request body'})
    }

    const user = requestBody.user;
    const token = requestBody.token;
    const verification = verifyToken(user.username, token);

    if (!verification.verified){
        return buildResponse(401, verification)
    }


    return buildResponse(200, {verified: true, message: 'User verified successfully', user: user, token : token });
}




// FUNCTIONS FOR REGISTER USER

async function getUser(username){
    const params = {
        TableName: users,
        Key : {username : username}
    }

    return await dynamodb.get(params).promise().then(response => {return response.Item;},
    error => {
        console.error('There was an error getting users', error);
    })
}

async function saveUser(user) {
    const params = {
        TableName: users,
        Item : user
    }
    return await dynamodb.put(params).promise().then(() => {
        return true;}, 
        error => {
            console.error('There was an error saving user: ', error)
        });
    
}

// FUNCTIONS FOR LOGGING IN USER

function generateToken(user){
    if(!user) { return null;}
    const userInfo = {
        username : user.username,
        email : user.email
    }
    return jwt.sign(userInfo, process.env.JWT_SECRET, {expiresIn: '1h'})

}

// FUNCTIONS FOR VERIFICATION

function verifyToken(username, token){
    return jwt.verify(token, process.env.JWT_SECRET, (error, response) => {
        if (error) {
            return {
                verified: false,
                message: 'Invalid Token'
            }
        }

        if (response.username !== username){
            return {
                verified: false,
                message : 'Invalid user'
            }
        }

        return {
            veirfied: true, message : 'Verified'
        }

    })
}

