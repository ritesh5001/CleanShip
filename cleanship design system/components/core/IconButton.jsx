import React from "react";
import { Icon } from "./Icon.jsx";

export function IconButton({ icon, label, variant = "solid", size = 40, onClick, href, style, ...rest }) {
  const [h, setH] = React.useState(false);
  const skins = {
    solid: { background: "var(--blue-600)", color: "#fff", border: "1px solid var(--blue-600)" },
    outline: { background: "transparent", color: "var(--blue-600)", border: "1px solid var(--border-default)" },
    onDark: { background: "rgba(255,255,255,.10)", color: "#fff", border: "1px solid var(--border-on-dark)" },
  };
  const hovers = {
    solid: { background: "var(--navy-800)", borderColor: "var(--navy-800)" },
    outline: { background: "var(--blue-50)", borderColor: "var(--blue-400)" },
    onDark: { background: "var(--aqua-500)", borderColor: "var(--aqua-500)" },
  };
  const Tag = href ? "a" : "button";
  return (
    <Tag href={href} onClick={onClick} aria-label={label} title={label}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        width: size, height: size, display: "inline-flex", alignItems: "center", justifyContent: "center",
        borderRadius: "var(--radius-xs)", cursor: "pointer", padding: 0,
        transition: "background var(--dur-fast) var(--ease-standard),border-color var(--dur-fast) var(--ease-standard)",
        ...skins[variant], ...(h ? hovers[variant] : null), ...style,
      }} {...rest}>
      {typeof icon === "string" ? <Icon name={icon} size={Math.round(size * 0.45)} /> : icon}
    </Tag>
  );
}
