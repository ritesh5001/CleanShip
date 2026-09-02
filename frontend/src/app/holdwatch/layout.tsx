import type { Metadata, Viewport } from "next";

/**
 * Hold Watch runs inside the marketing app but is a different product with
 * different rules — chiefly that none of it may ever be indexed. Jobs name
 * real vessels, ports and clients.
 *
 * The root layout sets `index, follow` for the marketing site; this overrides
 * it for the whole subtree rather than relying on every page to remember.
 */
export const metadata: Metadata = {
  title: { default: "Hold Watch", template: "%s | Hold Watch" },
  description:
    "Live hold and tank cleaning progress — updated from the vessel, visible to the client as it happens.",
  applicationName: "Hold Watch",
  manifest: "/holdwatch.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Hold Watch",
  },
  robots: { index: false, follow: false, nocache: true },
};

export const viewport: Viewport = {
  themeColor: "#0a2e52",
  /* No maximumScale — a supervisor reading a hold number in bright sun needs
     pinch-zoom more than the layout needs protecting. */
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function HoldWatchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="hw-root bg-slate-50 text-slate-900">{children}</div>;
}
