/**
 * Roles, and where each one belongs.
 *
 * No Next imports — `landingFor` returns a path string, and it is the app's
 * job to redirect to it. Keeping the mapping here means the rule lives beside
 * the access checks it has to agree with, rather than drifting apart in a
 * component.
 */

export type Role = "admin" | "editor" | "supervisor";

export type Session = {
  sub: number;
  email: string;
  name: string;
  role: Role;
};

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
