"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ScoreGauge from "@/components/ScoreGauge";
import RecDot from "@/components/RecDot";
import { competitors, howItWorksSteps } from "@/data/mock";

function DemoCard() {
  const messages = [
    { role: "ai", text: "Nne, how much dem collect dis week for your group?" },
    { role: "user", text: "₦5,000 — all 12 people don pay." },
    { role: "ai", text: "Perfect. Contribution confirmed. Your AjoScore just moved from 776 to 782." },
  ];
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    if (visible >= messages.length) return;
    const t = setTimeout(() => setVisible(v => v + 1), visible === 0 ? 600 : 1800);
    return () => clearTimeout(t);
  }, [visible]);

  return (
    <div className="rp-card-surface" style={{ maxWidth: "420px", width: "100%" }}>
      <div className="rp-demo-header">
        <span style={{ display: "flex", alignItems: "center" }}>
          <span className="rp-rec-dot" />
          Recording · language: <strong style={{ marginLeft: "4px" }}>Pidgin</strong>
        </span>
        <span className="rp-timer">T-00:24</span>
      </div>
      <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem", minHeight: "200px" }}>
        {messages.slice(0, visible).map((m, i) => (
          <div
            key={i}
            style={{
              background: m.role === "ai" ? "var(--bg-raised)" : "var(--text-primary)",
              color: m.role === "ai" ? "var(--text-primary)" : "var(--bg-primary)",
              borderRadius: m.role === "ai" ? "10px 10px 10px 3px" : "10px 10px 3px 10px",
              padding: "0.75rem 1rem",
              fontSize: "13px",
              lineHeight: 1.55,
              maxWidth: "82%",
              alignSelf: m.role === "user" ? "flex-end" : "flex-start",
              border: m.role === "ai" ? "0.5px solid var(--border-default)" : "none",
              animation: "fadeUp 0.3s ease forwards",
            }}
          >
            {m.text}
          </div>
        ))}
        {visible >= messages.length && (
          <div className="rp-scorer" style={{ animation: "fadeUp 0.4s ease forwards" }}>
            Gemini AI · AjoScore updated · +6 points · Cycle 7 of 12
          </div>
        )}
      </div>
    </div>
  );
}

