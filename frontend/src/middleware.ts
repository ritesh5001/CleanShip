import { NextResponse, type NextRequest } from "next/server";

/**
 * Serves CleanTrack on its own subdomain from this one app.
 *
 * `cleantrack.cleanship.co/app` is rewritten to `/cleantrack/app` internally.
 * The visitor's URL never changes — they see the subdomain, Next sees the
 * path — so there is one deployment, one build and one session cookie instead
 * of a second project to keep in step.
 *
 * A rewrite, not a redirect: a redirect would bounce the supervisor's phone to
 * the marketing domain and lose the subdomain the whole arrangement exists for.
 *
 * Locally there is no subdomain, so /cleantrack/* is reachable directly and
 * this does nothing.
 */
const CLEANTRACK_HOSTS = ["cleantrack."];

/**
 * The underwater hull cleaning campaign page, on its own subdomain.
 *
 * `uwc.cleanship.co/` is rewritten to the landing page, so the ad URL stays
 * short and the address bar shows the subdomain. That page is the ONLY thing
 * the subdomain serves: every other path (the service pages the landing page
 * links to, the header and footer navigation) is redirected to the main site,
 * so the whole site is never reachable under a second hostname.
 *
 * The old www path redirects here, so links and ads already pointing at
 * /lp/underwater-hull-cleaning keep working.
 */
const UWC_HOST = "uwc.";
const UWC_ORIGIN = "https://uwc.cleanship.co";
const UWC_PAGE = "/lp/underwater-hull-cleaning";
const MAIN_ORIGIN = "https://www.cleanship.co";

/** Next internals, API routes and anything that looks like a file. */
function isPassthrough(pathname: string) {
  return (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    /\.[a-z0-9]+$/i.test(pathname)
  );
}

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const { pathname, search } = request.nextUrl;

  if (host.startsWith(UWC_HOST)) {
    if (isPassthrough(pathname)) return NextResponse.next();
    if (pathname === "/") {
      const url = request.nextUrl.clone();
      url.pathname = UWC_PAGE;
      return NextResponse.rewrite(url);
    }
    /* The landing page's own path on the subdomain collapses to the root. */
    if (pathname === UWC_PAGE) {
      return NextResponse.redirect(`${UWC_ORIGIN}/${search}`, 308);
    }
    return NextResponse.redirect(`${MAIN_ORIGIN}${pathname}${search}`, 308);
  }

  /* Only on the real domain — previews and localhost keep the /lp path. */
  if (pathname === UWC_PAGE && host.endsWith("cleanship.co")) {
    return NextResponse.redirect(`${UWC_ORIGIN}/${search}`, 308);
  }

  const isCleanTrackHost = CLEANTRACK_HOSTS.some((h) => host.startsWith(h));
  if (!isCleanTrackHost) return NextResponse.next();

  /* Already prefixed (an internal link that hard-coded the path), or an asset
     route that must not be rewritten. */
  if (
    pathname.startsWith("/cleantrack") ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/")
  ) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/cleantrack${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  /* Everything except Next internals and static files. Keeping the matcher
     tight matters: middleware runs on every matched request. */
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|svg|webp|ico|txt|xml|webmanifest)$).*)"],
};
