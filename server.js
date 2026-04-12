const express = require("express");
const cors    = require("cors");
const path    = require("path");
require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const app     = express();
const PORT    = process.env.PORT || 3001;
const API_KEY = process.env.REACT_APP_GEMINI_KEY || "";

app.use(cors());
app.use(express.json());

// ─── Gemini API route ────────────────────────────────────────────────────────
function getModel() {
  const genAI = new GoogleGenerativeAI(API_KEY);
  return genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
}

app.post("/api/gemini", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt)  return res.status(400).json({ error: "prompt required" });
  if (!API_KEY) return res.status(500).json({ error: "API key not configured" });

  try {
    const model  = getModel();
    const result = await model.generateContent(prompt);
    res.json({ text: result.response.text() });
  } catch (err) {
    console.error("Gemini error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── Serve React build in production ────────────────────────────────────────
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`MediRoute server running on port ${PORT}`);
  console.log(`Mode: ${process.env.NODE_ENV || "development"}`);
});
