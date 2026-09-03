import React from "react";

export function Card({ children, tone = "light", interactive = false, pad = "var(--card-pad)", accentRule = false, style, ...rest }) {
  const [h, setH] = React.useState(false);
  const tones = {
    light: { background: "var(--surface-card)", border: "1px solid var(--border-default)", color: "var(--text-body)" },
    tint: { background: "var(--surface-tint)", border: "1px solid var(--blue-100)", color: "var(--text-body)" },
    dark: { background: "var(--surface-dark)", border: "1px solid var(--border-on-dark)", color: "var(--text-on-dark)" },
  };
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        position: "relative", padding: pad, borderRadius: "var(--radius-xs)",
        borderTop: accentRule ? "var(--rule-accent-w) solid var(--aqua-500)" : undefined,
        transition: "box-shadow var(--dur-base) var(--ease-standard),transform var(--dur-base) var(--ease-standard),border-color var(--dur-base) var(--ease-standard)",
        ...tones[tone],
        ...(interactive && h ? { boxShadow: "var(--shadow-md)", transform: "translateY(var(--lift-hover))", borderColor: tone === "dark" ? "rgba(255,255,255,.3)" : "var(--blue-200)" } : null),
        ...style,
      }} {...rest}>{children}</div>
  );
}
