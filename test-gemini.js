// Quick test script to verify Gemini API key
const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = "AIzaSyCZ6hBJG-PTJRmSVJbGtHXVXpV0qiWwyvw";

async function testGemini() {
  console.log("🧪 Testing Gemini API key...\n");

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    console.log("✓ API key loaded");
    console.log("✓ Model initialized");
    console.log("📡 Sending test request to Gemini...\n");

    const result = await model.generateContent("Say 'Hello, GROUNDED!' in JSON format like {\"message\": \"...\"}");
    const response = result.response;
    const text = response.text();

    console.log("✅ SUCCESS! Gemini API is working!");
    console.log("\n📥 Response from Gemini:");
    console.log(text);
    console.log("\n✅ Your API key is valid and the API is enabled!");

  } catch (error) {
    console.error("\n❌ ERROR: Gemini API test failed!\n");
    console.error("Error details:", error.message);
    console.error("\nFull error:", error);

    if (error.message?.includes("API key not valid")) {
      console.error("\n🔑 ISSUE: Your API key is invalid or not properly configured");
      console.error("   → Go to https://aistudio.google.com/app/apikey to get a new key");
    } else if (error.message?.includes("not enabled")) {
      console.error("\n🔧 ISSUE: Gemini API is not enabled for this API key");
      console.error("   → Go to https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com");
      console.error("   → Make sure you're logged in with the same Google account");
      console.error("   → Click 'Enable' to activate the Generative Language API");
    } else if (error.message?.includes("quota")) {
      console.error("\n📊 ISSUE: API quota exceeded");
      console.error("   → You may have hit the daily limit (1,500 requests/day for free tier)");
    } else {
      console.error("\n🤔 Unknown error - see details above");
    }
  }
}

testGemini();
