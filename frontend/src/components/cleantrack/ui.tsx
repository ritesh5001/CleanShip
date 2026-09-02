import Link from "next/link";
import type { ReactNode } from "react";
import { STATE_STYLE, type CompartmentState } from "@cleanship/backend/cleantrack/stages";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-lg border border-slate-200 bg-white ${className}`}>
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
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50";

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
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[12px] font-semibold ${s.chip}`}
    >
      {s.label}
    </span>
  );
}

const JOB_STATUS_STYLE: Record<string, string> = {
  scheduled: "bg-slate-100 text-slate-700 border-slate-300",
  "in-progress": "bg-amber-100 text-amber-800 border-amber-400",
  complete: "bg-emerald-100 text-emerald-800 border-emerald-400",
  cancelled: "bg-red-100 text-red-800 border-red-300",
};

export function JobStatusChip({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[12px] font-semibold capitalize ${
        JOB_STATUS_STYLE[status] ?? JOB_STATUS_STYLE.scheduled
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
        className="h-2 w-full overflow-hidden rounded-full bg-slate-200"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`h-full rounded-full transition-[width] duration-500 ${
            pct === 100 ? "bg-emerald-600" : "bg-amber-500"
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
  "w-full min-h-11 rounded-md border border-slate-300 bg-white px-3 text-[15px] text-slate-900 outline-none transition-colors focus:border-blue-600 focus:ring-2 focus:ring-blue-100";

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
