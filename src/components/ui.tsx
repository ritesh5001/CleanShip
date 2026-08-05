import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowIcon, CheckIcon } from "./icons";

/* ------------------------------------------------------------------ */
/* Buttons                                                             */
/* ------------------------------------------------------------------ */

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost" | "light";
  className?: string;
  /** Renders a plain <a> for tel:/mailto:/external targets. */
  external?: boolean;
};

const buttonStyles = {
  primary:
    "bg-aqua-400 text-abyss-950 shadow-lg shadow-aqua-500/25 hover:bg-aqua-300",
  ghost:
    "border border-white/20 text-white hover:border-aqua-400/70 hover:text-aqua-300",
  light:
    "bg-white text-abyss-950 shadow-lg shadow-abyss-950/10 hover:bg-abyss-50",
} as const;

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
  external,
}: ButtonProps) {
  const classes = `group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition duration-300 ${buttonStyles[variant]} ${className}`;

  const inner = (
    <>
      {children}
      <ArrowIcon className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
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
/* Section heading                                                     */
/* ------------------------------------------------------------------ */

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  light = false,
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  /** Set on light-background sections so the text inverts. */
  light?: boolean;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <div
      className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}
    >
      {eyebrow && (
        <span
          className={`eyebrow ${align === "center" ? "justify-center" : ""} ${
            light ? "text-aqua-700" : ""
          }`}
        >
          {eyebrow}
        </span>
      )}
      <Tag
        className={`mt-4 text-3xl leading-[1.15] sm:text-4xl lg:text-[2.75rem] ${
          light ? "text-abyss-950" : "text-white"
        }`}
      >
        {title}
      </Tag>
      {description && (
        <p
          className={`mt-5 text-base leading-relaxed sm:text-lg ${
            light ? "text-abyss-700" : "text-abyss-300"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Checklist                                                           */
/* ------------------------------------------------------------------ */

export function CheckList({
  items,
  light = false,
  className = "",
}: {
  items: readonly string[];
  light?: boolean;
  className?: string;
}) {
  return (
    <ul className={`space-y-3 ${className}`}>
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span
            className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full ${
              light
                ? "bg-aqua-600/15 text-aqua-700"
                : "bg-aqua-400/15 text-aqua-300"
            }`}
          >
            <CheckIcon className="size-3" />
          </span>
          <span
            className={`text-sm leading-relaxed ${
              light ? "text-abyss-700" : "text-abyss-200"
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
}: {
  trail: { name: string; path: string }[];
}) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-abyss-400">
        {trail.map((item, i) => {
          const last = i === trail.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-2">
              {last ? (
                <span aria-current="page" className="text-aqua-300">
                  {item.name}
                </span>
              ) : (
                <>
                  <Link
                    href={item.path}
                    className="transition hover:text-aqua-300"
                  >
                    {item.name}
                  </Link>
                  <span aria-hidden="true" className="text-abyss-600">
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
