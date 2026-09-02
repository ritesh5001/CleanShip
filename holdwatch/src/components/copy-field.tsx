"use client";

import { useState } from "react";

/** Read-only URL with a copy button. Falls back to select-all where the
    clipboard API is unavailable (http origins, older Safari). */
export function CopyField({
  value,
  className = "",
}: {
  value: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <div className={`flex gap-2 ${className}`}>
      <input
        readOnly
        value={value}
        onFocus={(e) => e.currentTarget.select()}
        className="min-w-0 flex-1 rounded-md border border-slate-300 bg-slate-50 px-3 py-2 font-mono text-[12px] text-slate-700"
      />
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          } catch {
            /* No clipboard permission — the field is selectable. */
          }
        }}
        className="shrink-0 rounded-md border border-slate-300 px-3 text-[13px] font-semibold text-slate-800 hover:bg-slate-50"
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
