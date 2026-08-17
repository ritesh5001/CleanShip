import { siteConfig } from "@/lib/site";

/**
 * Brand lockup — PLACEHOLDER.
 *
 * No CleanHull artwork has been supplied yet, so this is set in type rather
 * than shipping a broken <Image> or, worse, the CleanShip mark on a CleanHull
 * page. It uses the display face already loaded by the layout, so it costs
 * nothing extra and reads as a deliberate wordmark rather than a gap.
 *
 * TO SWAP IN THE REAL LOGO: drop the artwork in `public/brand/`, then replace
 * the markup below with next/image — keep the same props, since the header and
 * footer both rely on `onNavy` and `className`.
 */
export function Logo({
  onNavy = false,
  /* Height-constrained by default so the wordmark sits on the same baseline
     grid the image lockup used. */
  className = "h-9 sm:h-10",
}: {
  onNavy?: boolean;
  className?: string;
  /** Accepted for API parity with the image lockup; a text mark never lazy-loads. */
  priority?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center ${className}`}
      aria-label={`${siteConfig.legalName} — ${siteConfig.tagline}`}
    >
      <span className="font-display text-[26px] font-bold uppercase leading-none tracking-tight sm:text-[30px]">
        <span className={onNavy ? "text-white" : "text-navy-800"}>Clean</span>
        <span className={onNavy ? "text-aqua-400" : "text-blue-600"}>Hull</span>
      </span>
    </span>
  );
}
