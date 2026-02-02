"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";

// Simple Levenshtein distance for typo detection
function levenshtein(a: string, b: string): number {
  const matrix = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

export default function Home() {
  const router = useRouter();
  const { isSignedIn, user } = useUser();
  const [q, setQ] = React.useState("");
  const [smartSuggestion, setSmartSuggestion] = React.useState<string | null>(null);

  const suggestions = ["epstein", "tiktok ban", "inflation", "supreme court case"];

  // Knowledge base for natural language and typo correction
  const knowledgeBase = [
    { terms: ["epstein", "epsteen", "epstien", "jeffrey epstein"], canonical: "epstein" },
    { terms: ["tiktok", "tik tok", "tiktok ban", "tiktak"], canonical: "tiktok ban" },
    { terms: ["inflation", "inflaton", "cpi", "consumer price"], canonical: "inflation" },
    { terms: ["elon musk", "elon", "musk", "spacex", "space x"], canonical: "elon musk" },
    { terms: ["trump", "donald trump", "president trump"], canonical: "trump" },
    { terms: ["biden", "joe biden", "president biden"], canonical: "biden" },
  ];

  // Smart search: handles typos and natural language
  React.useEffect(() => {
    if (!q || q.length < 3) {
      setSmartSuggestion(null);
      return;
    }

    const lower = q.toLowerCase().trim();

    // Check for exact match first
    const exactMatch = knowledgeBase.find(kb =>
      kb.terms.some(term => term === lower)
    );
    if (exactMatch && exactMatch.canonical !== lower) {
      setSmartSuggestion(exactMatch.canonical);
      return;
    }

    // Check for fuzzy match (typos)
    for (const kb of knowledgeBase) {
      for (const term of kb.terms) {
        const distance = levenshtein(lower, term);
        // If typo distance is small (1-2 chars different), suggest correction
        if (distance > 0 && distance <= 2 && term.length > 3) {
          setSmartSuggestion(kb.canonical);
          return;
        }
      }
    }

    // Check if query contains multiple search terms (natural language)
    const words = lower.split(/\s+/);
    if (words.length > 3) {
      // Complex query like "epstein involved with elon musk space x?"
      const matches: string[] = [];
      for (const kb of knowledgeBase) {
        if (kb.terms.some(term => lower.includes(term))) {
          matches.push(kb.canonical);
        }
      }
      if (matches.length > 0) {
        setSmartSuggestion(matches.join(" + "));
        return;
      }
    }

    setSmartSuggestion(null);
  }, [q]);

  function goSearch(value?: string) {
    const query = (value ?? q).trim();
    if (!query) return;
    router.push(`/t/${encodeURIComponent(query)}`);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: 24,
        background: "#0b0e14",
        display: "grid",
        placeItems: "center",
      }}
    >
      <div
        style={{
          width: "min(920px, 100%)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 16,
          padding: 22,
          color: "rgba(255,255,255,0.92)",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
          fontFamily:
            'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        }}
      >
        <div style={{ fontSize: 22, letterSpacing: 1.2, fontWeight: 700 }}>
          GROUNDed
        </div>

        <div style={{ marginTop: 6, opacity: 0.85, fontSize: 14 }}>
          facts-first search + evidence-ranked discussion
        </div>

        <div style={{ marginTop: 18, lineHeight: 1.6 }}>
          <div>Type a person, event, policy, or claim.</div>
          <div>Get a verified rundown before the debate.</div>
        </div>

        <div
          style={{
            marginTop: 18,
            display: "flex",
            gap: 10,
            alignItems: "center",
          }}
        >
          <span style={{ opacity: 0.8 }}>&gt; search:</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") goSearch();
            }}
            placeholder='type here… (try: "epsteen" or "epstein + elon musk")'
            style={{
              flex: 1,
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.16)",
              background: "rgba(0,0,0,0.35)",
              color: "rgba(255,255,255,0.92)",
              outline: "none",
            }}
          />
          <button
            onClick={() => goSearch()}
            style={{
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "transparent",
              color: "rgba(255,255,255,0.9)",
              cursor: "pointer",
            }}
          >
            Enter
          </button>
        </div>

        {/* Smart Suggestion */}
        {smartSuggestion && (
          <div
            style={{
              marginTop: 10,
              padding: "8px 12px",
              borderRadius: 8,
              background: "rgba(234,179,8,0.15)",
              border: "1px solid rgba(234,179,8,0.3)",
              fontSize: 13,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ opacity: 0.8 }}>🤖 Did you mean:</span>
            <button
              onClick={() => {
                setQ(smartSuggestion);
                goSearch(smartSuggestion);
              }}
              style={{
                background: "rgba(234,179,8,0.2)",
                border: "1px solid rgba(234,179,8,0.5)",
                borderRadius: 6,
                padding: "4px 10px",
                color: "#eab308",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: 13,
              }}
            >
              "{smartSuggestion}"
            </button>
            <span style={{ opacity: 0.6, fontSize: 12 }}>
              (AI detected typo or natural language query)
            </span>
          </div>
        )}

        <div style={{ marginTop: 10, fontSize: 13, opacity: 0.8 }}>
          try:{" "}
          {suggestions.map((s, i) => (
            <button
              key={s}
              onClick={() => goSearch(s)}
              style={{
                font: "inherit",
                fontSize: 13,
                padding: "4px 10px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.14)",
                background: "rgba(255,255,255,0.04)",
                color: "rgba(255,255,255,0.92)",
                cursor: "pointer",
                marginRight: 8,
                marginTop: 6,
              }}
            >
              "{s}"
            </button>
          ))}
        </div>

        <div
          style={{
            marginTop: 16,
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => router.push("/feed")}
            style={{
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid rgba(34,197,94,0.5)",
              background: "rgba(34,197,94,0.15)",
              color: "#22c55e",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            View Feed
          </button>

          <button
            onClick={() => goSearch(q || "epstein")}
            style={{
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "transparent",
              color: "rgba(255,255,255,0.9)",
              cursor: "pointer",
            }}
          >
            Browse topics
          </button>

          {isSignedIn ? (
            <>
              <div
                style={{
                  padding: "6px 12px",
                  borderRadius: 10,
                  border: "1px solid rgba(34,197,94,0.3)",
                  background: "rgba(34,197,94,0.1)",
                  color: "#22c55e",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 13,
                }}
              >
                <span>👋 {user?.firstName || user?.username || "User"}</span>
                <UserButton />
              </div>
            </>
          ) : (
            <>
              <SignInButton mode="modal">
                <button
                  style={{
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "transparent",
                    color: "rgba(255,255,255,0.9)",
                    cursor: "pointer",
                  }}
                >
                  Sign In
                </button>
              </SignInButton>

              <SignUpButton mode="modal">
                <button
                  style={{
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: "1px solid rgba(34,197,94,0.5)",
                    background: "rgba(34,197,94,0.15)",
                    color: "#22c55e",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  Create Account
                </button>
              </SignUpButton>
            </>
          )}
        </div>

        <div
          style={{
            margin: "18px 0",
            height: 1,
            background: "rgba(255,255,255,0.10)",
          }}
        />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          <div>
            <div style={{ fontSize: 13, opacity: 0.75, marginBottom: 6 }}>
              Trending
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.6 }}>
              <div>1) Epstein</div>
              <div>2) Gaza ceasefire talks</div>
              <div>3) Inflation and CPI</div>
              <div>4) Border policy changes</div>
              <div>5) Supreme Court tracker</div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 13, opacity: 0.75, marginBottom: 6 }}>
              How it works
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.6 }}>
              <div>• Search-first: learn basics before arguments</div>
              <div>• Claims get sources + confidence</div>
              <div>• Reach is earned by evidence, not outrage</div>
              <div>• Anyone can speak — grounded posts rise</div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 14, fontSize: 12, opacity: 0.65 }}>
          promise: transparency over authority · sources always shown · uncertainty labeled
        </div>
      </div>
    </main>
  );
}