import React from "react";

export function Checkbox({ label, checked, onChange, disabled, style, ...rest }) {
  const [h, setH] = React.useState(false);
  return (
    <label onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ display: "inline-flex", alignItems: "flex-start", gap: "10px", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? .5 : 1, ...style }}>
      <input type="checkbox" checked={checked} onChange={onChange} disabled={disabled}
        style={{ position: "absolute", opacity: 0, width: 0, height: 0 }} {...rest} />
      <span style={{
        width: 18, height: 18, marginTop: 2, flex: "0 0 auto", display: "flex", alignItems: "center", justifyContent: "center",
        borderRadius: "var(--radius-xs)", background: checked ? "var(--blue-600)" : "var(--white)",
        border: "1px solid " + (checked ? "var(--blue-600)" : h ? "var(--blue-400)" : "var(--border-strong)"),
        transition: "all var(--dur-fast) var(--ease-standard)",
      }}>
        {checked && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5"><path d="M5 12l5 5L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg>}
      </span>
      <span style={{ font: "var(--type-body-sm)", color: "var(--text-body)" }}>{label}</span>
    </label>
  );
}
