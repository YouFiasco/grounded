"use client";

import * as React from "react";
import { useParams } from "next/navigation";

type Rundown = {
  topic: string;
  updatedAt: string;
  verdict: "Verified" | "Mixed/Disputed" | "Opinion/Analysis";
  summary: string[];
  keyClaims: { label: string; confidence: number; notes: string }[];
  related: string[];
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
          `${topic} what’s verified`,
          `${topic} disputed points`,
          `${topic} primary sources`,
        ];

  return {
    topic,
    updatedAt: new Date().toLocaleString(),
    verdict,
    summary: [
      `This is a demo “facts-first” rundown for “${topic}”.`,
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

export default function TopicPage() {
  const params = useParams<{ topic?: string }>();
  const topic = decodeURIComponent(params?.topic ?? "");

  const [data, setData] = React.useState<Rundown | null>(null);

  React.useEffect(() => {
    if (!topic) return;
    // fake “loading”
    setData(null);
    const t = setTimeout(() => setData(fakeRundown(topic)), 350);
    return () => clearTimeout(t);
  }, [topic]);

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: 32,
        background: "#0b0e14",
        color: "white",
        fontFamily:
          'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
      }}
    >
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
        {data ? `updated: ${data.updatedAt}` : "loading rundown…"}
      </div>

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
          AI Fact Rundown {data ? "" : "(loading)"}
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

      {/* Forum placeholder */}
      <section
        style={{
          marginTop: 20,
          padding: 16,
          borderRadius: 12,
          border: "1px dashed rgba(255,255,255,0.2)",
          opacity: 0.75,
        }}
      >
        Forum (coming next): posts, credibility scores, sources
      </section>

      <div style={{ marginTop: 14, fontSize: 12, opacity: 0.55 }}>
        demo note: this rundown is fake data right now — next we’ll generate it.
      </div>
    </main>
  );
}