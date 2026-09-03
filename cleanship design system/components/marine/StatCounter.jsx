import React from "react";
import { Icon } from "../core/Icon.jsx";

export function StatCounter({ value, suffix = "+", label, icon, tone = "light", align = "left", style }) {
  const dark = tone === "dark";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: align === "center" ? "center" : "flex-start", gap: 6, textAlign: align, ...style }}>
      {icon && <Icon name={icon} size={30} color={dark ? "var(--aqua-200)" : "var(--blue-600)"} style={{ marginBottom: 6 }} />}
      <div style={{ display: "flex", alignItems: "flex-start", font: "var(--fw-bold) 46px/1 var(--font-display)", color: dark ? "#fff" : "var(--navy-800)" }}>
        {value}<span style={{ fontSize: 24, color: "var(--aqua-500)", marginLeft: 2 }}>{suffix}</span>
      </div>
      <div style={{ font: "var(--type-label)", letterSpacing: "var(--ls-label)", textTransform: "uppercase", color: dark ? "var(--text-on-dark-muted)" : "var(--text-muted)" }}>{label}</div>
    </div>
  );
}
