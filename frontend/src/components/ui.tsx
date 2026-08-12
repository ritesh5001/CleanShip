import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowIcon, CheckIcon } from "./icons";

/* ------------------------------------------------------------------ */
/* Button                                                              */
/*                                                                     */
/* DS spec: 44px control height (hard floor), 2px radius, UPPERCASE     */
/* label at --ls-label. Hover *darkens* — it never lightens or glows.   */
/* Press scales to .985 with no colour change.                          */
/* ------------------------------------------------------------------ */

type Variant = "primary" | "outline" | "light" | "ghost-navy";

const variants: Record<Variant, string> = {
  primary: "bg-blue-600 text-white hover:bg-navy-700",
  outline:
    "border border-blue-600 text-blue-600 hover:bg-blue-50 hover:border-blue-400",
  light: "bg-white text-navy-800 hover:bg-blue-50",
  "ghost-navy":
    "border border-white/40 text-white hover:border-aqua-500 hover:bg-white/10",
};

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
  external,
  withArrow = true,
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  external?: boolean;
  withArrow?: boolean;
}) {
  const classes = `label-caps group inline-flex h-11 shrink-0 items-center whitespace-nowrap justify-center gap-2.5 rounded-xs px-6 transition-[background-color,border-color,transform] duration-[140ms] ease-standard active:scale-[.985] ${variants[variant]} ${className}`;

  const inner = (
    <>
      {children}
      {withArrow && (
        <ArrowIcon className="size-4 transition-transform duration-[140ms] ease-standard group-hover:translate-x-0.5" />
      )}
    </>
  );

  if (external) {
    return (
      <a href={href} className={classes}>
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {inner}
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* SectionHeading                                                      */
/*                                                                     */
/* Eyebrow renders between two 3px aqua rules (the .eyebrow device).   */
/* Display type is condensed uppercase and set large — the oversized    */
/* type is what carries the premium feel in a system with no gradients. */
/* ------------------------------------------------------------------ */

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  onNavy = false,
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  onNavy?: boolean;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <div
      className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}
    >
      {eyebrow && (
        <span
          className={`eyebrow ${align === "center" ? "justify-center" : ""}`}
        >
          {eyebrow}
        </span>
      )}
      <Tag
        className={`mt-5 text-[32px] leading-[1.08] sm:text-[40px] lg:text-[52px] ${
          onNavy ? "text-white" : "text-ink-900"
        }`}
      >
        {title}
      </Tag>
      {description && (
        <p
          className={`mt-5 max-w-[68ch] text-[17px] leading-[1.62] ${
            onNavy ? "text-white/72" : "text-ink-700"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CheckList                                                           */
/*                                                                     */
/* DS: ticks are the `check` glyph inside a square tinted plate —       */
/* blue-50 on white, rgba(255,255,255,.10) on navy. Never a bullet.     */
/* ------------------------------------------------------------------ */

export function CheckList({
  items,
  onNavy = false,
  className = "",
}: {
  items: readonly string[];
  onNavy?: boolean;
  className?: string;
}) {
  return (
    <ul className={`space-y-3.5 ${className}`}>
      {items.map((item) => (
        <li key={item} className="flex gap-3.5">
          <span
            className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-xs ${
              onNavy ? "bg-white/10 text-aqua-200" : "bg-blue-50 text-blue-600"
            }`}
          >
            <CheckIcon className="size-3.5" />
          </span>
          <span
            className={`text-[15px] leading-[1.6] ${
              onNavy ? "text-white/72" : "text-ink-700"
            }`}
          >
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/* Breadcrumbs                                                         */
/* ------------------------------------------------------------------ */

export function Breadcrumbs({
  trail,
  onNavy = false,
}: {
  trail: { name: string; path: string }[];
  onNavy?: boolean;
}) {
  return (
    <nav aria-label="Breadcrumb">
      <ol
        className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] ${
          onNavy ? "text-white/60" : "text-slate-500"
        }`}
      >
        {trail.map((item, i) => {
          const last = i === trail.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-2">
              {last ? (
                <span
                  aria-current="page"
                  className={onNavy ? "text-aqua-200" : "text-blue-600"}
                >
                  {item.name}
                </span>
              ) : (
                <>
                  <Link
                    href={item.path}
                    className={`transition-colors duration-[140ms] ${
                      onNavy ? "hover:text-white" : "hover:text-blue-600"
                    }`}
                  >
                    {item.name}
                  </Link>
                  <span aria-hidden="true" className="opacity-40">
                    /
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/* Badge — the one place the DS permits a pill                          */
/* ------------------------------------------------------------------ */

export function Badge({
  children,
  onNavy = false,
}: {
  children: ReactNode;
  onNavy?: boolean;
}) {
  return (
    <span
      className={`label-caps inline-flex items-center rounded-full px-3 py-1 text-[11px] ${
        onNavy
          ? "bg-white/10 text-aqua-200"
          : "bg-blue-50 text-blue-600"
      }`}
    >
      {children}
    </span>
  );
}

/* Two-digit service index — DS: services are always 01…08, mono face. */
export function IndexNumber({
  n,
  onNavy = false,
}: {
  n: number;
  onNavy?: boolean;
}) {
  return (
    <span
      className={`tabular text-[13px] ${
        onNavy ? "text-aqua-200" : "text-blue-600"
      }`}
    >
      {String(n).padStart(2, "0")}
    </span>
  );
}
