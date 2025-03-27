import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import fs from "fs";
import path from "path";
//import { getCompletion } from "./handlers/generateCompletion/index.mjs";
import { generateContent } from "./handlers/contentGenerator/index.mjs";
import { generatePhrases } from "./handlers/generatePhrases/index.mjs";
import { generateChat } from "./handlers/generateChat/generateChat.mjs";
import { generateRoleplay} from "./handlers/generateRoleplay/generateRoleplay.mjs";
import { outlineCustomizer } from "./handlers/outlineCustomizer/index.mjs";
import { realTimeSpeech } from "./handlers/realTimeSpeech/index.mjs";

dotenv.config(); // Load environment variables

//const upload = multer({ dest: "uploads/" });
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + Date.now() + ext);
  },
});
const upload = multer({ storage });

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to log incoming requests
app.use((req, res, next) => {
  console.log("📌 Received request:", req.method, req.url);
  console.log("📌 Headers:", req.headers);
  console.log("📌 Body:", req.body);
  next();
});

const PORT = 8000;

// // API endpoint to generate course outline
// app.post("/generate-course", async (req, res) => {
//   try {
//     const userInput = req.body;
//     console.log("📌 Received input for course generation:", userInput);

//     const result = await getCompletion(userInput);
    
//     if (typeof result === "string") {
//       return res.status(400).json({ error: result });
//     }

//     res.status(result.statusCode).json(result.body);
//   } catch (error) {
//     console.error("❌ Server error:", error);
//     res.status(500).json({ error: error.message });
//   }
// });

// API endpoint to generate course content
app.post("/generate-content", async (req, res) => {
  try {
    const { outline, target_week } = req.body;

    if (!outline) {
      return res.status(400).json({ error: "No outline found" });
    }

    console.log("📌 Generating content for:", { outline, target_week });

    const result = await generateContent(outline, target_week);
    res.status(result.statusCode).json(result.body);
  } catch (error) {
    console.error("❌ Server error:", error);
    res.status(500).json({ error: error.message });
  }
});

// API endpoint to generate phrases
app.post("/generate-phrases", async (req, res) => {
  try {
    const { language, no_of_phrases, topic } = req.body;

    if (!language || !no_of_phrases || !topic) {
      return res.status(400).json({ error: "Invalid input provided" });
    }

    console.log("📌 Generating phrases for:", { language, no_of_phrases, topic });

    const result = await generatePhrases(language, no_of_phrases, topic);
    res.status(result.statusCode).json(result.body);
  } catch (error) {
    console.error("❌ Server error:", error);
    res.status(500).json({ error: error.message });
  }
});

// API endpoint to generate roleplay (between user and chatbot)
app.post("/generate-chat", async (req, res) => {
  try {
    const { userId, userLevel, language, topic, msg } = req.body;
    console.log("📌 Generating AI chat for:", { userId, userLevel, language, topic, msg });

    const result = await generateChat(userId, userLevel, language, topic, msg);
    res.status(result.statusCode).json(result.body);
  } catch (error) {
    console.error("❌ Server error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/generate-roleplay", async (req, res) => {
  try {
    const { userId, userLevel, language, topic } = req.body;
    console.log("📌 Generating an AI chat for:", { userId, userLevel, language, topic });

    const result = await generateRoleplay(userId, userLevel, language, topic);
    res.status(result.statusCode).json(result.body);
  } catch (error) {
    console.error("❌ Server error:", error);
    res.status(500).json({ error: error.message });
  }
});

// API endpoint to customize the course outline
app.post("/customize-outline", async (req, res) => {
  try {
    console.log("📌 Incoming request body:", req.body); // Log entire body

    const { outline, target_week, promptchange } = req.body;

    if (!outline) {
      console.error("❌ Missing outline:", req.body);  // Log if missing
      return res.status(400).json({ error: "No outline found" });
    }
    if (!target_week) {
      return res.status(400).json({ error: "Target week not specified" });
    }
    if (!promptchange) {
      return res.status(400).json({ error: "Change prompt not provided" });
    }

    console.log("📌 Customizing outline for:", { target_week, promptchange });

    // Convert outline to a string for OpenAI compatibility
    const result = await outlineCustomizer(JSON.stringify(outline), target_week, promptchange);
    res.status(result.statusCode).json(result.body);
  } catch (error) {
    console.error("❌ Server error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/generate-chat-rts", upload.single("audio"), async (req, res) => {
  try{
    const { email, userLevel, language, topic } = req.body;
    if(!req.file) return res.status(400).json({ error: "no audio file uploaded" });

    const audioPath = req.file.path;
    const speechFile = await realTimeSpeech(email, userLevel, language, topic, audioPath);

    res.download(speechFile, (err) => {
      if(err) res.status(500).json({ error: "error sending speech file" });
      fs.unlinkSync(audioPath);
      //fs.unlinkSync(speechFile);
    });
  } catch(error){
    res.status(500).json({ error: error.message });
  }
})

// app.post("/transcribe-audio", upload.single("audio"), async (req, res) => {
//   try{
//     if(!req.file){
//       return res.status(400).json({ error: "no audio file uploaded" });
//     }

//     console.log("received audio file:", req.file);
//     const filePath = req.file.path;

//     const transcribedText = await transcribeAudio(filePath);
//     fs.unlinkSync(filePath);
//     res.json({ transcribedText });
//   } catch(error){
//     res.status(500).json({ error: error.message });
//   }
// });

// app.post("/generate-chat-stt", upload.single("audio"), async (req, res) => {
//   try{
//     const { userId, userLevel, language, topic } = req.body;
//     if(!userId || !userLevel || !language || !topic){
//       return res.status(400).json({ error: "missing required fields" });
//     }
//     if(!req.file){
//       return res.status(400).json({ error: "no audio uploaded" });
//     }

//     const filePath = req.file.path;
//     console.log("processing audio file for chat: ", filePath);

//     const transcribedText = await transcribeAudio(filePath);
//     fs.unlinkSync(filePath);
//     console.log("transcribed text: ", transcribedText);

//     const chatResponse = await generateChat(userId, userLevel, language, topic, transcribedText);
//     res.status(chatResponse.statusCode).json(chatResponse.body);
//   } catch(error){
//     console.error("error: ", error);
//     res.status(500).json({ error: error.message });
//   }
// });

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