export default function Landing() {
  return (
    <main>
      {/* ——— HERO ——— */}
      <section className="rp-section" id="hero">
        <span className="rp-eyebrow">01 — The Platform</span>
        <div className="rp-two-col" style={{ alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <h1 className="rp-hero-heading fade-up">
              Nigeria's most trusted<br />
              savings system.<br />
              <em>Now on OPay.</em>
            </h1>
            <p className="rp-body fade-up" style={{ fontSize: "17px", lineHeight: 1.7 }}>
              AjoStack digitises ajo and esusu circles on OPay's payment rails —
              preserving the communal trust Nigerians already love,
              and adding a Gemini AI credit identity on top.
            </p>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }} className="fade-up">
              <Link href="/app/dashboard" className="rp-btn-cta">
                Start Your Circle ↗
              </Link>
              <a href="#problem" className="rp-btn-ghost">
                See the problem
              </a>
            </div>
            <div style={{ display: "flex", gap: "1.5rem", paddingTop: "0.5rem", flexWrap: "wrap" }} className="fade-up">
              {[
                { val: "14.6M", label: "ajo participants" },
                { val: "₦0", label: "credit trail today" },
                { val: "100%", label: "digital, zero cash" },
              ].map(stat => (
                <div key={stat.label}>
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "20px", fontWeight: 500, color: "var(--accent-green)", lineHeight: 1 }}>{stat.val}</p>
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.08em", color: "var(--text-muted)", textTransform: "uppercase", marginTop: "0.25rem" }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <DemoCard />
          </div>
        </div>
      </section>

      {/* ——— PROBLEM (dark) ——— */}
      <section className="rp-section-dark" id="problem">
        <span className="rp-eyebrow-dark">02 — The Problem</span>
        <div className="rp-two-col-wide">
          <div>
            <h2 className="rp-big-heading">
              14.6 million<br />
              <em>invisibles.</em>
            </h2>
            <p className="rp-body-dark" style={{ marginBottom: "1.25rem" }}>
              Nigerians who save faithfully every week — but generate zero formal credit history.
              When the organiser disappears, there is no digital trail.
              No evidence. No recourse.
            </p>
            <div className="grid-2" style={{ marginTop: "1.5rem" }}>
              {[
                { n: "58%", l: "of GDP is informal" },
                { n: "70%", l: "of participants are women" },
                { n: "26%", l: "adults financially excluded" },
                { n: "30–50%", l: "monthly interest from loan sharks" },
              ].map(s => (
                <div key={s.l} style={{ borderLeft: "2px solid rgba(212,168,83,0.3)", paddingLeft: "0.75rem" }}>
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "20px", fontWeight: 500, color: "#D4A853", lineHeight: 1 }}>{s.n}</p>
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "#8E8E80", letterSpacing: "0.06em", marginTop: "0.2rem" }}>{s.l}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <span className="rp-eyebrow-dark">03 — What's Been Tried</span>
            <h3 className="rp-sub-heading-dark">
              Why nothing else builds a <em>credit trail.</em>
            </h3>
            <table className="rp-compare-table">
              <tbody>
                {competitors.map(c => (
                  <tr key={c.name}>
                    <td>{c.name}</td>
                    <td>{c.what}</td>
                    <td>{c.why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ——— HOW IT WORKS (light) ——— */}
      <section className="rp-section" id="howitworks">
        <span className="rp-eyebrow">04 — How It Works</span>
        <div style={{ maxWidth: "720px" }}>
          <h2 className="rp-sub-heading" style={{ marginBottom: "3rem" }}>
            The ajo circle you know.<br />
            <em>Infrastructure you can trust.</em>
          </h2>
        </div>
        <div className="grid-2" style={{ gap: "2rem" }}>
          {howItWorksSteps.map(step => (
            <div key={step.num} className="rp-card-raised">
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "28px", fontWeight: 500, color: "var(--accent-green)", opacity: 0.3, lineHeight: 1, display: "block", marginBottom: "1rem" }}>
                {step.num}
              </span>
              <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "18px", fontWeight: 500, color: "var(--text-primary)", marginBottom: "0.75rem", lineHeight: 1.3 }}>
                {step.heading}
              </h3>
              <p className="rp-body" style={{ fontSize: "14px" }}>{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ——— AJOSCORE TEASER (dark) ——— */}
      <section className="rp-section-dark" id="score">
        <span className="rp-eyebrow-dark">05 — AjoScore</span>
        <div className="rp-two-col" style={{ alignItems: "center" }}>
          <div>
            <h2 className="rp-big-heading">
              Your savings behaviour.<br />
              <em>Finally visible.</em>
            </h2>
            <p className="rp-body-dark" style={{ marginBottom: "1.5rem" }}>
              Google Gemini analyses your contribution history —
              consistency, recovery, tenure, cycle completion — and produces
              an AjoScore. The first formal financial identity millions of
              Nigerians will ever have.
            </p>
            <Link href="/app/score" className="rp-btn-cta">
              See your AjoScore ↗
            </Link>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <ScoreGauge score={782} max={1000} dark={true} />
          </div>
        </div>
      </section>

      {/* ——— FOOTER (light) ——— */}
      <footer className="rp-section" style={{ paddingTop: "3rem", paddingBottom: "3rem", borderTop: "0.5px solid var(--border-default)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "13px", fontWeight: 500, color: "var(--text-primary)", marginBottom: "0.25rem" }}>◈ AjoStack</p>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-ghost)", letterSpacing: "0.05em" }}>
              OPay x Google National Innovation Challenge 2026 · Fintech & Digital Payments
            </p>
          </div>
          <div style={{ display: "flex", gap: "1rem" }}>
            {["OPay Checkout API", "Google Gemini 1.5 Flash", "Africa's Talking USSD", "Supabase"].map(t => (
              <span key={t} className="badge">{t}</span>
            ))}
          </div>
        </div>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-ghost)", marginTop: "1.5rem", letterSpacing: "0.04em" }}>
          USSD fallback: *347# — no data connection required. Every ajo circle includes USSD access for basic phone users.
        </p>
      </footer>
    </main>
  );
}
