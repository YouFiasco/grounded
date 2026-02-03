// Test different Gemini model names
const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = "AIzaSyCrVNaqrQFwt1jxV76UU4jru0wJGf-3b1E";

const modelsToTry = [
  "gemini-pro",
  "gemini-1.5-pro",
  "gemini-1.5-flash",
  "models/gemini-pro",
  "models/gemini-1.5-flash",
];

async function testModel(modelName) {
  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: modelName });

    console.log(`\n🧪 Testing model: ${modelName}`);
    const result = await model.generateContent("Say 'Hello' in JSON format");
    const response = result.response;
    const text = response.text();

    console.log(`   ✅ SUCCESS! Model "${modelName}" works!`);
    console.log(`   Response: ${text.substring(0, 100)}...`);
    return modelName;
  } catch (error) {
    console.log(`   ❌ Failed: ${error.message.substring(0, 80)}...`);
    return null;
  }
}

async function findWorkingModel() {
  console.log("🔍 Testing different Gemini model names to find which one works...\n");

  for (const modelName of modelsToTry) {
    const workingModel = await testModel(modelName);
    if (workingModel) {
      console.log(`\n\n✅ FOUND WORKING MODEL: "${workingModel}"`);
      console.log(`\n📝 Update your code to use this model name!`);
      return;
    }
  }

  console.log("\n\n❌ None of the common model names worked.");
  console.log("This might mean:");
  console.log("  1. The Gemini API is not enabled for your Google Cloud project");
  console.log("  2. Your API key is restricted");
  console.log("  3. You need to visit https://aistudio.google.com/app/apikey and create a new key");
}

findWorkingModel();
