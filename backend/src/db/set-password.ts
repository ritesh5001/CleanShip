import "../load-env.js";
import { eq } from "drizzle-orm";
import { closeDb, db } from "./index.js";
import { users } from "./schema.js";
import { hashPassword, temporaryPassword } from "../auth/passwords.js";

/**
 * Sets an account's password from the command line.
 *
 * This exists because there is no "forgot password" email in this system and
 * deliberately so — the users are a handful of staff, and an email reset flow
 * is a whole attack surface to maintain for something that happens twice a
 * year. An admin can reset anyone from the People screen; this covers the one
 * case that screen cannot, which is nobody being able to sign in as an admin
 * at all.
 *
 *   npm run set-password -- someone@cleanship.co
 *   npm run set-password -- someone@cleanship.co "a chosen password"
 *
 * With no password given it generates one and prints it once. Nothing stores
 * it in readable form, so if it scrolls away, run this again.
 */
async function main() {
  const [email, supplied] = process.argv.slice(2);

  if (!email) {
    console.error("Usage: npm run set-password -- <email> [password]");
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

  if (supplied && supplied.length < 8) {
    console.error("Use at least 8 characters.");
    process.exitCode = 1;
    return;
  }

  const password = supplied ?? temporaryPassword();
  await db
    .update(users)
    .set({ passwordHash: await hashPassword(password) })
    .where(eq(users.id, user.id));

  console.log(`[set-password] updated ${email} (${user.name}, ${user.role})`);
  if (!supplied) console.log(`[set-password] password: ${password}`);
}

main()
  .then(() => closeDb())
  .then(() => process.exit(process.exitCode ?? 0))
  .catch(async (err) => {
    console.error(err);
    await closeDb().catch(() => {});
    process.exit(1);
  });
