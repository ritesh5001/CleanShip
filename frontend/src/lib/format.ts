/**
 * Dates are formatted in a fixed locale and time zone.
 *
 * A supervisor in Kandla, an admin in Ajman and a client in Rotterdam must all
 * read the same string for the same event — otherwise "Hold 3 finished at
 * 14:20" means three different moments and the audit trail is worthless. UTC
 * is the neutral choice; change TZ here if the business would rather everyone
 * read Gulf time.
 */
const TZ = "UTC";

export function formatDateTime(value: Date | string | null | undefined) {
  if (!value) return "—";
  const d = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: TZ,
  }).format(d) + " UTC";
}

export function formatDate(value: Date | string | null | undefined) {
  if (!value) return "—";
  const d = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: TZ,
  }).format(d);
}

/** "3 min ago", "2 h ago". Falls back to a date past a week. */
export function relativeTime(value: Date | string | null | undefined) {
  if (!value) return "—";
  const d = typeof value === "string" ? new Date(value) : value;
  const diff = Date.now() - d.getTime();
  const mins = Math.round(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.round(hours / 24);
  if (days <= 7) return `${days} d ago`;
  return formatDate(d);
}
