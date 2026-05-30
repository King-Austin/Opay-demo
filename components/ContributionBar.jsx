"use client";
import { useEffect, useRef, useState } from "react";

export default function ContributionBar({ label, weight, score, note }) {
  const ref = useRef(null);
  const [filled, setFilled] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setFilled(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ marginBottom: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.25rem" }}>
        <span style={{ fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: "15px", color: "var(--text-primary)" }}>
          {label}
        </span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--text-muted)" }}>
          {weight}% weight · <span style={{ color: "var(--accent-green)" }}>{score}%</span>
        </span>
      </div>
      {note && (
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-ghost)", letterSpacing: "0.03em", marginBottom: "0.4rem" }}>
          {note}
        </p>
      )}
      <div className="rp-bar-track">
        <div className="rp-bar-fill" style={{ width: filled ? `${score}%` : "0%" }} />
      </div>
    </div>
  );
}
