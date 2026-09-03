import React from "react";
import { Field } from "./Field.jsx";

export function Select({ label, hint, error, required, id, options = [], placeholder, style, ...rest }) {
  const [focus, setFocus] = React.useState(false);
  return (
    <Field label={label} hint={hint} error={error} required={required} htmlFor={id}>
      <div style={{ position: "relative" }}>
        <select id={id} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} defaultValue=""
          style={{
            width: "100%", height: "var(--control-h)", padding: "0 38px 0 14px", appearance: "none",
            background: "var(--white)", border: "1px solid " + (error ? "var(--danger-600)" : focus ? "var(--blue-500)" : "var(--border-default)"),
            borderRadius: "var(--radius-xs)", font: "var(--type-body-sm)", color: "var(--text-strong)",
            boxShadow: focus ? "var(--focus-ring)" : "none", outline: "none", cursor: "pointer", ...style,
          }} {...rest}>
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map(o => {
            const v = typeof o === "string" ? o : o.value;
            const l = typeof o === "string" ? o : o.label;
            return <option key={v} value={v}>{l}</option>;
          })}
        </select>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--slate-500)" strokeWidth="2.5"
          style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </Field>
  );
}
