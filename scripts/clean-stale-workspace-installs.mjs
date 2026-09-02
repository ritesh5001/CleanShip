/**
 * Removes stale nested node_modules from before this repo was an npm
 * workspace.
 *
 * `frontend/` used to be a standalone project with its own package-lock.json
 * and its own complete node_modules (its own copy of `next`, `react`, every
 * dependency). That directory is gitignored, so git never carried it forward
 * across the split into backend/ + frontend/ workspaces — but a host's build
 * cache is separate from git and can persist whatever was on disk from a
 * PRE-split deploy, including that old nested node_modules.
 *
 * That is a real, confirmed failure mode, not a hypothetical: a stale
 * frontend/node_modules/next sitting alongside the new root-hoisted next
 * gives two separate module instances of `next` (and `react`) in the same
 * build. Next.js's internal fallback error-page machinery creates a React
 * context as a singleton; when the app and that internal machinery resolve
 * to two different copies of `next`, the context created by one instance is
 * not the one read by the other, and `useContext` returns undefined instead
 * of throwing where you'd expect — surfacing many builds later as
 * "<Html> should not be imported outside of pages/_document", with nothing
 * in the error pointing at a duplicate package.
 *
 * This runs before every install, on every host, so a stale cache — Render's
 * or anyone else's — can never leave a duplicate package lying around again.
 * It is a no-op (and fast) when nothing stale exists, which is the normal
 * case on Vercel and locally today.
 */
import { existsSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

for (const workspace of ["frontend", "backend"]) {
  const stale = resolve(repoRoot, workspace, "node_modules");
  if (existsSync(stale)) {
    console.log(`[clean] removing stale ${workspace}/node_modules from before the workspace split`);
    rmSync(stale, { recursive: true, force: true });
  }
}
