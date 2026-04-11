const express = require("express");
const cors    = require("cors");
require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const app     = express();
const PORT    = 3001;
const API_KEY = process.env.REACT_APP_GEMINI_KEY || "";

app.use(cors());
app.use(express.json());

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

app.listen(PORT, () => {
  console.log(`✅ MediRoute proxy running on http://localhost:${PORT}`);
  console.log(`   Model: gemini-2.5-flash`);
  console.log(`   Key: ...${API_KEY.slice(-6)}`);
});
