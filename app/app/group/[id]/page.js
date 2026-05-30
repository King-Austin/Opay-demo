"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import RecDot from "@/components/RecDot";
import LedgerTable from "@/components/LedgerTable";
import { groups, awkaMembers, ledgerEntries } from "@/data/mock";

function fmt(n) { return "₦" + n.toLocaleString(); }

function Countdown({ targetDate }) {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => {
      const diff = new Date(targetDate) - new Date();
      if (diff <= 0) { setTime("Payout today!"); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setTime(`${d}d ${h}h ${m}m`);
    };
    tick();
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, [targetDate]);
  return <span style={{ fontFamily: "var(--font-mono)", fontSize: "13px", color: "var(--accent-green)", fontVariantNumeric: "tabular-nums" }}>{time}</span>;
}

export default function GroupDetail({ params }) {
  const { id } = params;
  const group = groups.find(g => g.id === id) || groups[0];
  const [toastVisible, setToastVisible] = useState(false);
  const [contributed, setContributed] = useState(false);

  function handleContribute() {
    if (contributed) return;
    setToastVisible(true);
    setContributed(true);
    setTimeout(() => setToastVisible(false), 3500);
  }

  const paid = awkaMembers.filter(m => m.paid).length;
  const pendingCount = awkaMembers.length - paid;

  return (
    <main style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      {/* Toast */}
      <div className={`toast${toastVisible ? " visible" : ""}`}>
        ✓ ₦5,000 debited from OPay wallet ****5678 · Ref: OPY-2026-0530-A4
      </div>

      {/* Header */}
      <div style={{ padding: "2.5rem 2.5rem 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
          <Link href="/app/dashboard" style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-muted)", letterSpacing: "0.06em" }}>
            ← Dashboard
          </Link>
          <span style={{ color: "var(--border-strong)" }}>/</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-ghost)" }}>{group.name}</span>
        </div>
        <span className="rp-eyebrow">{group.isOrganiser ? "07 — Circle (Organiser)" : "07 — Circle Detail"}</span>

        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
              <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(24px, 3.5vw, 40px)", fontWeight: 600, lineHeight: 1, letterSpacing: "-0.02em", color: "var(--text-primary)" }}>
                {group.name}
              </h1>
              <RecDot label="Live" />
            </div>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--text-muted)" }}>
              {group.members} members · {fmt(group.contribution)} {group.freq} · Week {group.currentWeek} of {group.cycle}
            </p>
          </div>
          <button
            className="rp-btn-cta"
            onClick={handleContribute}
            style={{ opacity: contributed ? 0.5 : 1, fontSize: "13px" }}
          >
            {contributed ? "✓ Contributed this week" : `Contribute ${fmt(group.contribution)} ↗`}
          </button>
        </div>
      </div>

      {/* Main grid */}
      <div style={{ padding: "0 2.5rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
        {/* Rotation schedule */}
        <div className="rp-card-raised">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "17px", fontWeight: 500, color: "var(--text-primary)" }}>
              Rotation Schedule
            </h3>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-ghost)" }}>
              {paid} paid · {pendingCount} pending
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            {awkaMembers.map(m => (
              <div key={m.id} style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.55rem 0.75rem",
                borderRadius: "var(--radius-sm)",
                background: m.isRecipient ? "var(--accent-green-tint)" : m.isMe ? "rgba(0,0,0,0.03)" : "transparent",
                border: m.isRecipient ? "0.5px solid var(--accent-green-border)" : "0.5px solid transparent",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-ghost)", width: "20px" }}>
                    {String(m.turnWeek).padStart(2, "0")}
                  </span>
                  <span style={{ fontFamily: "var(--font-serif)", fontSize: "14px", color: m.isRecipient ? "var(--accent-green)" : "var(--text-primary)", fontWeight: m.isMe ? 500 : 400 }}>
                    {m.name}{m.isMe ? " (you)" : ""}
                  </span>
                  {m.isRecipient && (
                    <span className="badge badge-green">This week's payout</span>
                  )}
                </div>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: m.paid ? "var(--accent-green)" : "var(--text-ghost)" }}>
                  {m.paid ? "✓" : "○"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Payout + stats */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* Payout card */}
          <div className="rp-card-tinted" style={{ padding: "1.25rem 1.25rem 1.25rem 1.25rem", borderRadius: "0 var(--radius-lg) var(--radius-lg) 0" }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--accent-green)", marginBottom: "0.5rem" }}>
              This week's payout
            </p>
            <p style={{ fontFamily: "var(--font-serif)", fontSize: "22px", fontWeight: 500, color: "var(--text-primary)", lineHeight: 1.2, marginBottom: "0.25rem" }}>
              {fmt(group.totalPot)} → Chioma Obi
            </p>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-muted)" }}>
              OPay wallet disbursement · {group.nextPayoutDate}
            </p>
            <div style={{ marginTop: "0.75rem" }}>
              <Countdown targetDate="2026-06-06T17:00:00" />
            </div>
          </div>

          {/* Group stats */}
          <div className="rp-card-raised" style={{ padding: "1.25rem" }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-ghost)", marginBottom: "1rem" }}>
              Group Health
            </p>
            {[
              { label: "On-time rate this cycle", val: "92%", bar: 92 },
              { label: "Cycle completion", val: `${Math.round((group.currentWeek/group.cycle)*100)}%`, bar: Math.round((group.currentWeek/group.cycle)*100) },
              { label: "Members contributing", val: `${paid}/${group.members}`, bar: Math.round((paid/group.members)*100) },
            ].map(item => (
              <div key={item.label} style={{ marginBottom: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                  <span style={{ fontFamily: "var(--font-serif)", fontSize: "13px", color: "var(--text-secondary)" }}>{item.label}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--accent-green)" }}>{item.val}</span>
                </div>
                <div className="rp-bar-track">
                  <div className="rp-bar-fill" style={{ width: `${item.bar}%`, transition: "width 0.8s ease 0.2s" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ledger (dark panel) */}
      <div style={{ background: "#0E0E0C", padding: "2.5rem 2.5rem", margin: "0 0 2rem 0" }}>
        <span className="rp-eyebrow-dark">08 — Transparent Ledger</span>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <h3 className="rp-sub-heading-dark" style={{ margin: 0 }}>
            Every naira. <em>Every member. Visible to all.</em>
          </h3>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "#3A3A34", letterSpacing: "0.06em" }}>
            {ledgerEntries.length} entries · auditable by all members
          </span>
        </div>
        <LedgerTable entries={ledgerEntries} />
      </div>
    </main>
  );
}
