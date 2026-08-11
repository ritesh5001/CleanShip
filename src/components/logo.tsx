import Image from "next/image";
import { siteConfig } from "@/lib/site";

/**
 * Brand lockup — the supplied logo file.
 *
 * The artwork is a transparent WebP (950x250) containing the propeller mark,
 * the CLEANSHIP wordmark and the "Your Cargo Our Passion" tagline. It is a
 * complete lockup, so nothing else is set in type beside it.
 *
 * On navy the blue artwork would sit at poor contrast, so it is rendered white
 * with `brightness(0) invert(1)`. That flattens every non-transparent pixel to
 * white while preserving the alpha channel — correct here precisely because
 * the mark is a single flat colour. It would destroy a multi-colour logo, so
 * this shortcut does not survive a rebrand.
 */
export function Logo({
  onNavy = false,
  /* Height-constrained by default — the source is 950px wide and would
     otherwise render at natural size. */
  className = "h-9 w-auto sm:h-10",
  priority = false,
}: {
  onNavy?: boolean;
  className?: string;
  /** Set on the header instance so the mark is not lazy-loaded. */
  priority?: boolean;
}) {
  return (
    <Image
      src="/brand/cleanship-logo.webp"
      alt={`${siteConfig.legalName} — ${siteConfig.tagline}`}
      width={950}
      height={250}
      priority={priority}
      className={`h-auto w-auto ${className}`}
      style={onNavy ? { filter: "brightness(0) invert(1)" } : undefined}
    />
  );
}
