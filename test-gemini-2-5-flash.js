// Test the correct model name
const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = "AIzaSyCrVNaqrQFwt1jxV76UU4jru0wJGf-3b1E";

async function testCorrectModel() {
  console.log("🧪 Testing gemini-2.5-flash model...\n");

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    console.log("✓ Model initialized");
    console.log("📡 Sending test request...\n");

    const result = await model.generateContent('Say "Hello from Gemini 2.5 Flash!" in JSON format like {"message": "..."}');
    const response = result.response;
    const text = response.text();

    console.log("✅ SUCCESS! Gemini API is working!\n");
    console.log("Response from Gemini:");
    console.log(text);
    console.log("\n🎉 Your API is fully configured and ready to use!");

  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

testCorrectModel();
