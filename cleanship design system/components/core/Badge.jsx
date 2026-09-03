import React from "react";

const TONES = {
  brand: { background: "var(--blue-100)", color: "var(--navy-800)" },
  accent: { background: "var(--aqua-200)", color: "var(--navy-900)" },
  neutral: { background: "var(--line-100)", color: "var(--slate-600)" },
  success: { background: "var(--success-100)", color: "var(--success-600)" },
  warning: { background: "var(--warning-100)", color: "var(--warning-600)" },
  danger: { background: "var(--danger-100)", color: "var(--danger-600)" },
  onDark: { background: "rgba(255,255,255,.12)", color: "#fff" },
};

export function Badge({ children, tone = "brand", shape = "square", style, ...rest }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "6px", height: "24px", padding: "0 10px",
      font: "var(--fw-semibold) var(--fs-micro)/1 var(--font-body)", letterSpacing: "var(--ls-label)",
      textTransform: "uppercase", borderRadius: shape === "pill" ? "var(--radius-pill)" : "var(--radius-xs)",
      ...TONES[tone], ...style,
    }} {...rest}>{children}</span>
  );
}
