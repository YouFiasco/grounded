"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  return (
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
          <Link
            href="/feed"
            style={{
              color: isActive("/feed") ? "#22c55e" : "rgba(255,255,255,0.7)",
              textDecoration: "none",
            }}
          >
            Feed
          </Link>
          <Link
            href="/"
            style={{
              color: isActive("/") && pathname === "/" ? "#22c55e" : "rgba(255,255,255,0.7)",
              textDecoration: "none",
            }}
          >
            Search
          </Link>
          <Link
            href="/profile"
            style={{
              color: isActive("/profile") ? "#22c55e" : "rgba(255,255,255,0.7)",
              textDecoration: "none",
            }}
          >
            Profile
          </Link>
        </div>
      </div>
    </header>
  );
}
