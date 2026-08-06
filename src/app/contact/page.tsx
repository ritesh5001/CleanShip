import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { ContactForm } from "@/components/contact-form";
import { Reveal } from "@/components/reveal";
import { JsonLd } from "@/components/json-ld";
import {
  ClockIcon,
  MailIcon,
  PhoneIcon,
  PinIcon,
  WhatsAppIcon,
} from "@/components/icons";
import { serviceAreas, siteConfig } from "@/lib/site";
import { BASE_URL, breadcrumbSchema, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact Cleanship Marine Services | 24/7 Operations Desk",
  description:
    "Contact Cleanship Marine Services for hold cleaning, tank cleaning, hull cleaning, offshore support and NDT enquiries. Ajman Free Zone, UAE. Operations desk manned 24/7.",
  path: "/contact",
  keywords: [
    "contact Cleanship",
    "marine cleaning quote UAE",
    "hold cleaning enquiry",
    "ship cleaning contact Ajman",
  ],
});

const trail = [
  { name: "Home", path: "/" },
  { name: "Contact Us", path: "/contact" },
];

export default function ContactPage() {
  return (
    <>
      <JsonLd
        schema={[
          breadcrumbSchema(trail),
          {
            "@context": "https://schema.org",
            "@type": "ContactPage",
            url: `${BASE_URL}/contact`,
            name: "Contact Cleanship Marine Services",
            description:
              "Enquiry and contact details for Cleanship Marine Services FZE.",
            mainEntity: { "@id": `${BASE_URL}/#organization` },
          },
        ]}
      />

      <PageHero
        eyebrow="Contact Us"
        title="Feel free to contact with us for any kind of query"
        description="Our team is ready to assist with all your marine service needs. The operations desk is manned around the clock — vessels do not arrive at convenient hours."
        trail={trail}
      />

      <section className="bg-white">
        <div className="container-page grid gap-10 py-16 lg:grid-cols-12 lg:gap-14 lg:py-24">
          {/* ---------- Form ---------- */}
          <div className="lg:col-span-7">
            <Reveal>
              <div className="rule-accent-top border border-line-200 bg-paper p-7 lg:p-9">
                <h2 className="font-display text-[26px] font-bold uppercase leading-tight text-ink-900">
                  Get a quote
                </h2>
                <p className="mt-3 max-w-[60ch] text-[15px] leading-[1.62] text-slate-600">
                  The more you can tell us about the vessel, the cargo history
                  and the window, the more useful our reply will be.
                </p>
                <div className="mt-8">
                  <ContactForm />
                </div>
              </div>
            </Reveal>
          </div>

          {/* ---------- Contact details ---------- */}
          <div className="lg:col-span-5">
            <Reveal delay={80}>
              <div className="border-t border-line-200">
                <ContactRow
                  Icon={PhoneIcon}
                  title="Phone Number"
                  lines={siteConfig.phones.map((p) => ({
                    text: `${p.number} (${p.label})`,
                    href: p.href,
                    mono: true,
                  }))}
                />
                <ContactRow
                  Icon={MailIcon}
                  title="Mail Address"
                  lines={[
                    {
                      text: siteConfig.email,
                      href: `mailto:${siteConfig.email}`,
                    },
                  ]}
                />
                <ContactRow
                  Icon={WhatsAppIcon}
                  title="WhatsApp"
                  lines={[
                    {
                      text: "Message the operations desk",
                      href: `https://wa.me/${siteConfig.whatsapp}`,
                      external: true,
                    },
                  ]}
                />
                <ContactRow
                  Icon={PinIcon}
                  title="Office Address"
                  lines={[{ text: siteConfig.address.full }]}
                />
                <ContactRow
                  Icon={ClockIcon}
                  title="Opening Time"
                  lines={[
                    { text: siteConfig.hours.office },
                    { text: siteConfig.hours.operations, accent: true },
                  ]}
                />
              </div>
            </Reveal>

            <Reveal delay={140}>
              <div className="mt-8 border border-line-200 p-6">
                <h2 className="label-caps text-[12px] text-slate-500">
                  Ports we cover
                </h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {serviceAreas.map((area) => (
                    <li
                      key={area}
                      className="border border-line-200 px-3 py-1.5 text-[13px] text-ink-700"
                    >
                      {area}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-[13px] leading-[1.62] text-slate-500">
                  Riding crews and specialist teams travel worldwide to join
                  vessels wherever the fixture requires.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}

function ContactRow({
  Icon,
  title,
  lines,
}: {
  Icon: (props: { className?: string }) => React.ReactElement;
  title: string;
  lines: {
    text: string;
    href?: string;
    external?: boolean;
    accent?: boolean;
    mono?: boolean;
  }[];
}) {
  return (
    <div className="flex gap-5 border-b border-line-200 py-6">
      {/* DS: contact-block icons sit in a 44–46px tinted plate. */}
      <span className="flex size-11 shrink-0 items-center justify-center bg-blue-50 text-blue-600">
        <Icon className="size-[22px]" />
      </span>
      <div className="min-w-0">
        <h2 className="label-caps text-[12px] text-slate-500">{title}</h2>
        <div className="mt-2 space-y-1">
          {lines.map((line) => (
            <p
              key={line.text}
              className={`break-words text-[15px] leading-[1.6] ${
                line.mono ? "tabular" : ""
              } ${line.accent ? "text-blue-600" : "text-ink-900"}`}
            >
              {line.href ? (
                <a
                  href={line.href}
                  {...(line.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="transition-colors duration-[140ms] hover:text-blue-600"
                >
                  {line.text}
                </a>
              ) : (
                line.text
              )}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
