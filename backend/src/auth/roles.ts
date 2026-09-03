/**
 * Roles, and where each one belongs.
 *
 * No framework imports: `landingFor` returns a path string and it is the
 * caller's job to send someone there. Keeping the mapping beside the access
 * checks it has to agree with is what stops the two from drifting.
 */

export type Role = "admin" | "editor" | "supervisor";

export type SessionUser = {
  /** users.id */
  sub: number;
  email: string;
  name: string;
  role: Role;
};

export const ROLES: Role[] = ["admin", "editor", "supervisor"];

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && ROLES.includes(value as Role);
}

/** Where a role lands after signing in. */
export function landingFor(role: Role) {
  if (role === "supervisor") return "/cleantrack/app";
  if (role === "editor") return "/admin";
  return "/cleantrack/admin";
}

/**
 * Which sign-in page a role belongs at.
 *
 * Two doors: the office at /admin/login, crews at /cleantrack/login. They
 * check the same credentials but serve different arrivals, and sending
 * someone to the wrong one is a support call.
 */
export function loginPageFor(role: Role) {
  return role === "supervisor" ? "/cleantrack/login" : "/admin/login";
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
  if (session.role === "admin") return true;
  if (session.role === "supervisor") return vessel.supervisorId === session.sub;
  return false;
}

/** Only the assigned supervisor and admins may change a cell. */
export function canUpdateVessel(
  session: Pick<SessionUser, "role" | "sub">,
  vessel: { supervisorId: number | null },
) {
  if (session.role === "admin") return true;
  return session.role === "supervisor" && vessel.supervisorId === session.sub;
}
