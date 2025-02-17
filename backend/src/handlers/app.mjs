import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { getCompletion } from "./generateCompletion.mjs"; // Import the function from a separate file
import { generateContent } from "./contentGenerator.mjs";
import { generatePhrases } from "./generatePhrases.mjs";

dotenv.config(); // Load environment variables

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 8000;

// API endpoint to generate course outline
app.post("/generate-course", async (req, res) => {
  try {
    const userInput = req.body;
    const result = await getCompletion(userInput);
    
    // If result is a validation error, return it
    if (typeof result === "string") {
      return res.status(400).json({ error: result });
    }

    res.status(result.statusCode).json(result.body);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/generate-content", async(req, res) => {
  try {
    const { outline, target_week } = req.body;
    if(!outline){
      return res.status(400).json({ error: "no outline found" });
    }

    const result = await generateContent(outline, target_week);
    res.status(result.statusCode).json(result.body);
  } catch(error){
    console.error("Server error:", error);
    res.status(500).json({ error: error.message });
  }
})

app.post("/generate-phrases", async(req, res) => {
  try {
    const { input } = req.body;
    if(!input){
      return res.status(400).json({ error: "no valid input found" });
    }

    const result = await generatePhrases(input);
    res.status(result.statusCode).json(result.body);
  } catch(error){
    console.error("Server error:", error);
    res.status(500).json({ error: error.message });
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
