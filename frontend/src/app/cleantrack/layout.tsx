import type { Metadata, Viewport } from "next";

/**
 * CleanTrack runs inside the marketing app but is a different product with
 * different rules — chiefly that none of it may ever be indexed. Jobs name
 * real vessels, ports and clients.
 *
 * The root layout sets `index, follow` for the marketing site; this overrides
 * it for the whole subtree rather than relying on every page to remember.
 */
export const metadata: Metadata = {
  title: { default: "CleanTrack", template: "%s | CleanTrack" },
  description:
    "Live hold and tank cleaning progress — updated from the vessel, visible to the client as it happens.",
  applicationName: "CleanTrack",
  manifest: "/cleantrack.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "CleanTrack",
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

export default function CleanTrackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="ct-root bg-slate-50 text-slate-900">{children}</div>;
}
