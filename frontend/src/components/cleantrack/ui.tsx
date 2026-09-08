import Link from "next/link";
import type { ReactNode } from "react";
import { STATE_STYLE, type CompartmentState } from "@/lib/cleantrack/types";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-none border border-[#dce4eb] bg-white ${className}`}>
      {children}
    </div>
  );
}

export function PageTitle({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}

const buttonBase =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-none px-4 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50";

const variants = {
  primary: "bg-blue-700 text-white hover:bg-blue-800",
  secondary: "border border-slate-300 bg-white text-slate-800 hover:bg-slate-50",
  danger: "border border-red-300 bg-white text-red-700 hover:bg-red-50",
} as const;

export function Button({
  children,
  variant = "primary",
  className = "",
  ...rest
}: {
  children: ReactNode;
  variant?: keyof typeof variants;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={`${buttonBase} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export function LinkButton({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: keyof typeof variants;
  className?: string;
}) {
  return (
    <Link href={href} className={`${buttonBase} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}

export function StatusChip({ state }: { state: CompartmentState }) {
  const s = STATE_STYLE[state];
  return (
    <span
      className={`inline-flex items-center rounded-none border px-2.5 py-0.5 text-[12px] font-semibold ${s.chip}`}
    >
      {s.label}
    </span>
  );
}

/* The cell language, applied one level up: a vessel that is working wears the
   same yellow a working cell does, and a finished one the same green. It reads
   as one system rather than two, which is why the design does it this way. */
const VESSEL_STATUS_STYLE: Record<string, string> = {
  scheduled: "bg-white text-[#5b6b7a] border-[#c8d2dc]",
  "in-progress": "bg-[#fdf3c4] text-[#7d5c00] border-[#d6a90a]",
  complete: "bg-[#8fce6a] text-[#14400a] border-[#4f9c2b]",
  cancelled: "bg-[#fae5e0] text-[#c6472f] border-[#c6472f]",
};

export function VesselStatusChip({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-none border px-2.5 py-0.5 text-[12px] font-semibold capitalize ${
        VESSEL_STATUS_STYLE[status] ?? VESSEL_STATUS_STYLE.scheduled
      }`}
    >
      {status.replace("-", " ")}
    </span>
  );
}

export function ProgressBar({
  ratio,
  className = "",
}: {
  ratio: number;
  className?: string;
}) {
  const pct = Math.round(ratio * 100);
  return (
    <div className={className}>
      <div
        className="h-2 w-full overflow-hidden rounded-none bg-[#dce4eb]"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`h-full rounded-none transition-[width] duration-500 ${
            pct === 100 ? "bg-[#1e9e63]" : "bg-[#00b0b9]"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-semibold text-slate-700">
        {label}
      </span>
      {children}
      {hint && !error && (
        <span className="mt-1 block text-[12px] text-slate-500">{hint}</span>
      )}
      {error && (
        <span role="alert" className="mt-1 block text-[12px] text-red-700">
          {error}
        </span>
      )}
    </label>
  );
}

export const inputClass =
  "w-full min-h-11 rounded-none border border-slate-300 bg-white px-3 text-[15px] text-slate-900 outline-none transition-colors focus:border-blue-600 focus:ring-2 focus:ring-blue-100";

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <Card className="p-10 text-center">
      <h2 className="text-base font-semibold text-slate-900">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">{body}</p>
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </Card>
  );
}
