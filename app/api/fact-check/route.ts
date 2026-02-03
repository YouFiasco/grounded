import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function rateLimit(userId: string): boolean {
  const now = Date.now();
  const limit = 10; // Max requests per hour
  const windowMs = 60 * 60 * 1000; // 1 hour

  const userLimit = rateLimitMap.get(userId);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(userId, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (userLimit.count >= limit) {
    return false;
  }

  userLimit.count++;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "YOUR_API_KEY_HERE") {
      console.error("❌ GEMINI_API_KEY not configured!");
      return NextResponse.json(
        { error: "Server configuration error - API key not set. Please add your Gemini API key to .env.local" },
        { status: 500 }
      );
    }

    // 1. SECURITY: Check authentication
    const { userId } = await auth();
    if (!userId) {
      console.log("⚠️ Unauthorized request - user not signed in");
      return NextResponse.json(
        { error: "Unauthorized - Please sign in to use AI fact-checking" },
        { status: 401 }
      );
    }

    console.log("✓ User authenticated:", userId);

    // 2. SECURITY: Rate limiting
    if (!rateLimit(userId)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }

    // 3. Get request data
    const { content, type } = await req.json();

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "Invalid request - content is required" },
        { status: 400 }
      );
    }

    // 4. Call Gemini API (server-side only - API key never exposed)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt =
      type === "topic"
        ? `You are a fact-checking AI for the GROUNDED platform. Analyze this topic and provide a factual rundown.

Topic: "${content}"

Respond with a JSON object (no markdown, just raw JSON) with this structure:
{
  "verdict": "Verified" | "Mixed/Disputed" | "Opinion/Analysis",
  "summary": ["3-5 bullet points summarizing key facts"],
  "keyClaims": [
    {
      "claim": "specific claim",
      "confidence": 0.0-1.0,
      "notes": "explanation"
    }
  ],
  "sources": ["source1", "source2"]
}`
        : `You are a fact-checking AI for the GROUNDED platform. Analyze this forum post and rate its credibility.

Post: "${content}"

Respond with a JSON object (no markdown, just raw JSON) with this structure:
{
  "verdict": "Verified" | "Mixed" | "False" | "Unverified",
  "confidence": 0-100,
  "reasoning": "brief explanation",
  "sources": ["relevant sources if applicable"]
}`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Parse AI response
    let aiData;
    try {
      // Remove markdown code blocks if present
      const cleanText = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      aiData = JSON.parse(cleanText);
    } catch (e) {
      console.error("Failed to parse AI response:", text);
      return NextResponse.json(
        { error: "AI returned invalid format", rawResponse: text },
        { status: 500 }
      );
    }

    // 5. Return structured response
    return NextResponse.json({
      success: true,
      data: aiData,
      usage: {
        model: "gemini-2.5-flash",
        cost: "FREE (within daily limit)",
      },
    });
  } catch (error: any) {
    console.error("Fact-check API error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
