"use client";
import { useState, useRef, useEffect } from "react";

const FLOWS = {
  root: {
    prompt: "Welcome to AjoStack\n*347*AJOSTACK#\n\n1. Join a circle\n2. Check my balance\n3. Confirm contribution\n4. Check my AjoScore\n5. Apply for micro-loan",
    options: {
      "1": "join_code",
      "2": "balance",
      "3": "confirm_contrib",
      "4": "score",
      "5": "loan_menu",
    },
  },
  join_code: {
    prompt: "JOIN A CIRCLE\n\nEnter the 6-digit circle code\nyour organiser gave you:\n\n(Type AWK-001 to demo)",
    options: { "AWK-001": "join_preview", "0": "root" },
    fallback: "join_not_found",
  },
  join_not_found: {
    prompt: "Circle not found.\nCheck the code with your organiser.\n\n0. Back to menu",
    options: { "0": "root" },
  },
  join_preview: {
    prompt: "CIRCLE FOUND\nAwka Market Women Circle\n₦5,000/week · 12 members\nWeek 7 of 12\n\nOrganiser: Chioma Obi\nYour turn: Week 9\n\n1. Join this circle\n0. Back",
    options: { "1": "join_success", "0": "root" },
  },
  join_success: {
    prompt: "✓ JOINED SUCCESSFULLY\n\nAwka Market Women Circle\nFirst contribution due: Friday Jun 6\nAmount: ₦5,000\n\nYou will receive an SMS reminder\n24 hours before each debit.\n\n0. Back to menu",
    options: { "0": "root" },
  },
  balance: {
    prompt: "YOUR BALANCE\n\nActive circles: 3\nTotal contributed this month:\n₦15,000\n\nNext payout (your turn):\nWeek 9 · ₦60,000\nDate: ~Jun 27\n\n1. See all circles\n0. Back",
    options: { "1": "balance_circles", "0": "root" },
  },
  balance_circles: {
    prompt: "YOUR CIRCLES\n\n1. Awka Market Women\n   ₦5,000/wk · Wk 7/12\n\n2. Unizik Friends Esusu\n   ₦10,000/mo · Wk 5/8\n\n3. Tech Bros Thrift\n   ₦20,000/mo · Wk 2/5\n\n0. Back",
    options: { "0": "root" },
  },
  confirm_contrib: {
    prompt: "CONFIRM CONTRIBUTION\n\nCircle: Awka Market Women\nAmount: ₦5,000\nFrom: OPay wallet ****5678\nWeek 7 of 12\n\n1. Confirm — debit ₦5,000\n2. I need more time (grace)\n0. Cancel",
    options: { "1": "contrib_success", "2": "contrib_grace", "0": "root" },
  },
  contrib_success: {
    prompt: "✓ CONTRIBUTION CONFIRMED\n\n₦5,000 debited from ****5678\nRef: OPY-2026-0530-A4\nTime: 10:24 AM\n\nCircle: Awka Market Women Wk 7\nAll 12 members now confirmed.\n\nPayout to Chioma Obi on Fri Jun 6.\n\n0. Back to menu",
    options: { "0": "root" },
  },
  contrib_grace: {
    prompt: "GRACE PERIOD REQUESTED\n\nYou have 48 hours to contribute\nbefore your record shows as Late.\n\nDeadline: Sun Jun 1, 10:24 AM\n\nWe will send you 2 SMS reminders.\nYour circle members are NOT notified\nuntil the grace period expires.\n\n0. Back to menu",
    options: { "0": "root" },
  },
  score: {
    prompt: "YOUR AJOSCORE\n\nScore: 782 / 1000\nRating: Excellent\n\nBreakdown:\nOn-time payments:  94%  (35%)\nCompleted cycles:  80%  (25%)\nConsistency:       88%  (20%)\nGroup tenure:      67%  (12%)\nLate recovery:    100%   (8%)\n\nMax loan eligible: ₦150,000\n\n1. Apply for loan\n0. Back",
    options: { "1": "loan_menu", "0": "root" },
  },
  loan_menu: {
    prompt: "MICRO-LOAN\n\nYour AjoScore: 782\nMax eligible: ₦150,000\nFlat fee: 2.5%\nTerm: 4 weeks\nRepayment: Auto from ajo contributions\n\nSelect amount:\n1. ₦25,000\n2. ₦50,000\n3. ₦75,000\n4. ₦100,000\n0. Back",
    options: { "1": "loan_confirm_25", "2": "loan_confirm_50", "3": "loan_confirm_75", "4": "loan_confirm_100", "0": "root" },
  },
  loan_confirm_25: {
    prompt: "LOAN CONFIRMATION\n\nAmount: ₦25,000\nFee (2.5%): ₦625\nTotal repay: ₦25,625\nWeekly deduction: ₦6,407\nTerm: 4 weeks\n\nDisbursed to: OPay ****5678\nRepayment: Auto from contributions\n\n1. Confirm loan\n0. Cancel",
    options: { "1": "loan_success", "0": "root" },
  },
  loan_confirm_50: {
    prompt: "LOAN CONFIRMATION\n\nAmount: ₦50,000\nFee (2.5%): ₦1,250\nTotal repay: ₦51,250\nWeekly deduction: ₦12,813\nTerm: 4 weeks\n\nDisbursed to: OPay ****5678\nRepayment: Auto from contributions\n\n1. Confirm loan\n0. Cancel",
    options: { "1": "loan_success", "0": "root" },
  },
  loan_confirm_75: {
    prompt: "LOAN CONFIRMATION\n\nAmount: ₦75,000\nFee (2.5%): ₦1,875\nTotal repay: ₦76,875\nWeekly deduction: ₦19,219\nTerm: 4 weeks\n\nDisbursed to: OPay ****5678\nRepayment: Auto from contributions\n\n1. Confirm loan\n0. Cancel",
    options: { "1": "loan_success", "0": "root" },
  },
  loan_confirm_100: {
    prompt: "LOAN CONFIRMATION\n\nAmount: ₦100,000\nFee (2.5%): ₦2,500\nTotal repay: ₦102,500\nWeekly deduction: ₦25,625\nTerm: 4 weeks\n\nDisbursed to: OPay ****5678\nRepayment: Auto from contributions\n\n1. Confirm loan\n0. Cancel",
    options: { "1": "loan_success", "0": "root" },
  },
  loan_success: {
    prompt: "✓ LOAN DISBURSED\n\nFunds sent to OPay ****5678.\nCheck your OPay app to confirm.\n\nRef: AJS-LOAN-2026-0530\nTime: 10:31 AM\n\nRepayments begin next Friday.\nYou will receive weekly SMS\nbefore each deduction.\n\n2.5% flat. No hidden charges.\n\n0. Back to menu",
    options: { "0": "root" },
  },
};

