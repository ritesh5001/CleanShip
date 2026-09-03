import React from "react";
import { Icon } from "../core/Icon.jsx";

export function CheckList({ items = [], tone = "light", columns = 1, style }) {
  const dark = tone === "dark";
  return (
    <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: `repeat(${columns},minmax(0,1fr))`, gap: "12px 28px", ...style }}>
      {items.map((it, i) => (
        <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, font: "var(--type-body)", color: dark ? "var(--text-on-dark-muted)" : "var(--text-body)" }}>
          <span style={{ flex: "0 0 auto", width: 22, height: 22, marginTop: 3, display: "flex", alignItems: "center", justifyContent: "center", background: dark ? "var(--aqua-500)" : "var(--blue-100)" }}>
            <Icon name="check" size={14} color={dark ? "var(--navy-900)" : "var(--blue-600)"} strokeWidth={3} />
          </span>
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}
