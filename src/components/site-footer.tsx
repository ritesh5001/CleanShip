import Link from "next/link";
import { serviceAreas, siteConfig } from "@/lib/site";
import { serviceCategories } from "@/lib/services";
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
    <footer className="relative overflow-hidden border-t border-white/10 bg-abyss-950">
      <div className="pointer-events-none absolute -top-40 left-1/2 size-[42rem] -translate-x-1/2 rounded-full bg-aqua-500/8 blur-3xl" />

      <div className="container-page relative py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Brand + contact */}
          <div className="lg:col-span-4">
            <Logo className="h-10 w-auto" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-abyss-300">
              {siteConfig.shortDescription}
            </p>

            <address className="mt-6 space-y-3 not-italic text-sm text-abyss-300">
              <div className="flex gap-3">
                <PinIcon className="mt-0.5 size-4 shrink-0 text-aqua-400" />
                <span>{siteConfig.address.full}</span>
              </div>
              <div className="flex gap-3">
                <PhoneIcon className="mt-0.5 size-4 shrink-0 text-aqua-400" />
                <span className="flex flex-col gap-1">
                  {siteConfig.phones.map((p) => (
                    <a
                      key={p.href}
                      href={p.href}
                      className="transition hover:text-aqua-300"
                    >
                      {p.number}
                    </a>
                  ))}
                </span>
              </div>
              <div className="flex gap-3">
                <MailIcon className="mt-0.5 size-4 shrink-0 text-aqua-400" />
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="transition hover:text-aqua-300"
                >
                  {siteConfig.email}
                </a>
              </div>
              <div className="flex gap-3">
                <ClockIcon className="mt-0.5 size-4 shrink-0 text-aqua-400" />
                <span>
                  {siteConfig.hours.office}
                  <br />
                  <span className="text-aqua-300">
                    {siteConfig.hours.operations}
                  </span>
                </span>
              </div>
            </address>

            <div className="mt-6 flex gap-3">
              {socialLinks.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${siteConfig.name} on ${label}`}
                  className="flex size-9 items-center justify-center rounded-full border border-white/12 text-abyss-300 transition hover:border-aqua-400/60 hover:text-aqua-300"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Service columns — every service linked for crawl depth */}
          <div className="grid gap-8 sm:grid-cols-2 lg:col-span-6 lg:grid-cols-3">
            {serviceCategories.map((category) => (
              <div key={category.slug}>
                <h3 className="text-sm font-semibold text-white">
                  <Link
                    href={`/services/${category.slug}`}
                    className="transition hover:text-aqua-300"
                  >
                    {category.name}
                  </Link>
                </h3>
                <ul className="mt-3 space-y-2">
                  {category.services.map((service) => (
                    <li key={service.slug}>
                      <Link
                        href={`/services/${category.slug}/${service.slug}`}
                        className="text-[13px] leading-snug text-abyss-300 transition hover:text-aqua-300"
                      >
                        {service.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Company */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold text-white">Company</h3>
            <ul className="mt-3 space-y-2 text-[13px] text-abyss-300">
              <li>
                <Link href="/about" className="transition hover:text-aqua-300">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/projects" className="transition hover:text-aqua-300">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/services" className="transition hover:text-aqua-300">
                  All Services
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition hover:text-aqua-300">
                  Contact Us
                </Link>
              </li>
            </ul>

            <h3 className="mt-8 text-sm font-semibold text-white">Licence</h3>
            <p className="mt-3 text-[13px] text-abyss-300">
              {siteConfig.licence}
              <br />
              Ajman Free Zone, UAE
            </p>
          </div>
        </div>

        {/* Ports served — genuinely useful to a reader, and it gives the
            crawler our geographic footprint in plain text. */}
        <div className="mt-14 border-t border-white/8 pt-8">
          <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-abyss-400">
            Ports &amp; regions served
          </h3>
          <p className="mt-3 text-[13px] leading-relaxed text-abyss-400">
            {serviceAreas.join(" · ")} — and worldwide by arrangement.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-white/8 pt-8 text-xs text-abyss-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.legalName}. All rights reserved.
          </p>
          <p>
            Hold cleaning · Tank cleaning · Hull cleaning · Offshore · NDT &amp;
            Repair
          </p>
        </div>
      </div>
    </footer>
  );
}
