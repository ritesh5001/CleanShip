import { siteConfig } from "@/lib/site";
import { Button } from "./ui";
import { WhatsAppCta } from "./whatsapp-cta";
import { PhoneIcon } from "./icons";
import { PhotoOverlay } from "./photo-overlay";
import { stockImages } from "@/lib/stock-images";

/**
 * Closing call to action.
 *
 * A photograph under a deep navy overlay rather than a flat plate. The DS
 * forbids decorative gradients but sanctions navy photo scrims, which is
 * exactly what this is — the overlay does the work the flat colour used to.
 */
export function CtaBand({
  title = "We always ready to serve you.",
  description = "Tell us the vessel, the port and the window. You get a scope, a crew size and an honest duration — usually the same working day.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section className="on-navy relative isolate overflow-hidden bg-navy-800">
      <PhotoOverlay image={stockImages.portTerminal} />
      <div className="container-page relative py-16 lg:py-20">
        <div className="flex flex-col items-start gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
          <div className="max-w-2xl">
            <span className="eyebrow">Get in touch</span>
            <h2 className="mt-5 text-[clamp(30px,4.4vw,46px)] leading-[1.06] text-white">
              {title}
            </h2>
            <p className="mt-5 text-[17px] leading-[1.62] text-white/72">
              {description}
            </p>
          </div>

          {/* wrap + shrink-0 rather than a single row: at 1280-1440 the three
              buttons had to share ~500px beside the heading, so labels broke
              mid-word and the phone number overflowed its border. They now
              drop to a second line instead of compressing. */}
          <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-end">
            <WhatsAppCta />
            <Button href="/contact" variant="light">
              Get a quote
            </Button>
            <a
              href={siteConfig.phones[0].href}
              className="label-caps inline-flex h-11 shrink-0 items-center justify-center gap-2.5 whitespace-nowrap border border-white/40 px-6 text-white transition-colors duration-[140ms] hover:border-aqua-500 hover:bg-white/10 active:scale-[.985]"
            >
              <PhoneIcon className="size-4" />
              <span className="tabular">{siteConfig.phones[0].number}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
