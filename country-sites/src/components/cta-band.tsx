import { company, whatsappUrl } from "@/content/company";
import { site } from "@/content/site";
import { Button } from "./ui";
import { PhoneIcon, WhatsAppIcon } from "./icons";

export function CtaBand({ title = "Ready when your ship is." }: { title?: string }) {
  return (
    <section className="on-navy bg-navy-800">
      <div className="container-page flex flex-col gap-8 py-16 lg:flex-row lg:items-end lg:justify-between lg:py-20">
        <div className="max-w-2xl">
          <p className="eyebrow">Get in touch</p>
          <h2 className="text-h2 mt-4">{title}</h2>
          <p className="text-lead mt-4 text-white/75">{site.contactIntro}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button href="/contact" variant="light" arrow>
            Get a quote
          </Button>
          <Button href={whatsappUrl(site.domain)} variant="whatsapp" external>
            <WhatsAppIcon className="size-4" /> WhatsApp
          </Button>
          <a
            href={company.phones[site.code === "ae" ? 1 : 0].href}
            className="inline-flex min-h-11 items-center gap-2 border border-white/30 px-5 text-[14px] font-semibold text-white hover:border-white"
          >
            <PhoneIcon className="size-4" />
            <span className="tabular">{company.phones[site.code === "ae" ? 1 : 0].number}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
