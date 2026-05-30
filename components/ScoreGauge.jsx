"use client";
import { useEffect, useRef, useState } from "react";

export default function ScoreGauge({ score = 782, max = 1000, dark = false }) {
  const ref = useRef(null);
  const [animated, setAnimated] = useState(false);

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

  const trackColor = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const fillColor = dark ? "#D4A853" : "#1F4A35";
  const textColor = dark ? "#ECEAE4" : "#1C1C1A";
  const subColor = dark ? "#7A7A68" : "#7A7A70";

  return (
    <div ref={ref} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
      <svg width="200" height="200" viewBox="0 0 200 200">
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={trackColor}
          strokeWidth="6"
        />
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
          x={cx} y={cy - 8}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fontFamily: "var(--font-mono)", fontSize: "28px", fontWeight: 500, fill: fillColor }}
        >
          {score}
        </text>
        <text
          x={cx} y={cy + 20}
          textAnchor="middle"
          style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.12em", fill: subColor, textTransform: "uppercase" }}
        >
          / {max}
        </text>
      </svg>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: subColor }}>
          AjoScore
        </p>
        <p style={{ fontFamily: "var(--font-serif)", fontSize: "14px", color: dark ? "#9A9A8E" : "var(--text-secondary)" }}>
          Excellent standing
        </p>
      </div>
    </div>
  );
}
