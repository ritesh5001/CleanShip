import type { Metadata, Viewport } from "next";
import { Fira_Mono, Fira_Sans, Fira_Sans_Condensed } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { JsonLd } from "@/components/json-ld";
import { Analytics } from "@/components/analytics";
import { company } from "@/content/company";
import { site } from "@/content/site";
import { BASE_URL, organizationSchema, websiteSchema } from "@/lib/seo";

/* Barlow, the family the other Cleanship sites use, has no Greek letters, so
   this site uses Fira Sans: the same engineered, condensed-headline feel with
   full Greek coverage. next/font downloads and self-hosts the files at build
   time; visitors' browsers never call Google. */
const displayFont = Fira_Sans_Condensed({
  subsets: ["greek", "latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display-face",
  display: "swap",
});
const bodyFont = Fira_Sans({
  subsets: ["greek", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body-face",
  display: "swap",
});
const monoFont = Fira_Mono({
  subsets: ["greek", "latin"],
  weight: ["400"],
  variable: "--font-mono-face",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: { default: site.defaultTitle, template: `%s | ${site.brand}` },
  description: site.description,
  applicationName: site.brand,
  authors: [{ name: company.legalName }],
  publisher: company.legalName,
  formatDetection: { telephone: false },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  other: { "geo.region": site.countryCode, "geo.placename": site.countryName },
};

export const viewport: Viewport = { themeColor: "#06203a", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={site.lang} className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable}`}>
      <body>
        <JsonLd schema={[organizationSchema(), websiteSchema()]} />
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-white focus:p-3">
          Μετάβαση στο περιεχόμενο
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <WhatsAppFloat />
        <Analytics />
      </body>
    </html>
  );
}
