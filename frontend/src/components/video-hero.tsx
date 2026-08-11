"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import manifest from "@/lib/video-manifest.json";

/**
 * Background video layer for service heroes.
 *
 * PERFORMANCE CONTRACT
 * --------------------
 * The poster image is the LCP element, not the video. It renders immediately
 * via next/image (which negotiates AVIF/WebP and emits a responsive srcset),
 * and the video is layered on top and faded in only once it can actually
 * play. That ordering matters: a `<video>` with a `poster` attribute makes the
 * browser wait on video metadata before painting, whereas an `<img>` paints on
 * its own schedule.
 *
 * The video is never fetched at all when:
 *   · the user prefers reduced motion
 *   · the browser reports a Save-Data preference or a 2g/slow-2g connection
 *
 * In those cases the poster simply stays, which is a perfectly good hero.
 */
export function VideoBackdrop({
  slug,
  alt,
}: {
  slug: string;
  alt: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [playing, setPlaying] = useState(false);

  const webmFirst =
    (manifest as Record<string, { preferred?: string } | undefined>)[slug]
      ?.preferred !== "mp4";

  const sources = webmFirst
    ? [
        { src: `/videos/${slug}.webm`, type: "video/webm" },
        { src: `/videos/${slug}.mp4`, type: "video/mp4" },
      ]
    : [
        { src: `/videos/${slug}.mp4`, type: "video/mp4" },
        { src: `/videos/${slug}.webm`, type: "video/webm" },
      ];

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Connection API is Chromium-only; absence is treated as "fine to load".
    const conn = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;

    if (conn?.saveData) return;
    if (conn?.effectiveType && /^(slow-)?2g$/.test(conn.effectiveType)) return;

    // Defer past first paint so the video never competes with the poster,
    // the fonts or hydration for bandwidth.
    const start = () => setShouldLoad(true);
    if ("requestIdleCallback" in window) {
      const id = (
        window as Window & {
          requestIdleCallback: (cb: () => void, o?: { timeout: number }) => number;
        }
      ).requestIdleCallback(start, { timeout: 2500 });
      return () =>
        (
          window as Window & { cancelIdleCallback?: (h: number) => void }
        ).cancelIdleCallback?.(id);
    }
    const t = setTimeout(start, 1200);
    return () => clearTimeout(t);
  }, []);

  // Autoplay can still be refused (low power mode, browser policy). If it is,
  // `playing` stays false and the poster remains visible — no broken frame.
  useEffect(() => {
    if (!shouldLoad) return;
    const v = videoRef.current;
    if (!v) return;
    v.play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));
  }, [shouldLoad]);

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      {/* Poster — the LCP element. */}
      <Image
        src={`/posters/${slug}.jpg`}
        alt={alt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      {shouldLoad && (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="auto"
          poster={`/posters/${slug}.jpg`}
          onPlaying={() => setPlaying(true)}
          className={`absolute inset-0 size-full object-cover transition-opacity duration-[900ms] ease-out ${
            playing ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Ordered smallest-first from the encode manifest — browsers take
              the first <source> they support, and VP9 is not always the
              smaller of the two for high-motion water footage. */}
          {sources.map((s) => (
            <source key={s.type} src={s.src} type={s.type} />
          ))}
        </video>
      )}

      {/* Navy scrims — the design system's only sanctioned gradients. The
          left wash carries the copy; the bottom fade seats the section into
          the page below it. */}
      {/* Scrim direction follows the copy.
          On desktop the copy sits in a left column, so the wash runs
          left-to-right and the footage stays visible on the right. On mobile
          the copy is full-width and bottom-anchored, so a horizontal wash
          would leave the end of the heading over bright video — there it runs
          bottom-up instead.

          Both hold >=0.72 wherever text lands. Against the worst case (a
          blown-out white frame) that composites to ~#4a545e, keeping white
          text at ~6.3:1 — comfortably past AA. */}
      <div
        className="absolute inset-0 sm:hidden"
        style={{
          background:
            "linear-gradient(0deg, rgba(3,16,31,.92) 0%, rgba(3,16,31,.80) 45%, rgba(3,16,31,.38) 100%)",
        }}
      />
      <div
        className="absolute inset-0 hidden sm:block"
        style={{
          background:
            "linear-gradient(90deg, rgba(3,16,31,.90) 0%, rgba(3,16,31,.74) 48%, rgba(3,16,31,.32) 100%)",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-40"
        style={{
          background:
            "linear-gradient(180deg, rgba(3,16,31,0) 0%, rgba(3,16,31,.85) 100%)",
        }}
      />
    </div>
  );
}