export default function UssdSimulator() {
  const [nodeKey, setNodeKey] = useState("root");
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const node = FLOWS[nodeKey];

  useEffect(() => { inputRef.current?.focus(); }, [nodeKey]);

  function handleSubmit(e) {
    e.preventDefault();
    const val = input.trim();
    setInput("");
    setError("");

    const next = node.options[val];
    if (next) {
      setHistory(h => [...h, { node: nodeKey, input: val }]);
      setNodeKey(next);
    } else if (node.fallback) {
      setHistory(h => [...h, { node: nodeKey, input: val }]);
      setNodeKey(node.fallback);
    } else {
      setError("Invalid option. Try again.");
    }
  }

  function reset() {
    setNodeKey("root");
    setHistory([]);
    setInput("");
    setError("");
  }

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <section className="rp-section">
        <span className="rp-eyebrow">USSD — *347*AJOSTACK#</span>
        <div className="rp-two-col" style={{ alignItems: "start" }}>

          {/* Left: context */}
          <div>
            <h2 className="rp-sub-heading" style={{ marginBottom: "1rem" }}>
              No data. No smartphone.<br />
              <em>Still in the circle.</em>
            </h2>
            <p className="rp-body" style={{ marginBottom: "2rem" }}>
              AjoStack's USSD layer reaches every member — including the market woman on a ₦5,000 phone with no data plan.
              Dial <strong style={{ fontFamily: "var(--font-mono)" }}>*347#</strong> to contribute, check balance, or apply for a micro-loan.
              Works on any GSM network. No internet required.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[
                { t: "3G not required", b: "Runs on any GSM signal. Even 2G." },
                { t: "48h grace window", b: "Missed a debit day? USSD lets you trigger it within 48h before Late is recorded." },
                { t: "Session resumable", b: "Network drop? Your session state is held for 10 minutes. Pick up where you left off." },
                { t: "Pidgin prompts", b: "All USSD text is available in both English and Pidgin based on your registered preference." },
              ].map(f => (
                <div key={f.t} className="rp-card-tinted">
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: 500, color: "var(--accent-green)", marginBottom: "0.2rem" }}>{f.t}</p>
                  <p style={{ fontFamily: "var(--font-serif)", fontSize: "13px", color: "var(--text-secondary)" }}>{f.b}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: phone simulator */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ width: "300px" }}>
              {/* Phone bezel */}
              <div style={{ background: "#111", borderRadius: "24px", padding: "16px", boxShadow: "0 0 0 8px #222, 0 20px 60px rgba(0,0,0,0.4)" }}>
                {/* Screen */}
                <div style={{ background: "#F0F4E8", borderRadius: "12px", overflow: "hidden", minHeight: "420px", display: "flex", flexDirection: "column" }}>
                  {/* Carrier bar */}
                  <div style={{ background: "#1F4A35", padding: "6px 12px", display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "#ECEAE4", letterSpacing: "0.06em" }}>MTN NG · 2G</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "#ECEAE4" }}>10:31</span>
                  </div>

                  {/* USSD header */}
                  <div style={{ background: "#E0E8D4", padding: "8px 12px", borderBottom: "1px solid #C8D4B8" }}>
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "#4A5A3A", letterSpacing: "0.06em" }}>*347*AJOSTACK# · AjoStack</p>
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, padding: "12px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <pre style={{ fontFamily: "var(--font-mono)", fontSize: "11px", lineHeight: 1.6, color: "#1A2A14", whiteSpace: "pre-wrap", margin: 0 }}>
                      {node.prompt}
                    </pre>

                    <div>
                      {error && (
                        <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "#C0392B", marginBottom: "6px" }}>{error}</p>
                      )}
                      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "4px" }}>
                        <input
                          ref={inputRef}
                          type="text"
                          value={input}
                          onChange={e => setInput(e.target.value)}
                          placeholder="Enter option..."
                          style={{ flex: 1, fontFamily: "var(--font-mono)", fontSize: "12px", padding: "6px 8px", border: "1px solid #C8D4B8", borderRadius: "4px", background: "#FFFFFF", color: "#1A2A14", outline: "none" }}
                        />
                        <button type="submit" style={{ background: "#1F4A35", color: "#ECEAE4", border: "none", borderRadius: "4px", padding: "6px 10px", fontFamily: "var(--font-mono)", fontSize: "11px", cursor: "pointer" }}>
                          OK
                        </button>
                      </form>
                    </div>
                  </div>
                </div>

                {/* Home button */}
                <div style={{ display: "flex", justifyContent: "center", marginTop: "12px" }}>
                  <button onClick={reset} style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#2A2A2A", border: "2px solid #444", cursor: "pointer" }} title="Reset / End session" />
                </div>
              </div>

              <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-ghost)", textAlign: "center", marginTop: "1rem", letterSpacing: "0.05em" }}>
                Press the circle button to reset. Type options and press OK.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
