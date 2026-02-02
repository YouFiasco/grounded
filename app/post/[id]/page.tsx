"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type Comment = {
  id: string;
  user: {
    name: string;
    avatar: string;
    credibility: number;
    isJournalist?: boolean;
  };
  text: string;
  aiVerdict: "Verified" | "Mixed" | "False" | "Unverified";
  aiConfidence: number;
  aiCitations?: { source: string; url: string; verdict: string }[];
  reactions: { like: number; wow: number };
  timestamp: string;
};

type Post = {
  id: string;
  user: {
    name: string;
    avatar: string;
    credibility: number;
    isJournalist?: boolean;
  };
  image: string;
  caption: string;
  aiVerdict: "Verified" | "Mixed" | "False" | "Unverified";
  aiConfidence: number;
  likes: number;
  timestamp: string;
};

// Mock data
const MOCK_POSTS: Record<string, Post> = {
  "1": {
    id: "1",
    user: {
      name: "Sarah Chen",
      avatar: "👩‍💼",
      credibility: 87,
      isJournalist: true,
    },
    image: "https://images.unsplash.com/photo-1585241645927-c7a8e5840c42?w=800",
    caption: "New study shows 62% drop in violent crime rates since 2020. Full breakdown in comments.",
    aiVerdict: "Verified",
    aiConfidence: 91,
    likes: 234,
    timestamp: "2h ago",
  },
  "2": {
    id: "2",
    user: {
      name: "Mike Johnson",
      avatar: "👨",
      credibility: 45,
    },
    image: "https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=800",
    caption: "They're putting chemicals in the water that are turning kids sick. Wake up people!",
    aiVerdict: "False",
    aiConfidence: 88,
    likes: 12,
    timestamp: "5h ago",
  },
};

const MOCK_COMMENTS: Record<string, Comment[]> = {
  "1": [
    {
      id: "c1",
      user: { name: "Dr. James Wilson", avatar: "👨‍🔬", credibility: 91, isJournalist: true },
      text: "Excellent analysis. FBI's Uniform Crime Report confirms these numbers. Violent crime peaked in the early 90s and has been declining since.",
      aiVerdict: "Verified",
      aiConfidence: 94,
      reactions: { like: 45, wow: 3 },
      timestamp: "1h ago",
    },
    {
      id: "c2",
      user: { name: "Karen Smith", avatar: "👩", credibility: 32 },
      text: "This is fake news! Crime is at an all-time high, I see it every day in my neighborhood!",
      aiVerdict: "False",
      aiConfidence: 82,
      aiCitations: [
        {
          source: "FBI Crime Data Explorer",
          url: "https://cde.ucr.cjis.gov",
          verdict: "National violent crime rate decreased 49% from 1993-2022",
        },
        {
          source: "Pew Research Center",
          url: "https://pewresearch.org",
          verdict: "Public perception of crime often differs from actual statistics",
        },
        {
          source: "Bureau of Justice Statistics",
          url: "https://bjs.ojp.gov",
          verdict: "Violent victimization rates at historic lows since 2020",
        },
      ],
      reactions: { like: 2, wow: 15 },
      timestamp: "45m ago",
    },
    {
      id: "c3",
      user: { name: "Alex Rivera", avatar: "🧑", credibility: 68 },
      text: "Would be good to see this broken down by city and demographic. National averages can hide local trends.",
      aiVerdict: "Mixed",
      aiConfidence: 71,
      reactions: { like: 23, wow: 1 },
      timestamp: "30m ago",
    },
  ],
  "2": [
    {
      id: "c4",
      user: { name: "Dr. Lisa Chen", avatar: "👩‍⚕️", credibility: 93, isJournalist: true },
      text: "Water quality is regulated by EPA. Tested regularly. No evidence of intentional contamination.",
      aiVerdict: "Verified",
      aiConfidence: 96,
      reactions: { like: 156, wow: 8 },
      timestamp: "4h ago",
    },
    {
      id: "c5",
      user: { name: "TruthSeeker2024", avatar: "🕵️", credibility: 28 },
      text: "70% of black people are criminals, that's why crime is so high. Facts don't care about your feelings!",
      aiVerdict: "False",
      aiConfidence: 99,
      aiCitations: [
        {
          source: "FBI Uniform Crime Report 2022",
          url: "https://ucr.fbi.gov",
          verdict: "FALSE: This is a racist myth. Arrest rates ≠ crime rates. Black Americans make up 13% of population and ~27% of arrests, NOT 70%. Most crimes are intra-racial.",
        },
        {
          source: "Bureau of Justice Statistics",
          url: "https://bjs.ojp.gov",
          verdict: "Poverty and policing patterns, not race, correlate with crime rates",
        },
        {
          source: "ACLU Report on Racial Bias",
          url: "https://aclu.org",
          verdict: "Black Americans are arrested at disproportionate rates due to over-policing, not higher criminal behavior",
        },
      ],
      reactions: { like: 3, wow: 89 },
      timestamp: "3h ago",
    },
  ],
};

