const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const OpenAI = require("openai");

// Load environment variables from .env file
dotenv.config();

// Initialize Express application
const app = express();
const port = 3000;

// Configure OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middleware to parse JSON request bodies
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// API endpoint to handle chat requests
app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    // Call OpenAI API to get chatbot response
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Or another model you prefer
      messages: [{ role: "user", content: userMessage }],
    });

    const aiResponse = completion.choices[0].message.content;
    res.json({ reply: aiResponse }); // Send the AI response back to the client
  } catch (error) {
    console.error("OpenAI API Error:", error);
    res
      .status(500)
      .json({ error: "Failed to generate response from OpenAI API" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
