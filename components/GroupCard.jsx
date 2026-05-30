"use client";
import Link from "next/link";

function fmt(n) {
  return "₦" + n.toLocaleString();
}

export default function GroupCard({ group }) {
  const weeksLeft = group.cycle - group.currentWeek;
  const isMyTurnSoon = (group.myTurnWeek - group.currentWeek) <= 2 && group.myTurnWeek >= group.currentWeek;

  return (
    <div className="rp-card-raised" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.5rem" }}>
          <div>
            {group.isOrganiser && (
              <span className="badge badge-green" style={{ marginBottom: "0.5rem", display: "inline-flex" }}>Organiser</span>
            )}
            {isMyTurnSoon && !group.isOrganiser && (
              <span className="badge badge-green" style={{ marginBottom: "0.5rem", display: "inline-flex" }}>Your turn soon</span>
            )}
          </div>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-ghost)", letterSpacing: "0.05em" }}>
            {group.freq.toUpperCase()}
          </span>
        </div>

        <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "18px", fontWeight: 500, color: "var(--text-primary)", lineHeight: 1.2, marginBottom: "0.75rem" }}>
          {group.name}
        </h3>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
          <div>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-ghost)", marginBottom: "0.2rem" }}>Contribution</p>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "14px", fontWeight: 500, color: "var(--text-primary)" }}>{fmt(group.contribution)}</p>
          </div>
          <div>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-ghost)", marginBottom: "0.2rem" }}>Total pot</p>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "14px", fontWeight: 500, color: "var(--text-primary)" }}>{fmt(group.totalPot)}</p>
          </div>
          <div>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-ghost)", marginBottom: "0.2rem" }}>Members</p>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "14px", fontWeight: 500, color: "var(--text-primary)" }}>{group.members}</p>
          </div>
          <div>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-ghost)", marginBottom: "0.2rem" }}>
              {group.currentWeek >= group.myTurnWeek ? "Your turn" : "Your turn"}
            </p>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "14px", fontWeight: 500, color: group.myTurnWeek === group.currentWeek + 1 ? "var(--accent-green)" : "var(--text-primary)" }}>
              {group.freq === "weekly" ? `Week ${group.myTurnWeek}` : `Month ${group.myTurnWeek}`}
            </p>
          </div>
        </div>
      </div>

      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-ghost)", letterSpacing: "0.03em" }}>
            Cycle progress
          </span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-muted)" }}>
            {group.currentWeek}/{group.cycle}
          </span>
        </div>
        <div className="rp-bar-track">
          <div className="rp-bar-fill" style={{ width: `${group.progress}%`, transition: "width 0.8s ease" }} />
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "0.5rem", borderTop: "0.5px solid var(--border-default)" }}>
        <div>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-ghost)" }}>Next payout</p>
          <p style={{ fontFamily: "var(--font-serif)", fontSize: "13px", color: "var(--text-secondary)" }}>
            {group.nextPayout} · <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px" }}>{group.nextPayoutDate}</span>
          </p>
        </div>
        <Link href={`/app/group/${group.id}`} className="rp-btn-ghost" style={{ fontSize: "11px" }}>
          View →
        </Link>
      </div>
    </div>
  );
}
