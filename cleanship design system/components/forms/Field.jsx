import React from "react";

/** Shared label / hint / error wrapper for form controls. */
export function Field({ label, hint, error, required, htmlFor, children, style }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "7px", ...style }}>
      {label && (
        <label htmlFor={htmlFor} style={{ font: "var(--type-label)", letterSpacing: "var(--ls-label)", textTransform: "uppercase", color: "var(--slate-600)" }}>
          {label}{required && <span style={{ color: "var(--danger-600)" }}> *</span>}
        </label>
      )}
      {children}
      {(error || hint) && (
        <span style={{ font: "var(--type-body-sm)", fontSize: "var(--fs-caption)", color: error ? "var(--danger-600)" : "var(--text-faint)" }}>{error || hint}</span>
      )}
    </div>
  );
}
