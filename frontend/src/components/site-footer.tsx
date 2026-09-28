import Link from "next/link";
import { portLabel } from "@/lib/ports/types";
import {
  getLine,
  portHubSlug,
  regionHubSlug,
  regions,
} from "@/lib/ports/registry";
import { offices, officeTownLine, serviceAreas, siteConfig, type Office } from "@/lib/site";
import { serviceCategories } from "@/lib/services";
import {
  ClockIcon,
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  MailIcon,
  YouTubeIcon,
  PhoneIcon,
} from "./icons";
import { Logo } from "./logo";

const socialLinks = [
  { href: siteConfig.social.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
  { href: siteConfig.social.instagram, label: "Instagram", Icon: InstagramIcon },
  { href: siteConfig.social.facebook, label: "Facebook", Icon: FacebookIcon },
  { href: siteConfig.social.youtube, label: "YouTube", Icon: YouTubeIcon },
];

/* Office groups, in the order the business presents them. A country not
   listed here still appears, after these. */
const COUNTRY_ORDER = ["United Arab Emirates", "India", "Saudi Arabia", "Sri Lanka", "Guinea"];
const COUNTRY_LABEL: Record<string, string> = { "United Arab Emirates": "UAE" };

function officeGroups() {
  const countries = [...new Set(offices.map((o) => o.country))].sort(
    (a, b) =>
      (COUNTRY_ORDER.indexOf(a) + 1 || 99) - (COUNTRY_ORDER.indexOf(b) + 1 || 99),
  );
  return countries.map((country) => ({
    country,
    items: offices.filter((o) => o.country === country),
  }));
}

const linkGroups = [
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Our Team", href: "/team" },
      { label: "Projects", href: "/projects" },
      { label: "Locations", href: "/locations" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "All Services", href: "/services" },
      { label: "Port Coverage", href: "/ports" },
      { label: "Blog", href: "/blog" },
      { label: "Equipment", href: "/equipment" },
      { label: "Get a Quote", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms & Conditions", href: "/terms-and-conditions" },
      { label: "Disclaimer", href: "/disclaimer" },
    ],
  },
];

const heading = "font-display text-[17px] font-bold uppercase leading-tight text-white";
const link = "transition-colors duration-[140ms] hover:text-white";

