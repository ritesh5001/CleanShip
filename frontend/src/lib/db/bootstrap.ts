import "../load-env";
import crypto from "node:crypto";
import { eq } from "drizzle-orm";
import { db, pool } from "./index";
import { users } from "./schema";
import { hashPassword } from "../auth-node";

/**
 * Creates the first admin account.
 *
 * This exists instead of running `db:seed` against a real database. The seed
 * plants demo accounts sharing a password that is printed in the repo and in
 * the terminal history — fine for a throwaway local database, a genuine
 * liability in one that anything real touches.
 *
 * This script instead:
 *   · creates exactly one account, with an address you supply
 *   · generates a strong password, prints it once, and never stores it
 *   · refuses to run if an admin already exists, so it cannot be used to
 *     quietly mint a second one
 *
 *   npm run db:bootstrap -- "you@cleanship.co" "Your Name"
 */

async function main() {
  const [email, ...nameParts] = process.argv.slice(2);
  const name = nameParts.join(" ").trim();

  if (!email || !name) {
    console.error(
      '\nUsage: npm run db:bootstrap -- "you@cleanship.co" "Your Name"\n',
    );
    process.exit(1);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    console.error(`\n"${email}" is not a valid email address.\n`);
    process.exit(1);
  }

  const existingAdmins = await db
    .select({ id: users.id, email: users.email })
    .from(users)
    .where(eq(users.role, "admin"));

  if (existingAdmins.length > 0) {
    console.error(
      `\nAn admin already exists (${existingAdmins[0].email}).\n` +
        "Create further accounts from /cleantrack/admin/users while signed in " +
        "as that account — this script only bootstraps an empty system.\n",
    );
    process.exit(1);
  }

  /* 18 bytes of base64url — long enough that it never needs rotating for
     strength, short enough to read down a phone line once. */
  const password = crypto.randomBytes(18).toString("base64url");

  const [created] = await db
    .insert(users)
    .values({
      name,
      email: email.trim().toLowerCase(),
      passwordHash: await hashPassword(password),
      role: "admin",
    })
    .returning({ id: users.id, email: users.email });

  console.log(`
Admin account created.

  Email     ${created.email}
  Password  ${password}

This password is shown ONCE and is not stored anywhere in plaintext. Save it
now. If you lose it there is no reset flow yet — the recovery path is to delete
the row and run this again.

Sign in at /cleantrack/login, then add supervisors, clients and\neditors from /cleantrack/admin/users.
`);
}

main()
  .then(() => pool.end())
  .catch((err) => {
    console.error(err);
    pool.end();
    process.exit(1);
  });
