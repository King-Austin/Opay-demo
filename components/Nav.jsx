"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isApp = pathname.startsWith("/app");

  return (
    <>
      <nav style={styles.nav}>
        <Link href="/" style={styles.logo}>
          <span style={styles.logoMark}>◈</span>
          <span style={styles.logoText}>AjoStack</span>
        </Link>

        {!isApp && (
          <div style={styles.links} className="nav-links-desktop">
            <a href="#problem" style={styles.link}>Problem</a>
            <a href="#howitworks" style={styles.link}>How It Works</a>
            <a href="#score" style={styles.link}>AjoScore</a>
          </div>
        )}

        {isApp && (
          <div style={styles.links} className="nav-links-desktop">
            <Link href="/app/dashboard" style={styles.link}>Dashboard</Link>
            <Link href="/app/score" style={styles.link}>AjoScore</Link>
            <Link href="/app/loan" style={styles.link}>Loans</Link>
          </div>
        )}

        <div style={styles.actions}>
          {!isApp ? (
            <>
              <Link href="/app/dashboard" className="rp-btn-ghost" style={{ fontSize: "11px" }}>
                Sign in
              </Link>
              <Link href="/app/dashboard" className="rp-btn-solid">
                Open App ↗
              </Link>
            </>
          ) : (
            <>
              <span style={styles.userPill}>
                <span style={styles.avatar}>NA</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-secondary)" }}>Ngozi Adaeze</span>
              </span>
            </>
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
        @media (max-width: 768px) {
          .nav-links-desktop { display: none; }
        }
      `}</style>
    </>
  );
}

const styles = {
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "1rem 2.5rem",
    borderBottom: "0.5px solid rgba(0,0,0,0.10)",
    background: "var(--bg-primary)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    textDecoration: "none",
  },
  logoMark: {
    fontSize: "18px",
    color: "var(--accent-green)",
    lineHeight: 1,
  },
  logoText: {
    fontFamily: "var(--font-mono)",
    fontSize: "13px",
    fontWeight: 500,
    letterSpacing: "0.04em",
    color: "var(--text-primary)",
  },
  links: {
    display: "flex",
    gap: "2rem",
  },
  link: {
    fontFamily: "var(--font-mono)",
    fontSize: "11px",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "var(--text-muted)",
    textDecoration: "none",
    transition: "color 0.12s ease",
  },
  actions: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  userPill: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  avatar: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    background: "var(--accent-green)",
    color: "#ECEAE4",
    fontFamily: "var(--font-mono)",
    fontSize: "10px",
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
};
