import "../load-env.js";
import { eq, inArray } from "drizzle-orm";
import { closeDb, db } from "./index.js";
import { enquiries } from "./schema.js";
import { spamReason } from "../domain/spam.js";

/**
 * Runs the spam rules over enquiries still marked "new" and moves the matches
 * to "spam". For clearing out what arrived before the filter existed.
 *
 *   npm run reclassify-spam            dry run — lists what would move
 *   npm run reclassify-spam -- --apply   actually moves them
 *
 * Only touches "new" rows, so nothing the office has already triaged changes.
 */
async function main() {
  const apply = process.argv.includes("--apply");

  const rows = await db
    .select()
    .from(enquiries)
    .where(eq(enquiries.status, "new"));

  const flagged = rows
    .map((row) => ({ row, reason: spamReason(row) }))
    .filter((r) => r.reason !== null);

  for (const { row, reason } of flagged) {
    console.log(`#${row.id}  [${reason}]  ${row.email}  ${row.name.slice(0, 60)}`);
  }
  console.log(`\n${flagged.length} of ${rows.length} new enquiries look like spam.`);

  if (!apply) {
    console.log("Dry run. Re-run with --apply to move them to spam.");
    return;
  }
  if (flagged.length === 0) return;

  await db
    .update(enquiries)
    .set({ status: "spam" })
    .where(inArray(enquiries.id, flagged.map((f) => f.row.id)));
  console.log(`Moved ${flagged.length} to spam.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => closeDb());
