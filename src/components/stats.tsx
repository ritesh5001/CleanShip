/**
 * Counter band.
 *
 * Deliberately a server component with static figures: the design system
 * explicitly rules out animated counters ("no bounce, no spring, no parallax,
 * no scroll-triggered choreography, no animated counters"). The numbers are
 * set in the mono face with a rationed aqua `+`, per the DS counter spec.
 */

type Stat = { value: string; suffix?: string; label: string };

export function StatsBand({
  stats,
  onNavy = false,
}: {
  stats: Stat[];
  onNavy?: boolean;
}) {
  return (
    <dl
      className={`grid grid-cols-2 border-t border-l lg:grid-cols-4 ${
        onNavy ? "border-white/16" : "border-line-200"
      }`}
    >
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`border-b border-r px-6 py-8 lg:px-8 lg:py-10 ${
            onNavy ? "border-white/16" : "border-line-200"
          }`}
        >
          <dd
            className={`tabular text-[38px] leading-none lg:text-[46px] ${
              onNavy ? "text-white" : "text-navy-800"
            }`}
          >
            {stat.value}
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
