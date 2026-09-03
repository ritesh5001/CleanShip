import { asc, eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { users, type User } from "../db/schema.js";
import { hashPassword, verifyPassword } from "../auth/passwords.js";
import type { Role, SessionUser } from "../auth/roles.js";
import { ApiError } from "../http/errors.js";

/** Never send a password hash to a client, no matter who is asking. */
export type PublicUser = Omit<User, "passwordHash">;

function strip(user: User): PublicUser {
  const { passwordHash: _hash, ...rest } = user;
  return rest;
}

export async function listUsers(role?: Role): Promise<PublicUser[]> {
  const rows = role
    ? await db.select().from(users).where(eq(users.role, role)).orderBy(asc(users.name))
    : await db.select().from(users).orderBy(asc(users.name));
  return rows.map(strip);
}

/** Supervisors an admin can pick from when assigning a vessel. */
export async function listSupervisors() {
  const rows = await db
    .select({ id: users.id, name: users.name, email: users.email, active: users.active })
    .from(users)
    .where(eq(users.role, "supervisor"))
    .orderBy(asc(users.name));
  return rows.filter((r) => r.active === 1);
}

export async function getUser(id: number): Promise<PublicUser | null> {
  const [row] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return row ? strip(row) : null;
}

export type CreateUserInput = {
  email: string;
  name: string;
  role: Role;
  password: string;
  phone?: string | null;
};

export async function createUser(input: CreateUserInput): Promise<PublicUser> {
  const email = input.email.trim().toLowerCase();
  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  if (existing) throw ApiError.conflict("An account with that email already exists.");

  const [row] = await db
    .insert(users)
    .values({
      email,
      name: input.name.trim(),
      role: input.role,
      phone: input.phone?.trim() || null,
      passwordHash: await hashPassword(input.password),
    })
    .returning();
  return strip(row);
}

export type UpdateUserInput = Partial<{
  name: string;
  role: Role;
  phone: string | null;
  active: boolean;
  password: string;
}>;

export async function updateUser(
  id: number,
  patch: UpdateUserInput,
): Promise<PublicUser> {
  const values: Partial<User> = {};
  if (patch.name !== undefined) values.name = patch.name.trim();
  if (patch.role !== undefined) values.role = patch.role;
  if (patch.phone !== undefined) values.phone = patch.phone?.trim() || null;
  if (patch.active !== undefined) values.active = patch.active ? 1 : 0;
  if (patch.password !== undefined) {
    values.passwordHash = await hashPassword(patch.password);
  }

  if (Object.keys(values).length === 0) {
    const current = await getUser(id);
    if (!current) throw ApiError.notFound("No such user.");
    return current;
  }

  const [row] = await db.update(users).set(values).where(eq(users.id, id)).returning();
  if (!row) throw ApiError.notFound("No such user.");
  return strip(row);
}

/* -------------------------------------------------------------------- */
/* Sign-in                                                              */
/* -------------------------------------------------------------------- */

export type CredentialResult =
  | { ok: true; session: SessionUser }
  | { ok: false; reason: "no-match" | "wrong-door"; role?: Role };

/**
 * Checks credentials, optionally restricted to the roles a given door admits.
 *
 * `wrong-door` exists because there are two sign-in pages — the office at
 * /admin/login and crews at /cleantrack/login — and telling someone "wrong
 * password" when they are simply at the wrong entrance is a support call.
 *
 * A missing account still runs a bcrypt comparison against a dummy hash, so
 * the response time does not reveal which addresses exist.
 */
const DUMMY_HASH = "$2a$12$C6UzMDM.H6dfI/f/IKcEe.9L4qKW7Hh1lXlN8pJ0KZ5c7YQ0z8bMe";

export async function checkCredentials(
  email: string,
  password: string,
  allow?: Role[],
): Promise<CredentialResult> {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email.trim().toLowerCase()))
    .limit(1);

  if (!user || !user.active) {
    await verifyPassword(password, DUMMY_HASH);
    return { ok: false, reason: "no-match" };
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return { ok: false, reason: "no-match" };

  if (allow?.length && !allow.includes(user.role)) {
    return { ok: false, reason: "wrong-door", role: user.role };
  }

  await db
    .update(users)
    .set({ lastLoginAt: new Date() })
    .where(eq(users.id, user.id));

  return {
    ok: true,
    session: {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  };
}
