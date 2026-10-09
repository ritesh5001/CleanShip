import type { Metadata } from "next";
import Link from "next/link";
import { company, offices } from "@/content/company";
import { whatsappUrl } from "@/content/labels";
import { site } from "@/content/site";
import { buildMetadata, faqSchema } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { Button, SectionHeading } from "@/components/ui";
import { FaqList } from "@/components/faq";
import { CtaBand } from "@/components/cta-band";
import { OfficeGrid } from "@/components/offices";
import { CertificateCard } from "@/components/certificate";
import { ArrowIcon, CategoryIcon, WhatsAppIcon } from "@/components/icons";

export const metadata: Metadata = buildMetadata({ description: site.description, path: "/" });

export default function HomePage() {
  const h = site.home;
  const countries = new Set(offices.map((o) => o.country)).size;
  const stats = [
    { value: `${offices.length}`, label: `γραφεία σε ${countries} χώρες` },
    { value: "24/7", label: "τμήμα επιχειρήσεων" },
    { value: String(company.foundingYear), label: "έτος ίδρυσης" },
    { value: "BW Class", label: "εγκεκριμένος πάροχος RIT" },
  ];

  return (
    <>
      <JsonLd schema={faqSchema(h.faqs)} />

      <section className="on-navy relative isolate overflow-hidden bg-navy-900">
        {/* eslint-disable-next-line @next/next/no-img-element -- hero backdrop */}
        <img src={h.image} alt={h.imageAlt} className="absolute inset-0 -z-20 size-full object-cover" fetchPriority="high" />
        <div className="absolute inset-0 -z-10" style={{ background: "var(--scrim-navy-left)" }} />
        <div className="container-page py-20 lg:py-32">
          <p className="eyebrow">{h.eyebrow}</p>
          <h1 className="text-display mt-6 max-w-4xl">{h.title}</h1>
          <p className="text-lead mt-7 max-w-2xl text-white/85">{h.lead}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button href="/contact" variant="light" arrow>Ζητήστε προσφορά</Button>
            <Button href={whatsappUrl(site.domain)} variant="whatsapp" external>
              <WhatsAppIcon className="size-4" /> WhatsApp
            </Button>
            <Button href="/services" variant="ghost">Οι υπηρεσίες μας</Button>
          </div>
        </div>
      </section>

      <section className="border-b border-line-200 bg-white">
        <dl className="container-page grid grid-cols-2 gap-6 py-10 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label}>
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <span className="font-display text-[36px] font-bold leading-none text-blue-600">{s.value}</span>
                <span className="mt-2 block text-[14px] text-slate-600">{s.label}</span>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="bg-white">
        <div className="container-page grid gap-12 py-20 lg:grid-cols-12 lg:py-24">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="Ποιοι είμαστε" title={h.introTitle} />
          </div>
          <div className="space-y-5 text-[17px] leading-[1.65] text-ink-700 lg:col-span-7">
            {h.intro.map((p) => <p key={p}>{p}</p>)}
          </div>
        </div>
      </section>

      <section className="bg-paper">
        <div className="container-page py-20 lg:py-24">
          <SectionHeading eyebrow="Υπηρεσίες" title="Τι κάνουμε" description={site.servicesIntro} />
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {site.services.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="card card-interactive group flex h-full flex-col p-7">
                  <CategoryIcon name={s.icon} className="size-9 text-blue-600" />
                  <h3 className="mt-5 font-display text-[22px] font-bold uppercase leading-tight text-ink-900 group-hover:text-blue-600">{s.name}</h3>
                  <p className="mt-3 flex-1 text-[15px] leading-[1.6] text-slate-600">{s.short}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.08em] text-blue-600">
                    Περισσότερα <ArrowIcon className="size-4" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-white">
        <div className="container-page py-20 lg:py-24">
          <SectionHeading eyebrow={site.placesLabel} title={site.placesTitle} description={site.placesIntro} />
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {site.places.map((p) => (
              <li key={p.slug}>
                <Link href={`/ports/${p.slug}`} className="card card-interactive group block h-full p-6">
                  <p className="label-caps text-[11px] text-blue-600">{p.area}</p>
                  <h3 className="mt-2 font-display text-[20px] font-bold uppercase leading-tight text-ink-900 group-hover:text-blue-600">{p.name}</h3>
                  <p className="mt-2 text-[14px] leading-[1.55] text-slate-600">{p.hook}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="on-navy bg-navy-900">
        <div className="container-page py-20 lg:py-24">
          <SectionHeading eyebrow={`Γιατί ${site.brand}`} title={site.whyTitle} />
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {h.why.map((w) => (
              <div key={w.title} className="border-t-2 border-aqua-500 pt-5">
                <h3 className="font-display text-[20px] font-bold uppercase leading-tight">{w.title}</h3>
                <p className="mt-3 text-[15px] leading-[1.6] text-white/75">{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="container-page py-20 lg:py-24">
          <SectionHeading eyebrow="Πώς δουλεύουμε" title="Από το αίτημα στην αναφορά" />
          <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {h.process.map((s, i) => (
              <li key={s.title} className="card p-6">
                <span className="tabular text-[13px] text-blue-600">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 font-display text-[19px] font-bold uppercase leading-tight text-ink-900">{s.title}</h3>
                <p className="mt-2 text-[15px] leading-[1.6] text-slate-600">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-paper">
        <div className="container-page py-20 lg:py-24">
          <SectionHeading eyebrow="Εγκρίσεις" title="Πιστοποιημένοι από νηογνώμονα" />
          <div className="mt-10"><CertificateCard /></div>
        </div>
      </section>

      <section className="bg-white">
        <div className="container-page py-20 lg:py-24">
          <SectionHeading eyebrow="Γραφεία" title="Πού θα μας βρείτε" description="Τα ίδια γραφεία και διευθύνσεις με όλους τους ιστότοπους της Cleanship." />
          <div className="mt-12"><OfficeGrid /></div>
        </div>
      </section>

      <section className="bg-paper">
        <div className="container-page grid gap-12 py-20 lg:grid-cols-12 lg:py-24">
          <div className="lg:col-span-4">
            <SectionHeading eyebrow="Συχνές ερωτήσεις" title="Τι μας ρωτούν συχνά" />
          </div>
          <div className="lg:col-span-8"><FaqList faqs={h.faqs} /></div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
