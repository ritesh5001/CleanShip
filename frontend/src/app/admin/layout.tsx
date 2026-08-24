import type { Metadata } from "next";

/**
 * The admin area was returning `index, follow` — the CMS login and dashboard
 * were both indexable. Nothing sensitive leaks (the data loads client-side
 * behind auth), but an indexed login page is a phishing target and a wasted
 * crawl budget line, and it turned up as a duplicate-description page in the
 * audit because it inherits the site-wide default.
 *
 * The protected layout below this is a client component and cannot export
 * metadata, which is why this server layout exists at the segment root.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
