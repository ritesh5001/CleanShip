# CleanTrack for Android

The supervisor's app. Sign in, see the vessels assigned to you, and update the
hold or tank status sheet from the deck — with or without signal.

Built with Expo (SDK 57) and React Native. It talks to the CleanTrack API at
`../backend` over HTTPS and shares no code with it or with the web app: this
ships to phones through a store and cannot import from a server it does not
deploy with.

## Why an app rather than the website

One reason: **the signal.** A supervisor loses it constantly — inside a hold,
behind a shed, at anchor. If a tap is lost the paper sheet wins and the whole
system is pointless.

So every tap is written to the device queue *before* it is sent. The screen
updates immediately from local state; the network is a background concern. The
queue survives the app being killed, and drains by itself when signal returns,
when the app is brought back to the foreground, or on a slow timer.

Two consequences worth knowing:

- **`occurredAt` is when the supervisor tapped, not when the server heard.** A
  hold finished at 02:10 and synced at 06:00 reports 02:10. The audit trail
  exists to settle disputes about timing; recording the sync time would make it
  worse than useless.
- **Each queued change carries its own idempotency key.** The API enforces
  those with a unique index rather than a pre-check, which is what makes
  replaying an hour-old queue safe even if part of it already landed.

## Running it

```bash
npm install
npx expo start          # then press "a" for Android, or scan with Expo Go
```

It points at the deployed API by default. To develop against a local one:

```bash
EXPO_PUBLIC_API_URL=http://localhost:4000 npx expo start
```

On an Android **emulator**, `localhost` is the emulator itself — use
`http://10.0.2.2:4000` to reach the host machine. On a physical device, use the
machine's LAN address.

## Building an APK

There is no Android SDK required locally; EAS builds in the cloud.

```bash
npm install -g eas-cli
eas login                       # an Expo account, free
eas build:configure             # first time only
npm run build:apk               # installable .apk for sideloading / testing
npm run build:play              # .aab for the Play Store
```

`build:apk` produces a file you can send to a supervisor's phone directly.
`build:play` produces the bundle the Play Console wants.

## Layout

```
app/                    the routes (expo-router, file-based)
  _layout.tsx           session, the sync engine, the pending-work bar
  login.tsx             the crew door — supervisors only
  vessels/index.tsx     the vessels assigned to this supervisor
  vessels/[id].tsx      the status sheet
src/
  api.ts                the API client
  session.ts            token storage
  queue.ts              the offline queue
  sync.ts               pushing the queue; overlaying it on server data
  cache.ts              last-known server state, so the app opens offline
  types.ts              domain shapes and the four cell statuses
  theme.ts              colour and spacing
  components/ui.tsx     shared pieces
```

## Two ways to record the same thing

Deliberate, because the two situations are different:

- **Tap a stage chip** and it cycles — blank, working, done. One thumb, no
  reading. That is what happens while work is going on.
- **Open a hold** and every state is spelled out, including *N/A*, with a note
  field. That is for the exceptions — a tank out of scope, water found in a
  hold — which are rare and worth slowing down for.

`N/A` is never reached by cycling. It excludes that cell from the progress
denominator, so a compartment outside the scope of the job cannot hold a vessel
at 99% forever, and it is too consequential to set by accident.

## Sessions

Sign-in returns the API's JWT and it is stored as-is in AsyncStorage. It is
never inspected or verified here — this app has no secret to verify it with and
should not have one. The API is the authority on every request.

Signing out clears the session, the cached vessels **and the queue**. Queued
work belongs to the person who tapped it; sending it under the next
supervisor's name would put the wrong name in the audit trail.

## What it deliberately does not do

- **No admin.** Creating vessels, defining stages and assigning supervisors are
  office jobs and live on the website. This app is one role doing one job.
- **No push notifications.** Nothing yet needs to interrupt someone on a deck.
- **No photos.** The queue is sized for small records. Photos would want
  IndexedDB-style storage and an upload pipeline; that is a separate piece of
  work, not a flag to flip.
