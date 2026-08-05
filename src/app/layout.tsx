import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { JsonLd } from "@/components/json-ld";
import { BASE_URL, organizationSchema, websiteSchema } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-sora",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default:
      "Cleanship Marine Services | Hold, Tank & Hull Cleaning Specialists",
    // Every child page supplies only its own title; the brand is appended here.
    template: `%s | ${siteConfig.name} Marine Services`,
  },
  description: siteConfig.shortDescription,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.legalName }],
  creator: siteConfig.legalName,
  publisher: siteConfig.legalName,
  category: "Marine Services",
  keywords: [
    "hold cleaning",
    "tank cleaning",
    "underwater hull cleaning",
    "propeller polishing",
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
    title: "Cleanship Marine Services | Hold, Tank & Hull Cleaning Specialists",
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
  themeColor: "#04121f",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`}>
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
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-full focus:bg-aqua-400 focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-abyss-950"
        >
          Skip to content
        </a>

        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
