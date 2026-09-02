import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { JsonLd } from "@/components/json-ld";
import { ScrollTriggerRefresh } from "@/components/motion/scroll-fx";
import { WhatsAppFloat } from "@/components/whatsapp-cta";
import { Analytics } from "@/components/analytics";
import { BASE_URL, organizationSchema, websiteSchema } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

/* The DS specifies Barlow Condensed for display, Barlow for body and IBM Plex
   Mono for spec figures. These are flagged in the DS as substitutions for the
   brochure's industrial sans — swap them here if licensed faces arrive.
 *
 * SELF-HOSTED via next/font/local, not next/font/google.
 *
 * next/font/google downloads its font files from Google's servers DURING THE
 * BUILD, not at request time. That network call worked on Vercel and locally
 * but failed silently on Render's build sandbox, and a failed font fetch
 * surfaces as a wildly misleading error — Next falls back to rendering its
 * default error page and trips over an unrelated internal check, producing
 * "<Html> should not be imported outside of pages/_document" with no mention
 * of fonts anywhere in the trace.
 *
 * The .woff2 files below are vendored into the repo (latin subset, the exact
 * weights this file requests, fetched from the same Google Fonts CDN
 * next/font/google would have called) so the build depends on nothing outside
 * the repository, on every host, forever. Barlow, Barlow Condensed and IBM
 * Plex Mono are all licensed under the SIL Open Font License — see
 * src/app/fonts/OFL.txt.
 */
const barlowCondensed = localFont({
  src: [
    { path: "./fonts/barlow-condensed-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/barlow-condensed-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/barlow-condensed-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-barlow-condensed",
  display: "swap",
});

const barlow = localFont({
  src: [
    { path: "./fonts/barlow-300.woff2", weight: "300", style: "normal" },
    { path: "./fonts/barlow-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/barlow-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/barlow-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/barlow-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-barlow",
  display: "swap",
});

const plexMono = localFont({
  src: [
    { path: "./fonts/ibm-plex-mono-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/ibm-plex-mono-500.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default:
      "Cleanship Marine Services | Underwater Hull & Tank Cleaning",
    /* Every child page supplies only its own title; the brand is appended
       here. Kept to "| Cleanship" — the old "| Cleanship Marine Services"
       suffix consumed 30 of the ~60 characters Google shows before it
       truncates, so page titles were being cut mid-phrase in results. */
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.shortDescription,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.legalName }],
  creator: siteConfig.legalName,
  publisher: siteConfig.legalName,
  category: "Marine Services",
  alternates: { canonical: "/" },
  /* A plain file rather than app/manifest.ts. The file convention injects its
     link globally and cannot be overridden by a nested layout, which meant
     CleanTrack's install prompt served the marketing manifest. */
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_AE",
    url: BASE_URL,
    siteName: siteConfig.name,
    title: "Cleanship Marine Services | Underwater Hull & Tank Cleaning",
    description: siteConfig.shortDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: "Cleanship Marine Services",
    description: siteConfig.shortDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  /* No formatDetection block. Next.js emits `telephone=no` for anything
     declared here, which switched OFF tap-to-call on mobile — on a site whose
     primary CTA is "call the 24/7 desk". Omitting it restores the browser
     default, which is to detect. */
};

export const viewport: Viewport = {
  themeColor: "#06203a",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    /* suppressHydrationWarning covers the data-js attribute that the inline
       script below writes onto <html> before React hydrates. Without it React
       reports an attribute mismatch on every page load. It applies only to
       this element's own attributes, so genuine mismatches in the tree below
       are still reported. */
    <html
      lang="en"
      className={`${barlowCondensed.variable} ${barlow.variable} ${plexMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Marks the document as JS-capable before first paint, which is what
            arms the scroll-reveal animations. If this never runs, every
            .reveal element simply stays visible — content is never hidden
            behind JavaScript. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.setAttribute('data-js','true')`,
          }}
        />
      </head>
      <body className="min-h-screen antialiased">
        {/* Organization and WebSite nodes live in the layout so they appear
            once per page and every other schema can reference them by @id. */}
        <JsonLd schema={[organizationSchema(), websiteSchema()]} />

        <a
          href="#main"
          className="label-caps sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:bg-blue-600 focus:px-5 focus:py-3 focus:text-white"
        >
          Skip to content
        </a>

        {/* ScrollTrigger caches document height on creation; after a
            client-side route change those measurements describe the previous
            page. This re-measures once the new route has painted. */}
        <ScrollTriggerRefresh />

        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />

        {/* Persistent enquiry path — WhatsApp is the default channel for
            agents and superintendents in the Gulf. */}
        <WhatsAppFloat />

        {/* Last in the body and afterInteractive, so the tag never competes
            with LCP. See the notes in the component. */}
        <Analytics />
      </body>
    </html>
  );
}
