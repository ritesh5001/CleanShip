import Link from "next/link";
import { Button, CheckList } from "./ui";
import { ArrowIcon } from "./icons";
import { MountTimeline } from "./motion/scroll-reveal";
import { Magnetic } from "./motion/magnetic";
import { serviceCategories, totalServiceCount } from "@/lib/services";

const trustPoints = [
  "Experienced marine cleaning professionals",
  "IMO & port-compliant procedures",
  "Eco-friendly cleaning solutions",
];

/**
 * Home hero — a hard navy split on the deepest plate in the palette.
 *
 * No photography was supplied with the design system, so rather than shipping
 * empty photo frames the right half uses the other device the brochure relies
 * on: a numbered contents index. When real vessel photography arrives this
 * panel is the natural slot for it.
 *
 * The <h1> is the LCP element and is intentionally NOT animated — see
 * MountTimeline's note. Everything around it staggers in instead, which reads
 * as the same effect while leaving the largest paint immediate.
 */
export function Hero() {
  return (
    <section className="on-navy relative overflow-hidden bg-abyss-950">
      {/* Structural grid — a measured drafting rule, not a decorative wash. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.055]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "88px 88px",
        }}
      />

      <div className="container-page relative">
        <MountTimeline>
          <div className="grid items-center gap-14 py-20 lg:grid-cols-12 lg:gap-16 lg:py-28">
            {/* ---------- Copy ---------- */}
            <div className="lg:col-span-7">
              <span data-mount className="eyebrow">
                Marine Cleaning You Can Trust
              </span>

              {/* Not data-mount: this is the LCP element. */}
              <h1 className="text-mega mt-8 font-display text-white">
                Cleaning that
                <br />
                passes first
                <br />
                <span className="text-aqua-400">inspection</span>
              </h1>

              <p
                data-mount
                className="text-lead mt-8 max-w-[56ch] text-white/72"
              >
                Cleanship is a trusted hold and tank cleaning service provider,
                preparing cargo holds, tanks and hulls on bulk carriers,
                tankers, container ships and offshore vessels — with certified
                crews and equipment we bring ourselves.
              </p>

              <div data-mount className="mt-9">
                <CheckList items={trustPoints} onNavy />
              </div>

              <div data-mount className="mt-11 flex flex-col gap-3 sm:flex-row">
                <Magnetic>
                  <Button href="/contact" variant="light">
                    Get a quote
                  </Button>
                </Magnetic>
                <Button href="/services" variant="ghost-navy">
                  View more services
                </Button>
              </div>
            </div>

            {/* ---------- Numbered contents index ---------- */}
            <div data-mount className="lg:col-span-5">
              <div className="rule-accent-top border border-white/16 bg-white/[0.04]">
                <div className="flex items-baseline justify-between border-b border-white/16 px-6 py-5">
                  <h2 className="font-display text-[20px] font-bold uppercase leading-none text-white">
                    Service lines
                  </h2>
                  <span className="num-index text-[13px] text-aqua-200">
                    {totalServiceCount} scopes
                  </span>
                </div>

                <ul>
                  {serviceCategories.map((category, i) => (
                    <li key={category.slug}>
                      <Link
                        href={`/services/${category.slug}`}
                        className="group flex items-center gap-4 border-b border-white/10 px-6 py-4 transition-colors duration-[140ms] hover:bg-white/[0.07]"
                      >
                        <span className="num-index text-[13px] text-aqua-500">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="flex-1 font-display text-[19px] font-semibold uppercase leading-tight text-white">
                          {category.name}
                        </span>
                        <span className="num-index text-[12px] text-white/40">
                          {category.services.length}
                        </span>
                        <ArrowIcon className="size-4 text-white/30 transition-transform duration-[140ms] group-hover:translate-x-1 group-hover:text-aqua-200" />
                      </Link>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/services"
                  className="label-caps group flex items-center justify-between px-6 py-5 text-aqua-200"
                >
                  See the full scope list
                  <ArrowIcon className="size-4 transition-transform duration-[140ms] group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </MountTimeline>
      </div>
    </section>
  );
}
