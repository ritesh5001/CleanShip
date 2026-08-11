import type { ReactNode } from "react";
import { Breadcrumbs } from "./ui";
import { VideoBackdrop } from "./video-hero";
import type { HeroMedia } from "@/lib/service-media";

/**
 * Interior page banner — the breadcrumb trail, the H1 and a lead paragraph.
 * One component so every inner page shares an identical heading structure,
 * which matters for both SEO and screen readers.
 *
 * With `media` it becomes a full-bleed video hero; without it, the plain navy
 * plate. Pages that have no footage are not a degraded case — they simply use
 * the other treatment.
 */
export function PageHero({
  eyebrow,
  title,
  description,
  trail,
  media,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  trail: { name: string; path: string }[];
  /** Supply to render footage behind the copy. */
  media?: HeroMedia | null;
  children?: ReactNode;
}) {
  const hasVideo = Boolean(media);

  return (
    <section
      className={`on-navy relative isolate overflow-hidden ${
        hasVideo ? "bg-abyss-950" : "bg-navy-900"
      }`}
    >
      {media && <VideoBackdrop slug={media.slug} alt={media.alt} />}

      <div
        className={`container-page relative ${
          hasVideo
            ? "flex min-h-[clamp(420px,58vh,620px)] flex-col justify-end py-14 lg:py-20"
            : "py-12 lg:py-16"
        }`}
      >
        <Breadcrumbs trail={trail} onNavy />

        <div className="mt-8 max-w-4xl">
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          {/* Never animated: this is the LCP text on every interior page. */}
          <h1 className="text-h1 mt-5 font-display text-white">{title}</h1>
          {description && (
            <p className="mt-6 max-w-[62ch] text-[18px] leading-[1.62] text-white/80">
              {description}
            </p>
          )}
        </div>

        {children}
      </div>

      {/* Brand rule seating the hero against the content below. */}
      {hasVideo && (
        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-[3px] bg-aqua-500"
        />
      )}
    </section>
  );
}
