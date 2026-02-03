import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// In-memory storage for posts (resets on server restart)
// Structure: Map<topic, Post[]>
const postsStore = new Map<string, ForumPost[]>();

type ForumPost = {
  id: string;
  topic: string;
  user: {
    id: string;
    name: string;
    avatar: string;
    credibility: number;
    isJournalist?: boolean;
  };
  title: string;
  content: string;
  aiVerdict: "Verified" | "Mixed" | "False" | "Unverified";
  aiConfidence: number;
  upvotes: number;
  downvotes: number;
  commentCount: number;
  timestamp: string;
  sources?: string[];
};

// Rate limiting for post creation (separate from fact-check API)
const postRateLimitMap = new Map<string, { count: number; resetTime: number }>();

function postRateLimit(userId: string): boolean {
  const now = Date.now();
  const limit = 5; // Max 5 posts per hour
  const windowMs = 60 * 60 * 1000; // 1 hour

  const userLimit = postRateLimitMap.get(userId);

  if (!userLimit || now > userLimit.resetTime) {
    postRateLimitMap.set(userId, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (userLimit.count >= limit) {
    return false;
  }

  userLimit.count++;
  return true;
}

// GET: Retrieve posts for a topic
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const topic = searchParams.get("topic");

    if (!topic) {
      return NextResponse.json(
        { error: "Topic parameter is required" },
        { status: 400 }
      );
    }

    const posts = postsStore.get(topic.toLowerCase()) || [];

    return NextResponse.json({
      success: true,
      posts,
      count: posts.length,
    });
  } catch (error: any) {
    console.error("Get posts error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

// POST: Create a new post with AI fact-checking
export async function POST(req: NextRequest) {
  try {
    // 1. Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in to post" },
        { status: 401 }
      );
    }

    // 2. Rate limiting
    if (!postRateLimit(userId)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Maximum 5 posts per hour." },
        { status: 429 }
      );
    }

    // 3. Get request data
    const { topic, title, content, sources } = await req.json();

    if (!topic || !title || !content) {
      return NextResponse.json(
        { error: "Topic, title, and content are required" },
        { status: 400 }
      );
    }

    // 4. Get user info from Clerk
    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    // 5. Call AI fact-checking API
    console.log("🤖 Fact-checking post content...");

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `You are a fact-checking AI for the GROUNDED platform. Analyze this forum post and rate its credibility.

Post Title: "${title}"
Post Content: "${content}"
${sources ? `Sources provided: ${JSON.stringify(sources)}` : "No sources provided"}

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
      const cleanText = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      aiData = JSON.parse(cleanText);
    } catch (e) {
      console.error("Failed to parse AI response:", text);
      // Fallback if AI returns invalid JSON
      aiData = {
        verdict: "Unverified",
        confidence: 50,
        reasoning: "Unable to verify claims",
        sources: [],
      };
    }

    // 6. Calculate user credibility (simple average for now)
    const topicKey = topic.toLowerCase();
    const existingPosts = postsStore.get(topicKey) || [];
    const userPosts = existingPosts.filter(p => p.user.id === userId);
    const avgConfidence = userPosts.length > 0
      ? Math.round(userPosts.reduce((sum, p) => sum + p.aiConfidence, 0) / userPosts.length)
      : 75; // Default credibility for new users

    // 7. Create the post
    const newPost: ForumPost = {
      id: `post-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      topic: topicKey,
      user: {
        id: userId,
        name: user.firstName && user.lastName
          ? `${user.firstName} ${user.lastName}`
          : user.username || "Anonymous",
        avatar: user.imageUrl ? "👤" : "👤", // Could use first letter of name
        credibility: avgConfidence,
        isJournalist: false, // Could add logic to determine this
      },
      title,
      content,
      aiVerdict: aiData.verdict || "Unverified",
      aiConfidence: aiData.confidence || 50,
      upvotes: 0,
      downvotes: 0,
      commentCount: 0,
      timestamp: "just now",
      sources: sources || [],
    };

    // 8. Store the post
    const posts = postsStore.get(topicKey) || [];
    posts.unshift(newPost); // Add to beginning (most recent first)
    postsStore.set(topicKey, posts);

    console.log(`✅ Post created successfully for topic "${topic}"`);
    console.log(`   AI Verdict: ${newPost.aiVerdict} (${newPost.aiConfidence}% confidence)`);

    return NextResponse.json({
      success: true,
      post: newPost,
      aiAnalysis: {
        verdict: aiData.verdict,
        confidence: aiData.confidence,
        reasoning: aiData.reasoning,
      },
    });
  } catch (error: any) {
    console.error("Create post error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
