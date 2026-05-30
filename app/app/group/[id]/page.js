"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import RecDot from "@/components/RecDot";
import LedgerTable from "@/components/LedgerTable";
import { groups, awkaMembers, ledgerEntries } from "@/data/mock";

function fmt(n) { return "₦" + n.toLocaleString(); }

function genRef() {
  const chars = "ABCDEFGHJKMNPQRST";
  const r = () => chars[Math.floor(Math.random() * chars.length)];
  return `OPY-2026-0530-${r()}${r()}${Math.floor(Math.random() * 9 + 1)}`;
}
const CONTRIB_REF = genRef();
const CONTRIB_TIME = new Date().toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" });

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

/* Organiser inactive alert — shown when organiser hasn't confirmed payout in 24h */
function OrgInactiveAlert({ onDismiss }) {
  return (
    <div style={{ background: "rgba(192,57,43,0.08)", border: "0.5px solid rgba(192,57,43,0.3)", borderRadius: "var(--radius-md)", padding: "0.9rem 1.25rem", marginBottom: "1.5rem", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem" }}>
      <div>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: 500, color: "var(--accent-red)", marginBottom: "0.2rem", letterSpacing: "0.04em" }}>
          Organiser Inactive — 26h without action
        </p>
        <p style={{ fontFamily: "var(--font-serif)", fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
          Chioma Obi has not confirmed this week's payout. AjoStack will auto-escalate to the next longest-standing member (Adaeze Nwosu) in <strong style={{ fontFamily: "var(--font-mono)" }}>22h</strong> if no action is taken.
        </p>
      </div>
      <button onClick={onDismiss} style={{ background: "none", border: "none", color: "var(--text-ghost)", cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: "12px", flexShrink: 0 }}>✕</button>
    </div>
  );
}

/* Low balance warning — shown before contribution CTA */
function LowBalanceWarning() {
  return (
    <div style={{ background: "rgba(212,168,83,0.08)", border: "0.5px solid rgba(212,168,83,0.3)", borderRadius: "var(--radius-md)", padding: "0.75rem 1rem", marginBottom: "0.75rem" }}>
      <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "#D4A853", letterSpacing: "0.03em", lineHeight: 1.5 }}>
        ⚠ OPay balance may be low. Top up before Friday to avoid a grace-period flag on your AjoScore.
      </p>
    </div>
  );
}

/* OPay-style toast — detailed like a real bank SMS */
function OPayToast({ visible, amount, ref, wallet, time }) {
  return (
    <div style={{
      position: "fixed", bottom: "2rem", left: "50%",
      transform: `translateX(-50%) translateY(${visible ? 0 : "80px"})`,
      opacity: visible ? 1 : 0,
      background: "#0E0E0C",
      border: "0.5px solid rgba(255,255,255,0.12)",
      borderRadius: "var(--radius-lg)",
      padding: "1rem 1.25rem",
      zIndex: 1000,
      maxWidth: "380px", width: "calc(100vw - 2rem)",
      transition: "transform 0.35s cubic-bezier(0.22,1,0.36,1), opacity 0.35s ease",
      pointerEvents: "none",
      boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
        <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "rgba(31,74,53,0.3)", border: "0.5px solid #1F4A35", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <span style={{ color: "#1F4A35", fontSize: "14px" }}>✓</span>
        </div>
        <div>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: 500, color: "#ECEAE4", marginBottom: "0.3rem", letterSpacing: "0.03em" }}>
            OPay Debit Alert
          </p>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#9A9A8E", lineHeight: 1.6 }}>
            <span style={{ color: "#D4A853" }}>{fmt(amount)}</span> debited from wallet {wallet}<br />
            Awka Market Women Circle · Week 7<br />
            <span style={{ color: "#5A5A52" }}>Ref: {ref} · {time}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

/* Exit circle modal */
function ExitModal({ group, onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}>
      <div className="rp-card-raised" style={{ maxWidth: "460px", width: "100%" }}>
        <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "20px", fontWeight: 500, color: "var(--text-primary)", marginBottom: "0.75rem" }}>
          Leaving <em>{group.name}</em>
        </h3>
        <p className="rp-body" style={{ marginBottom: "1.25rem", fontSize: "14px" }}>
          Your contributions so far cannot be refunded — that's the ajo contract. However, you can <strong>transfer your remaining turns</strong> to a replacement member approved by the group.
        </p>
        <div className="rp-card-tinted" style={{ marginBottom: "1.25rem" }}>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--accent-green)", lineHeight: 1.6 }}>
            Your turn (Week 9) and Weeks 10–12 can be transferred. The group admin will be notified to approve a replacement.
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button className="rp-btn-ghost" style={{ flex: 1, justifyContent: "center" }} onClick={onClose}>Cancel</button>
          <button style={{ flex: 1, fontFamily: "var(--font-mono)", fontSize: "12px", padding: "0.45rem 1rem", background: "rgba(192,57,43,0.1)", border: "0.5px solid rgba(192,57,43,0.3)", color: "var(--accent-red)", borderRadius: "var(--radius-md)", cursor: "pointer" }} onClick={onClose}>
            Request transfer →
          </button>
        </div>
      </div>
    </div>
  );
}

