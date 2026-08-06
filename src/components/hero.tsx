import Link from "next/link";
import { Button, CheckList } from "./ui";
import { ArrowIcon } from "./icons";
import { serviceCategories, totalServiceCount } from "@/lib/services";

const trustPoints = [
  "Experienced marine cleaning professionals",
  "IMO & port-compliant procedures",
  "Eco-friendly cleaning solutions",
];

/**
 * Home hero — a hard 50/50 navy split, exactly as the brochure spreads do.
 *
 * No photography was supplied with the design system, so rather than shipping
 * empty photo frames the right half uses the other device the brochure relies
 * on: a numbered contents index. When real vessel photography arrives this
 * panel is the natural slot for it.
 */
export function Hero() {
  return (
    <section className="on-navy relative bg-navy-900">
      <div className="container-page">
        <div className="grid items-center gap-14 py-16 lg:grid-cols-12 lg:gap-16 lg:py-24">
          {/* ---------- Copy ---------- */}
          <div className="lg:col-span-7">
            <span className="eyebrow">Marine Cleaning You Can Trust</span>

            <h1 className="mt-7 text-[clamp(40px,7.4vw,76px)] leading-[1.02] text-white">
              Cleaning that passes
              <br />
              first inspection
            </h1>

            <p className="mt-7 max-w-[58ch] text-[18px] leading-[1.62] text-white/72">
              Cleanship is a trusted hold and tank cleaning service provider,
              preparing cargo holds, tanks and hulls on bulk carriers, tankers,
              container ships and offshore vessels — with certified crews and
              equipment we bring ourselves.
            </p>

            <div className="mt-9">
              <CheckList items={trustPoints} onNavy />
            </div>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button href="/contact" variant="light">
                Get a quote
              </Button>
              <Button href="/services" variant="ghost-navy">
                View more services
              </Button>
            </div>
          </div>

          {/* ---------- Numbered contents index ---------- */}
          <div className="lg:col-span-5">
            <div className="rule-accent-top border border-white/16 bg-white/[0.04]">
              <div className="flex items-baseline justify-between border-b border-white/16 px-6 py-5">
                <h2 className="font-display text-[20px] font-bold uppercase leading-none text-white">
                  Service lines
                </h2>
                <span className="tabular text-[13px] text-aqua-200">
                  {totalServiceCount} scopes
                </span>
              </div>

              <ul>
                {serviceCategories.map((category, i) => (
                  <li key={category.slug}>
                    <Link
                      href={`/services/${category.slug}`}
                      className="group flex items-center gap-4 border-b border-white/10 px-6 py-4 transition-colors duration-[140ms] hover:bg-white/[0.06]"
                    >
                      <span className="tabular text-[13px] text-aqua-500 transition-colors duration-[140ms]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="flex-1 font-display text-[19px] font-semibold uppercase leading-tight text-white">
                        {category.name}
                      </span>
                      <span className="tabular text-[12px] text-white/40">
                        {category.services.length}
                      </span>
                      <ArrowIcon className="size-4 text-white/30 transition-transform duration-[140ms] group-hover:translate-x-0.5 group-hover:text-aqua-200" />
                    </Link>
                  </li>
                ))}
              </ul>

              <Link
                href="/services"
                className="label-caps group flex items-center justify-between px-6 py-5 text-aqua-200"
              >
                See the full scope list
                <ArrowIcon className="size-4 transition-transform duration-[140ms] group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
