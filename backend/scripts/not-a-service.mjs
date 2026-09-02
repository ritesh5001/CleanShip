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
logic. It is imported directly by the Next app in ../frontend. It has no
server, no port and no entry point.

If a deploy brought you here, its Root Directory is set to "backend". That is
a leftover from the Express API this folder used to hold, retired when
everything moved into the one Next app.

TWO WAYS OUT — pick one:

  1. Delete the service. Nothing depends on it. Correct if the site is
     already deployed elsewhere (Vercel).

  2. Point it at the whole app instead. In the service settings:

       Root Directory   (leave blank)
       Build Command    npm install && npm run build
       Start Command    npm start

     Then set DATABASE_URL, SESSION_SECRET, APP_URL, CLEANTRACK_URL and
     COOKIE_DOMAIN. See render.yaml in the repository root.

Do not run the same site on two hosts. Pick one.

Database commands run from the repository root, not from a deployment:

  npm run db:push
  npm run db:bootstrap -- "you@cleanship.co" "Your Name"
`);
process.exit(1);
