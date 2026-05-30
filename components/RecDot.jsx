export default function RecDot({ label = "Live" }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-muted)" }}>
      <span className="rp-rec-dot" />
      {label}
    </span>
  );
}
