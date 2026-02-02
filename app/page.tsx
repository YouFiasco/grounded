"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [q, setQ] = React.useState("");

  const suggestions = ["epstein", "tiktok ban", "inflation", "supreme court case"];

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
            placeholder='type here… (example: "epstein")'
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

          <span
            style={{
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.22)",
              background: "rgba(255,255,255,0.10)",
            }}
          >
            Create account
          </span>

          <span
            style={{
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            Journalist mode
          </span>
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