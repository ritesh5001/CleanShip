import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    /**
     * Image optimization is OFF deliberately.
     *
     * Vercel's optimizer returned 402 OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED
     * on this account, which breaks every next/image on the deployed site —
     * the logo and all the video-hero posters rendered as broken images while
     * the raw files served fine.
     *
     * Nothing here needs the optimizer anyway: the logo ships as a 58KB WebP
     * and the posters are ffmpeg-encoded JPEGs already sized for their slot.
     * Turning it off serves those files directly, for free, with no quota.
     *
     * REVISIT THIS when real vessel photography is added. Large unprocessed
     * photos DO benefit from the optimizer — at that point either raise the
     * Vercel plan and delete this flag, or pre-process the photos the way the
     * posters are handled in scripts/compress-videos.sh.
     */
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
  },
  /**
   * Legacy location pages → the port programme that replaced them.
   *
   * These URLs were thin pages that canonicalised to their parent service
   * page, which told Google to consolidate the signal there and drop them —
   * so they could never rank for the port term they were written for. Their
   * replacements (lib/ports) carry real port content and self-canonicalise.
   *
   * 301, not 302: the intent is to move the URL permanently and pass whatever
   * equity these pages have accumulated. Do not delete these entries — the
   * old URLs may be linked from agent emails, directories and old quotes long
   * after the pages are gone.
   *
   * `/hold-cleaning-in-kakinada-port` is absent on purpose: the generated
   * page takes over that exact URL, so there is nothing to redirect.
   */
  async redirects() {
    const moved: [string, string][] = [
      // India
      ["/ship-hold-cleaning-in-kandla-port", "/hold-cleaning-in-kandla-port"],
      ["/ship-hold-cleaning-in-mumbai-port", "/hold-cleaning-in-mumbai-port"],
      [
        "/cargo-hold-cleaning-in-vizag-port",
        "/cargo-hold-cleaning-in-visakhapatnam-port",
      ],
      // UAE — the legacy slugs bundled "hold tank cleaning" into one page;
      // they land on the hold-cleaning port hub, which links across to tank.
      ["/hold-cleaning-in-sharjah", "/hold-cleaning-in-sharjah-port"],
      ["/hold-cleaning-in-khorfakkan", "/hold-cleaning-in-khor-fakkan-port"],
      [
        "/hold-tank-cleaning-service-at-jebel-ali-port",
        "/hold-cleaning-in-jebel-ali-port",
      ],
      [
        "/hold-tank-cleaning-service-at-rashid-port",
        "/hold-cleaning-in-rashid-port",
      ],
      [
        "/hold-tank-cleaning-service-at-ajman-port",
        "/hold-cleaning-in-ajman-port",
      ],
      [
        "/hold-tank-cleaning-service-at-mina-saqr-port",
        "/hold-cleaning-in-mina-saqr-port",
      ],
      /* Note the typo in the legacy slug — "ras-ai-khaimah". It shipped that
         way, so it is redirected as it shipped. */
      [
        "/hold-tank-cleaning-service-at-ras-ai-khaimah-port",
        "/hold-cleaning-in-ras-al-khaimah-port",
      ],
      [
        "/hold-tank-cleaning-service-at-uaq-port",
        "/hold-cleaning-in-umm-al-quwain-port",
      ],
      [
        "/hold-tank-cleaning-service-at-ruwais-port",
        "/hold-cleaning-in-ruwais-port",
      ],
    ];

    return moved.map(([source, destination]) => ({
      source,
      destination,
      permanent: true,
    }));
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
