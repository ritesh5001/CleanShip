import React from "react";
import { Button } from "../core/Button.jsx";
import { Icon } from "../core/Icon.jsx";

const NAV = ["Home", "Services", "Project", "About Us", "Contact Us"];

/** CleanShip has no supplied logo mark — the wordmark is set in type (see readme). */
export function SiteHeader({ items = NAV, active = "Home", onNavigate, ctaLabel = "Get a quote", tone = "light", style }) {
  const dark = tone === "dark";
  return (
    <header style={{
      background: dark ? "var(--navy-800)" : "var(--white)",
      borderBottom: "1px solid " + (dark ? "var(--border-on-dark)" : "var(--border-default)"), ...style,
    }}>
      <div style={{ maxWidth: "var(--page-max)", margin: "0 auto", padding: "0 var(--page-pad)", height: 78, display: "flex", alignItems: "center", gap: 40 }}>
        <a href="#" onClick={e => { e.preventDefault(); onNavigate && onNavigate("Home"); }}
          style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <Icon name="anchor" size={26} color="var(--aqua-500)" />
          <span style={{ font: "var(--fw-bold) 28px/1 var(--font-display)", letterSpacing: "0.04em", textTransform: "uppercase", color: dark ? "#fff" : "var(--navy-800)" }}>
            Clean<span style={{ color: "var(--blue-500)" }}>ship</span>
          </span>
        </a>
        <nav style={{ display: "flex", gap: 30, marginLeft: "auto" }}>
          {items.map(it => {
            const on = it === active;
            return (
              <a key={it} href={"#" + it.toLowerCase().replace(/\s+/g, "-")}
                onClick={e => { e.preventDefault(); onNavigate && onNavigate(it); }}
                style={{
                  position: "relative", padding: "8px 0", textDecoration: "none",
                  font: "var(--fw-semibold) var(--fs-body-sm)/1 var(--font-body)", letterSpacing: "var(--ls-label)", textTransform: "uppercase",
                  color: on ? (dark ? "var(--aqua-200)" : "var(--blue-600)") : (dark ? "rgba(255,255,255,.8)" : "var(--text-body)"),
                }}>
                {it}
                <span style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 2, background: on ? "var(--aqua-500)" : "transparent" }} />
              </a>
            );
          })}
        </nav>
        <Button variant={dark ? "onDark" : "primary"} size="md" iconRight={<Icon name="arrow-right" size={15} />}>{ctaLabel}</Button>
      </div>
    </header>
  );
}
