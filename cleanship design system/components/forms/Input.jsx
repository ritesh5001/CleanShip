import React from "react";
import { Field } from "./Field.jsx";

export function Input({ label, hint, error, required, id, iconLeft, style, ...rest }) {
  const [focus, setFocus] = React.useState(false);
  return (
    <Field label={label} hint={hint} error={error} required={required} htmlFor={id}>
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        {iconLeft && <span style={{ position: "absolute", left: 13, color: "var(--slate-400)", display: "flex" }}>{iconLeft}</span>}
        <input id={id} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          style={{
            width: "100%", height: "var(--control-h)", padding: iconLeft ? "0 14px 0 40px" : "0 14px",
            background: "var(--white)", border: "1px solid " + (error ? "var(--danger-600)" : focus ? "var(--blue-500)" : "var(--border-default)"),
            borderRadius: "var(--radius-xs)", font: "var(--type-body-sm)", color: "var(--text-strong)",
            boxShadow: focus ? "var(--focus-ring)" : "none", outline: "none",
            transition: "border-color var(--dur-fast) var(--ease-standard),box-shadow var(--dur-fast) var(--ease-standard)", ...style,
          }} {...rest} />
      </div>
    </Field>
  );
}
