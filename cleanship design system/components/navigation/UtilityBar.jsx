import React from "react";
import { Icon } from "../core/Icon.jsx";

export function UtilityBar({ welcome = "Welcome to our Cleanship Marine Services!", phone = "+971 - 554029954", email = "ops@cleanship.co", style }) {
  return (
    <div style={{ background: "var(--navy-900)", color: "var(--text-on-dark-muted)", font: "var(--type-body-sm)", ...style }}>
      <div style={{ maxWidth: "var(--page-max)", margin: "0 auto", padding: "0 var(--page-pad)", height: 44, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Icon name="waves" size={15} color="var(--aqua-500)" />{welcome}
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 26 }}>
          <a href={"tel:" + phone.replace(/[^+\d]/g, "")} style={{ display: "flex", alignItems: "center", gap: 8, color: "#fff", textDecoration: "none" }}>
            <Icon name="phone-call" size={14} color="var(--aqua-500)" />Call for help: {phone}
          </a>
          <a href={"mailto:" + email} style={{ display: "flex", alignItems: "center", gap: 8, color: "#fff", textDecoration: "none" }}>
            <Icon name="mail" size={14} color="var(--aqua-500)" />Mail to us: {email}
          </a>
        </span>
      </div>
    </div>
  );
}
