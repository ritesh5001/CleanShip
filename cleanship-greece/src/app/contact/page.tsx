import type { Metadata } from "next";
import { company } from "@/content/company";
import { whatsappUrl } from "@/content/labels";
import { site } from "@/content/site";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { ContactForm } from "@/components/contact-form";
import { ClockIcon, MailIcon, PhoneIcon, WhatsAppIcon } from "@/components/icons";
import { hours, phoneLabel } from "@/content/labels";

export const metadata: Metadata = buildMetadata({ title: "Επικοινωνία και προσφορά", description: site.contactIntro, path: "/contact" });
const trail = [{ name: "Αρχική", path: "/" }, { name: "Επικοινωνία", path: "/contact" }];

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ service?: string; port?: string }> }) {
  const { service, port } = await searchParams;
  const portName = site.places.find((p) => p.name === port)?.name;
  const names = site.services.map((s) => s.name);
  const preset = names.includes(service ?? "") ? service : undefined;

  return (
    <>
      <JsonLd schema={breadcrumbSchema(trail)} />
      <PageHero eyebrow="Επικοινωνία" title="Ζητήστε προσφορά" lead={site.contactIntro} trail={trail} />
      <section className="bg-white">
        <div className="container-page grid gap-12 py-20 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <ContactForm services={names} defaultService={preset} defaultMessage={portName ? `Λιμάνι: ${portName}\n` : undefined} />
          </div>
          <aside className="lg:col-span-5">
            <div className="card rule-accent-top space-y-5 p-7 text-[15px]">
              <h2 className="font-display text-[20px] font-bold uppercase text-ink-900">Τμήμα επιχειρήσεων</h2>
              {company.phones.map((p) => (
                <a key={p.href} href={p.href} className="flex items-center gap-3 text-ink-900 hover:text-blue-600">
                  <PhoneIcon className="size-5 text-blue-600" />
                  <span className="tabular">{p.number}</span> <span className="text-slate-500">({phoneLabel(p.label)})</span>
                </a>
              ))}
              <a href={`mailto:${company.email}`} className="flex items-center gap-3 text-ink-900 hover:text-blue-600">
                <MailIcon className="size-5 text-blue-600" /> {company.email}
              </a>
              <a href={whatsappUrl(site.domain)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-ink-900 hover:text-blue-600">
                <WhatsAppIcon className="size-5 text-blue-600" /> WhatsApp
              </a>
              <p className="flex gap-3 text-slate-600">
                <ClockIcon className="mt-0.5 size-5 shrink-0 text-blue-600" />
                <span>{hours.office}<br />{hours.operations}</span>
              </p>
              <p className="border-t border-line-200 pt-5 text-slate-600">
                <strong className="text-ink-900">{company.legalName}</strong>
                <br />
                {company.registeredAddress.full}
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
