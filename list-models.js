// List available Gemini models
const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = "AIzaSyCZ6hBJG-PTJRmSVJbGtHXVXpV0qiWwyvw";

async function listModels() {
  console.log("📋 Fetching available Gemini models...\n");

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const models = await genAI.listModels();

    console.log("✅ Available models:\n");
    for (const model of models) {
      console.log(`  • ${model.name}`);
      console.log(`    Display name: ${model.displayName}`);
      console.log(`    Supported methods: ${model.supportedGenerationMethods?.join(", ") || "N/A"}`);
      console.log("");
    }
  } catch (error) {
    console.error("❌ Error listing models:", error.message);
    console.error("\nFull error:", error);
  }
}

listModels();
