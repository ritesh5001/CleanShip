import Link from "next/link";
import { Button, CheckList } from "./ui";
import { ArrowIcon } from "./icons";
import { MountTimeline } from "./motion/scroll-reveal";
import { VideoBackdrop } from "./video-hero";
import { WhatsAppCta } from "./whatsapp-cta";
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
    <section className="on-navy relative isolate overflow-hidden bg-abyss-950">
      {/* Thruster footage behind the copy. VideoBackdrop owns the poster-first
          loading, the reduced-motion / Save-Data opt-outs and the navy scrims. */}
      <VideoBackdrop
        slug="thruster-cleaning-polishing"
        alt="Diver cleaning and polishing a vessel's thruster underwater"
      />

      <div className="container-page relative">
        <MountTimeline>
          <div className="grid items-center gap-12 py-14 lg:grid-cols-12 lg:gap-16 lg:py-20">
            {/* ---------- Copy ---------- */}
            <div className="lg:col-span-7">
              <span data-mount className="eyebrow">
                Marine Cleaning You Can Trust
              </span>

              {/* Not data-mount: this is the LCP element.
                  Sized well below the display scale — at mega the headline ran
                  three lines deep and pushed the whole fold past a laptop
                  viewport. */}
              <h1 className="mt-6 font-display text-[clamp(32px,4.4vw,62px)] leading-[1.02] text-white">
                Cleaning that passes
                <br />
                <span className="text-aqua-400">first inspection</span>
              </h1>

              <p
                data-mount
                className="mt-6 max-w-[54ch] text-[17px] leading-[1.6] text-white/80"
              >
                Cleanship is a trusted underwater hull cleaning specialist —
                cleaning hulls, propellers and thrusters in the water, and
                preparing cargo holds and tanks on bulk carriers, tankers,
                container ships and offshore vessels.
              </p>

              <div data-mount className="mt-8">
                <CheckList items={trustPoints} onNavy />
              </div>

              <div data-mount className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Magnetic>
                  <Button href="/contact" variant="light">
                    Get a quote
                  </Button>
                </Magnetic>
                <WhatsAppCta />
                <Button href="/services" variant="ghost-navy">
                  View more services
                </Button>
              </div>
            </div>

            {/* ---------- Numbered contents index ---------- */}
            <div data-mount className="lg:col-span-5">
              {/* Near-opaque: at 4% white the footage read straight through the panel
                  and the scope counts became unreadable. */}
              <div className="rule-accent-top border border-white/20 bg-abyss-950/80">
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
                        <span className="num-index text-[12px] text-white/60">
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
