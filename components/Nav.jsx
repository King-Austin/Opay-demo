"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePidgin } from "@/contexts/PidginContext";

export default function Nav() {
  const pathname = usePathname();
  const { pidgin, toggle } = usePidgin();
  const isApp = pathname.startsWith("/app");
  const isOnboarding = pathname.startsWith("/onboarding") || pathname.startsWith("/join") || pathname.startsWith("/create");

  if (isOnboarding) return null;

  return (
    <>
      <nav style={styles.nav}>
        <Link href="/" style={styles.logo}>
          <span style={styles.logoMark}>◈</span>
          <span style={styles.logoText}>AjoStack</span>
        </Link>

        {!isApp && (
          <div className="nav-links-desktop">
            <a href="#problem" style={styles.link}>Problem</a>
            <a href="#howitworks" style={styles.link}>How It Works</a>
            <a href="#score" style={styles.link}>AjoScore</a>
            <Link href="/ussd" style={styles.link}>USSD *347#</Link>
          </div>
        )}

        {isApp && (
          <div className="nav-links-desktop">
            <Link href="/app/dashboard" style={styles.link}>Dashboard</Link>
            <Link href="/app/score" style={styles.link}>AjoScore</Link>
            <Link href="/app/loan" style={styles.link}>Loans</Link>
            <Link href="/ussd" style={styles.link}>USSD *347#</Link>
          </div>
        )}

        <div style={styles.actions}>
          {/* Pidgin toggle */}
          <button
            onClick={toggle}
            title={pidgin ? "Switch to English" : "Switch to Pidgin"}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              letterSpacing: "0.08em",
              padding: "0.3rem 0.6rem",
              border: "0.5px solid var(--border-default)",
              borderRadius: "var(--radius-sm)",
              background: pidgin ? "var(--accent-green-tint)" : "transparent",
              color: pidgin ? "var(--accent-green)" : "var(--text-ghost)",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            {pidgin ? "PID" : "EN"}
          </button>

          {!isApp ? (
            <>
              <Link href="/app/dashboard" className="rp-btn-ghost" style={{ fontSize: "11px" }}>
                {pidgin ? "Enter" : "Sign in"}
              </Link>
              <Link href="/onboarding" className="rp-btn-solid">
                {pidgin ? "Begin ↗" : "Open App ↗"}
              </Link>
            </>
          ) : (
            <span style={styles.userPill}>
              <span style={styles.avatar}>NA</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-secondary)" }}>
                Ngozi Adaeze
              </span>
            </span>
          )}
        </div>
      </nav>

      <style>{`
        .nav-links-desktop {
          display: flex;
          gap: 2rem;
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        @media (max-width: 768px) { .nav-links-desktop { display: none; } }
      `}</style>
    </>
  );
}

const styles = {
  nav: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "1rem 2.5rem",
    borderBottom: "0.5px solid rgba(0,0,0,0.10)",
    background: "var(--bg-primary)",
    position: "sticky", top: 0, zIndex: 100,
  },
  logo: { display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" },
  logoMark: { fontSize: "18px", color: "var(--accent-green)", lineHeight: 1 },
  logoText: { fontFamily: "var(--font-mono)", fontSize: "13px", fontWeight: 500, letterSpacing: "0.04em", color: "var(--text-primary)" },
  link: { fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", textDecoration: "none", transition: "color 0.12s ease" },
  actions: { display: "flex", alignItems: "center", gap: "0.75rem" },
  userPill: { display: "flex", alignItems: "center", gap: "0.5rem" },
  avatar: { width: "28px", height: "28px", borderRadius: "50%", background: "var(--accent-green)", color: "#ECEAE4", fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
};
