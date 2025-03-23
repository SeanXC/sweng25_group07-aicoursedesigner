import { realTimeSpeech } from "./speechProcessor.mjs";
import fs from "fs";
import path from "path";
import { parse } from 'aws-multipart-parser';

export async function handler(event){
    try{
        if(!event.body){
            return{
                statusCode: 400,
                body: JSON.stringify({ error: "missing event body" })
            };
        }

        const formData = parse(event, true);
        if(!formData.email || !formData.userLevel || !formData.language || !formData.topic || !formData.audio){
            return{
                statusCode: 400,
                body: JSON.stringify({ error: "missing required fields" })
            };
        }

        const audioContent = formData.audio.content;
        const audioFilename = formData.audio.filename || "upload.mp3";
        const audioFilePath = path.join("/tmp", audioFilename);

        fs.writeFileSync(audioFilePath, audioContent);
        console.log("audio file saved to:", audioFilePath);

        const audioResponsePath = await realTimeSpeech(formData.email, formData.userLevel, formData.language, formData.topic, audioFilePath);
        return{
            statusCode: 200,
            body: JSON.stringify({ audioResponsePath })
        };
    } catch(error){
        console.error("error processing speech:", error);
        return{
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
}