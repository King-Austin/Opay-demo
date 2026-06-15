"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import GroupCard from "@/components/GroupCard";
import { currentUser, groups } from "@/data/mock";

export default function Dashboard() {
  const totalSaved = groups.reduce((sum, g) => sum + g.contribution * g.currentWeek, 0);

  // Render the date only after mount — server and client clocks/locales can differ,
  // which causes a hydration mismatch if formatted during SSR.
  const [today, setToday] = useState("");
  useEffect(() => {
    setToday(new Date().toLocaleDateString("en-NG", { weekday: "long", year: "numeric", month: "long", day: "numeric" }));
  }, []);

  return (
    <main style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      {/* Header */}
      <div className="app-pad" style={{ paddingTop: "2.5rem" }}>
        <span className="rp-eyebrow">Dashboard</span>
        <div className="stack-mobile" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(32px, 5vw, 46px)", fontWeight: 600, lineHeight: 0.95, letterSpacing: "-0.02em", color: "var(--text-primary)", marginBottom: "0.5rem" }}>
              Welcome back,<br />
              <em>Ngozi.</em>
            </h1>
            <p suppressHydrationWarning style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--text-muted)", letterSpacing: "0.03em", minHeight: "1.2em" }}>
              {today}
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <Link href="/app/loan" className="rp-btn-ghost">Apply for Loan</Link>
            <Link href="/create" className="rp-btn-cta" style={{ fontSize: "12px", padding: "0.7rem 1.5rem" }}>
              + Create Circle
            </Link>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid-4" style={{ marginBottom: "2rem" }}>
          {[
            { label: "Active Circles", val: groups.length, mono: true },
            { label: "Total Contributed", val: "₦" + totalSaved.toLocaleString(), mono: true },
            { label: "AjoScore", val: currentUser.ajoScore, mono: true, highlight: true },
            { label: "Max Loan Eligible", val: "₦" + currentUser.maxLoan.toLocaleString(), mono: true },
          ].map(s => (
            <div key={s.label} className="rp-card-raised stat-pop" style={{ padding: "1.25rem" }}>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
                {s.label}
              </p>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "24px", fontWeight: 500, color: s.highlight ? "var(--accent-green)" : "var(--text-primary)", lineHeight: 1 }}>
                {s.val}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Groups */}
      <div className="app-pad" style={{ paddingBottom: "4rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <span className="rp-eyebrow" style={{ marginBottom: 0 }}>Your Ajo Circles</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-muted)" }}>
            {groups.length} active
          </span>
        </div>

        <div className="grid-3">
          {groups.map(g => (
            <GroupCard key={g.id} group={g} />
          ))}
          {/* "Create new" placeholder card */}
          <Link href="/create" style={{
            background: "transparent",
            border: "0.5px dashed var(--border-strong)",
            borderRadius: "var(--radius-lg)",
            textDecoration: "none",
            padding: "1.75rem",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.75rem",
            minHeight: "200px",
            transition: "background 0.15s ease",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "var(--bg-surface)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "24px", color: "var(--text-ghost)" }}>+</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-ghost)", letterSpacing: "0.06em" }}>Start new circle</span>
          </Link>
        </div>
      </div>

      {/* AjoScore prompt */}
      <div className="app-pad stack-mobile" style={{ marginBottom: "4rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.25rem" }}>
        <div style={{ background: "#0E0E0C", borderRadius: "var(--radius-lg)", padding: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.25rem", width: "100%" }}>
          <div>
            <span className="rp-eyebrow-dark" style={{ marginBottom: "0.5rem" }}>06 — Your Credit Identity</span>
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "24px", fontWeight: 500, color: "#F2F0EA", lineHeight: 1.2 }}>
              AjoScore: <em style={{ color: "#D4A853" }}>782</em> — Excellent standing.
            </h3>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--dark-text-muted)", marginTop: "0.5rem", letterSpacing: "0.03em" }}>
              Eligible for micro-loans up to ₦150,000 via OPay wallet
            </p>
          </div>
          <Link href="/app/score" className="rp-btn-cta full-mobile">
            View AjoScore ↗
          </Link>
        </div>
      </div>
    </main>
  );
}
