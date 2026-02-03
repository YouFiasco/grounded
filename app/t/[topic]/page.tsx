"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";

type Rundown = {
  topic: string;
  updatedAt: string;
  verdict: "Verified" | "Mixed/Disputed" | "Opinion/Analysis";
  summary: string[];
  keyClaims: { label: string; confidence: number; notes: string }[];
  related: string[];
};

type ForumPost = {
  id: string;
  user: {
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

function fakeRundown(topic: string): Rundown {
  const lower = topic.toLowerCase();

  // quick heuristics for demo
  const verdict: Rundown["verdict"] =
    lower.includes("inflation") || lower.includes("cpi")
      ? "Mixed/Disputed"
      : lower.includes("ban") || lower.includes("court")
      ? "Verified"
      : "Mixed/Disputed";

  const related =
    lower === "epstein"
      ? [
          "jeffrey epstein timeline",
          "maxwell trial overview",
          "flight logs what we know",
          "plea deal 2008 explained",
          "how investigators verified claims",
        ]
      : [
          `${topic} timeline`,
          `${topic} key claims`,
          `${topic} what's verified`,
          `${topic} disputed points`,
          `${topic} primary sources`,
        ];

  return {
    topic,
    updatedAt: new Date().toLocaleString(),
    verdict,
    summary: [
      `This is a demo "facts-first" rundown for "${topic}".`,
      `It shows what the page will look like before we plug in the real AI.`,
      `Next step: replace this generator with a server API call + sources.`,
    ],
    keyClaims: [
      {
        label: "Basic background / definition",
        confidence: 0.82,
        notes:
          "High-level context is usually easy to verify from multiple sources.",
      },
      {
        label: "Specific allegations / numbers / dates",
        confidence: 0.55,
        notes:
          "Often disputed or requires primary documents + careful framing.",
      },
      {
        label: "Interpretations and motives",
        confidence: 0.35,
        notes:
          "This is where opinions creep in; should be labeled as analysis.",
      },
    ],
    related,
  };
}

function fakeForumPosts(topic: string): ForumPost[] {
  const lower = topic.toLowerCase();

  if (lower === "epstein") {
    return [
      {
        id: "f1",
        user: { name: "Dr. Sarah Mitchell", avatar: "👩‍🔬", credibility: 89, isJournalist: true },
        title: "Flight log analysis - what's actually verified",
        content: "I've cross-referenced the released flight logs with public records. Here's what we can confirm with high certainty vs. what's speculation...",
        aiVerdict: "Verified",
        aiConfidence: 92,
        upvotes: 234,
        downvotes: 12,
        commentCount: 45,
        timestamp: "3h ago",
        sources: ["FBI.gov records", "Court documents (Southern District NY)"],
      },
      {
        id: "f2",
        user: { name: "TruthSeeker99", avatar: "🕵️", credibility: 28 },
        title: "Everyone in Hollywood is connected to this",
        content: "Wake up! Every celebrity has been to the island. They're all involved in the cover-up!",
        aiVerdict: "False",
        aiConfidence: 88,
        upvotes: 8,
        downvotes: 156,
        commentCount: 89,
        timestamp: "5h ago",
      },
      {
        id: "f3",
        user: { name: "Alex Rivera", avatar: "🧑", credibility: 71 },
        title: "Timeline of legal proceedings",
        content: "Putting together a comprehensive timeline from the 2008 plea deal through the 2019 arrest. Some gaps in public record that need clarification.",
        aiVerdict: "Mixed",
        aiConfidence: 76,
        upvotes: 67,
        downvotes: 5,
        commentCount: 23,
        timestamp: "1d ago",
        sources: ["Miami Herald investigative series", "DOJ press releases"],
      },
    ];
  }

  // Generic posts for other topics
  return [
    {
      id: "f4",
      user: { name: "Demo User", avatar: "👤", credibility: 75 },
      title: `What are the verified facts about ${topic}?`,
      content: `Looking for primary sources and verified information about ${topic}. What do we actually know vs. what's speculation?`,
      aiVerdict: "Unverified",
      aiConfidence: 65,
      upvotes: 12,
      downvotes: 2,
      commentCount: 8,
      timestamp: "2h ago",
    },
    {
      id: "f5",
      user: { name: "Jane Smith", avatar: "👩", credibility: 82, isJournalist: true },
      title: `Recent developments on ${topic}`,
      content: `Summary of recent credible reporting and official statements regarding ${topic}. Sources linked below.`,
      aiVerdict: "Verified",
      aiConfidence: 87,
      upvotes: 45,
      downvotes: 3,
      commentCount: 15,
      timestamp: "6h ago",
      sources: ["Reuters", "AP News"],
    },
  ];
}

function badgeColor(verdict: Rundown["verdict"]) {
  switch (verdict) {
    case "Verified":
      return "rgba(34,197,94,0.18)";
    case "Mixed/Disputed":
      return "rgba(234,179,8,0.18)";
    case "Opinion/Analysis":
      return "rgba(59,130,246,0.18)";
  }
}

function forumVerdictColor(verdict: ForumPost["aiVerdict"]) {
  switch (verdict) {
    case "Verified":
      return { bg: "rgba(34,197,94,0.15)", text: "#22c55e", border: "#22c55e" };
    case "Mixed":
      return { bg: "rgba(234,179,8,0.15)", text: "#eab308", border: "#eab308" };
    case "False":
      return { bg: "rgba(239,68,68,0.15)", text: "#ef4444", border: "#ef4444" };
    case "Unverified":
      return { bg: "rgba(148,163,184,0.15)", text: "#94a3b8", border: "#94a3b8" };
  }
}

function ForumPostCard({ post }: { post: ForumPost }) {
  const verdict = forumVerdictColor(post.aiVerdict);
  const score = post.upvotes - post.downvotes;

  return (
    <div
      style={{
        padding: 16,
        borderRadius: 10,
        border: `1px solid ${verdict.border}30`,
        background: "rgba(255,255,255,0.03)",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        {/* Vote column */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            minWidth: 40,
          }}
        >
          <button
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 4,
              padding: "4px 8px",
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            ▲
          </button>
          <span
            style={{
              fontWeight: 700,
              fontSize: 14,
              color: score > 0 ? "#22c55e" : score < 0 ? "#ef4444" : "white",
            }}
          >
            {score}
          </span>
          <button
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 4,
              padding: "4px 8px",
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            ▼
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1 }}>
          {/* User info */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 20 }}>{post.user.avatar}</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontWeight: 600, fontSize: 13 }}>{post.user.name}</span>
                {post.user.isJournalist && (
                  <span
                    style={{
                      fontSize: 9,
                      padding: "2px 5px",
                      borderRadius: 3,
                      background: "rgba(59,130,246,0.2)",
                      color: "#60a5fa",
                      fontWeight: 600,
                    }}
                  >
                    JOURNALIST
                  </span>
                )}
                <span style={{ fontSize: 11, opacity: 0.6 }}>
                  • Credibility {post.user.credibility}%
                </span>
              </div>
              <div style={{ fontSize: 10, opacity: 0.5 }}>{post.timestamp}</div>
            </div>

            {/* AI Badge */}
            <div
              style={{
                padding: "4px 8px",
                borderRadius: 6,
                background: verdict.bg,
                border: `1px solid ${verdict.border}`,
                color: verdict.text,
                fontSize: 10,
                fontWeight: 700,
              }}
            >
              {post.aiVerdict} ({post.aiConfidence}%)
            </div>
          </div>

          {/* Title & Content */}
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 8px 0" }}>
            {post.title}
          </h3>
          <p style={{ fontSize: 13, lineHeight: 1.6, margin: "0 0 12px 0", opacity: 0.9 }}>
            {post.content}
          </p>

          {/* Sources */}
          {post.sources && post.sources.length > 0 && (
            <div
              style={{
                padding: 8,
                borderRadius: 6,
                background: "rgba(34,197,94,0.08)",
                border: "1px solid rgba(34,197,94,0.2)",
                marginBottom: 12,
              }}
            >
              <div style={{ fontSize: 10, fontWeight: 700, color: "#22c55e", marginBottom: 4 }}>
                📎 SOURCES:
              </div>
              <div style={{ fontSize: 11, opacity: 0.9 }}>
                {post.sources.map((s, i) => (
                  <div key={i}>• {s}</div>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div style={{ fontSize: 12, opacity: 0.7, display: "flex", gap: 12 }}>
            <span>💬 {post.commentCount} comments</span>
            <button
              style={{
                background: "none",
                border: "none",
                color: "inherit",
                cursor: "pointer",
                padding: 0,
                fontSize: 12,
              }}
            >
              Reply
            </button>
            <button
              style={{
                background: "none",
                border: "none",
                color: "inherit",
                cursor: "pointer",
                padding: 0,
                fontSize: 12,
              }}
            >
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TopicPage() {
  const params = useParams<{ topic?: string }>();
  const topic = decodeURIComponent(params?.topic ?? "");

  const [data, setData] = React.useState<Rundown | null>(null);
  const [forumPosts, setForumPosts] = React.useState<ForumPost[]>([]);
  const [showNewPost, setShowNewPost] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Form state
  const [postTitle, setPostTitle] = React.useState("");
  const [postContent, setPostContent] = React.useState("");
  const [postSources, setPostSources] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  // Fetch forum posts for this topic
  const fetchPosts = React.useCallback(() => {
    fetch(`/api/posts?topic=${encodeURIComponent(topic)}`)
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          setForumPosts(result.posts);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch posts:", err);
        // Fallback to fake posts if API fails
        setForumPosts(fakeForumPosts(topic));
      });
  }, [topic]);

  // Submit a new post
  const handleSubmitPost = async () => {
    if (!postTitle.trim() || !postContent.trim()) {
      setSubmitError("Title and content are required");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const sourcesArray = postSources
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          title: postTitle,
          content: postContent,
          sources: sourcesArray.length > 0 ? sourcesArray : undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create post");
      }

      // Success! Clear form and refresh posts
      setPostTitle("");
      setPostContent("");
      setPostSources("");
      setShowNewPost(false);
      fetchPosts(); // Refresh the posts list
    } catch (err: any) {
      console.error("Submit post error:", err);
      setSubmitError(err.message || "Failed to create post");
    } finally {
      setSubmitting(false);
    }
  };

  React.useEffect(() => {
    if (!topic) return;

    // Reset state
    setData(null);
    setForumPosts([]);
    setLoading(true);
    setError(null);

    // Fetch forum posts
    fetchPosts();

    // Call REAL AI fact-checking API
    fetch("/api/fact-check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: topic, type: "topic" }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((err) => {
            throw new Error(err.error || "Failed to fact-check");
          });
        }
        return res.json();
      })
      .then((result) => {
        if (result.success && result.data) {
          const aiData = result.data;
          setData({
            topic,
            updatedAt: new Date().toLocaleString(),
            verdict: aiData.verdict || "Mixed/Disputed",
            summary: aiData.summary || ["AI analysis in progress..."],
            keyClaims: aiData.keyClaims?.map((claim: any) => ({
              label: claim.claim || claim.label || "Unknown claim",
              confidence: claim.confidence || 0.5,
              notes: claim.notes || "",
            })) || [],
            related: [
              `${topic} timeline`,
              `${topic} key claims`,
              `${topic} what's verified`,
              `${topic} disputed points`,
              `${topic} primary sources`,
            ],
          });
        } else {
          throw new Error("Invalid AI response");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fact-check error:", err);
        setError(err.message || "Failed to load AI analysis");
        setLoading(false);
        // Fallback to fake data on error
        setData(fakeRundown(topic));
      });
  }, [topic]);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0b0e14",
        color: "white",
        fontFamily:
          'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
      }}
    >
      <Header />

      <div style={{ padding: 32 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
          <h1 style={{ fontSize: 26, margin: 0 }}>Topic: {topic || "—"}</h1>
        {data ? (
          <span
            style={{
              fontSize: 12,
              padding: "4px 10px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.14)",
              background: badgeColor(data.verdict),
              opacity: 0.95,
            }}
          >
            {data.verdict}
          </span>
        ) : null}
      </div>

      <div style={{ marginTop: 8, opacity: 0.65, fontSize: 12 }}>
        {loading ? "🤖 AI analyzing topic..." : data ? `updated: ${data.updatedAt}` : "loading rundown…"}
      </div>

      {/* Error Message */}
      {error && (
        <div
          style={{
            marginTop: 16,
            padding: 12,
            borderRadius: 8,
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
            color: "#ef4444",
            fontSize: 13,
          }}
        >
          ⚠️ {error} - Showing fallback data
        </div>
      )}

      {/* AI Rundown */}
      <section
        style={{
          marginTop: 16,
          padding: 16,
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.14)",
          background: "rgba(255,255,255,0.04)",
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: 8 }}>
          {loading ? "🤖 AI Fact-Checking..." : "AI Fact Rundown"} {!loading && !data && "(loading)"}
        </div>

        {data ? (
          <div style={{ lineHeight: 1.65, fontSize: 13, opacity: 0.9 }}>
            {data.summary.map((line, i) => (
              <div key={i}>• {line}</div>
            ))}
          </div>
        ) : (
          <div style={{ opacity: 0.7, fontSize: 13 }}>
            generating demo summary…
          </div>
        )}
      </section>

      {/* Key Claims */}
      <section
        style={{
          marginTop: 16,
          padding: 16,
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.12)",
          background: "rgba(0,0,0,0.25)",
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: 10 }}>Key claims</div>

        {data ? (
          <div style={{ display: "grid", gap: 10 }}>
            {data.keyClaims.map((c) => (
              <div
                key={c.label}
                style={{
                  padding: 12,
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.10)",
                  background: "rgba(255,255,255,0.03)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div style={{ fontWeight: 600 }}>{c.label}</div>
                  <div style={{ opacity: 0.75 }}>
                    confidence: {(c.confidence * 100).toFixed(0)}%
                  </div>
                </div>
                <div style={{ marginTop: 6, opacity: 0.8, fontSize: 13 }}>
                  {c.notes}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ opacity: 0.7, fontSize: 13 }}>loading…</div>
        )}
      </section>

      {/* Related topics */}
      <section style={{ marginTop: 16 }}>
        <div style={{ fontWeight: 700, marginBottom: 10 }}>Related searches</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {(data?.related ?? []).map((r) => (
            <a
              key={r}
              href={`/t/${encodeURIComponent(r)}`}
              style={{
                fontSize: 13,
                padding: "6px 10px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.14)",
                background: "rgba(255,255,255,0.04)",
                color: "rgba(255,255,255,0.92)",
                textDecoration: "none",
              }}
            >
              {r}
            </a>
          ))}
        </div>
      </section>

      {/* Forum Section */}
      <section style={{ marginTop: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>
            Community Discussion ({forumPosts.length})
          </h2>
          <button
            onClick={() => setShowNewPost(!showNewPost)}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: "1px solid rgba(34,197,94,0.5)",
              background: showNewPost ? "rgba(34,197,94,0.2)" : "rgba(34,197,94,0.1)",
              color: "#22c55e",
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            {showNewPost ? "Cancel" : "+ New Post"}
          </button>
        </div>

        {/* New Post Form */}
        {showNewPost && (
          <div
            style={{
              marginBottom: 20,
              padding: 16,
              borderRadius: 10,
              border: "1px solid rgba(34,197,94,0.3)",
              background: "rgba(34,197,94,0.05)",
            }}
          >
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 6, opacity: 0.8 }}>
                TITLE
              </div>
              <input
                type="text"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                placeholder="What's your question or insight?"
                disabled={submitting}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 6,
                  border: "1px solid rgba(255,255,255,0.15)",
                  background: "rgba(0,0,0,0.3)",
                  color: "white",
                  fontSize: 13,
                  fontFamily: "inherit",
                }}
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 6, opacity: 0.8 }}>
                CONTENT
              </div>
              <textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="Share your thoughts... (AI will fact-check and add credibility score)"
                disabled={submitting}
                style={{
                  width: "100%",
                  minHeight: 100,
                  padding: "10px 12px",
                  borderRadius: 6,
                  border: "1px solid rgba(255,255,255,0.15)",
                  background: "rgba(0,0,0,0.3)",
                  color: "white",
                  fontSize: 13,
                  fontFamily: "inherit",
                  resize: "vertical",
                }}
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 6, opacity: 0.8 }}>
                SOURCES (OPTIONAL - BOOSTS CREDIBILITY)
              </div>
              <input
                type="text"
                value={postSources}
                onChange={(e) => setPostSources(e.target.value)}
                placeholder="Add links to sources (separated by commas)"
                disabled={submitting}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 6,
                  border: "1px solid rgba(255,255,255,0.15)",
                  background: "rgba(0,0,0,0.3)",
                  color: "white",
                  fontSize: 13,
                  fontFamily: "inherit",
                }}
              />
            </div>

            {/* Submit Error */}
            {submitError && (
              <div
                style={{
                  marginBottom: 12,
                  padding: 10,
                  borderRadius: 6,
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  color: "#ef4444",
                  fontSize: 12,
                }}
              >
                ⚠️ {submitError}
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 11, opacity: 0.7 }}>
                {submitting ? "🤖 AI analyzing your post..." : "🤖 AI will analyze your post and assign a credibility score"}
              </div>
              <button
                onClick={handleSubmitPost}
                disabled={submitting}
                style={{
                  padding: "8px 16px",
                  borderRadius: 6,
                  border: "none",
                  background: submitting ? "#666" : "#22c55e",
                  color: "white",
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: submitting ? "not-allowed" : "pointer",
                  opacity: submitting ? 0.7 : 1,
                }}
              >
                {submitting ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        )}

        {/* Forum Posts */}
        <div style={{ display: "grid", gap: 16 }}>
          {forumPosts.length > 0 ? (
            forumPosts.map((post) => <ForumPostCard key={post.id} post={post} />)
          ) : (
            <div
              style={{
                padding: 40,
                textAlign: "center",
                opacity: 0.5,
                fontSize: 13,
              }}
            >
              No forum posts yet. Be the first to start a discussion!
            </div>
          )}
        </div>
      </section>

        <div style={{ marginTop: 24, fontSize: 11, opacity: 0.5, textAlign: "center" }}>
          AI-powered fact-checking enabled • Posts stored in-memory (reset on server restart)
        </div>
      </div>
    </main>
  );
}