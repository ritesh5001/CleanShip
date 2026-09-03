import React from "react";

/** Photography frame. Pass `src` for a real image; otherwise renders a fillable
 *  <image-slot> (load assets/image-slot.js on the page) so a real marine photo can be dropped in. */
export function PhotoFrame({ src, alt = "", slotId, placeholder = "Drop a marine photo", ratio = "3 / 2", scrim = "none", children, style }) {
  const scrims = { none: null, bottom: "var(--scrim-navy)", left: "var(--scrim-navy-left)", flat: "var(--scrim-flat)" };
  return (
    <div style={{ position: "relative", aspectRatio: ratio, overflow: "hidden", background: "var(--navy-800)", borderRadius: "var(--radius-xs)", ...style }}>
      {src
        ? <img src={src} alt={alt} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        : React.createElement("image-slot", { id: slotId, shape: "rect", placeholder, style: { position: "absolute", inset: 0 } })}
      {scrims[scrim] && <div style={{ position: "absolute", inset: 0, background: scrims[scrim], pointerEvents: "none" }} />}
      {children && <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>{children}</div>}
    </div>
  );
}
