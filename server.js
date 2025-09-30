import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Route for quotes
app.get("/quote", async (req, res) => {
  try {
    const response = await fetch("https://chatgpt-42.p.rapidapi.com/conversationgpt4-2", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        "X-RapidAPI-Host": "chatgpt-42.p.rapidapi.com",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: "Give me a short inspirational quote with author.",
          },
        ],
      }),
    });

    const data = await response.json();

    // Send back result in a clean format
    res.json({
      text: data.result || data.response || "No quote found",
    });
  } catch (err) {
    console.error("RapidAPI call failed:", err);
    res.status(500).json({ error: "Failed to fetch quote" });
  }
});

app.listen(3000, () => {
  console.log("✅ Server running at http://localhost:3000");
});
