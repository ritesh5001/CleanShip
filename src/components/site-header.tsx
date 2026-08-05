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
  MenuIcon,
  PhoneIcon,
} from "./icons";
import { Logo } from "./logo";

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Solid background once the hero has scrolled past.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Any navigation closes every menu.
  useEffect(() => {
    setMobileOpen(false);
    setMegaOpen(false);
  }, [pathname]);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Escape closes whichever menu is open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMegaOpen(false);
      setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* A short close delay keeps the mega menu open while the pointer crosses
     the gap between the trigger and the panel. */
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
      {/* Utility strip — hidden on small screens to protect vertical space */}
      <div className="hidden border-b border-white/5 bg-abyss-950 text-abyss-300 lg:block">
        <div className="container-page flex h-10 items-center justify-between text-xs">
          <p>
            Welcome to Cleanship Marine Services — hold, tank, hull and offshore
            specialists
          </p>
          <div className="flex items-center gap-6">
            <a
              href={siteConfig.phones[0].href}
              className="flex items-center gap-2 transition hover:text-aqua-300"
            >
              <PhoneIcon className="size-3.5" />
              {siteConfig.phones[0].number}
            </a>
            <a
              href={`mailto:${siteConfig.email}`}
              className="transition hover:text-aqua-300"
            >
              {siteConfig.email}
            </a>
          </div>
        </div>
      </div>

      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled || mobileOpen
            ? "border-b border-white/10 bg-abyss-950/85 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="container-page flex h-18 items-center justify-between gap-4 py-3">
          <Link
            href="/"
            className="shrink-0"
            aria-label={`${siteConfig.name} — home`}
          >
            <Logo className="h-9 w-auto" />
          </Link>

          {/* ---------- Desktop navigation ---------- */}
          <nav
            aria-label="Main"
            className="hidden items-center gap-1 lg:flex"
          >
            {mainNav.map((item) =>
              item.href === "/services" ? (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={openMega}
                  onMouseLeave={scheduleCloseMega}
                >
                  <Link
                    href={item.href}
                    aria-expanded={megaOpen}
                    aria-haspopup="true"
                    className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition ${
                      isActive(item.href)
                        ? "text-aqua-300"
                        : "text-abyss-100 hover:text-aqua-300"
                    }`}
                  >
                    {item.label}
                    <ChevronIcon
                      className={`size-4 transition-transform duration-300 ${
                        megaOpen ? "rotate-180" : ""
                      }`}
                    />
                  </Link>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    isActive(item.href)
                      ? "text-aqua-300"
                      : "text-abyss-100 hover:text-aqua-300"
                  }`}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              className="hidden rounded-full bg-aqua-400 px-5 py-2.5 text-sm font-semibold text-abyss-950 shadow-lg shadow-aqua-500/20 transition hover:bg-aqua-300 sm:inline-flex"
            >
              Request a Quote
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              className="inline-flex size-10 items-center justify-center rounded-full border border-white/15 text-abyss-50 transition hover:border-aqua-400/60 hover:text-aqua-300 lg:hidden"
            >
              {mobileOpen ? (
                <CloseIcon className="size-5" />
              ) : (
                <MenuIcon className="size-5" />
              )}
            </button>
          </div>
        </div>

        {/* ---------- Desktop mega menu ---------- */}
        <div
          onMouseEnter={openMega}
          onMouseLeave={scheduleCloseMega}
          className={`absolute inset-x-0 top-full hidden origin-top border-b border-white/10 bg-abyss-950/95 backdrop-blur-2xl transition-all duration-300 lg:block ${
            megaOpen
              ? "pointer-events-auto translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-3 opacity-0"
          }`}
        >
          <div className="container-page grid grid-cols-5 gap-6 py-8">
            {serviceCategories.map((category) => (
              <div key={category.slug}>
                <Link
                  href={`/services/${category.slug}`}
                  className="group mb-4 flex items-center gap-2.5 text-sm font-semibold text-abyss-50 transition hover:text-aqua-300"
                >
                  <span className="flex size-8 items-center justify-center rounded-lg bg-aqua-400/10 text-aqua-300 ring-1 ring-aqua-400/20">
                    <CategoryIcon name={category.icon} className="size-4.5" />
                  </span>
                  {category.name}
                </Link>
                <ul className="space-y-1.5 border-l border-white/10 pl-3">
                  {category.services.map((service) => (
                    <li key={service.slug}>
                      <Link
                        href={`/services/${category.slug}/${service.slug}`}
                        className="block py-1 text-[13px] leading-snug text-abyss-300 transition hover:text-aqua-300"
                      >
                        {service.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 bg-white/[0.02]">
            <div className="container-page flex items-center justify-between py-4 text-sm">
              <p className="text-abyss-300">
                Not sure which scope you need? Our operations desk is manned
                24/7.
              </p>
              <Link
                href="/services"
                className="group inline-flex items-center gap-2 font-semibold text-aqua-300"
              >
                View all services
                <ArrowIcon className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ---------- Mobile drawer ---------- */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-40 lg:hidden ${
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!mobileOpen}
      >
        <div
          onClick={() => setMobileOpen(false)}
          className={`absolute inset-0 bg-abyss-950/70 backdrop-blur-sm transition-opacity duration-300 ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <nav
          aria-label="Mobile"
          className={`absolute inset-x-0 top-[calc(4.5rem)] max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-white/10 bg-abyss-950 px-5 pb-10 pt-4 transition-transform duration-300 ${
            mobileOpen ? "translate-y-0" : "-translate-y-4 opacity-0"
          }`}
        >
          <ul className="divide-y divide-white/8">
            {mainNav.map((item) =>
              item.href === "/services" ? (
                <li key={item.href} className="py-1">
                  <div className="flex items-center justify-between">
                    <Link
                      href={item.href}
                      className="flex-1 py-3 text-base font-medium text-abyss-50"
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
                      className="p-3 text-abyss-300"
                    >
                      <ChevronIcon
                        className={`size-5 transition-transform ${
                          openAccordion === "services" ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>
                  {openAccordion === "services" && (
                    <ul className="mb-3 space-y-4 border-l border-white/10 pl-4">
                      {serviceCategories.map((category) => (
                        <li key={category.slug}>
                          <Link
                            href={`/services/${category.slug}`}
                            className="flex items-center gap-2 py-1 text-sm font-semibold text-aqua-300"
                          >
                            <CategoryIcon
                              name={category.icon}
                              className="size-4"
                            />
                            {category.name}
                          </Link>
                          <ul className="mt-1 space-y-0.5 pl-6">
                            {category.services.map((service) => (
                              <li key={service.slug}>
                                <Link
                                  href={`/services/${category.slug}/${service.slug}`}
                                  className="block py-1.5 text-[13px] text-abyss-300"
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
                    className="block py-4 text-base font-medium text-abyss-50"
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
              className="flex w-full items-center justify-center rounded-full bg-aqua-400 px-5 py-3.5 text-sm font-semibold text-abyss-950"
            >
              Request a Quote
            </Link>
            <a
              href={siteConfig.phones[0].href}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-white/15 px-5 py-3.5 text-sm font-semibold text-abyss-50"
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
