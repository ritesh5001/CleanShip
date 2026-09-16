/**
 * Roles, and where each one belongs.
 *
 * No framework imports: `landingFor` returns a path string and it is the
 * caller's job to send someone there. Keeping the mapping beside the access
 * checks it has to agree with is what stops the two from drifting.
 */

/**
 * Four tiers, most privileged first.
 *
 * `crew` is the joiner: they sign into the Android app, fill in their own
 * documents, checklist and travel for a vessel they have been rostered onto,
 * and reach nothing else — no status sheet, no other person's row, no vessel
 * they are not joining. A supervisor carries the same paperwork onto the same
 * flight, so crew sits BELOW supervisor rather than beside it, and every
 * supervisor is automatically allowed everything a crew member is.
 *
 * `editor` used to sit between admin and supervisor: office staff who worked
 * the enquiry inbox and could see no vessels at all. It was removed because
 * nobody could say what it was for that admin was not, and a role nobody can
 * describe is a role nobody administers correctly.
 */
export type Role = "superadmin" | "admin" | "supervisor" | "crew";

export type SessionUser = {
  /** users.id */
  sub: number;
  email: string;
  name: string;
  role: Role;
};

export const ROLES: Role[] = ["superadmin", "admin", "supervisor", "crew"];

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && ROLES.includes(value as Role);
}

/**
 * The hierarchy, as a number.
 *
 * Access checks are written against the LOWEST role that may pass, and anyone
 * above it passes too. Listing roles explicitly instead would mean every new
 * tier had to be added to dozens of call sites — and the one that got missed
 * would silently lock out the most privileged account, which is the least
 * likely bug to be noticed in testing and the worst to hit in production.
 */
const RANK: Record<Role, number> = {
  crew: 1,
  supervisor: 2,
  admin: 3,
  superadmin: 4,
};

/** Whether `role` sits at or above `minimum` in the hierarchy. */
export function atLeast(role: Role, minimum: Role) {
  return RANK[role] >= RANK[minimum];
}

/** Where a role lands after signing in. */
export function landingFor(role: Role) {
  /* Crew have no web surface at all. Everything they do is on the phone, so
     the browser sends them back to the door they came in at rather than to a
     page that would immediately bounce them. */
  if (role === "crew") return "/cleantrack/login";
  if (role === "supervisor") return "/cleantrack/app";
  if (role === "admin" || role === "superadmin") return "/cleantrack/admin";
  /* A role this build does not know — a token minted while `editor` still
     existed. Send them to sign in again, NOT to the office landing page:
     that page would reject them and redirect straight back here, which is a
     loop that renders as a blank screen with no error to explain it. */
  return "/admin/login";
}

/**
 * Which sign-in page a role belongs at.
 *
 * Two doors: the office at /admin/login, crews at /cleantrack/login. They
 * check the same credentials but serve different arrivals, and sending
 * someone to the wrong one is a support call.
 */
export function loginPageFor(role: Role) {
  return role === "supervisor" || role === "crew"
    ? "/cleantrack/login"
    : "/admin/login";
}

/* -------------------------------------------------------------------- */
/* Vessel access                                                        */
/* -------------------------------------------------------------------- */

/**
 * Whether a session may see a vessel.
 *
 * One function rather than an inline check at each route, because
 * "supervisors see only the vessels they are assigned to" is exactly the rule
 * that rots when it is restated in six places.
 */
export function canViewVessel(
  session: Pick<SessionUser, "role" | "sub">,
  vessel: { supervisorId: number | null },
) {
  if (isOffice(session.role)) return true;
  if (session.role === "supervisor") return vessel.supervisorId === session.sub;
  /* Crew never see a vessel through this door. Being rostered onto a ship
     entitles them to their own joining paperwork and to nothing about the
     cleaning of it — see the crew routes, which check the roster instead. */
  return false;
}

/** Only the assigned supervisor and the office may change a cell. */
export function canUpdateVessel(
  session: Pick<SessionUser, "role" | "sub">,
  vessel: { supervisorId: number | null },
) {
  if (isOffice(session.role)) return true;
  return session.role === "supervisor" && vessel.supervisorId === session.sub;
}

/** Admin and above: everything operational — vessels, clients, share links. */
export function isOffice(role: Role) {
  return role === "admin" || role === "superadmin";
}

/**
 * Managing people is the one thing an admin cannot do.
 *
 * That is the whole distinction between the two office tiers: an admin runs
 * the work, a superadmin decides who gets to. Without that split "admin" is
 * simply the only role and the hierarchy means nothing.
 */
export function canManageUsers(role: Role) {
  return role === "superadmin";
}
