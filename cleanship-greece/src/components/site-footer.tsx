import Link from "next/link";
import { company } from "@/content/company";
import { whatsappUrl } from "@/content/labels";
import { site } from "@/content/site";
import { hours, phoneLabel } from "@/content/labels";
import { Logo } from "./logo";
import { OfficeGrid } from "./offices";
import { ClockIcon, FacebookIcon, InstagramIcon, LinkedInIcon, MailIcon, PhoneIcon, WhatsAppIcon, YouTubeIcon } from "./icons";

const socials = [
  { href: company.social.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
  { href: company.social.instagram, label: "Instagram", Icon: InstagramIcon },
  { href: company.social.facebook, label: "Facebook", Icon: FacebookIcon },
  { href: company.social.youtube, label: "YouTube", Icon: YouTubeIcon },
];

const heading = "font-display text-[17px] font-bold uppercase leading-tight text-white";
const link = "transition-colors duration-[140ms] hover:text-white";

export function SiteFooter() {
  return (
    <footer className="on-navy bg-navy-900 text-white/72">
      <div className="container-page py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Logo onNavy />
            <p className="mt-6 max-w-sm text-[15px] leading-[1.62]">{site.description}</p>
            <ul className="mt-7 space-y-4 text-[15px]">
              <li className="flex gap-3.5">
                <PhoneIcon className="mt-1 size-[18px] shrink-0 text-aqua-500" />
                <span className="flex flex-col gap-1">
                  {company.phones.map((p) => (
                    <a key={p.href} href={p.href} className={`tabular ${link}`}>
                      {p.number} <span className="text-white/45">({phoneLabel(p.label)})</span>
                    </a>
                  ))}
                </span>
              </li>
              <li className="flex gap-3.5">
                <MailIcon className="mt-1 size-[18px] shrink-0 text-aqua-500" />
                <a href={`mailto:${company.email}`} className={link}>{company.email}</a>
              </li>
              <li className="flex gap-3.5">
                <WhatsAppIcon className="mt-1 size-[18px] shrink-0 text-aqua-500" />
                <a href={whatsappUrl(site.domain)} target="_blank" rel="noopener noreferrer" className={link}>WhatsApp στο τμήμα επιχειρήσεων</a>
              </li>
              <li className="flex gap-3.5">
                <ClockIcon className="mt-1 size-[18px] shrink-0 text-aqua-500" />
                <span>
                  {hours.office}
                  <br />
                  <span className="text-aqua-200">{hours.operations}</span>
                </span>
              </li>
            </ul>
            <div className="mt-7 flex gap-2.5">
              {socials.map(({ href, label, Icon }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer me" aria-label={`Η Cleanship στο ${label}`} className="flex size-11 items-center justify-center border border-white/16 hover:border-aqua-500 hover:text-white">
                  <Icon className="size-[18px]" />
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Υπηρεσίες" className="lg:col-span-3">
            <h2 className={heading}>Υπηρεσίες</h2>
            <ul className="mt-4 space-y-2.5 text-[14px]">
              {site.services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className={link}>{s.name}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={site.placesLabel} className="lg:col-span-3">
            <h2 className={heading}>{site.placesLabel}</h2>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 text-[14px] lg:grid-cols-1">
              {site.places.map((p) => (
                <li key={p.slug}>
                  <Link href={`/ports/${p.slug}`} className={link}>{p.name}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Εταιρεία" className="lg:col-span-2">
            <h2 className={heading}>Εταιρεία</h2>
            <ul className="mt-4 space-y-2.5 text-[14px]">
              {[
                ["Η εταιρεία", "/about"],
                ["Γραφεία", "/offices"],
                ["Επικοινωνία", "/contact"],
                ["Πολιτική απορρήτου", "/privacy-policy"],
                ["Όροι χρήσης", "/terms"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className={link}>{label}</Link>
                </li>
              ))}
            </ul>
            <h2 className={`${heading} mt-9`}>Ιστότοποι Cleanship</h2>
            <ul className="mt-4 space-y-2.5 text-[14px]">
              {site.sisterSites.map((s) => (
                <li key={s.url}>
                  <a href={s.url} className={link} hrefLang={s.hreflang === "x-default" ? "en" : s.hreflang}>{s.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <section aria-labelledby="footer-offices" className="mt-14 border-t border-white/16 pt-10">
          <h2 id="footer-offices" className={heading}>Τα γραφεία μας</h2>
          <div className="mt-6">
            <OfficeGrid onNavy />
          </div>
        </section>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/16 pt-8 text-[13px] text-white/50 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {company.legalName}. Άδεια {company.licence}, Ελεύθερη Ζώνη Ajman, ΗΑΕ.</p>
          <p>{site.domain}</p>
        </div>
      </div>
    </footer>
  );
}
