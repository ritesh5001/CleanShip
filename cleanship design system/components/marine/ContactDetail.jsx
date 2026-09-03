import React from "react";
import { Icon } from "../core/Icon.jsx";

export function ContactDetail({ icon, label, lines = [], tone = "light", style }) {
  const dark = tone === "dark";
  return (
    <div style={{ display: "flex", gap: 16, alignItems: "flex-start", ...style }}>
      <span style={{ flex: "0 0 auto", width: 46, height: 46, display: "flex", alignItems: "center", justifyContent: "center", background: dark ? "rgba(255,255,255,.10)" : "var(--blue-50)", border: "1px solid " + (dark ? "var(--border-on-dark)" : "var(--blue-100)") }}>
        <Icon name={icon} size={20} color={dark ? "var(--aqua-200)" : "var(--blue-600)"} />
      </span>
      <div>
        <div style={{ font: "var(--type-label)", letterSpacing: "var(--ls-label)", textTransform: "uppercase", color: dark ? "var(--aqua-200)" : "var(--text-faint)", marginBottom: 6 }}>{label}</div>
        {lines.map((l, i) => (
          <div key={i} style={{ font: "var(--fw-medium) var(--fs-body)/1.5 var(--font-body)", color: dark ? "#fff" : "var(--text-strong)" }}>{l}</div>
        ))}
      </div>
    </div>
  );
}
