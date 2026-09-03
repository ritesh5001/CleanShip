import React from "react";
import { PhotoFrame } from "../marine/PhotoFrame.jsx";
import { Icon } from "../core/Icon.jsx";

export function PageHero({ title, breadcrumb = [], eyebrow, image, slotId, height = 320, style }) {
  return (
    <section style={{ position: "relative", height, overflow: "hidden", background: "var(--navy-800)", ...style }}>
      <PhotoFrame src={image} slotId={slotId} scrim="left" ratio="auto" placeholder="Drop a vessel photo"
        style={{ position: "absolute", inset: 0, aspectRatio: "auto", borderRadius: 0 }} />
      <div style={{ position: "relative", height: "100%", maxWidth: "var(--page-max)", margin: "0 auto", padding: "0 var(--page-pad)", display: "flex", flexDirection: "column", justifyContent: "center", gap: 12 }}>
        {eyebrow && <div style={{ font: "var(--type-eyebrow)", letterSpacing: "var(--ls-eyebrow)", textTransform: "uppercase", color: "var(--aqua-200)" }}>{eyebrow}</div>}
        <h1 style={{ font: "var(--fw-bold) var(--fs-display-2)/var(--lh-display) var(--font-display)", textTransform: "uppercase", color: "#fff", margin: 0, letterSpacing: "var(--ls-display)" }}>{title}</h1>
        {breadcrumb.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, font: "var(--type-body-sm)", color: "var(--text-on-dark-muted)" }}>
            {breadcrumb.map((b, i) => (
              <React.Fragment key={i}>
                {i > 0 && <Icon name="chevron-right" size={14} color="var(--aqua-500)" />}
                <span style={{ color: i === breadcrumb.length - 1 ? "#fff" : "var(--text-on-dark-muted)" }}>{b}</span>
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
