import { CountUp } from "./motion/count-up";

/**
 * Counter band.
 *
 * The design system rules out animated counters. That rule has been
 * deliberately overridden at the brand owner's direction — the counters now
 * tick up on entry. The SEO-safe part is preserved: `CountUp` renders the
 * final value as server HTML and only overwrites it once on screen, so the
 * real figures are in the source and visible without JavaScript.
 *
 * Figures are set in the mono face with a rationed aqua `+`, per the DS
 * counter spec.
 */

type Stat = { value: number; suffix?: string; label: string };

export function StatsBand({
  stats,
  onNavy = false,
}: {
  stats: Stat[];
  onNavy?: boolean;
}) {
  return (
    <dl
      className={`grid grid-cols-2 border-l border-t lg:grid-cols-4 ${
        onNavy ? "border-white/16" : "border-line-200"
      }`}
    >
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`group border-b border-r px-6 py-8 transition-colors duration-[220ms] lg:px-8 lg:py-10 ${
            onNavy
              ? "border-white/16 hover:bg-white/[0.04]"
              : "border-line-200 hover:bg-ice-50"
          }`}
        >
          <dd
            className={`num-index text-[clamp(38px,4.4vw,58px)] ${
              onNavy ? "text-white" : "text-navy-800"
            }`}
          >
            <CountUp value={stat.value} />
            {stat.suffix && (
              <span className="text-aqua-500">{stat.suffix}</span>
            )}
          </dd>
          <dt
            className={`label-caps mt-3 text-[12px] ${
              onNavy ? "text-white/60" : "text-slate-500"
            }`}
          >
            {stat.label}
          </dt>
        </div>
      ))}
    </dl>
  );
}
