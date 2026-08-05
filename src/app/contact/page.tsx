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
        eyebrow="Contact us"
        title="Feel free to contact us for any kind of query"
        description="Our team is ready to assist with all your marine service needs. The operations desk is manned around the clock — vessels do not arrive at convenient hours."
        trail={trail}
      />

      <section className="pb-20 lg:pb-28">
        <div className="container-page">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            {/* ---------- Form ---------- */}
            <div className="lg:col-span-7">
              <Reveal>
                <div className="rounded-3xl border border-white/10 bg-abyss-900/50 p-7 lg:p-9">
                  <h2 className="text-2xl text-white">Request a quote</h2>
                  <p className="mt-2.5 text-sm leading-relaxed text-abyss-300">
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
              <Reveal delay={100}>
                <div className="space-y-4">
                  <ContactCard
                    Icon={PhoneIcon}
                    title="Phone"
                    lines={siteConfig.phones.map((p) => ({
                      text: `${p.number} (${p.label})`,
                      href: p.href,
                    }))}
                  />
                  <ContactCard
                    Icon={MailIcon}
                    title="Email"
                    lines={[
                      {
                        text: siteConfig.email,
                        href: `mailto:${siteConfig.email}`,
                      },
                    ]}
                  />
                  <ContactCard
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
                  <ContactCard
                    Icon={PinIcon}
                    title="Office address"
                    lines={[{ text: siteConfig.address.full }]}
                  />
                  <ContactCard
                    Icon={ClockIcon}
                    title="Opening hours"
                    lines={[
                      { text: siteConfig.hours.office },
                      { text: siteConfig.hours.operations, accent: true },
                    ]}
                  />
                </div>
              </Reveal>

              <Reveal delay={180}>
                <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-abyss-300">
                    Ports we cover
                  </h2>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {serviceAreas.map((area) => (
                      <li
                        key={area}
                        className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-abyss-300"
                      >
                        {area}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-xs leading-relaxed text-abyss-500">
                    Riding crews and specialist teams travel worldwide to join
                    vessels wherever the fixture requires.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ContactCard({
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
  }[];
}) {
  return (
    <div className="flex gap-4 rounded-2xl border border-white/10 bg-abyss-900/40 p-5">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-aqua-400/10 text-aqua-300 ring-1 ring-aqua-400/20">
        <Icon className="size-5" />
      </span>
      <div className="min-w-0">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-abyss-400">
          {title}
        </h2>
        <div className="mt-1.5 space-y-1">
          {lines.map((line) => (
            <p
              key={line.text}
              className={`text-sm leading-relaxed break-words ${
                line.accent ? "text-aqua-300" : "text-abyss-100"
              }`}
            >
              {line.href ? (
                <a
                  href={line.href}
                  {...(line.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="transition hover:text-aqua-300"
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
