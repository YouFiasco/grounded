"use client";

import * as React from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

type UserPost = {
  id: string;
  title: string;
  aiVerdict: "Verified" | "Mixed" | "False" | "Unverified";
  aiConfidence: number;
  points: number;
  hasSources: boolean;
  timestamp: string;
};

// Calculate points based on AI verdict and confidence
function calculatePoints(verdict: string, confidence: number, hasSources: boolean): number {
  let basePoints = 0;

  if (confidence >= 90) {
    basePoints = 100; // Verified
  } else if (confidence >= 50) {
    basePoints = 50; // Mixed
  } else {
    basePoints = -25; // False
  }

  const confidenceMultiplier = confidence / 100;
  let totalPoints = basePoints * confidenceMultiplier;

  // Bonus for providing sources
  if (hasSources) {
    totalPoints += 50;
  }

  return Math.round(totalPoints);
}

// Mock user data
const MOCK_USER_POSTS: UserPost[] = [
  {
    id: "p1",
    title: "Analysis of recent inflation data from Federal Reserve",
    aiVerdict: "Verified",
    aiConfidence: 94,
    points: calculatePoints("Verified", 94, true),
    hasSources: true,
    timestamp: "2 days ago",
  },
  {
    id: "p2",
    title: "Breaking down the Supreme Court ruling on student loans",
    aiVerdict: "Verified",
    aiConfidence: 88,
    points: calculatePoints("Verified", 88, true),
    hasSources: true,
    timestamp: "5 days ago",
  },
  {
    id: "p3",
    title: "My thoughts on current economic policy",
    aiVerdict: "Mixed",
    aiConfidence: 67,
    points: calculatePoints("Mixed", 67, false),
    hasSources: false,
    timestamp: "1 week ago",
  },
  {
    id: "p4",
    title: "Crime statistics comparison across major cities",
    aiVerdict: "Verified",
    aiConfidence: 91,
    points: calculatePoints("Verified", 91, true),
    hasSources: true,
    timestamp: "2 weeks ago",
  },
];

function verdictColor(verdict: string) {
  switch (verdict) {
    case "Verified":
      return { bg: "rgba(34,197,94,0.15)", text: "#22c55e", border: "#22c55e" };
    case "Mixed":
      return { bg: "rgba(234,179,8,0.15)", text: "#eab308", border: "#eab308" };
    case "False":
      return { bg: "rgba(239,68,68,0.15)", text: "#ef4444", border: "#ef4444" };
    default:
      return { bg: "rgba(148,163,184,0.15)", text: "#94a3b8", border: "#94a3b8" };
  }
}

