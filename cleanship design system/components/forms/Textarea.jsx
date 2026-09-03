import React from "react";
import { Field } from "./Field.jsx";

export function Textarea({ label, hint, error, required, id, rows = 5, style, ...rest }) {
  const [focus, setFocus] = React.useState(false);
  return (
    <Field label={label} hint={hint} error={error} required={required} htmlFor={id}>
      <textarea id={id} rows={rows} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{
          width: "100%", padding: "12px 14px", background: "var(--white)", resize: "vertical",
          border: "1px solid " + (error ? "var(--danger-600)" : focus ? "var(--blue-500)" : "var(--border-default)"),
          borderRadius: "var(--radius-xs)", font: "var(--type-body-sm)", color: "var(--text-strong)",
          boxShadow: focus ? "var(--focus-ring)" : "none", outline: "none",
          transition: "border-color var(--dur-fast) var(--ease-standard),box-shadow var(--dur-fast) var(--ease-standard)", ...style,
        }} {...rest} />
    </Field>
  );
}
