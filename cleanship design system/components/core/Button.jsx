import React from "react";

const SIZES = {
  sm: { height: "var(--control-h-sm)", padding: "0 16px", fontSize: "13px" },
  md: { height: "var(--control-h)", padding: "0 22px", fontSize: "14px" },
  lg: { height: "var(--control-h-lg)", padding: "0 30px", fontSize: "15px" },
};

const VARIANTS = {
  primary: { background: "var(--blue-600)", color: "#fff", border: "1px solid var(--blue-600)" },
  navy: { background: "var(--navy-800)", color: "#fff", border: "1px solid var(--navy-800)" },
  secondary: { background: "transparent", color: "var(--blue-600)", border: "1px solid var(--blue-200)" },
  ghost: { background: "transparent", color: "var(--text-body)", border: "1px solid transparent" },
  onDark: { background: "#fff", color: "var(--navy-800)", border: "1px solid #fff" },
  onDarkOutline: { background: "transparent", color: "#fff", border: "1px solid var(--border-on-dark)" },
};

const HOVER = {
  primary: { background: "var(--navy-700)", borderColor: "var(--navy-700)" },
  navy: { background: "var(--navy-900)", borderColor: "var(--navy-900)" },
  secondary: { background: "var(--blue-50)", borderColor: "var(--blue-400)" },
  ghost: { background: "var(--line-100)" },
  onDark: { background: "var(--aqua-200)", borderColor: "var(--aqua-200)" },
  onDarkOutline: { background: "rgba(255,255,255,.10)", borderColor: "rgba(255,255,255,.4)" },
};

export function Button({ children, variant = "primary", size = "md", iconRight, iconLeft, disabled, fullWidth, as = "button", href, onClick, style, ...rest }) {
  const [h, setH] = React.useState(false);
  const [p, setP] = React.useState(false);
  const Tag = href ? "a" : as;
  return (
    <Tag
      href={href} onClick={disabled ? undefined : onClick} disabled={Tag === "button" ? disabled : undefined}
      onMouseEnter={() => setH(true)} onMouseLeave={() => { setH(false); setP(false); }}
      onMouseDown={() => setP(true)} onMouseUp={() => setP(false)}
      style={{
        display: fullWidth ? "flex" : "inline-flex", width: fullWidth ? "100%" : undefined,
        alignItems: "center", justifyContent: "center", gap: "10px",
        font: "var(--fw-semibold) 14px/1 var(--font-body)", letterSpacing: "var(--ls-label)",
        textTransform: "uppercase", textDecoration: "none", cursor: disabled ? "not-allowed" : "pointer",
        borderRadius: "var(--radius-xs)", whiteSpace: "nowrap",
        transition: "background var(--dur-fast) var(--ease-standard),border-color var(--dur-fast) var(--ease-standard),transform var(--dur-instant) var(--ease-standard)",
        ...SIZES[size], ...VARIANTS[variant],
        ...(h && !disabled ? HOVER[variant] : null),
        transform: p && !disabled ? "scale(var(--press-scale))" : "none",
        opacity: disabled ? 0.45 : 1,
        ...style,
      }}
      {...rest}
    >
      {iconLeft}{children}{iconRight}
    </Tag>
  );
}
