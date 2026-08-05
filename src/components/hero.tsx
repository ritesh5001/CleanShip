import Link from "next/link";
import { Button } from "./ui";
import { ArrowIcon, CheckIcon, ShieldIcon } from "./icons";
import { totalServiceCount } from "@/lib/services";

const trustPoints = [
  "IMO & port-compliant procedures",
  "Eco-friendly cleaning systems",
  "Certified riding crews & divers",
];

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden pb-24 pt-16 lg:pb-32 lg:pt-24">
      {/* ---------- Ambient background ---------- */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        {/* Deep gradient wash */}
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_75%_0%,#123a6b_0%,#0a1e31_45%,#04121f_100%)]" />
        {/* Engineering grid, faded at the edges */}
        <div className="grid-lines mask-fade absolute inset-0 opacity-60" />
        {/* Drifting light sources */}
        <div className="absolute -right-40 top-0 size-[38rem] animate-drift rounded-full bg-marine-500/18 blur-[110px]" />
        <div className="absolute -left-52 top-40 size-[32rem] rounded-full bg-abyss-500/25 blur-[120px]" />
        {/* Waterline curve at the base of the hero */}
        <svg
          className="absolute inset-x-0 bottom-0 h-32 w-full text-abyss-950"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            fillOpacity="0.55"
            d="M0 64c160 32 320 48 480 32s320-64 480-64 320 32 480 48v40H0Z"
          />
        </svg>
      </div>

      <div className="container-page">
        <div className="grid items-center gap-16 lg:grid-cols-12">
          {/* ---------- Copy ---------- */}
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-2 rounded-full border border-marine-400/25 bg-marine-400/8 px-4 py-1.5 text-xs font-medium text-marine-300">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-pulse-ring rounded-full bg-marine-400" />
                <span className="relative inline-flex size-1.5 rounded-full bg-marine-300" />
              </span>
              Operations desk manned 24 / 7
            </span>

            <h1 className="mt-6 font-display text-4xl leading-[1.08] text-white sm:text-5xl lg:text-6xl xl:text-[4.25rem]">
              Marine cleaning that{" "}
              <span className="text-gradient">passes first inspection</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-abyss-200 sm:text-lg">
              Cleanship prepares cargo holds, tanks and hulls for bulk carriers,
              tankers, container ships and offshore vessels — with certified
              crews, documented procedures and equipment we bring ourselves.
            </p>

            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
              {trustPoints.map((point) => (
                <li
                  key={point}
                  className="flex items-center gap-2 text-sm text-abyss-200"
                >
                  <span className="flex size-5 items-center justify-center rounded-full bg-marine-400/15 text-marine-300">
                    <CheckIcon className="size-3" />
                  </span>
                  {point}
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button href="/contact">Request a quote</Button>
              <Button href="/services" variant="ghost">
                Explore our services
              </Button>
            </div>
          </div>

          {/* ---------- Visual ---------- */}
          <div className="relative lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Sonar rings behind the panel */}
              <div
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 -z-10 size-[26rem] -translate-x-1/2 -translate-y-1/2"
              >
                {[0, 1, 2].map((ring) => (
                  <span
                    key={ring}
                    className="absolute inset-0 rounded-full border border-marine-400/12"
                    style={{
                      transform: `scale(${0.5 + ring * 0.25})`,
                    }}
                  />
                ))}
              </div>

              {/* Main capability panel */}
              <div className="glass animate-float rounded-4xl p-7 shadow-2xl shadow-abyss-950/60">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-abyss-400">
                      Service lines
                    </p>
                    <p className="mt-1 font-display text-3xl text-white">
                      {totalServiceCount} scopes
                    </p>
                  </div>
                  <span className="flex size-11 items-center justify-center rounded-2xl bg-marine-400/12 text-marine-300 ring-1 ring-marine-400/25">
                    <ShieldIcon className="size-5" />
                  </span>
                </div>

                <div className="mt-6 space-y-3">
                  {[
                    { label: "Hold cleaning", value: "Shore gang · Riding crew" },
                    { label: "Tank cleaning", value: "DPP · CPP · Demucking" },
                    { label: "Hull & underwater", value: "Polishing · UWILD" },
                    { label: "NDT & repair", value: "Inspection · Fabrication" },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3"
                    >
                      <span className="text-sm font-medium text-white">
                        {row.label}
                      </span>
                      <span className="text-xs text-abyss-400">{row.value}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href="/services"
                  className="group mt-6 flex items-center justify-between rounded-xl bg-marine-400/10 px-4 py-3 text-sm font-semibold text-marine-300 transition hover:bg-marine-400/18"
                >
                  See the full scope list
                  <ArrowIcon className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              {/* Response-time strip. Kept in normal flow rather than floated
                  over the panel — an absolute badge here overlapped the
                  panel's own call to action at several viewport widths. */}
              <div className="mt-4 grid grid-cols-2 gap-4">
                {[
                  { value: "12–24h", label: "UAE mobilisation" },
                  { value: "24/7", label: "Operations desk" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="glass rounded-2xl px-5 py-4 shadow-xl shadow-abyss-950/40"
                  >
                    <p className="font-display text-2xl text-white">
                      {item.value}
                    </p>
                    <p className="mt-0.5 text-[11px] uppercase tracking-wider text-abyss-400">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