export default function ProfilePage() {
  const { user } = useUser();
  const [isEditing, setIsEditing] = React.useState(false);

  // Calculate total points and credibility
  const totalPoints = MOCK_USER_POSTS.reduce((sum, post) => sum + post.points, 0);
  const averageConfidence = Math.round(
    MOCK_USER_POSTS.reduce((sum, post) => sum + post.aiConfidence, 0) / MOCK_USER_POSTS.length
  );
  const verifiedCount = MOCK_USER_POSTS.filter(p => p.aiVerdict === "Verified").length;

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
            maxWidth: 1200,
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
            <Link href="/feed" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>
              Feed
            </Link>
            <Link href="/" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>
              Search
            </Link>
            <span style={{ color: "#22c55e" }}>Profile</span>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 20px" }}>
        {/* Profile Header */}
        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 16,
            padding: 32,
            marginBottom: 24,
          }}
        >
          <div style={{ display: "flex", gap: 24, alignItems: "start" }}>
            {/* Avatar */}
            <div
              style={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #22c55e, #16a34a)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 40,
                flexShrink: 0,
              }}
            >
              {user?.firstName?.charAt(0) || user?.username?.charAt(0) || "U"}
            </div>

            {/* Profile Info */}
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                <h1 style={{ fontSize: 28, margin: 0 }}>
                  {user?.firstName || user?.username || "Demo User"}
                </h1>

                {/* Journalist Badge (example) */}
                <span
                  style={{
                    padding: "4px 12px",
                    borderRadius: 6,
                    background: "rgba(59,130,246,0.2)",
                    border: "1px solid rgba(59,130,246,0.4)",
                    color: "#60a5fa",
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  ✓ VERIFIED JOURNALIST
                </span>
              </div>

              <div style={{ fontSize: 14, opacity: 0.7, marginBottom: 16 }}>
                {user?.primaryEmailAddress?.emailAddress || "user@example.com"}
              </div>

              <div style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 16, maxWidth: 600 }}>
                Fact-checker and journalist focused on economic policy and statistical analysis.
                Committed to evidence-based reporting and transparent sourcing.
              </div>

              <button
                onClick={() => setIsEditing(!isEditing)}
                style={{
                  padding: "8px 16px",
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.2)",
                  background: "rgba(255,255,255,0.05)",
                  color: "white",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {isEditing ? "Save Profile" : "Edit Profile"}
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
          <div
            style={{
              background: "rgba(34,197,94,0.1)",
              border: "1px solid rgba(34,197,94,0.3)",
              borderRadius: 12,
              padding: 20,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 32, fontWeight: 700, color: "#22c55e", marginBottom: 4 }}>
              {totalPoints}
            </div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>Total Points</div>
          </div>

          <div
            style={{
              background: "rgba(59,130,246,0.1)",
              border: "1px solid rgba(59,130,246,0.3)",
              borderRadius: 12,
              padding: 20,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 32, fontWeight: 700, color: "#60a5fa", marginBottom: 4 }}>
              {averageConfidence}%
            </div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>Credibility Score</div>
          </div>

          <div
            style={{
              background: "rgba(234,179,8,0.1)",
              border: "1px solid rgba(234,179,8,0.3)",
              borderRadius: 12,
              padding: 20,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 32, fontWeight: 700, color: "#eab308", marginBottom: 4 }}>
              {MOCK_USER_POSTS.length}
            </div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>Total Posts</div>
          </div>

          <div
            style={{
              background: "rgba(168,85,247,0.1)",
              border: "1px solid rgba(168,85,247,0.3)",
              borderRadius: 12,
              padding: 20,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 32, fontWeight: 700, color: "#a855f7", marginBottom: 4 }}>
              {verifiedCount}
            </div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>Verified Posts</div>
          </div>
        </div>

        {/* Point System Explanation */}
        <div
          style={{
            background: "rgba(59,130,246,0.08)",
            border: "1px solid rgba(59,130,246,0.2)",
            borderRadius: 12,
            padding: 16,
            marginBottom: 24,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: "#60a5fa" }}>
            🏆 How Points Work
          </div>
          <div style={{ fontSize: 12, lineHeight: 1.8, opacity: 0.9 }}>
            • <strong>Verified posts (90%+ confidence):</strong> 100 points × confidence%<br />
            • <strong>Mixed posts (50-89% confidence):</strong> 50 points × confidence%<br />
            • <strong>False posts (below 50%):</strong> -25 points × confidence%<br />
            • <strong>Source bonus:</strong> +50 points for citing sources
          </div>
        </div>

        {/* Post History */}
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Recent Posts</h2>

          <div style={{ display: "grid", gap: 12 }}>
            {MOCK_USER_POSTS.map((post) => {
              const colors = verdictColor(post.aiVerdict);
              return (
                <div
                  key={post.id}
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: `1px solid ${colors.border}30`,
                    borderRadius: 10,
                    padding: 16,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
                      {post.title}
                    </div>
                    <div style={{ fontSize: 11, opacity: 0.6, display: "flex", gap: 12 }}>
                      <span>{post.timestamp}</span>
                      {post.hasSources && <span>📎 Sources included</span>}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div
                      style={{
                        padding: "6px 12px",
                        borderRadius: 6,
                        background: colors.bg,
                        border: `1px solid ${colors.border}`,
                        color: colors.text,
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      {post.aiVerdict} ({post.aiConfidence}%)
                    </div>

                    <div
                      style={{
                        padding: "6px 12px",
                        borderRadius: 6,
                        background: post.points >= 0 ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
                        border: `1px solid ${post.points >= 0 ? "#22c55e" : "#ef4444"}`,
                        color: post.points >= 0 ? "#22c55e" : "#ef4444",
                        fontSize: 11,
                        fontWeight: 700,
                        minWidth: 80,
                        textAlign: "center",
                      }}
                    >
                      {post.points >= 0 ? "+" : ""}{post.points} pts
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
