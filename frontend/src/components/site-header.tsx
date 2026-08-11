"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { mainNav, siteConfig } from "@/lib/site";
import { serviceCategories } from "@/lib/services";
import {
  ArrowIcon,
  CategoryIcon,
  ChevronIcon,
  CloseIcon,
  MailIcon,
  MenuIcon,
  PhoneIcon,
  WhatsAppIcon,
} from "./icons";
import { Logo } from "./logo";

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // The DS allows the header to be the one sticky element; it takes
  // shadow-sm once content scrolls beneath it. No blur, per the system.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMegaOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMegaOpen(false);
      setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* A short close delay keeps the panel open while the pointer crosses the
     gap between trigger and panel. */
  const openMega = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMegaOpen(true);
  };
  const scheduleCloseMega = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMegaOpen(false), 140);
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* The utility bar and the main header stick together as one unit, so
          the phone / email / WhatsApp line stays reachable at any scroll
          depth. Combined height: 72px below lg, 112px from lg up (40 + 72) —
          every other sticky offset on the site is derived from that, so
          changing either height means updating them too:
            · the service page progress rail
            · the service page sidebar
            · scroll-padding-top in globals.css */}
      <div className="sticky top-0 z-50">
        {/* ---------- Utility bar (navy) ---------- */}
        <div className="on-navy hidden bg-navy-900 text-white/70 lg:block">
        <div className="container-page flex h-10 items-center justify-between text-[13px]">
          <p>Marine Cleaning You Can Trust — hold, tank, hull and offshore</p>
          <div className="flex items-center gap-7">
            <a
              href={siteConfig.phones[0].href}
              className="flex items-center gap-2 transition-colors duration-[140ms] hover:text-aqua-200"
            >
              <PhoneIcon className="size-4" />
              {siteConfig.phones[0].number}
            </a>
            <a
              href={`mailto:${siteConfig.email}`}
              className="flex items-center gap-2 transition-colors duration-[140ms] hover:text-aqua-200"
            >
              <MailIcon className="size-4" />
              {siteConfig.email}
            </a>
            <a
              href={siteConfig.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 transition-colors duration-[140ms] hover:text-aqua-500"
            >
              <WhatsAppIcon className="size-3.5" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>

        {/* ---------- Main header (white) ---------- */}
        <header
          className={`relative border-b bg-white transition-shadow duration-[220ms] ${
          scrolled ? "border-line-200 shadow-sm" : "border-line-100"
        }`}
      >
        <div className="container-page flex h-[72px] items-center justify-between gap-4">
          <Link href="/" aria-label={`${siteConfig.name} — home`}>
            <Logo priority />
          </Link>

          <nav aria-label="Main" className="hidden items-center lg:flex">
            {mainNav.map((item) => {
              const active = isActive(item.href);
              const isServices = item.href === "/services";

              return (
                <div
                  key={item.href}
                  className="relative"
                  {...(isServices
                    ? { onMouseEnter: openMega, onMouseLeave: scheduleCloseMega }
                    : {})}
                >
                  <Link
                    href={item.href}
                    {...(isServices
                      ? { "aria-expanded": megaOpen, "aria-haspopup": true }
                      : {})}
                    className={`label-caps relative flex h-[72px] items-center gap-1.5 px-4 transition-colors duration-[140ms] ${
                      active
                        ? "text-blue-600"
                        : "text-ink-700 hover:text-blue-600"
                    }`}
                  >
                    {item.label}
                    {isServices && (
                      <ChevronIcon
                        className={`size-4 transition-transform duration-[140ms] ${
                          megaOpen ? "rotate-180" : ""
                        }`}
                      />
                    )}
                    {/* Active nav takes a 2px aqua underline — DS spec. */}
                    {active && (
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-3 bottom-0 h-0.5 bg-aqua-500"
                      />
                    )}
                  </Link>
                </div>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              className="label-caps hidden h-11 items-center bg-blue-600 px-6 text-white transition-colors duration-[140ms] hover:bg-navy-700 active:scale-[.985] sm:inline-flex"
            >
              Get a quote
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              className="inline-flex size-11 items-center justify-center border border-line-200 text-ink-900 transition-colors duration-[140ms] hover:border-blue-400 hover:text-blue-600 lg:hidden"
            >
              {mobileOpen ? (
                <CloseIcon className="size-5" />
              ) : (
                <MenuIcon className="size-5" />
              )}
            </button>
          </div>
        </div>

        {/* ---------- Mega menu ---------- */}
        <div
          onMouseEnter={openMega}
          onMouseLeave={scheduleCloseMega}
          className={`absolute inset-x-0 top-full hidden border-b border-line-200 bg-white shadow-lg transition-[opacity,transform] duration-[220ms] ease-standard lg:block ${
            megaOpen
              ? "pointer-events-auto translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-2 opacity-0"
          }`}
        >
          <div className="container-page grid grid-cols-5 gap-8 py-10">
            {serviceCategories.map((category, i) => (
              <div key={category.slug}>
                <Link
                  href={`/services/${category.slug}`}
                  className="group mb-4 block"
                >
                  <span className="tabular text-[13px] text-blue-600">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="mt-2 flex items-center gap-2.5">
                    <CategoryIcon
                      name={category.icon}
                      className="size-[22px] text-blue-600"
                    />
                    <span className="font-display text-[19px] font-bold uppercase leading-tight text-ink-900 transition-colors duration-[140ms] group-hover:text-blue-600">
                      {category.name}
                    </span>
                  </span>
                </Link>
                <ul className="space-y-2 border-l border-line-200 pl-3.5">
                  {category.services.map((service) => (
                    <li key={service.slug}>
                      <Link
                        href={`/services/${category.slug}/${service.slug}`}
                        className="block py-0.5 text-[14px] leading-snug text-slate-600 transition-colors duration-[140ms] hover:text-blue-600"
                      >
                        {service.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-line-100 bg-paper">
            <div className="container-page flex items-center justify-between py-4 text-[14px]">
              <p className="text-slate-600">
                Operations desk manned 24 hours, Mon – Sun.
              </p>
              <Link
                href="/services"
                className="label-caps group inline-flex items-center gap-2 text-blue-600"
              >
                View more services
                <ArrowIcon className="size-4 transition-transform duration-[140ms] group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
        </header>
      </div>

      {/* ---------- Mobile drawer ---------- */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-40 lg:hidden ${
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!mobileOpen}
      >
        {/* Navy scrim, never black — and no blur. */}
        <div
          onClick={() => setMobileOpen(false)}
          className={`absolute inset-0 bg-[rgba(6,32,58,.62)] transition-opacity duration-[220ms] ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <nav
          aria-label="Mobile"
          className={`absolute inset-x-0 top-[72px] max-h-[calc(100dvh-72px)] overflow-y-auto border-t border-line-200 bg-white px-5 pb-10 pt-2 transition-transform duration-[220ms] ease-standard ${
            mobileOpen ? "translate-y-0" : "-translate-y-3 opacity-0"
          }`}
        >
          <ul className="divide-y divide-line-100">
            {mainNav.map((item) =>
              item.href === "/services" ? (
                <li key={item.href}>
                  <div className="flex items-center justify-between">
                    <Link
                      href={item.href}
                      className="label-caps flex-1 py-4 text-ink-900"
                    >
                      Services
                    </Link>
                    <button
                      type="button"
                      aria-label="Toggle service categories"
                      aria-expanded={openAccordion === "services"}
                      onClick={() =>
                        setOpenAccordion((v) =>
                          v === "services" ? null : "services",
                        )
                      }
                      className="flex size-11 items-center justify-center text-slate-500"
                    >
                      <ChevronIcon
                        className={`size-5 transition-transform duration-[140ms] ${
                          openAccordion === "services" ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>
                  {openAccordion === "services" && (
                    <ul className="mb-4 space-y-5 border-l border-line-200 pl-4">
                      {serviceCategories.map((category) => (
                        <li key={category.slug}>
                          <Link
                            href={`/services/${category.slug}`}
                            className="flex items-center gap-2 py-1 font-display text-[17px] font-bold uppercase text-blue-600"
                          >
                            <CategoryIcon
                              name={category.icon}
                              className="size-[18px]"
                            />
                            {category.name}
                          </Link>
                          <ul className="mt-1 space-y-0.5 pl-6">
                            {category.services.map((service) => (
                              <li key={service.slug}>
                                <Link
                                  href={`/services/${category.slug}/${service.slug}`}
                                  className="block py-2 text-[14px] text-slate-600"
                                >
                                  {service.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ) : (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="label-caps block py-4 text-ink-900"
                  >
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>

          <div className="mt-6 space-y-3">
            <Link
              href="/contact"
              className="label-caps flex h-12 w-full items-center justify-center bg-blue-600 text-white"
            >
              Get a quote
            </Link>
            <a
              href={siteConfig.phones[0].href}
              className="label-caps flex h-12 w-full items-center justify-center gap-2 border border-blue-600 text-blue-600"
            >
              <PhoneIcon className="size-4" />
              {siteConfig.phones[0].number}
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}
