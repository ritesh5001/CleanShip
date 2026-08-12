import Image from "next/image";
import type { StockImage } from "@/lib/stock-images";

/**
 * Photographic backdrop for a solid-colour panel.
 *
 * Drop inside a container that is `relative isolate overflow-hidden`; the
 * panel's own content must sit in a `relative` sibling so it stacks above.
 *
 * The overlay is deep navy rather than pure black — the design system is
 * explicit that scrims are navy, never black, and at these opacities it reads
 * as black anyway while keeping the brand's colour temperature.
 *
 * Opacity tiers are chosen so white body text clears WCAG AA against the
 * worst case (a blown-out white frame), not just against these particular
 * photographs — swapping the image later cannot silently break contrast:
 *   veil   0.86  panels with headings and body copy
 *   heavy  0.92  panels with small print, forms or dense text
 */
const OVERLAY = {
  veil: "linear-gradient(180deg, rgba(3,16,31,.88) 0%, rgba(3,16,31,.84) 55%, rgba(3,16,31,.90) 100%)",
  heavy:
    "linear-gradient(180deg, rgba(3,16,31,.93) 0%, rgba(3,16,31,.90) 55%, rgba(3,16,31,.94) 100%)",
} as const;

export function PhotoOverlay({
  image,
  strength = "veil",
  /** Set only where this panel is the largest paint in the viewport. */
  priority = false,
  sizes = "100vw",
}: {
  image: StockImage;
  strength?: keyof typeof OVERLAY;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
      <Image
        src={image.src}
        alt=""
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
      <div className="absolute inset-0" style={{ background: OVERLAY[strength] }} />
    </div>
  );
}
