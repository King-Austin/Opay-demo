"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePidgin, t } from "@/contexts/PidginContext";

const CIRCLE_CODES = {
  "AWK-001": {
    name: "Awka Market Women Circle",
    organiser: "Chioma Obi",
    contribution: 5000,
    freq: "weekly",
    members: 12,
    currentWeek: 7,
    cycle: 12,
    totalPot: 60000,
    ledgerPreview: [
      { member: "Chioma Obi", status: "ontime" },
      { member: "Adaeze Nwosu", status: "ontime" },
      { member: "Ify Eze", status: "ontime" },
      { member: "Ngozi Adaeze", status: "ontime" },
      { member: "Amaka Dike", status: "late" },
    ],
  },
};

function fmt(n) { return "₦" + n.toLocaleString(); }

export default function JoinCircle({ params }) {
  const router = useRouter();
  const { pidgin } = usePidgin();
  const [code, setCode] = useState(params.code !== "enter" ? params.code : "");
  const [looked, setLooked] = useState(params.code !== "enter");
  const [joining, setJoining] = useState(false);
  const [joined, setJoined] = useState(false);

  const circle = CIRCLE_CODES[code.toUpperCase()] || CIRCLE_CODES["AWK-001"];
  const found = looked && circle;

  function handleLookup(e) {
    e.preventDefault();
    setLooked(true);
  }

  function handleJoin() {
    setJoining(true);
    setTimeout(() => setJoined(true), 2000);
    setTimeout(() => router.push("/app/dashboard"), 3500);
  }

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{ maxWidth: "520px", width: "100%" }}>

        {!joined ? (
          <>
            <span className="rp-eyebrow">{t("Join a Circle", "Join Ajo Circle", pidgin)}</span>
            <h1 className="rp-sub-heading" style={{ marginBottom: "2rem" }}>
              {t("Enter the code your organiser shared.", "Enter the code wey your organiser give you.", pidgin)}<br />
              <em>{t("See everything before you commit.", "See everything before you join.", pidgin)}</em>
            </h1>

            <form onSubmit={handleLookup} style={{ display: "flex", gap: "0.75rem", marginBottom: "2rem" }}>
              <input
                type="text"
                value={code}
                onChange={e => { setCode(e.target.value.toUpperCase()); setLooked(false); }}
                placeholder="AWK-001"
                maxLength={7}
                style={{ flex: 1, background: "var(--bg-sunken)", border: "0.5px solid var(--border-default)", borderRadius: "var(--radius-md)", padding: "0.75rem 1rem", fontFamily: "var(--font-mono)", fontSize: "16px", letterSpacing: "0.12em", color: "var(--text-primary)", outline: "none" }}
              />
              <button type="submit" className="rp-btn-solid" style={{ flexShrink: 0 }}>
                {t("Look up →", "Check →", pidgin)}
              </button>
            </form>

            {found && (
              <div style={{ animation: "fadeUp 0.4s ease forwards" }}>
                {/* Circle preview card */}
                <div className="rp-card-raised" style={{ marginBottom: "1.25rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
                    <div>
                      <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-ghost)", marginBottom: "0.3rem" }}>
                        Circle found
                      </p>
                      <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "20px", fontWeight: 500, color: "var(--text-primary)", lineHeight: 1.2 }}>
                        {circle.name}
                      </h2>
                      <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                        {t("Organised by", "Organiser:")} {circle.organiser}
                      </p>
                    </div>
                    <span className="badge badge-green">{t("Active", "Active", pidgin)}</span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem", marginBottom: "1.25rem" }}>
                    {[
                      { l: t("Weekly", "Per week", pidgin), v: fmt(circle.contribution) },
                      { l: t("Members", "Members", pidgin), v: circle.members },
                      { l: t("Week", "Week", pidgin), v: `${circle.currentWeek}/${circle.cycle}` },
                    ].map(s => (
                      <div key={s.l} style={{ background: "var(--bg-surface)", borderRadius: "var(--radius-sm)", padding: "0.6rem 0.75rem" }}>
                        <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--text-ghost)", letterSpacing: "0.1em", marginBottom: "0.2rem" }}>{s.l}</p>
                        <p style={{ fontFamily: "var(--font-mono)", fontSize: "14px", fontWeight: 500, color: "var(--text-primary)" }}>{s.v}</p>
                      </div>
                    ))}
                  </div>

                  {/* Important: show the ledger before they join */}
                  <div style={{ background: "#0E0E0C", borderRadius: "var(--radius-md)", padding: "1rem", marginBottom: "1rem" }}>
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#5A5A52", marginBottom: "0.75rem" }}>
                      {t("Last week's contributions — visible to you before joining", "Last week record — you fit see am before you join", pidgin)}
                    </p>
                    {circle.ledgerPreview.map((e, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "0.35rem 0", borderBottom: i < circle.ledgerPreview.length - 1 ? "0.5px solid rgba(255,255,255,0.05)" : "none" }}>
                        <span style={{ fontFamily: "var(--font-serif)", fontSize: "13px", color: "#ECEAE4" }}>{e.member}</span>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: e.status === "ontime" ? "#1F4A35" : "#D4A853" }}>
                          {e.status === "ontime" ? "✓ On Time" : "⚠ Late"}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="rp-card-tinted" style={{ marginBottom: "1.25rem" }}>
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--accent-green)", lineHeight: 1.6 }}>
                      {t(
                        "You'll join starting from Cycle 2 — next full rotation. Your first contribution will be due next Friday.",
                        "You go join from Cycle 2 — next full rotation. Your first payment go due next Friday.",
                        pidgin
                      )}
                    </p>
                  </div>

                  <button
                    className="rp-btn-cta"
                    style={{ width: "100%", justifyContent: "center", opacity: joining ? 0.7 : 1 }}
                    onClick={handleJoin}
                    disabled={joining}
                  >
                    {joining
                      ? t("Joining...", "Joining...", pidgin)
                      : t(`Join — ${fmt(circle.contribution)}/week →`, `Join — ${fmt(circle.contribution)}/week →`, pidgin)
                    }
                  </button>
                </div>

                <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-ghost)", textAlign: "center", letterSpacing: "0.04em" }}>
                  {t(
                    "Your OPay wallet will be debited automatically each week.",
                    "Your OPay wallet go debit automatic every week.",
                    pidgin
                  )}
                </p>
              </div>
            )}

            {looked && !found && (
              <div style={{ padding: "1.25rem", border: "0.5px solid var(--border-default)", borderRadius: "var(--radius-lg)", textAlign: "center" }}>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--text-muted)" }}>
                  {t("Circle not found. Check the code with your organiser.", "That code no dey. Ask your organiser again.", pidgin)}
                </p>
              </div>
            )}
          </>
        ) : (
          <div style={{ textAlign: "center", animation: "fadeUp 0.5s ease forwards" }}>
            <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "var(--accent-green-tint)", border: "0.5px solid var(--accent-green-border)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", fontSize: "22px" }}>
              ✓
            </div>
            <h2 className="rp-sub-heading" style={{ marginBottom: "0.5rem" }}>
              {t("You're in.", "You don join!", pidgin)} <em>{circle.name}.</em>
            </h2>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--text-muted)" }}>
              {t("Taking you to your dashboard...", "E dey take you to your dashboard...", pidgin)}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
