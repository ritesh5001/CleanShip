import React from "react";
import { PhotoFrame } from "./PhotoFrame.jsx";
import { Icon } from "../core/Icon.jsx";

/** The homepage service tile: big index number, photo, title, blurb, "Read more". */
export function ServiceCard({ index, title, description, icon, image, slotId, href = "#", onClick, style }) {
  const [h, setH] = React.useState(false);
  return (
    <a href={href} onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        display: "block", position: "relative", textDecoration: "none", background: "var(--surface-card)",
        border: "1px solid " + (h ? "var(--blue-200)" : "var(--border-default)"), borderRadius: "var(--radius-xs)",
        overflow: "hidden", transform: h ? "translateY(var(--lift-hover))" : "none",
        boxShadow: h ? "var(--shadow-md)" : "none",
        transition: "all var(--dur-base) var(--ease-standard)", ...style,
      }}>
      <div style={{ position: "relative", overflow: "hidden" }}>
        <PhotoFrame src={image} slotId={slotId} ratio="4 / 3" scrim="bottom" placeholder={title}
          style={{ borderRadius: 0, transform: h ? "scale(1.04)" : "scale(1)", transition: "transform var(--dur-photo) var(--ease-out)" }} />
        <span style={{
          position: "absolute", top: 0, left: 0, minWidth: 52, height: 40, display: "flex", alignItems: "center", justifyContent: "center",
          background: h ? "var(--aqua-500)" : "var(--navy-800)", color: "#fff",
          font: "var(--fw-bold) 18px/1 var(--font-display)", letterSpacing: "var(--ls-label)",
          transition: "background var(--dur-base) var(--ease-standard)",
        }}>{index}</span>
        {icon && (
          <span style={{ position: "absolute", right: 16, bottom: -20, width: 44, height: 44, background: "var(--white)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--border-default)" }}>
            <Icon name={icon} size={22} color="var(--blue-600)" />
          </span>
        )}
      </div>
      <div style={{ padding: "24px 24px 22px" }}>
        <h3 style={{ font: "var(--type-h3)", color: h ? "var(--blue-600)" : "var(--text-strong)", margin: "0 0 8px", transition: "color var(--dur-fast) var(--ease-standard)" }}>{title}</h3>
        <p style={{ font: "var(--type-body-sm)", color: "var(--text-muted)", margin: "0 0 16px" }}>{description}</p>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8, font: "var(--fw-semibold) var(--fs-caption)/1 var(--font-body)", letterSpacing: "var(--ls-label)", textTransform: "uppercase", color: "var(--blue-600)" }}>
          Read more <Icon name="arrow-right" size={15} />
        </span>
      </div>
    </a>
  );
}
