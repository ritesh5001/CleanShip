import React from "react";

/** Lucide-backed icon. Requires the Lucide UMD script on the page:
 *  <script src="https://unpkg.com/lucide@0.470.0/dist/umd/lucide.js"></script> */
export function Icon({ name, size = 20, strokeWidth = 1.75, color = "currentColor", style, ...rest }) {
  const [inner, setInner] = React.useState("");
  React.useEffect(() => {
    let stop = false;
    const build = () => {
      const L = window.lucide;
      if (!L || !L.icons) return false;
      const key = String(name).split(/[-_ ]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join("");
      const node = L.icons[key] || L.icons[name];
      if (!node) return false;
      const kids = Array.isArray(node) ? node[2] : node;
      const html = (kids || []).map(([tag, attrs]) =>
        "<" + tag + " " + Object.entries(attrs || {}).map(([k, v]) => k + '="' + v + '"').join(" ") + " />").join("");
      if (!stop) setInner(html);
      return true;
    };
    if (!build()) {
      const t = setInterval(() => { if (build()) clearInterval(t); }, 120);
      setTimeout(() => clearInterval(t), 4000);
      return () => { stop = true; clearInterval(t); };
    }
    return () => { stop = true; };
  }, [name]);
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
      style={{ display: "block", flex: "0 0 auto", ...style }}
      dangerouslySetInnerHTML={{ __html: inner }} {...rest} />
  );
}
