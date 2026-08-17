import Link from "next/link";
import { serviceAreas, siteConfig } from "@/lib/site";
import { hullCleaning } from "@/lib/services";
import {
  ClockIcon,
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  MailIcon,
  PhoneIcon,
  PinIcon,
} from "./icons";
import { Logo } from "./logo";

const socialLinks = [
  { href: siteConfig.social.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
  { href: siteConfig.social.instagram, label: "Instagram", Icon: InstagramIcon },
  { href: siteConfig.social.facebook, label: "Facebook", Icon: FacebookIcon },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    /* Solid navy — one of the system's two permitted page backgrounds.
       `on-navy` switches the focus ring and eyebrow to their aqua variants. */
    <footer className="on-navy bg-navy-900 text-white/72">
      <div className="container-page py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Brand + NAP */}
          <div className="lg:col-span-4">
            <Logo onNavy />

            <p className="mt-6 max-w-sm text-[15px] leading-[1.62]">
              {siteConfig.shortDescription}
            </p>

            <address className="mt-7 space-y-4 not-italic text-[15px]">
              <div className="flex gap-3.5">
                <PinIcon className="mt-1 size-[18px] shrink-0 text-aqua-500" />
                <span>{siteConfig.address.full}</span>
              </div>
              <div className="flex gap-3.5">
                <PhoneIcon className="mt-1 size-[18px] shrink-0 text-aqua-500" />
                <span className="flex flex-col gap-1">
                  {siteConfig.phones.map((p) => (
                    <a
                      key={p.href}
                      href={p.href}
                      className="tabular transition-colors duration-[140ms] hover:text-white"
                    >
                      {p.number}
                    </a>
                  ))}
                </span>
              </div>
              <div className="flex gap-3.5">
                <MailIcon className="mt-1 size-[18px] shrink-0 text-aqua-500" />
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="transition-colors duration-[140ms] hover:text-white"
                >
                  {siteConfig.email}
                </a>
              </div>
              <div className="flex gap-3.5">
                <ClockIcon className="mt-1 size-[18px] shrink-0 text-aqua-500" />
                <span>
                  {siteConfig.hours.office}
                  <br />
                  <span className="text-aqua-200">
                    {siteConfig.hours.operations}
                  </span>
                </span>
              </div>
            </address>

            <div className="mt-7 flex gap-2.5">
              {socialLinks.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${siteConfig.name} on ${label}`}
                  className="flex size-11 items-center justify-center border border-white/16 transition-colors duration-[140ms] hover:border-aqua-500 hover:text-white"
                >
                  <Icon className="size-[18px]" />
                </a>
              ))}
            </div>
          </div>

          {/* Every scope linked — keeps crawl depth shallow from any page. */}
          <div className="lg:col-span-6">
            <h2 className="font-display text-[17px] font-bold uppercase leading-tight text-white">
              <Link
                href={`/services/${hullCleaning.slug}`}
                className="transition-colors duration-[140ms] hover:text-aqua-200"
              >
                {hullCleaning.name}
              </Link>
            </h2>
            {/* Two columns: five scopes in one column left a tall ragged gap
                beside the company column. */}
            <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {hullCleaning.services.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${hullCleaning.slug}/${service.slug}`}
                    className="text-[14px] leading-snug transition-colors duration-[140ms] hover:text-white"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="lg:col-span-2">
            <h2 className="font-display text-[17px] font-bold uppercase leading-tight text-white">
              Company
            </h2>
            <ul className="mt-4 space-y-2.5 text-[14px]">
              {[
                { label: "About Us", href: "/about" },
                { label: "Projects", href: "/projects" },
                { label: "All Scopes", href: "/services" },
                { label: "Contact Us", href: "/contact" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="transition-colors duration-[140ms] hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h2 className="mt-9 font-display text-[17px] font-bold uppercase leading-tight text-white">
              Licence
            </h2>
            <p className="tabular mt-4 text-[14px]">
              {siteConfig.licence}
              <br />
              <span className="font-sans">Ajman Free Zone, UAE</span>
            </p>
          </div>
        </div>

        {/* Ports served — useful to a reader, and it states our geographic
            footprint in plain crawlable text. */}
        <div className="mt-14 border-t border-white/16 pt-8">
          <h2 className="label-caps text-[11px] text-white/50">
            Ports &amp; regions served
          </h2>
          <p className="mt-3 text-[14px] leading-[1.7]">
            {serviceAreas.join(" · ")} — and worldwide by arrangement.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/16 pt-8 text-[13px] text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.legalName}. All rights reserved.
          </p>
          <p>We always ready to serve you.</p>
        </div>
      </div>
    </footer>
  );
}
