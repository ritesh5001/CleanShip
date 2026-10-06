import type { NextConfig } from "next";

/* Fail the build rather than silently shipping the wrong country. */
const SITE = process.env.SITE;
if (SITE !== "ae" && SITE !== "gr") {
  throw new Error(`SITE must be "ae" or "gr" (got ${JSON.stringify(SITE)}). Set it in the Vercel project's environment variables.`);
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  /* Exposed to client components, which cannot read SITE directly. */
  env: { NEXT_PUBLIC_SITE: SITE },
  images: { unoptimized: true },
};

export default nextConfig;
