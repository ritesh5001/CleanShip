import Image from "next/image";
import Link from "next/link";
import { ArrowIcon } from "./icons";
import { StaggerGroup } from "./motion/scroll-reveal";
import { serviceCategories } from "@/lib/services";
import { stockImages } from "@/lib/stock-images";

/**
 * Image-led band for the five service lines.
 *
 * Each tile pulls the still that already exists for that line: the video
 * poster where footage was supplied, a stock photograph where it was not. So
 * the grid stays visually consistent while the real footage gradually
 * replaces the placeholders — swapping a stock entry for a poster is a
 * one-line change here.
 *
 * Ordered from `serviceCategories`, so it follows the same hull-cleaning-first
 * priority as the rest of the site rather than hard-coding a sequence.
 */

/** Poster where a clip exists, stock photograph where it does not. */
const TILE_IMAGE: Record<string, { src: string; alt: string }> = {
  "hull-cleaning": {
    src: "/posters/underwater-hull-cleaning.jpg",
    alt: "Diver cleaning marine growth from a vessel's underwater hull",
  },
  "hold-cleaning": stockImages.crewAtWork,
  "tank-cleaning": stockImages.oilTanker,
  offshore: stockImages.offshorePlatform,
  "ndt-and-repair": stockImages.ndtTechnician,
};

/*
 * 4 columns on wide screens: the lead line takes a full-width banner and the
 * remaining four sit in one even row. A 3-column grid left a visible gap
 * beside the lead tile, because a 16:9 tile spanning two columns is taller
 * than a 4:3 tile spanning one.
 */
export function CapabilityGallery() {
  return (
    <StaggerGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {serviceCategories.map((category, i) => {
        const image = TILE_IMAGE[category.slug];
        if (!image) return null;

        // The lead service line gets a full-width banner.
        const wide = i === 0;

        return (
          <Link
            key={category.slug}
            href={`/services/${category.slug}`}
            data-stagger
            className={`group relative isolate block overflow-hidden ${
              wide ? "sm:col-span-2 lg:col-span-4" : ""
            }`}
          >
            <div
              className={`relative w-full ${wide ? "aspect-[16/9] lg:aspect-[24/7]" : "aspect-[4/3]"}`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                // Below the fold on every page that uses this, so it lazy-loads.
                sizes={wide ? "100vw" : "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"}
                className="object-cover transition-transform duration-[700ms] ease-out group-hover:scale-[1.04]"
              />
              {/* Bottom-up navy scrim — the DS's sanctioned photo treatment. */}
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(3,16,31,.10) 0%, rgba(3,16,31,.55) 55%, rgba(3,16,31,.92) 100%)",
                }}
              />
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-aqua-500 transition-transform duration-[220ms] group-hover:scale-x-100"
              />

              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                <span className="num-index text-[13px] text-aqua-400">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 font-display text-[22px] font-bold uppercase leading-tight text-white">
                  {category.name}
                </h3>
                <p className="mt-1.5 line-clamp-2 max-w-[46ch] text-[14px] leading-[1.5] text-white/75">
                  {category.tagline}
                </p>
                <span className="label-caps mt-3 inline-flex items-center gap-2 text-[12px] text-aqua-200">
                  {category.services.length} scopes
                  <ArrowIcon className="size-4 transition-transform duration-[140ms] group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </StaggerGroup>
  );
}
