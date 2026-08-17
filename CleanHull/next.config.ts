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
