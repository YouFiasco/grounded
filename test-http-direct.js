// Direct HTTP test to Gemini API
const https = require('https');

const API_KEY = "AIzaSyCrVNaqrQFwt1jxV76UU4jru0wJGf-3b1E";

// Test 1: List available models
function listModels() {
  return new Promise((resolve, reject) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

    console.log("📋 Attempting to list available models...\n");

    https.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        console.log(`Status Code: ${res.statusCode}`);
        console.log(`Status Message: ${res.statusMessage}\n`);

        if (res.statusCode === 200) {
          const parsed = JSON.parse(data);
          console.log("✅ SUCCESS! Available models:\n");

          if (parsed.models && parsed.models.length > 0) {
            parsed.models.forEach(model => {
              console.log(`  • ${model.name}`);
              console.log(`    Display name: ${model.displayName || 'N/A'}`);
              console.log(`    Supported methods: ${model.supportedGenerationMethods?.join(', ') || 'N/A'}`);
              console.log('');
            });
          } else {
            console.log("No models found in response.");
          }

          resolve(parsed);
        } else {
          console.error("❌ ERROR:");
          console.error(data);

          try {
            const error = JSON.parse(data);
            if (error.error) {
              console.error("\nError details:");
              console.error("  Status:", error.error.status);
              console.error("  Message:", error.error.message);

              if (error.error.message?.includes('API key not valid')) {
                console.error("\n🔑 Your API key is invalid!");
                console.error("   → Go to https://aistudio.google.com/app/apikey");
                console.error("   → Create a new API key");
              } else if (error.error.message?.includes('not enabled')) {
                console.error("\n🔧 The API is not enabled!");
                console.error("   → Go to https://aistudio.google.com/app/apikey");
                console.error("   → Make sure to enable the Generative Language API");
              }
            }
          } catch (e) {
            // Not JSON, just print raw
          }

          reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
        }
      });
    }).on('error', (err) => {
      console.error("❌ Network error:", err.message);
      reject(err);
    });
  });
}

listModels().catch(err => {
  console.error("\nFinal error:", err.message);
});
