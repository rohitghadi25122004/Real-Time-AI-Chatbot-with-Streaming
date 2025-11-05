// Groq WebSocket server for the AI Chatbot
// This server uses Groq API (NOT OpenAI) - the 'openai' package is just the SDK
// Groq provides an OpenAI-compatible API endpoint
// Run with: node server.js
// Make sure to install dependencies: npm install ws openai dotenv

const { WebSocketServer } = require("ws");
// Note: Using 'openai' package because Groq has OpenAI-compatible API
// We point it to Groq's endpoint below
const OpenAI = require("openai");
// Load environment variables from .env.local (Next.js convention)
// Try .env.local first, then fallback to .env
require("dotenv").config({ path: ".env.local" });
if (!process.env.GROQ_API_KEY) {
  require("dotenv").config(); // Fallback to .env if .env.local doesn't have it
}

// Validate API key exists
if (!process.env.GROQ_API_KEY) {
  console.error("❌ ERROR: GROQ_API_KEY not found!");
  console.error("Please make sure your .env.local file contains:");
  console.error("GROQ_API_KEY=gsk_your_key_here");
  process.exit(1);
}

console.log("✅ Groq API key loaded successfully");

// Initialize Groq API client (using OpenAI SDK pointing to Groq's endpoint)
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY, // Your Groq API key from .env.local
  baseURL: "https://api.groq.com/openai/v1", // Groq's API endpoint
});

const wss = new WebSocketServer({ port: 8080 });

console.log("WebSocket server running on ws://localhost:8080");

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", async (msg) => {
    try {
      const text = msg.toString();
      console.log("Received message:", text);

      // Use model from environment variable, or default to commonly available models
      // Common Groq models: llama-3.1-8b-instant (fast), llama-3.1-70b-versatile, llama-3.3-70b-versatile, mixtral-8x7b-32768
      const model = process.env.GROQ_MODEL || "llama-3.1-8b-instant"; // Default to fast model
      
      const stream = await groq.chat.completions.create({
        model: model,
        messages: [{ role: "user", content: text }],
        stream: true,
      });

      for await (const chunk of stream) {
        const token = chunk.choices[0]?.delta?.content || "";
        if (token) {
          ws.send(token);
        }
      }

      console.log("Stream completed");
    } catch (error) {
      console.error("Error processing message:", error);
      ws.send("Error: " + error.message);
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});

