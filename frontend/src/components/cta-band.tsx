import { siteConfig } from "@/lib/site";
import { Button } from "./ui";
import { WhatsAppCta } from "./whatsapp-cta";
import { PhoneIcon } from "./icons";

/**
 * Closing call to action — a solid navy plate. The DS reserves navy for
 * bands, footer and CTA, and forbids decorative gradients, so the emphasis
 * comes from the colour block and the oversized condensed heading.
 */
export function CtaBand({
  title = "We always ready to serve you.",
  description = "Tell us the vessel, the port and the window. You get a scope, a crew size and an honest duration — usually the same working day.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section className="on-navy bg-navy-800">
      <div className="container-page py-16 lg:py-20">
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

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <WhatsAppCta />
            <Button href="/contact" variant="light">
              Get a quote
            </Button>
            <a
              href={siteConfig.phones[0].href}
              className="label-caps inline-flex h-11 items-center justify-center gap-2.5 border border-white/40 px-6 text-white transition-colors duration-[140ms] hover:border-aqua-500 hover:bg-white/10 active:scale-[.985]"
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
