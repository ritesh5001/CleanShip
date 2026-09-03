import "../load-env.js";
import { eq } from "drizzle-orm";
import { closeDb, db } from "./index.js";
import { users } from "./schema.js";
import { hashPassword, temporaryPassword } from "../auth/passwords.js";
import { env } from "../env.js";

/**
 * Creates the first admin, so a fresh deployment is reachable.
 *
 * Idempotent: if the account already exists it is left alone rather than
 * having its password reset, because this script runs on every deploy in some
 * setups and silently resetting the admin password would be a very bad
 * surprise. Use the reset endpoint for that.
 */
async function main() {
  const email = (env.SEED_ADMIN_EMAIL ?? "admin@cleanship.co").toLowerCase();
  const name = env.SEED_ADMIN_NAME ?? "CleanShip Admin";

  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing) {
    console.log(`[seed] ${email} already exists — nothing to do.`);
    return;
  }

  const password = env.SEED_ADMIN_PASSWORD ?? temporaryPassword();
  await db.insert(users).values({
    email,
    name,
    role: "admin",
    passwordHash: await hashPassword(password),
  });

  console.log(`[seed] created admin ${email}`);
  if (!env.SEED_ADMIN_PASSWORD) {
    /* Printed once, to the deploy log. There is no way to read it back. */
    console.log(`[seed] temporary password: ${password}`);
    console.log("[seed] change it after the first sign-in.");
  }
}

main()
  .then(() => closeDb())
  .then(() => process.exit(0))
  .catch(async (err) => {
    console.error(err);
    await closeDb().catch(() => {});
    process.exit(1);
  });
