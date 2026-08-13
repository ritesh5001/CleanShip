import type { Metadata, Viewport } from "next";
import { Barlow, Barlow_Condensed, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { JsonLd } from "@/components/json-ld";
import { ScrollTriggerRefresh } from "@/components/motion/scroll-fx";
import { WhatsAppFloat } from "@/components/whatsapp-cta";
import { BASE_URL, organizationSchema, websiteSchema } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

/* The DS specifies Barlow Condensed for display, Barlow for body and IBM Plex
   Mono for spec figures. These are flagged in the DS as substitutions for the
   brochure's industrial sans — swap them here if licensed faces arrive. */
const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-barlow-condensed",
  display: "swap",
});

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-barlow",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
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
  keywords: [
    "underwater hull cleaning",
    "propeller polishing",
    "in-water survey",
    "hold cleaning",
    "tank cleaning",
    "riding crew",
    "marine NDT",
    "hydroblasting",
    "ship cleaning UAE",
    "Ajman marine services",
  ],
  alternates: { canonical: "/" },
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
  formatDetection: { telephone: true, address: true, email: true },
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
      </body>
    </html>
  );
}
