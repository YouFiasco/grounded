"use client";

import * as React from "react";
import Link from "next/link";

type Post = {
  id: string;
  user: {
    name: string;
    avatar: string;
    credibility: number; // 0-100
    isJournalist?: boolean;
  };
  image: string;
  caption: string;
  aiVerdict: "Verified" | "Mixed" | "False" | "Unverified";
  aiConfidence: number; // 0-100
  likes: number;
  commentCount: number;
  timestamp: string;
};

// Mock data - replace with real data later
const MOCK_POSTS: Post[] = [
  {
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
    commentCount: 45,
    timestamp: "2h ago",
  },
  {
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
    commentCount: 89,
    timestamp: "5h ago",
  },
  {
    id: "3",
    user: {
      name: "Dr. Aisha Patel",
      avatar: "👩‍⚕️",
      credibility: 92,
      isJournalist: true,
    },
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800",
    caption: "Latest CDC data on vaccination rates across demographics. Sources linked below.",
    aiVerdict: "Verified",
    aiConfidence: 95,
    likes: 567,
    commentCount: 123,
    timestamp: "8h ago",
  },
  {
    id: "4",
    user: {
      name: "Alex Rivera",
      avatar: "🧑",
      credibility: 68,
    },
    image: "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800",
    caption: "Interesting debate on economic policy. Not sure what to believe anymore...",
    aiVerdict: "Mixed",
    aiConfidence: 62,
    likes: 78,
    commentCount: 34,
    timestamp: "1d ago",
  },
];

function verdictColor(verdict: Post["aiVerdict"]) {
  switch (verdict) {
    case "Verified":
      return { bg: "rgba(34,197,94,0.15)", text: "#22c55e", icon: "✓" };
    case "Mixed":
      return { bg: "rgba(234,179,8,0.15)", text: "#eab308", icon: "⚠" };
    case "False":
      return { bg: "rgba(239,68,68,0.15)", text: "#ef4444", icon: "✕" };
    case "Unverified":
      return { bg: "rgba(148,163,184,0.15)", text: "#94a3b8", icon: "?" };
  }
}

function PostCard({ post }: { post: Post }) {
  const verdict = verdictColor(post.aiVerdict);

  return (
    <Link
      href={`/post/${post.id}`}
      style={{
        display: "block",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 12,
        overflow: "hidden",
        textDecoration: "none",
        color: "inherit",
        transition: "all 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* User header */}
      <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ fontSize: 32 }}>{post.user.avatar}</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontWeight: 600, fontSize: 14 }}>{post.user.name}</span>
            {post.user.isJournalist && (
              <span
                style={{
                  fontSize: 10,
                  padding: "2px 6px",
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
          <div style={{ fontSize: 11, opacity: 0.6, marginTop: 2 }}>
            Credibility: {post.user.credibility}% • {post.timestamp}
          </div>
        </div>
      </div>

      {/* Image */}
      <div
        style={{
          width: "100%",
          height: 320,
          background: `url(${post.image}) center/cover`,
          position: "relative",
        }}
      >
        {/* AI Verdict Badge */}
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            padding: "6px 12px",
            borderRadius: 8,
            background: verdict.bg,
            border: `1px solid ${verdict.text}`,
            color: verdict.text,
            fontSize: 12,
            fontWeight: 700,
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <span>{verdict.icon}</span>
          <span>{post.aiVerdict}</span>
          <span style={{ opacity: 0.7, fontSize: 11 }}>({post.aiConfidence}%)</span>
        </div>
      </div>

      {/* Caption & Stats */}
      <div style={{ padding: 16 }}>
        <div style={{ fontSize: 13, lineHeight: 1.5, marginBottom: 12 }}>
          {post.caption}
        </div>

        <div
          style={{
            display: "flex",
            gap: 16,
            fontSize: 12,
            opacity: 0.7,
            paddingTop: 12,
            borderTop: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <span>❤️ {post.likes}</span>
          <span>💬 {post.commentCount} comments</span>
        </div>
      </div>
    </Link>
  );
}

export default function FeedPage() {
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

          <div style={{ display: "flex", gap: 16, fontSize: 13 }}>
            <Link href="/feed" style={{ color: "#22c55e", textDecoration: "none" }}>
              Feed
            </Link>
            <Link href="/" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>
              Search
            </Link>
            <span style={{ color: "rgba(255,255,255,0.5)" }}>Profile</span>
          </div>
        </div>
      </header>

      {/* Feed */}
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "20px 20px 60px" }}>
        <div style={{ display: "grid", gap: 20 }}>
          {MOCK_POSTS.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </main>
  );
}
