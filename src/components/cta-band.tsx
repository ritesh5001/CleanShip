import { siteConfig } from "@/lib/site";
import { Button } from "./ui";
import { PhoneIcon } from "./icons";

export function CtaBand({
  title = "Need a vessel turned around?",
  description = "Tell us the vessel, the port and the window. We will come back with a scope, a crew size and a realistic timeline — not a brochure.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section className="relative overflow-hidden py-20 lg:py-28">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-4xl border border-aqua-400/20 bg-gradient-to-br from-abyss-800 via-abyss-900 to-abyss-950 px-6 py-14 sm:px-12 lg:px-16 lg:py-20">
          {/* Ambient light sources */}
          <div className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-aqua-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-20 size-80 rounded-full bg-abyss-400/15 blur-3xl" />

          <div className="relative flex flex-col items-start gap-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <span className="eyebrow">Get in touch</span>
              <h2 className="mt-4 text-3xl leading-tight text-white sm:text-4xl">
                {title}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-abyss-200">
                {description}
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row lg:flex-col xl:flex-row">
              <Button href="/contact">Request a quote</Button>
              <a
                href={siteConfig.phones[0].href}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3.5 text-sm font-semibold text-white transition hover:border-aqua-400/70 hover:text-aqua-300"
              >
                <PhoneIcon className="size-4" />
                {siteConfig.phones[0].number}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
