"use client";
import { useState } from "react";
import Link from "next/link";
import { currentUser } from "@/data/mock";

const PURPOSES = ["Medical emergency", "Business capital", "School fees", "Home repair", "Other"];
const MIN = 10000;
const MAX = 150000;
const STEP = 5000;
const RATE = 0.025;
const TERM_WEEKS = 4;

function fmt(n) { return "₦" + n.toLocaleString(); }

function genRef() {
  return "AJS-" + Date.now().toString(36).toUpperCase() + "-OPAY";
}

export default function LoanApply() {
  const [amount, setAmount] = useState(75000);
  const [purpose, setPurpose] = useState(PURPOSES[0]);
  const [stage, setStage] = useState("form"); // form | processing | success
  const [step, setStep] = useState(0);
  const [ref] = useState(genRef);

  const repayment = Math.ceil((amount + amount * RATE) / TERM_WEEKS);
  const total = amount + Math.ceil(amount * RATE);
  const fee = Math.ceil(amount * RATE);

  function handleApply() {
    setStage("processing");
    setStep(1);
    setTimeout(() => setStep(2), 1600);
    setTimeout(() => setStep(3), 3000);
    setTimeout(() => setStage("success"), 4500);
  }

  if (stage === "processing") {
    return (
      <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-primary)" }}>
        <div style={{ textAlign: "center", maxWidth: "420px", padding: "2rem" }}>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "2.5rem" }}>
            Processing your loan
          </p>
          {[
            { label: "Checking AjoScore", done: step >= 1 },
            { label: "Verifying OPay wallet", done: step >= 2 },
            { label: "Disbursing funds", done: step >= 3 },
          ].map((s, i) => (
            <div key={s.label} style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem" }}>
              <div style={{
                width: "32px", height: "32px", borderRadius: "50%",
                border: "0.5px solid",
                borderColor: s.done ? "var(--accent-green)" : "var(--border-default)",
                background: s.done ? "var(--accent-green-tint)" : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
                transition: "all 0.4s ease",
              }}>
                {s.done ? (
                  <span style={{ color: "var(--accent-green)", fontSize: "14px" }}>✓</span>
                ) : (
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-ghost)" }}>{String(i + 1).padStart(2, "0")}</span>
                )}
              </div>
              <div style={{ textAlign: "left" }}>
                <p style={{ fontFamily: "var(--font-serif)", fontSize: "15px", fontWeight: 500, color: s.done ? "var(--text-primary)" : "var(--text-ghost)" }}>
                  {s.label}
                </p>
                {s.done && i === 0 && (
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--accent-green)", marginTop: "0.2rem" }}>
                    Score: 782 — Eligible ✓
                  </p>
                )}
                {s.done && i === 1 && (
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--accent-green)", marginTop: "0.2rem" }}>
                    Wallet ****5678 verified ✓
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    );
  }

  if (stage === "success") {
    return (
      <main style={{ minHeight: "100vh", background: "#0E0E0C", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", maxWidth: "500px", padding: "2rem" }}>
          <div style={{
            width: "64px", height: "64px", borderRadius: "50%",
            background: "rgba(31,74,53,0.2)", border: "2px solid #1F4A35",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 2rem", fontSize: "24px",
            animation: "fadeUp 0.5s ease forwards",
          }}>
            ✓
          </div>
          <span className="rp-eyebrow-dark" style={{ display: "block", marginBottom: "1rem", animation: "fadeUp 0.5s ease 0.1s forwards", opacity: 0 }}>
            Loan Disbursed
          </span>
          <h1 className="rp-big-heading" style={{ fontSize: "40px", marginBottom: "0.75rem", animation: "fadeUp 0.5s ease 0.2s forwards", opacity: 0 }}>
            {fmt(amount)} sent.<br />
            <em>Welcome to credit.</em>
          </h1>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#5A5A52", marginBottom: "0.25rem", animation: "fadeUp 0.5s ease 0.3s forwards", opacity: 0 }}>
            Sent to OPay wallet ****5678
          </p>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "#3A3A34", letterSpacing: "0.05em", marginBottom: "2rem", animation: "fadeUp 0.5s ease 0.3s forwards", opacity: 0 }}>
            Ref: {ref}
          </p>
          <div className="rp-card-tinted" style={{ textAlign: "left", margin: "0 0 2rem", background: "rgba(31,74,53,0.12)", animation: "fadeUp 0.5s ease 0.4s forwards", opacity: 0 }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "#D4A853", marginBottom: "0.25rem", letterSpacing: "0.06em" }}>
              Repayment schedule
            </p>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "13px", color: "#9A9A8E" }}>
              {fmt(repayment)}/week × {TERM_WEEKS} weeks · Auto-deducted from ajo contributions
            </p>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "#5A5A52", marginTop: "0.25rem" }}>
              Total repayment: {fmt(total)} (incl. 2.5% flat fee)
            </p>
          </div>
          <Link href="/app/dashboard" className="rp-btn-cta" style={{ animation: "fadeUp 0.5s ease 0.5s forwards", opacity: 0 }}>
            Back to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main>
      {/* Hero (dark) */}
      <section className="rp-section-dark">
        <span className="rp-eyebrow-dark">12 — Micro-Credit</span>
        <h1 className="rp-big-heading" style={{ maxWidth: "560px" }}>
          Emergency capital.<br />
          <em>On your own terms.</em>
        </h1>
        <p className="rp-body-dark">
          Your AjoScore of {currentUser.ajoScore} qualifies you for up to {fmt(currentUser.maxLoan)}.
          Disbursed instantly to your OPay wallet. Repaid through your ajo contributions.
        </p>
      </section>

      {/* Form (light) */}
      <section className="rp-section">
        <span className="rp-eyebrow">Loan Application</span>
        <div className="rp-two-col" style={{ alignItems: "start" }}>
          {/* Calculator */}
          <div className="rp-card-raised">
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-ghost)", marginBottom: "1.5rem" }}>
              Loan Calculator
            </p>

            {/* Eligibility */}
            <div className="rp-card-tinted" style={{ marginBottom: "1.5rem" }}>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--accent-green)", letterSpacing: "0.06em", marginBottom: "0.25rem" }}>
                AjoScore {currentUser.ajoScore} — Eligible
              </p>
              <p style={{ fontFamily: "var(--font-serif)", fontSize: "14px", color: "var(--text-primary)" }}>
                Maximum available: <strong>{fmt(currentUser.maxLoan)}</strong>
              </p>
            </div>

            {/* Amount slider */}
            <label style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", display: "block", marginBottom: "0.5rem" }}>
              Loan amount
            </label>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "28px", fontWeight: 500, color: "var(--accent-green)", lineHeight: 1, marginBottom: "0.75rem" }}>
              {fmt(amount)}
            </p>
            <input
              type="range"
              min={MIN} max={MAX} step={STEP}
              value={amount}
              onChange={e => setAmount(Number(e.target.value))}
              style={{ width: "100%", accentColor: "var(--accent-green)", marginBottom: "0.5rem", cursor: "pointer" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-ghost)" }}>{fmt(MIN)}</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-ghost)" }}>{fmt(MAX)}</span>
            </div>

            {/* Repayment summary */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "0.5px solid var(--border-default)" }}>
              {[
                { label: "Weekly repayment", val: fmt(repayment) },
                { label: "Term", val: `${TERM_WEEKS} weeks` },
                { label: "Flat fee (2.5%)", val: fmt(fee) },
                { label: "Total repayment", val: fmt(total) },
              ].map(s => (
                <div key={s.label}>
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-ghost)", marginBottom: "0.2rem" }}>{s.label}</p>
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "15px", fontWeight: 500, color: "var(--text-primary)" }}>{s.val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Application form */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div className="rp-card-raised">
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-ghost)", marginBottom: "1.25rem" }}>
                Application Details
              </p>

              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", display: "block", marginBottom: "0.4rem" }}>
                  Loan purpose
                </label>
                <select
                  value={purpose}
                  onChange={e => setPurpose(e.target.value)}
                  style={{
                    width: "100%", padding: "0.65rem 0.75rem",
                    background: "var(--bg-sunken)",
                    border: "0.5px solid var(--border-default)",
                    borderRadius: "var(--radius-md)",
                    fontFamily: "var(--font-mono)", fontSize: "13px",
                    color: "var(--text-primary)",
                    cursor: "pointer", appearance: "none",
                  }}
                >
                  {PURPOSES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", display: "block", marginBottom: "0.4rem" }}>
                  Disbursement wallet
                </label>
                <div style={{
                  padding: "0.65rem 0.75rem",
                  background: "var(--bg-sunken)",
                  border: "0.5px solid var(--border-default)",
                  borderRadius: "var(--radius-md)",
                  fontFamily: "var(--font-mono)", fontSize: "13px", color: "var(--text-secondary)",
                }}>
                  OPay wallet ****5678 — {currentUser.name}
                </div>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", display: "block", marginBottom: "0.4rem" }}>
                  Repayment method
                </label>
                <div style={{
                  padding: "0.65rem 0.75rem",
                  background: "var(--accent-green-tint)",
                  border: "0.5px solid var(--accent-green-border)",
                  borderRadius: "var(--radius-md)",
                  fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--accent-green)",
                }}>
                  ✓ Auto-deduct from weekly ajo contributions
                </div>
                {/* Payout-clash offset notice */}
                <div style={{ marginTop: "0.5rem", padding: "0.6rem 0.75rem", background: "rgba(0,0,0,0.03)", border: "0.5px solid var(--border-default)", borderRadius: "var(--radius-md)" }}>
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-muted)", lineHeight: 1.6, letterSpacing: "0.02em" }}>
                    Your payout falls in Week 9 (Awka circle). Repayment will automatically start <strong>Week 10</strong> to avoid clashing with the week you collect.
                  </p>
                </div>
              </div>

              <button className="rp-btn-cta" style={{ width: "100%", justifyContent: "center" }} onClick={handleApply}>
                Apply for {fmt(amount)} ↗
              </button>
            </div>

            {/* Risk info */}
            <div className="rp-scorer">
              <strong>Zero predatory rates.</strong> AjoStack charges a flat 2.5% fee — versus 30–50% monthly from informal lenders.
              Repayment is deducted automatically from your ajo contributions so you never miss a payment.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
