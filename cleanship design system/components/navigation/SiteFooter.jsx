import React from "react";
import { Icon } from "../core/Icon.jsx";
import { IconButton } from "../core/IconButton.jsx";

const SERVICES = ["Hold Cleaning", "Tank Cleaning", "Underwater Hull Cleaning", "Hydroblasting", "Painting"];

export function SiteFooter({ services = SERVICES, style }) {
  const col = { display: "flex", flexDirection: "column", gap: 12 };
  const head = { font: "var(--fw-semibold) var(--fs-body)/1 var(--font-body)", letterSpacing: "var(--ls-label)", textTransform: "uppercase", color: "#fff", marginBottom: 8 };
  const link = { color: "var(--text-on-dark-muted)", textDecoration: "none", font: "var(--type-body-sm)" };
  return (
    <footer style={{ background: "var(--surface-darker)", color: "var(--text-on-dark-muted)", ...style }}>
      <div style={{ maxWidth: "var(--page-max)", margin: "0 auto", padding: "64px var(--page-pad) 40px", display: "grid", gridTemplateColumns: "1.4fr 1fr 1.2fr 1fr", gap: 48 }}>
        <div style={col}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Icon name="anchor" size={24} color="var(--aqua-500)" />
            <span style={{ font: "var(--fw-bold) 26px/1 var(--font-display)", textTransform: "uppercase", letterSpacing: "0.04em", color: "#fff" }}>Cleanship</span>
          </div>
          <div style={{ font: "var(--fw-semibold) var(--fs-h4)/1.3 var(--font-display)", color: "#fff", textTransform: "uppercase" }}>We are Cleanship!</div>
          <p style={{ font: "var(--type-body-sm)", margin: 0 }}>Marine Cleaning You Can Trust</p>
          <div style={{ marginTop: 8 }}>
            <div style={{ font: "var(--type-label)", letterSpacing: "var(--ls-label)", textTransform: "uppercase", color: "var(--aqua-200)", marginBottom: 10 }}>Follow us:</div>
            <div style={{ display: "flex", gap: 10 }}>
              {["linkedin", "facebook", "instagram", "youtube"].map(s => <IconButton key={s} icon={s} label={s} variant="onDark" size={38} />)}
            </div>
          </div>
        </div>
        <div style={col}>
          <div style={head}>Services</div>
          {services.map(s => <a key={s} href="#services" style={link}>{s}</a>)}
        </div>
        <div style={col}>
          <div style={head}>Official info:</div>
          <span style={{ font: "var(--type-body-sm)" }}>B.C. 1302955, Ajman Free Zone C1 Building, UAE</span>
          <a href="tel:+971554029954" style={link}>+971 - 554029954</a>
          <a href="tel:+919236520609" style={link}>+91 - 9236520609</a>
          <a href="mailto:ops@cleanship.co" style={link}>ops@cleanship.co</a>
        </div>
        <div style={col}>
          <div style={head}>Open hours:</div>
          <span style={{ font: "var(--type-body-sm)" }}>Mon – Sun: 24 Hours</span>
        </div>
      </div>
      <div style={{ borderTop: "1px solid var(--border-on-dark)" }}>
        <div style={{ maxWidth: "var(--page-max)", margin: "0 auto", padding: "20px var(--page-pad)", font: "var(--type-body-sm)", fontSize: "var(--fs-caption)", textAlign: "center" }}>
          © All rights reserved by Cleanship Marine Services FZE
        </div>
      </div>
    </footer>
  );
}
