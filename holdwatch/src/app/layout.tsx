import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Hold Watch", template: "%s | Hold Watch" },
  description:
    "Live hold and tank cleaning progress — updated from the vessel, visible to the client as it happens.",
  applicationName: "Hold Watch",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Hold Watch" },
  /* This is an internal operations tool. Nothing here should ever appear in a
     search result — jobs name real vessels, ports and clients. */
  robots: { index: false, follow: false, nocache: true },
};

export const viewport: Viewport = {
  themeColor: "#0a2e52",
  width: "device-width",
  initialScale: 1,
  /* No maximumScale: pinch-zoom must stay available. A supervisor reading a
     hold number in bright sun needs it more than the layout needs protecting. */
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
