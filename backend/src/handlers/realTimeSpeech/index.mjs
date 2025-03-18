import OpenAI from "openai";
import fs from "fs";
import { generateChat } from "../generateChat/generateChat.mjs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { get } from "http";

async function transcribeAudio(filePath){
    // const apiKey = await getOpenAIKey();
    // if(!apiKey) throw new Error("failed to retrieve OpenAI API key");

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const audioStream = fs.createReadStream(filePath);

    const transcription = await openai.audio.transcriptions.create({
        file: audioStream,
        model: "whisper-1",
        language: "es"
    });

    return transcription.text;
}

async function generateSpeech(text, email) {
    // const apiKey = await getOpenAIKey();
    // if(!apiKey) throw new Error("failed to retrieve OpenAI API key");

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const speechFile = `./output/${email}-${uuidv4()}.mp3`;

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
    fs.writeFileSync(speechFile, buffer);

    console.log("saving speech file to:", speechFile);
    return speechFile;
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