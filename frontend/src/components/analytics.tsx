import Script from "next/script";

/**
 * Google Analytics 4 (gtag.js).
 *
 * NOT Google Tag Manager. The two get used interchangeably and they are
 * different installs: GTM is a container (`GTM-XXXXXXX`) that loads other tags
 * including GA, while this is GA4 direct (`G-XXXXXXXXXX`). If a GTM container
 * is added later, GA should move inside it and this component should be
 * removed — running both is the standard way to end up counting every event
 * twice.
 *
 * WHY `afterInteractive`
 *
 * The audit flagged Core Web Vitals as unverified, and analytics is the most
 * common way a fast page becomes a slow one. `afterInteractive` loads the tag
 * once the page is interactive, so it never competes with LCP. `beforeInteractive`
 * would block, and `lazyOnload` would miss short sessions — bounces are exactly
 * the sessions worth measuring.
 *
 * WHY IT DOES NOT RUN IN DEVELOPMENT
 *
 * `npm run dev` sets NODE_ENV to "development", so local page views, hot
 * reloads and test runs never reach the property. Without that guard the
 * first week of data is mostly you.
 */

/** Public by nature — the measurement ID is visible in the page source. */
const MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_ID ?? "G-JTD0RRJZ50";

export function Analytics() {
  if (process.env.NODE_ENV !== "production" || !MEASUREMENT_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}
