import Image from "next/image";
import Link from "next/link";
import { ArrowIcon } from "./icons";
import { StaggerGroup } from "./motion/scroll-reveal";
import { hullCleaning } from "@/lib/services";

/**
 * Image-led band for the five hull scopes.
 *
 * Each tile pulls the poster still already generated for that scope's hero
 * clip, so the grid needs no photography of its own and stays in step with the
 * footage automatically.
 *
 * Ordered from `hullCleaning.services`, so it follows the same sequence as the
 * mega-menu and the /services index rather than hard-coding one.
 */

/** Poster frame from each scope's hero clip. */
const TILE_IMAGE: Record<string, { src: string; alt: string }> = {
  "underwater-hull-cleaning": {
    src: "/posters/underwater-hull-cleaning.jpg",
    alt: "Diver cleaning marine growth from a vessel's underwater hull",
  },
  "thruster-cleaning-polishing": {
    src: "/posters/thruster-cleaning-polishing.jpg",
    alt: "Diver working inside a bow thruster tunnel",
  },
  "propeller-super-polishing": {
    src: "/posters/propeller-super-polishing.jpg",
    alt: "Diver polishing a ship's propeller blade underwater",
  },
  "in-water-class-survey": {
    src: "/posters/in-water-class-survey.jpg",
    alt: "Diver carrying out an in-water class survey on a vessel's hull",
  },
  // UWILD is the same operation performed for drydocking credit.
  uwild: {
    src: "/posters/in-water-class-survey.jpg",
    alt: "Diver carrying out an underwater inspection in lieu of drydocking",
  },
};

/*
 * 4 columns on wide screens: the lead line takes a full-width banner and the
 * remaining four sit in one even row. A 3-column grid left a visible gap
 * beside the lead tile, because a 16:9 tile spanning two columns is taller
 * than a 4:3 tile spanning one.
 */
export function CapabilityGallery({
  /**
   * Heading level for the tiles. On the home page the gallery sits under a
   * section <h2>, so h3 is correct; on /services it follows the <h1> directly
   * with no h2 between, and h3 there would skip a level — an accessibility
   * fault and a structure signal search engines read.
   */
  headingLevel = "h3",
}: {
  headingLevel?: "h2" | "h3";
} = {}) {
  const Heading = headingLevel;
  return (
    <StaggerGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {hullCleaning.services.map((service, i) => {
        const image = TILE_IMAGE[service.slug];
        if (!image) return null;

        // The flagship scope gets a full-width banner.
        const wide = i === 0;

        return (
          <Link
            key={service.slug}
            href={`/services/${hullCleaning.slug}/${service.slug}`}
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
                <Heading className="mt-2 font-display text-[22px] font-bold uppercase leading-tight text-white">
                  {service.name}
                </Heading>
                <p className="mt-1.5 line-clamp-2 max-w-[46ch] text-[14px] leading-[1.5] text-white/75">
                  {service.tagline}
                </p>
                <span className="label-caps mt-3 inline-flex items-center gap-2 text-[12px] text-aqua-200">
                  Read more
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
