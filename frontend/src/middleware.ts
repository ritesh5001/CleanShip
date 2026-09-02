import { NextResponse, type NextRequest } from "next/server";

/**
 * Serves Hold Watch on its own subdomain from this one app.
 *
 * `holdwatch.cleanship.co/app` is rewritten to `/holdwatch/app` internally.
 * The visitor's URL never changes — they see the subdomain, Next sees the
 * path — so there is one deployment, one build and one session cookie instead
 * of a second project to keep in step.
 *
 * A rewrite, not a redirect: a redirect would bounce the supervisor's phone to
 * the marketing domain and lose the subdomain the whole arrangement exists for.
 *
 * Locally there is no subdomain, so /holdwatch/* is reachable directly and
 * this does nothing.
 */
const HOLDWATCH_HOSTS = ["holdwatch."];

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const isHoldWatchHost = HOLDWATCH_HOSTS.some((h) => host.startsWith(h));

  if (!isHoldWatchHost) return NextResponse.next();

  const { pathname } = request.nextUrl;

  /* Already prefixed (an internal link that hard-coded the path), or an asset
     route that must not be rewritten. */
  if (
    pathname.startsWith("/holdwatch") ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/")
  ) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/holdwatch${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  /* Everything except Next internals and static files. Keeping the matcher
     tight matters: middleware runs on every matched request. */
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|svg|webp|ico|txt|xml|webmanifest)$).*)"],
};
