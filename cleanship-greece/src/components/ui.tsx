import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowIcon, CheckIcon } from "./icons";

const variants = {
  primary: "bg-blue-600 text-white hover:bg-navy-700",
  outline: "border border-blue-600 text-blue-600 hover:bg-blue-50",
  light: "bg-white text-navy-800 hover:bg-blue-50",
  ghost: "border border-white/40 text-white hover:border-white hover:bg-white/10",
  whatsapp: "bg-[#25d366] text-[#06203a] hover:bg-[#1fb857]",
} as const;

export function Button({
  href,
  children,
  variant = "primary",
  arrow = false,
  external = false,
}: {
  href: string;
  children: ReactNode;
  variant?: keyof typeof variants;
  arrow?: boolean;
  external?: boolean;
}) {
  const cls = `inline-flex min-h-11 items-center justify-center gap-2 rounded-xs px-6 text-[14px] font-semibold uppercase tracking-[0.08em] transition-colors duration-[140ms] ${variants[variant]}`;
  const inner = (
    <>
      {children}
      {arrow && <ArrowIcon className="size-4" />}
    </>
  );
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  as: Tag = "h2",
  center = false,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  as?: "h1" | "h2";
  center?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <Tag className="text-h2 mt-4">{title}</Tag>
      {description && <p className="text-lead mt-5 text-slate-600">{description}</p>}
    </div>
  );
}

export function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-[16px] leading-[1.55] text-ink-700">
          <CheckIcon className="mt-0.5 size-5 shrink-0 text-aqua-600" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
