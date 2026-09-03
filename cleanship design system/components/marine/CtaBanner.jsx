import React from "react";
import { Button } from "../core/Button.jsx";

export function CtaBanner({ eyebrow, title, body, primaryLabel = "Contact us", primaryHref = "#contact", secondaryLabel, secondaryHref, style }) {
  return (
    <section style={{
      background: "var(--surface-dark)", color: "#fff", padding: "48px", position: "relative", overflow: "hidden",
      display: "flex", gap: 40, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", ...style,
    }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "var(--rule-accent-w)", background: "var(--aqua-500)" }} />
      <div style={{ maxWidth: 640 }}>
        {eyebrow && <div style={{ font: "var(--type-eyebrow)", letterSpacing: "var(--ls-eyebrow)", textTransform: "uppercase", color: "var(--aqua-200)", marginBottom: 10 }}>{eyebrow}</div>}
        <h2 style={{ font: "var(--type-h2)", color: "#fff", margin: 0 }}>{title}</h2>
        {body && <p style={{ font: "var(--type-body)", color: "var(--text-on-dark-muted)", margin: "12px 0 0" }}>{body}</p>}
      </div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Button variant="onDark" size="lg" href={primaryHref}>{primaryLabel}</Button>
        {secondaryLabel && <Button variant="onDarkOutline" size="lg" href={secondaryHref}>{secondaryLabel}</Button>}
      </div>
    </section>
  );
}