function OfficeAddress({ office }: { office: Office }) {
  return (
    <address className="not-italic">
      <Link href={`/locations/${office.slug}`} className="text-[15px] font-semibold text-white hover:text-aqua-200">
        {office.city}
      </Link>
      {office.head && (
        <span className="label-caps ml-2 bg-aqua-500 px-1.5 py-0.5 align-middle text-[9px] text-abyss-950">
          Head office
        </span>
      )}
      <p className="mt-1 text-[13px] leading-[1.55]">
        {office.street && (
          <>
            {office.street}
            <br />
          </>
        )}
        {officeTownLine(office)}
      </p>
    </address>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    /* Solid navy — one of the system's two permitted page backgrounds.
       `on-navy` switches the focus ring and eyebrow to their aqua variants. */
    <footer data-site-chrome="" className="on-navy bg-navy-900 text-white/72">
      <div className="container-page py-16 lg:py-20">
        {/* ---------- 1. Brand, contact and services ---------- */}
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Logo onNavy />
            <p className="mt-6 max-w-sm text-[15px] leading-[1.62]">{siteConfig.shortDescription}</p>

            <ul className="mt-7 space-y-4 text-[15px]">
              <li className="flex gap-3.5">
                <PhoneIcon className="mt-1 size-[18px] shrink-0 text-aqua-500" />
                <span className="flex flex-col gap-1">
                  {siteConfig.phones.map((p) => (
                    <a key={p.href} href={p.href} className={`tabular ${link}`}>
                      {p.number} <span className="text-white/45">({p.label})</span>
                    </a>
                  ))}
                </span>
              </li>
              <li className="flex gap-3.5">
                <MailIcon className="mt-1 size-[18px] shrink-0 text-aqua-500" />
                <a href={`mailto:${siteConfig.email}`} className={link}>
                  {siteConfig.email}
                </a>
              </li>
              <li className="flex gap-3.5">
                <ClockIcon className="mt-1 size-[18px] shrink-0 text-aqua-500" />
                <span>
                  {siteConfig.hours.office}
                  <br />
                  <span className="text-aqua-200">{siteConfig.hours.operations}</span>
                </span>
              </li>
            </ul>

            <div className="mt-7 flex gap-2.5">
              {socialLinks.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer me"
                  aria-label={`${siteConfig.name} on ${label}`}
                  className="flex size-11 items-center justify-center border border-white/16 transition-colors duration-[140ms] hover:border-aqua-500 hover:text-white"
                >
                  <Icon className="size-[18px]" />
                </a>
              ))}
            </div>
          </div>

          {/* Every service linked — keeps crawl depth shallow from any page. */}
          <nav aria-label="Services" className="grid gap-8 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-3">
            {serviceCategories.map((category) => (
              <div key={category.slug}>
                <h2 className={heading}>
                  <Link href={`/services/${category.slug}`} className="transition-colors duration-[140ms] hover:text-aqua-200">
                    {category.name}
                  </Link>
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {category.services.map((service) => (
                    <li key={service.slug}>
                      <Link
                        href={`/services/${category.slug}/${service.slug}`}
                        className={`text-[14px] leading-snug ${link}`}
                      >
                        {service.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* ---------- 2. Offices ---------- */}
        <section aria-labelledby="footer-offices" className="mt-14 border-t border-white/16 pt-10">
          <h2 id="footer-offices" className={heading}>
            Our offices
          </h2>
          <div className="mt-6 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
            {officeGroups().map((group) => (
              <div key={group.country}>
                <h3 className="label-caps text-[11px] text-aqua-200">
                  {COUNTRY_LABEL[group.country] ?? group.country}
                </h3>
                <ul className="mt-4 space-y-5">
                  {group.items.map((office) => (
                    <li key={office.slug}>
                      <OfficeAddress office={office} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- 3. Port coverage ---------- */}
        {/* A site-wide entry point into the port programme, so those pages are
            never more than one hop from any page rather than sitemap-only. */}
        <nav aria-label="Port services by region" className="mt-14 border-t border-white/16 pt-10">
          <div className="grid gap-x-8 gap-y-8 lg:grid-cols-2">
            {regions.map((region) => (
              <div key={region.slug}>
                <h2 className={heading}>
                  <Link
                    href={`/${regionHubSlug(getLine("hull-cleaning"), region)}`}
                    className="transition-colors duration-[140ms] hover:text-aqua-200"
                  >
                    Port services in {region.name}
                  </Link>
                </h2>
                <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[13px]">
                  {region.ports.map((port) => (
                    <li key={port.slug}>
                      <Link href={`/${portHubSlug(port, getLine("hull-cleaning"))}`} className={link}>
                        {portLabel(port)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </nav>

        {/* ---------- 4. Company, resources, legal, licence ---------- */}
        <div className="mt-14 grid gap-10 border-t border-white/16 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          {linkGroups.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h2 className={heading}>{group.title}</h2>
              <ul className="mt-4 space-y-2.5 text-[14px]">
                {group.links.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className={link}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
          <div>
            <h2 className={heading}>Registered office</h2>
            <p className="mt-4 text-[14px] leading-[1.6]">
              {siteConfig.legalName}
              <br />
              <span className="tabular">Licence {siteConfig.licence}</span>
              <br />
              Ajman Free Zone, UAE
            </p>
          </div>
        </div>

        {/* Ports served — states the geographic footprint in plain crawlable text. */}
        <div className="mt-14 border-t border-white/16 pt-8">
          <h2 className="label-caps text-[11px] text-white/50">Ports &amp; regions served</h2>
          <p className="mt-3 text-[14px] leading-[1.7]">{serviceAreas.join(" · ")} — and worldwide by arrangement.</p>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/16 pt-8 text-[13px] text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.legalName}. All rights reserved.
          </p>
          <p>Ready when you are.</p>
        </div>
      </div>
    </footer>
  );
}
