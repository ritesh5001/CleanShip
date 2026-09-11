import "../load-env.js";
import { eq } from "drizzle-orm";
import { closeDb, db } from "./index.js";
import { users } from "./schema.js";
import { ROLES, isRole } from "../auth/roles.js";

/**
 * Sets an account's role from the command line.
 *
 * Mirrors set-password.ts: the People screen can do this for every role
 * except the one case it cannot cover — promoting the first superadmin when
 * none exists yet, or fixing one by hand outside the app.
 *
 *   npm run set-role -- someone@cleanship.co superadmin
 */
async function main() {
  const [email, role] = process.argv.slice(2);

  if (!email || !role) {
    console.error("Usage: npm run set-role -- <email> <role>");
    console.error(`Roles: ${ROLES.join(", ")}`);
    process.exitCode = 1;
    return;
  }

  if (!isRole(role)) {
    console.error(`"${role}" is not a role. Use one of: ${ROLES.join(", ")}`);
    process.exitCode = 1;
    return;
  }

  const [user] = await db
    .select({ id: users.id, name: users.name, role: users.role })
    .from(users)
    .where(eq(users.email, email.trim().toLowerCase()))
    .limit(1);

  if (!user) {
    console.error(`No account with the email ${email}.`);
    process.exitCode = 1;
    return;
  }

  await db.update(users).set({ role }).where(eq(users.id, user.id));

  console.log(`[set-role] ${email} (${user.name}): ${user.role} -> ${role}`);
}

main()
  .then(() => closeDb())
  .then(() => process.exit(process.exitCode ?? 0))
  .catch(async (err) => {
    console.error(err);
    await closeDb().catch(() => {});
    process.exit(1);
  });
