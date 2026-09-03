import React from "react";

export function Tag({ children, active = false, href, onClick, style, ...rest }) {
  const [h, setH] = React.useState(false);
  const Tag_ = href ? "a" : "button";
  const on = active || h;
  return (
    <Tag_ href={href} onClick={onClick}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        display: "inline-flex", alignItems: "center", height: "34px", padding: "0 14px", cursor: "pointer",
        font: "var(--fw-medium) var(--fs-body-sm)/1 var(--font-body)", textDecoration: "none",
        border: "1px solid " + (on ? "var(--blue-600)" : "var(--border-default)"),
        background: active ? "var(--blue-600)" : h ? "var(--blue-50)" : "transparent",
        color: active ? "#fff" : "var(--text-body)", borderRadius: "var(--radius-xs)",
        transition: "all var(--dur-fast) var(--ease-standard)", ...style,
      }} {...rest}>{children}</Tag_>
  );
}
