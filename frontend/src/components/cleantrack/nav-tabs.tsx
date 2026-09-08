"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * The nav tabs, with the current one marked.
 *
 * Split out as a client component only because it needs the current path.
 * The active tab takes a lighter navy panel and an aqua underline rather than
 * a colour change alone — on a navy bar, "slightly whiter text" is not a state
 * anyone notices.
 */

export function NavTabs({ items }: { items: { href: string; label: string }[] }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 items-stretch overflow-x-auto">
      {items.map((item) => {
        /* Longest-prefix match, so /cleantrack/admin/clients marks Clients and
           not Vessels — the parent would otherwise light up on every child. */
        const best = items.reduce((acc, i) =>
          pathname.startsWith(i.href) && i.href.length > acc.length ? i.href : acc,
        "");
        const active = item.href === best;

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`flex items-center whitespace-nowrap border-b-[3px] px-4 text-[14px] font-medium transition-colors ${
              active
                ? "border-[#00b0b9] bg-white/[0.07] text-white"
                : "border-transparent text-white/65 hover:bg-white/[0.04] hover:text-white"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
