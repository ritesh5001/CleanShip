import Link from "next/link";
import { company } from "@/content/company";
import { site } from "@/content/site";
import { Logo } from "./logo";
import { MailIcon, MenuIcon, PhoneIcon } from "./icons";

export function navItems() {
  return [
    { label: "Services", href: "/services" },
    { label: site.placesLabel, href: "/ports" },
    { label: "About", href: "/about" },
    { label: "Offices", href: "/offices" },
    { label: "Contact", href: "/contact" },
  ];
}

export function SiteHeader() {
  const phone = company.phones[site.code === "ae" ? 1 : 0];
  return (
    <header className="sticky top-0 z-40 border-b border-line-200 bg-white">
      <div className="hidden bg-navy-900 text-[13px] text-white/75 md:block">
        <div className="container-page flex h-10 items-center justify-between">
          <span>{site.code === "ae" ? "Hull, hold and tank cleaning across the UAE" : "Marine cleaning for Greek-managed fleets"}</span>
          <span className="flex items-center gap-6">
            <a href={phone.href} className="flex items-center gap-2 hover:text-white">
              <PhoneIcon className="size-3.5" />
              <span className="tabular">{phone.number}</span>
            </a>
            <a href={`mailto:${company.email}`} className="flex items-center gap-2 hover:text-white">
              <MailIcon className="size-3.5" />
              {company.email}
            </a>
          </span>
        </div>
      </div>
      <div className="container-page flex h-[72px] items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3" aria-label={`${company.name} home`}>
          <Logo priority className="h-9 w-auto" />
          <span className="label-caps hidden border-l border-line-200 pl-3 text-[11px] text-blue-600 sm:inline">
            {site.code === "ae" ? "UAE" : "Greece"}
          </span>
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
          {navItems().map((item) => (
            <Link key={item.href} href={item.href} className="text-[14px] font-semibold uppercase tracking-[0.06em] text-ink-900 hover:text-blue-600">
              {item.label}
            </Link>
          ))}
          <Link href="/contact" className="inline-flex min-h-11 items-center bg-blue-600 px-5 text-[14px] font-semibold uppercase tracking-[0.08em] text-white hover:bg-navy-700">
            Get a quote
          </Link>
        </nav>
        <details className="group relative lg:hidden">
          <summary className="flex size-11 cursor-pointer list-none items-center justify-center border border-line-200 [&::-webkit-details-marker]:hidden" aria-label="Menu">
            <MenuIcon className="size-5" />
          </summary>
          <nav aria-label="Mobile" className="absolute right-0 top-14 w-64 border border-line-200 bg-white p-3 shadow-lg">
            {[...navItems(), { label: "Get a quote", href: "/contact" }].map((item) => (
              <Link key={item.label} href={item.href} className="block px-3 py-3 text-[15px] font-semibold text-ink-900 hover:bg-blue-50">
                {item.label}
              </Link>
            ))}
          </nav>
        </details>
      </div>
    </header>
  );
}