function verdictColor(verdict: "Verified" | "Mixed" | "False" | "Unverified") {
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

function CommentCard({ comment }: { comment: Comment }) {
  const verdict = verdictColor(comment.aiVerdict);
  const [showCitations, setShowCitations] = React.useState(false);

  return (
    <div
      style={{
        padding: 16,
        background: "rgba(255,255,255,0.03)",
        border: `1px solid ${verdict.border}40`,
        borderRadius: 10,
      }}
    >
      {/* User header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <span style={{ fontSize: 24 }}>{comment.user.avatar}</span>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontWeight: 600, fontSize: 13 }}>{comment.user.name}</span>
            {comment.user.isJournalist && (
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
          </div>
          <div style={{ fontSize: 10, opacity: 0.6 }}>
            Credibility: {comment.user.credibility}% • {comment.timestamp}
          </div>
        </div>

        {/* AI Verdict Badge */}
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
          {comment.aiVerdict} ({comment.aiConfidence}%)
        </div>
      </div>

      {/* Comment text */}
      <div style={{ fontSize: 13, lineHeight: 1.5, marginBottom: 12 }}>
        {comment.text}
      </div>

      {/* AI Citations (if false/disputed) */}
      {comment.aiCitations && comment.aiCitations.length > 0 && (
        <div
          style={{
            marginTop: 12,
            padding: 12,
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: 8,
          }}
        >
          <button
            onClick={() => setShowCitations(!showCitations)}
            style={{
              background: "none",
              border: "none",
              color: "#ef4444",
              fontSize: 11,
              fontWeight: 700,
              cursor: "pointer",
              padding: 0,
              marginBottom: showCitations ? 8 : 0,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span>🤖 AI FACT-CHECK</span>
            <span style={{ opacity: 0.7 }}>{showCitations ? "▼" : "▶"}</span>
          </button>

          {showCitations && (
            <div style={{ fontSize: 11, lineHeight: 1.6 }}>
              {comment.aiCitations.map((cite, i) => (
                <div
                  key={i}
                  style={{
                    marginTop: 8,
                    paddingTop: 8,
                    borderTop: i > 0 ? "1px solid rgba(239,68,68,0.2)" : "none",
                  }}
                >
                  <div style={{ fontWeight: 600, color: "#fca5a5", marginBottom: 4 }}>
                    📎 {cite.source}
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.8)", marginBottom: 4 }}>
                    {cite.verdict}
                  </div>
                  <a
                    href={cite.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "#60a5fa",
                      fontSize: 10,
                      textDecoration: "underline",
                    }}
                  >
                    {cite.url}
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Reactions */}
      <div
        style={{
          display: "flex",
          gap: 12,
          marginTop: 12,
          paddingTop: 12,
          borderTop: "1px solid rgba(255,255,255,0.1)",
          fontSize: 12,
        }}
      >
        <button
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 6,
            padding: "4px 10px",
            color: "white",
            fontSize: 12,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          👍 {comment.reactions.like}
        </button>
        <button
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 6,
            padding: "4px 10px",
            color: "white",
            fontSize: 12,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          😮 {comment.reactions.wow}
        </button>
        <button
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 6,
            padding: "4px 10px",
            color: "white",
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          💬 Reply
        </button>
      </div>
    </div>
  );
}

export default function PostPage() {
  const params = useParams<{ id?: string }>();
  const postId = params?.id ?? "1";

  const post = MOCK_POSTS[postId];
  const comments = MOCK_COMMENTS[postId] ?? [];

  if (!post) {
    return (
      <div style={{ minHeight: "100vh", background: "#0b0e14", color: "white", padding: 40 }}>
        Post not found
      </div>
    );
  }

  const verdict = verdictColor(post.aiVerdict);

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
      {/* Header */}
      <header
        style={{
          position: "sticky",
          top: 0,
          background: "rgba(11,14,20,0.95)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          padding: "12px 20px",
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: 680,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Link
            href="/feed"
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.7)",
              textDecoration: "none",
            }}
          >
            ← Back to Feed
          </Link>
          <Link
            href="/"
            style={{
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: 1,
              textDecoration: "none",
              color: "white",
            }}
          >
            GROUNDed
          </Link>
        </div>
      </header>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "20px 20px 60px" }}>
        {/* Post */}
        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 12,
            overflow: "hidden",
            marginBottom: 24,
          }}
        >
          {/* User header */}
          <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 36 }}>{post.user.avatar}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontWeight: 600, fontSize: 15 }}>{post.user.name}</span>
                {post.user.isJournalist && (
                  <span
                    style={{
                      fontSize: 10,
                      padding: "3px 7px",
                      borderRadius: 4,
                      background: "rgba(59,130,246,0.2)",
                      color: "#60a5fa",
                      fontWeight: 600,
                    }}
                  >
                    JOURNALIST
                  </span>
                )}
              </div>
              <div style={{ fontSize: 12, opacity: 0.6, marginTop: 3 }}>
                Credibility: {post.user.credibility}% • {post.timestamp}
              </div>
            </div>

            {/* AI Verdict Badge */}
            <div
              style={{
                padding: "6px 12px",
                borderRadius: 8,
                background: verdict.bg,
                border: `1px solid ${verdict.border}`,
                color: verdict.text,
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {post.aiVerdict} ({post.aiConfidence}%)
            </div>
          </div>

          {/* Image */}
          <div
            style={{
              width: "100%",
              height: 400,
              background: `url(${post.image}) center/cover`,
            }}
          />

          {/* Caption & Stats */}
          <div style={{ padding: 20 }}>
            <div style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>
              {post.caption}
            </div>

            <div
              style={{
                display: "flex",
                gap: 16,
                fontSize: 13,
                paddingTop: 16,
                borderTop: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <span>❤️ {post.likes}</span>
              <span>💬 {comments.length} comments</span>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
            Comments ({comments.length})
          </h2>

          {/* Add comment box */}
          <div
            style={{
              marginBottom: 20,
              padding: 16,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 10,
            }}
          >
            <textarea
              placeholder="Add your comment... (AI will fact-check it)"
              style={{
                width: "100%",
                minHeight: 80,
                background: "rgba(0,0,0,0.3)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 8,
                padding: 12,
                color: "white",
                fontSize: 13,
                fontFamily: "inherit",
                resize: "vertical",
              }}
            />
            <div style={{ marginTop: 10, display: "flex", justifyContent: "flex-end" }}>
              <button
                style={{
                  padding: "8px 16px",
                  background: "#22c55e",
                  border: "none",
                  borderRadius: 6,
                  color: "white",
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                Post Comment (AI will review)
              </button>
            </div>
          </div>

          {/* Comments list */}
          <div style={{ display: "grid", gap: 16 }}>
            {comments.map((comment) => (
              <CommentCard key={comment.id} comment={comment} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
