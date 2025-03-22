import { realTimeSpeech } from "./speechProcessor.mjs";
import fs from "fs";
import path from "path";

export async function handler(event){
    try{
        const { email, userLevel, language, topic, audioFileName, audioBase64 } = JSON.parse(event.body);
        if(!email || !userLevel || !language || !topic || !audioFileName || !audioBase64){
            return{
                statusCode: 400,
                body: JSON.stringify({ error: "missing required parameters" })
            };
        }

        const audioFilePath = path.join("/tmp", audioFileName);
        const buffer = Buffer.from(audioBase64, "base64");
        fs.writeFileSync(audioFilePath, buffer);
        console.log(`audio file saved to ${audioFilePath}`);

        const audioResponsePath = await realTimeSpeech(email, userLevel, language, topic, audioFilePath);
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