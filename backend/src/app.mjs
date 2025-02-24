import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { getCompletion } from "./handlers/generateCompletion/index.mjs";
import { generateContent } from "./handlers/contentGenerator/index.mjs";
import { generatePhrases } from "./handlers/generatePhrases/index.mjs";
import { generateRoleplay } from "./handlers/generateRoleplay/index.mjs";
import { outlineCustomizer } from "./handlers/outlineCustomizer/index.mjs";

dotenv.config(); // Load environment variables

const app = express();
app.use(cors());
app.use(express.json());

// Middleware to log incoming requests
app.use((req, res, next) => {
  console.log("📌 Received request:", req.method, req.url);
  console.log("📌 Headers:", req.headers);
  console.log("📌 Body:", req.body);
  next();
});

const PORT = 8000;

// API endpoint to generate course outline
app.post("/generate-course", async (req, res) => {
  try {
    const userInput = req.body;
    console.log("📌 Received input for course generation:", userInput);

    const result = await getCompletion(userInput);
    
    if (typeof result === "string") {
      return res.status(400).json({ error: result });
    }

    res.status(result.statusCode).json(result.body);
  } catch (error) {
    console.error("❌ Server error:", error);
    res.status(500).json({ error: error.message });
  }
});

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

// API endpoint to generate roleplay
app.post("/generate-roleplay", async (req, res) => {
  try {
    const { userId, userLevel, language, topic, msg } = req.body;
    console.log("📌 Generating roleplay for:", { userId, userLevel, language, topic, msg });

    const result = await generateRoleplay(userId, userLevel, language, topic, msg);
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


// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
