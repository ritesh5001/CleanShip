import React from "react";

export function SectionHeading({ eyebrow, title, intro, align = "left", tone = "light", maxWidth = 720, style, ...rest }) {
  const dark = tone === "dark";
  return (
    <header style={{ textAlign: align, maxWidth, margin: align === "center" ? "0 auto" : undefined, ...style }} {...rest}>
      {eyebrow && (
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "12px", marginBottom: "14px",
          font: "var(--type-eyebrow)", letterSpacing: "var(--ls-eyebrow)", textTransform: "uppercase",
          color: dark ? "var(--aqua-200)" : "var(--blue-600)",
        }}>
          <span style={{ width: 22, height: 1, background: "var(--aqua-500)" }} />{eyebrow}
          <span style={{ width: 22, height: 1, background: "var(--aqua-500)" }} />
        </div>
      )}
      {title && <h2 style={{ font: "var(--type-h2)", letterSpacing: "var(--ls-display)", color: dark ? "#fff" : "var(--text-strong)", margin: 0 }}>{title}</h2>}
      {intro && <p style={{ font: "var(--type-body-lg)", color: dark ? "var(--text-on-dark-muted)" : "var(--text-muted)", margin: "14px 0 0" }}>{intro}</p>}
    </header>
  );
}
