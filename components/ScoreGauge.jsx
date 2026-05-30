"use client";
import { useEffect, useRef, useState } from "react";

export default function ScoreGauge({ score = 782, max = 1000, dark = false }) {
  const ref = useRef(null);
  const [animated, setAnimated] = useState(false);
  const [displayScore, setDisplayScore] = useState(0);

  const r = 80;
  const cx = 100;
  const cy = 100;
  const circumference = 2 * Math.PI * r;
  const pct = score / max;
  const offset = circumference * (1 - pct);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 200);
    return () => clearTimeout(timer);
  }, []);

  // Count-up animation for the number
  useEffect(() => {
    if (!animated) return;
    const duration = 1200;
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayScore(Math.round(eased * score));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [animated, score]);

  const trackColor = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const fillColor = dark ? "#D4A853" : "#1F4A35";
  const subColor = dark ? "#B4B4A6" : "#62625A";

  return (
    <div ref={ref} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem", maxWidth: "100%" }}>
      <svg viewBox="0 0 200 200" style={{ width: "min(220px, 60vw)", height: "auto" }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={trackColor} strokeWidth="6" />
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={fillColor}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={animated ? offset : circumference}
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.22,1,0.36,1)" }}
        />
        <text
          x={cx} y={cy - 6}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fontFamily: "var(--font-mono)", fontSize: "32px", fontWeight: 500, fill: fillColor }}
        >
          {displayScore}
        </text>
        <text
          x={cx} y={cy + 22}
          textAnchor="middle"
          style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "0.12em", fill: subColor, textTransform: "uppercase" }}
        >
          / {max}
        </text>
      </svg>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: subColor }}>
          AjoScore
        </p>
        <p style={{ fontFamily: "var(--font-serif)", fontSize: "15px", color: dark ? "#B4B4A6" : "var(--text-secondary)" }}>
          Excellent standing
        </p>
      </div>
    </div>
  );
}
