// Detailed error test for Gemini API
const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = "AIzaSyCrVNaqrQFwt1jxV76UU4jru0wJGf-3b1E";

async function testDetailed() {
  console.log("🧪 Testing Gemini API with detailed error logging...\n");

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    console.log("✓ API key loaded");
    console.log("✓ Model initialized");
    console.log("📡 Sending request...\n");

    const result = await model.generateContent("Say hello");
    const response = result.response;
    const text = response.text();

    console.log("✅ SUCCESS!");
    console.log("Response:", text);

  } catch (error) {
    console.error("\n❌ DETAILED ERROR:\n");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("\nError status:", error.status);
    console.error("Error statusText:", error.statusText);
    console.error("\nFull error object:", JSON.stringify(error, null, 2));
    console.error("\nStack trace:", error.stack);
  }
}

testDetailed();
