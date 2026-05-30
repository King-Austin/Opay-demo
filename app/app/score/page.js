"use client";
import { useState } from "react";
import Link from "next/link";
import ScoreGauge from "@/components/ScoreGauge";
import ContributionBar from "@/components/ContributionBar";
import { currentUser, scoreFactors, groups } from "@/data/mock";

/* Building state — shown to brand-new users with < 4 contributions */
function BuildingState({ onToggle }) {
  const contributionsDone = 1;
  const contributionsNeeded = 4;
  const pct = (contributionsDone / contributionsNeeded) * 100;

  return (
    <main>
      <section className="rp-section-dark" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <span className="rp-eyebrow-dark">09 — AjoScore</span>
        <div className="rp-two-col" style={{ alignItems: "center" }}>
          <div>
            <h1 className="rp-big-heading">
              Your score is<br />
              <em>building.</em>
            </h1>
            <p className="rp-body-dark" style={{ marginBottom: "1.5rem" }}>
              Complete {contributionsNeeded} contributions to unlock your AjoScore.
              You're {contributionsDone} in. Every on-time payment from here builds your
              first formal credit identity.
            </p>

            {/* Progress to unlock */}
            <div style={{ maxWidth: "320px", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "#B4B4A6" }}>
                  {contributionsDone} of {contributionsNeeded} contributions
                </span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "#D4A853" }}>
                  {contributionsNeeded - contributionsDone} to go
                </span>
              </div>
              <div style={{ height: "3px", background: "rgba(255,255,255,0.08)", borderRadius: "2px", overflow: "hidden" }}>
                <div style={{ height: "3px", width: `${pct}%`, background: "#D4A853", borderRadius: "2px", transition: "width 0.8s ease" }} />
              </div>
            </div>

            <div className="rp-card-tinted" style={{ background: "rgba(212,168,83,0.1)", borderColor: "rgba(212,168,83,0.3)", borderLeftColor: "#D4A853", maxWidth: "380px" }}>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "#D4A853", lineHeight: 1.6 }}>
                No score yet — that's normal. We never show a "0". Your discipline is being recorded from contribution one.
              </p>
            </div>

            <button onClick={onToggle} style={{ marginTop: "2rem", background: "none", border: "0.5px solid rgba(255,255,255,0.15)", borderRadius: "var(--radius-md)", padding: "0.5rem 1rem", fontFamily: "var(--font-mono)", fontSize: "10px", color: "#8E8E80", cursor: "pointer", letterSpacing: "0.06em" }}>
              ⤺ Demo: view as established user (Ngozi, 782)
            </button>
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            {/* Locked gauge */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
              <div style={{ width: "200px", height: "200px", borderRadius: "50%", border: "6px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative" }}>
                <span style={{ fontSize: "28px", marginBottom: "0.5rem", opacity: 0.5 }}>🔒</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.12em", color: "#8E8E80", textTransform: "uppercase" }}>Locked</span>
              </div>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "#6E6E62", textAlign: "center", maxWidth: "200px" }}>
                Unlocks after {contributionsNeeded} contributions
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function AjoScorePage() {
  const [viewMode, setViewMode] = useState("established"); // "established" | "building"
  const scoreColor = currentUser.ajoScore >= 750 ? "Excellent" : currentUser.ajoScore >= 600 ? "Good" : "Fair";

  if (viewMode === "building") {
    return <BuildingState onToggle={() => setViewMode("established")} />;
  }

  return (
    <main>
      {/* Dark hero */}
      <section className="rp-section-dark">
        <span className="rp-eyebrow-dark">09 — AjoScore</span>
        <div className="rp-two-col" style={{ alignItems: "center" }}>
          <div>
            <h1 className="rp-big-heading">
              Your credit identity.<br />
              <em>Earned, not given.</em>
            </h1>
            <p className="rp-body-dark" style={{ marginBottom: "1.5rem" }}>
              Google Gemini analyses your ajo contribution history across all your circles
              and produces a score that represents your financial discipline —
              behaviour you're already doing, now formally visible.
            </p>
            <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
              <Link href="/app/loan" className="rp-btn-cta">
                Apply for Micro-Loan ↗
              </Link>
              <button onClick={() => setViewMode("building")} style={{ background: "none", border: "0.5px solid rgba(255,255,255,0.15)", borderRadius: "var(--radius-md)", padding: "0.5rem 1rem", fontFamily: "var(--font-mono)", fontSize: "10px", color: "#8E8E80", cursor: "pointer", letterSpacing: "0.06em" }}>
                Demo: new-user "Building" state →
              </button>
            </div>

            {/* Score breakdown preview */}
            <div style={{ marginTop: "2rem", display: "flex", gap: "1.5rem" }}>
              {[
                { label: "On-time rate", val: "94%" },
                { label: "Cycles done", val: "4 of 5" },
                { label: "Active circles", val: groups.length },
              ].map(s => (
                <div key={s.label}>
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "18px", fontWeight: 500, color: "#D4A853", lineHeight: 1 }}>{s.val}</p>
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "#8E8E80", letterSpacing: "0.06em", marginTop: "0.25rem" }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <ScoreGauge score={currentUser.ajoScore} max={1000} dark={true} />
          </div>
        </div>
      </section>

      {/* Light breakdown */}
      <section className="rp-section">
        <span className="rp-eyebrow">10 — Score Breakdown</span>
        <div className="rp-two-col" style={{ alignItems: "start" }}>
          <div>
            <h2 className="rp-sub-heading" style={{ marginBottom: "2rem" }}>
              Five signals.<br />
              <em>One number.</em>
            </h2>
            <p className="rp-body" style={{ marginBottom: "2rem" }}>
              Gemini weights five behavioural signals from your ajo history.
              Each signals a different dimension of financial reliability.
              Together they are more predictive than a bank statement.
            </p>

            {/* Gemini insight */}
            <div className="rp-scorer">
              <p style={{ marginBottom: "0.25rem", fontWeight: 500 }}>Gemini AI Analysis · May 30, 2026</p>
              <p>
                Ngozi demonstrates strong financial discipline across 3 active circles.
                94% on-time rate, zero missed cycles, and consistent ₦5,000–₦20,000 contribution bands.
                One late payment recovered same-day (Week 3, Awka circle). Eligible for micro-credit up to <strong>₦150,000</strong>.
              </p>
            </div>
          </div>

          <div className="rp-card-raised">
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-ghost)", marginBottom: "1.5rem" }}>
              Weighted Rubric — 5 signals
            </p>
            {scoreFactors.map(f => (
              <ContributionBar key={f.label} label={f.label} weight={f.weight} score={f.score} note={f.note} />
            ))}
          </div>
        </div>
      </section>

      {/* Dark CTA */}
      <section className="rp-section-dark">
        <span className="rp-eyebrow-dark">11 — Micro-Credit</span>
        <div style={{ maxWidth: "600px" }}>
          <h2 className="rp-big-heading">
            Score of {currentUser.ajoScore}.<br />
            <em>₦150,000 available.</em>
          </h2>
          <p className="rp-body-dark" style={{ marginBottom: "2rem" }}>
            Your AjoScore unlocks OPay-backed micro-loans disbursed directly
            to your wallet. Repayment is automatic — deducted from your
            future ajo contributions. No bank visit. No collateral.
          </p>
          <Link href="/app/loan" className="rp-btn-cta">
            Apply Now ↗
          </Link>
        </div>
      </section>
    </main>
  );
}
