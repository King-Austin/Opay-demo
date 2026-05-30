"use client";
import { useState } from "react";

const STATUS_STYLES = {
  ontime: { color: "#1F4A35", label: "✓ On Time", bg: "rgba(31,74,53,0.08)" },
  late:    { color: "#D4A853", label: "⚠ Late",    bg: "rgba(212,168,83,0.12)" },
  pending: { color: "#7A7A70", label: "○ Pending",  bg: "transparent" },
};

function fmt(n) { return "₦" + n.toLocaleString(); }

export default function LedgerTable({ entries }) {
  const [filterWeek, setFilterWeek] = useState("all");
  const weeks = [...new Set(entries.map(e => e.week))].sort((a,b) => a - b);

  const filtered = filterWeek === "all"
    ? entries
    : entries.filter(e => e.week === Number(filterWeek));

  return (
    <div>
      {/* Filter bar */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        <button
          onClick={() => setFilterWeek("all")}
          style={{
            fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.08em",
            padding: "0.3rem 0.75rem", borderRadius: "var(--radius-sm)",
            border: "0.5px solid",
            borderColor: filterWeek === "all" ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.10)",
            background: filterWeek === "all" ? "rgba(255,255,255,0.08)" : "transparent",
            color: filterWeek === "all" ? "#ECEAE4" : "#5A5A52",
            cursor: "pointer",
          }}
        >All weeks</button>
        {weeks.map(w => (
          <button
            key={w}
            onClick={() => setFilterWeek(String(w))}
            style={{
              fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.08em",
              padding: "0.3rem 0.75rem", borderRadius: "var(--radius-sm)",
              border: "0.5px solid",
              borderColor: filterWeek === String(w) ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.10)",
              background: filterWeek === String(w) ? "rgba(255,255,255,0.08)" : "transparent",
              color: filterWeek === String(w) ? "#ECEAE4" : "#5A5A52",
              cursor: "pointer",
            }}
          >
            Wk {w}
          </button>
        ))}
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Week", "Date", "Member", "Amount", "Status", "OPay Ref"].map(h => (
                <th key={h} style={{
                  fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.12em",
                  textTransform: "uppercase", color: "#3A3A34", textAlign: "left",
                  padding: "0 0 0.75rem 0", borderBottom: "0.5px solid rgba(255,255,255,0.08)",
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((entry, i) => {
              const s = STATUS_STYLES[entry.status];
              return (
                <tr key={i} style={{ borderBottom: "0.5px solid rgba(255,255,255,0.05)" }}>
                  <td style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "#5A5A52", padding: "0.65rem 0.5rem 0.65rem 0" }}>
                    {entry.week}
                  </td>
                  <td style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "#5A5A52", padding: "0.65rem 0.5rem" }}>
                    {entry.date}
                  </td>
                  <td style={{ fontFamily: "var(--font-serif)", fontSize: "13px", color: "#ECEAE4", padding: "0.65rem 0.5rem" }}>
                    {entry.member}
                  </td>
                  <td style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#ECEAE4", padding: "0.65rem 0.5rem" }}>
                    {fmt(entry.amount)}
                  </td>
                  <td style={{ padding: "0.65rem 0.5rem" }}>
                    <span style={{
                      fontFamily: "var(--font-mono)", fontSize: "10px",
                      color: s.color, background: s.bg,
                      padding: "0.15rem 0.4rem", borderRadius: "var(--radius-sm)",
                      letterSpacing: "0.03em",
                    }}>
                      {s.label}
                    </span>
                  </td>
                  <td style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "#3A3A34", padding: "0.65rem 0 0.65rem 0.5rem", letterSpacing: "0.03em" }}>
                    {entry.ref}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
