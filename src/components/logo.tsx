import { siteConfig } from "@/lib/site";

/**
 * Wordmark with an inline mark. Drawn as SVG rather than an image file so it
 * stays crisp at any size, needs no network request, and inherits colour.
 */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <svg
        viewBox="0 0 40 40"
        className="h-full w-auto shrink-0"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="cs-logo" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#93d0ff" />
            <stop offset="100%" stopColor="#217ce4" />
          </linearGradient>
        </defs>
        <circle cx="20" cy="20" r="19" fill="url(#cs-logo)" opacity="0.12" />
        <circle
          cx="20"
          cy="20"
          r="19"
          fill="none"
          stroke="url(#cs-logo)"
          strokeWidth="1.5"
        />
        {/* Hull silhouette */}
        <path
          d="M9 22h22l-2.6 5a2.4 2.4 0 0 1-2.1 1.3H13.7a2.4 2.4 0 0 1-2.1-1.3Z"
          fill="url(#cs-logo)"
        />
        {/* Superstructure */}
        <path
          d="M13 22v-7h10l3.4 7"
          fill="none"
          stroke="url(#cs-logo)"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        {/* Waterline */}
        <path
          d="M8 31.5c1.7 0 1.7-1.3 3.4-1.3s1.7 1.3 3.4 1.3 1.7-1.3 3.4-1.3 1.7 1.3 3.4 1.3 1.7-1.3 3.4-1.3 1.7 1.3 3.4 1.3"
          fill="none"
          stroke="#93d0ff"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.8"
        />
      </svg>
      <span className="flex flex-col leading-none">
        <span className="font-display text-xl font-semibold tracking-tight text-white">
          {siteConfig.name}
        </span>
        <span className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.22em] text-marine-400">
          Marine Services
        </span>
      </span>
    </span>
  );
}
