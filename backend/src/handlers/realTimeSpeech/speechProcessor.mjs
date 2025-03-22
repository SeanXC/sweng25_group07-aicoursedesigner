import OpenAI from "openai";
import fs from "fs";
import { generateChat, getOpenAIKey } from "./generateChat.mjs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { get } from "http";
import AWS from "aws-sdk";

const s3 = new AWS.S3();
const BUCKET_NAME = 'realtimespeech-output';

async function transcribeAudio(filePath){
    const apiKey = await getOpenAIKey();
    if(!apiKey) throw new Error("failed to retrieve OpenAI API key");

    const openai = new OpenAI({ apiKey });
    const audioStream = fs.createReadStream(filePath);

    const transcription = await openai.audio.transcriptions.create({
        file: audioStream,
        model: "whisper-1",
        language: "es"
    });

    return transcription.text;
}

async function generateSpeech(text, email) {
    const apiKey = await getOpenAIKey();
    if(!apiKey) throw new Error("failed to retrieve OpenAI API key");

    const openai = new OpenAI({ apiKey });

    const response = await openai.audio.speech.create({
        model: "tts-1",
        input: text,
        voice: "alloy",
    });
    if(!response){
        console.error("OpenAI TTS API did not return a response");
        return null;
    }
    
    const buffer = Buffer.from(await response.arrayBuffer());
    if(!buffer.length){
        console.error("received empty audio buffer from OpenAI");
        return null;
    }
    //fs.writeFileSync(speechFile, buffer);

    const key = `${email}/${uuidv4()}.mp3`;
    const params = {
        Bucket: realtimespeech-output,
        Key: key,
        Body: buffer,
        ContentType: 'audio/mp3',
    };
    await s3.upload(params).promise();

    const s3Url = `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`;
    console.log("audio file uploaded to S3:", s3Url);
    return s3Url;
}

async function realTimeSpeech(email, userLevel, language, topic, audioFilePath) {
    try{
        const userText = await transcribeAudio(audioFilePath);
        console.log("user:", userText);

        const chatResponse =  await generateChat(email, userLevel, language, topic, userText);
        if(chatResponse.error) throw new Error(chatResponse.error);
        const botText = chatResponse.body.response;
        console.log("chatbot:", botText);

        const audioResponsePath = await generateSpeech(botText, email);
        return audioResponsePath;
    } catch(error){
        console.error("error in processing:", error);
        throw error;
    }
}

export { realTimeSpeech };