export default function GroupDetail({ params }) {
  const { id } = params;
  const group = groups.find(g => g.id === id) || groups[0];
  const [toastVisible, setToastVisible] = useState(false);
  const [contributed, setContributed] = useState(false);
  const [showOrgAlert, setShowOrgAlert] = useState(true);
  const [showExitModal, setShowExitModal] = useState(false);

  function handleContribute() {
    if (contributed) return;
    setToastVisible(true);
    setContributed(true);
    setTimeout(() => setToastVisible(false), 4000);
  }

  const paid = awkaMembers.filter(m => m.paid).length;
  const pendingCount = awkaMembers.length - paid;

  return (
    <main style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      {/* OPay-style toast */}
      <OPayToast visible={toastVisible} amount={group.contribution} ref={CONTRIB_REF} wallet="****5678" time={CONTRIB_TIME} />

      {/* Exit modal */}
      {showExitModal && <ExitModal group={group} onClose={() => setShowExitModal(false)} />}

      {/* Header */}
      <div style={{ padding: "2.5rem 2.5rem 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
          <Link href="/app/dashboard" style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-muted)", letterSpacing: "0.06em" }}>
            ← Dashboard
          </Link>
          <span style={{ color: "var(--border-strong)" }}>/</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-ghost)" }}>{group.name}</span>
        </div>
        <span className="rp-eyebrow">{group.isOrganiser ? "07 — Circle (Organiser View)" : "07 — Circle Detail"}</span>

        {/* Organiser inactive alert */}
        {showOrgAlert && !group.isOrganiser && (
          <OrgInactiveAlert onDismiss={() => setShowOrgAlert(false)} />
        )}

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
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.5rem" }}>
            {/* Low balance warning */}
            {!contributed && <LowBalanceWarning />}
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button className="rp-btn-ghost" style={{ fontSize: "11px" }} onClick={() => setShowExitModal(true)}>
                Leave circle
              </button>
              <button
                className="rp-btn-cta"
                onClick={handleContribute}
                disabled={contributed}
                style={{ opacity: contributed ? 0.6 : 1, fontSize: "13px" }}
              >
                {contributed ? "✓ Contributed this week" : `Contribute ${fmt(group.contribution)} ↗`}
              </button>
            </div>
          </div>
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
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "0.55rem 0.75rem", borderRadius: "var(--radius-sm)",
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
                  {m.isRecipient && <span className="badge badge-green">This week's payout</span>}
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
          <div className="rp-card-tinted" style={{ borderRadius: "0 var(--radius-lg) var(--radius-lg) 0", padding: "1.25rem" }}>
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

          {/* "New member next cycle" notice */}
          <div style={{ background: "rgba(0,0,0,0.03)", border: "0.5px solid var(--border-default)", borderRadius: "var(--radius-md)", padding: "0.75rem 1rem" }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-ghost)", marginBottom: "0.25rem" }}>
              Pending joins
            </p>
            <p style={{ fontFamily: "var(--font-serif)", fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
              <strong>Blessing Okafor</strong> has requested to join.
              <br />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-ghost)" }}>
                Will join from Cycle 2 · Spot 13
              </span>
            </p>
          </div>

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
      <div style={{ background: "#0E0E0C", padding: "2.5rem", margin: "0 0 2rem 0" }}>
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
