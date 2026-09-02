/**
 * Fails a deploy that is trying to run backend/ as a service.
 *
 * This package used to be an Express API deployed on Render. It is now a
 * library imported by the Next app in ../frontend, and there is nothing here
 * to start — no server, no port, no entry point.
 *
 * Without this script the failure reads `Missing script: "build"`, which says
 * nothing about why. A deliberate failure with an explanation costs one file
 * and saves the next person the archaeology.
 */
console.error(`
╭──────────────────────────────────────────────────────────────────────╮
│  backend/ is not a service. There is nothing here to deploy.         │
╰──────────────────────────────────────────────────────────────────────╯

This package holds the database schema, auth primitives and CleanTrack domain
logic. It is imported directly by the Next app in ../frontend, which is the
only thing that gets deployed.

If you are seeing this in a Render (or similar) build log, that service is a
leftover from the Express API that used to live here. It was retired when
everything moved into the one Next app.

  → Delete the service. Nothing depends on it.

If you meant to deploy the site, deploy frontend/ — on Vercel, with Root
Directory set to "frontend". npm workspaces are detected from the repository
root, so backend/ is installed automatically.

Database commands run from the repository root, not a deployment:

  npm run db:push
  npm run db:bootstrap -- "you@cleanship.co" "Your Name"
`);
process.exit(1);
