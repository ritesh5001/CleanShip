import Link from "next/link";
import { Reveal } from "./reveal";
import { ArrowIcon, CheckIcon } from "./icons";
import type { Port, LineKey } from "@/lib/ports/types";
import { portLabel } from "@/lib/ports/types";
import type { PortLine, PortScope } from "@/lib/ports/lines";
import { findingNotes, seasonNotes, workingConditions } from "@/lib/ports/lines";
import {
  neighboursWithLine,
  otherLinesAt,
  portFactRows,
  portHubSlug,
  portScopeSlug,
} from "@/lib/ports/registry";

/**
 * Shared furniture for the port landing pages.
 *
 * These sections carry the port-specific content — the facts table, the
 * conditions note, the scope-at-this-port list, the seasonal window and the
 * internal links out to neighbouring ports and the other service lines. They
 * are what makes each page a real page rather than a service page with a name
 * swapped in, so they render on every one of them.
 */

/** workAreas are stored mid-sentence; display surfaces capitalise. */
const sentenceCase = (value: string) => value[0].toUpperCase() + value.slice(1);

/* ------------------------------------------------------------------ */
/* Port facts — a scannable, structured block of genuinely local data  */
/* ------------------------------------------------------------------ */

export function PortFacts({ port }: { port: Port }) {
  return (
    <div className="rule-accent-top border border-line-200 bg-paper p-6">
      <h2 className="font-display text-[20px] font-bold uppercase leading-tight text-ink-900">
        {portLabel(port)} at a glance
      </h2>
      <dl className="mt-5 divide-y divide-line-200">
        {portFactRows(port).map((row) => (
          <div
            key={row.label}
            className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4"
          >
            <dt className="label-caps text-[11px] text-slate-500">
              {row.label}
            </dt>
            <dd className="text-[15px] leading-[1.55] text-ink-700 sm:col-span-2">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Working conditions                                                   */
/* ------------------------------------------------------------------ */

export function PortConditions({ port, line }: { port: Port; line: LineKey }) {
  return (
    <div className="rule-accent-left border-y border-r border-line-200 bg-blue-50 p-7">
      <h2 className="font-display text-[20px] font-bold uppercase leading-tight text-ink-900">
        Working conditions at {port.name}
      </h2>
      <p className="mt-4 max-w-[70ch] text-[15px] leading-[1.62] text-ink-700">
        {workingConditions(port, line)}
      </p>
      <dl className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <dt className="label-caps text-[11px] text-blue-600">
            Where we work
          </dt>
          <dd className="mt-2 text-[15px] leading-[1.55] text-ink-700">
            {port.workAreas.map(sentenceCase).join(" · ")}
          </dd>
        </div>
        <div>
          <dt className="label-caps text-[11px] text-blue-600">
            Vessels we see here
          </dt>
          <dd className="mt-2 text-[15px] leading-[1.55] text-ink-700">
            {port.vesselTypes.join(" · ")}
          </dd>
        </div>
      </dl>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Scope at this port                                                   */
/* ------------------------------------------------------------------ */

export function PortScopeList({
  heading,
  items,
}: {
  heading: string;
  items: string[];
}) {
  return (
    <section className="mt-14">
      <Reveal>
        <h2 className="font-display text-[28px] font-bold uppercase leading-tight text-ink-900 sm:text-[32px]">
          {heading}
        </h2>
        <ul className="mt-6 divide-y divide-line-100 border-t border-line-200">
          {items.map((item) => (
            <li key={item} className="flex gap-4 py-4">
              <CheckIcon className="mt-1 size-4 shrink-0 text-aqua-500" />
              <span className="text-[15px] leading-[1.62] text-ink-700">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Delivery steps                                                       */
/* ------------------------------------------------------------------ */

export function PortDelivery({
  port,
  steps,
}: {
  port: Port;
  steps: { title: string; body: string }[];
}) {
  return (
    <section className="mt-14">
      <Reveal>
        <h2 className="font-display text-[28px] font-bold uppercase leading-tight text-ink-900 sm:text-[32px]">
          How we deliver it at {port.name}
        </h2>
      </Reveal>
      <ol className="mt-8 space-y-7">
        {steps.map((step, i) => (
          <Reveal as="li" key={step.title} delay={i * 40} className="flex gap-5">
            <span className="tabular flex size-7 shrink-0 items-center justify-center bg-blue-600 text-[12px] text-white">
              {i + 1}
            </span>
            <div className="min-w-0">
              <h3 className="font-display text-[18px] font-bold uppercase leading-tight text-ink-900">
                {step.title}
              </h3>
              <p className="mt-2 max-w-[70ch] text-[15px] leading-[1.62] text-slate-600">
                {step.body}
              </p>
            </div>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Planning the window / what we find                                  */
/*                                                                     */
/* Paired deliberately: one answers "when can you come", the other     */
/* answers "what will you find when you do". Together they are the     */
/* largest block of genuinely port-specific prose on the page.         */
/* ------------------------------------------------------------------ */

export function PortPlanning({
  port,
  line,
  extraFinding,
}: {
  port: Port;
  line: LineKey;
  extraFinding?: string;
}) {
  const season = seasonNotes(port, line);
  const findings = findingNotes(port, line, extraFinding);

  return (
    <section className="mt-14 grid gap-10 lg:grid-cols-2 lg:gap-12">
      <Reveal>
        <h2 className="font-display text-[22px] font-bold uppercase leading-tight text-ink-900">
          Planning the window at {port.name}
        </h2>
        <div className="mt-4 space-y-4">
          {season.map((paragraph, i) => (
            <p key={i} className="text-[15px] leading-[1.62] text-ink-700">
              {paragraph}
            </p>
          ))}
        </div>
      </Reveal>

      <Reveal delay={60}>
        <h2 className="font-display text-[22px] font-bold uppercase leading-tight text-ink-900">
          What we typically find at {port.name}
        </h2>
        <div className="mt-4 space-y-4">
          {findings.map((paragraph, i) => (
            <p key={i} className="text-[15px] leading-[1.62] text-ink-700">
              {paragraph}
            </p>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Internal linking: other scopes, other lines, nearby ports            */
/* ------------------------------------------------------------------ */

export function OtherScopesAtPort({
  port,
  line,
  currentPrefix,
}: {
  port: Port;
  line: PortLine;
  /** Omit on the port hub so all scopes render. */
  currentPrefix?: string;
}) {
  const others = line.scopes.filter((s) => s.urlPrefix !== currentPrefix);
  if (others.length === 0) return null;

  return (
    <div className="card p-6">
      <h2 className="label-caps text-[12px] text-slate-500">
        {currentPrefix ? "Also at" : `${line.name} at`} {portLabel(port)}
      </h2>
      <ul className="mt-4 divide-y divide-line-100">
        {others.map((scope) => (
          <li key={scope.urlPrefix}>
            <Link
              href={`/${portScopeSlug(port, scope)}`}
              className="group flex items-center justify-between gap-3 py-3 text-[15px] text-ink-700 transition-colors duration-[140ms] hover:text-blue-600"
            >
              <span>
                {scope.titleStem} at {port.name}
              </span>
              <ArrowIcon className="size-4 shrink-0 text-slate-300 transition-transform duration-[140ms] group-hover:translate-x-0.5 group-hover:text-blue-600" />
            </Link>
          </li>
        ))}
      </ul>
      {currentPrefix && (
        <Link
          href={`/${portHubSlug(port, line)}`}
          className="label-caps mt-4 inline-flex items-center gap-2 text-blue-600"
        >
          All {line.noun} at {port.name}
          <ArrowIcon className="size-4" />
        </Link>
      )}
    </div>
  );
}

/**
 * Cross-line linking. Without this a visitor on the hull page at a port has
 * no path to the hold or tank page at the same port, and the three sets sit
 * as separate silos with no crawl path between them.
 */
export function OtherLinesAtPort({
  port,
  current,
}: {
  port: Port;
  current: LineKey;
}) {
  const others = otherLinesAt(port, current);
  if (others.length === 0) return null;

  return (
    <div className="card p-6">
      <h2 className="label-caps text-[12px] text-slate-500">
        Other services at {portLabel(port)}
      </h2>
      <ul className="mt-4 divide-y divide-line-100">
        {others.map((other) => (
          <li key={other.key}>
            <Link
              href={`/${portHubSlug(port, other)}`}
              className="group flex items-center justify-between gap-3 py-3 transition-colors duration-[140ms]"
            >
              <span className="min-w-0">
                <span className="block font-display text-[16px] font-semibold uppercase leading-tight text-ink-900 transition-colors duration-[140ms] group-hover:text-blue-600">
                  {other.name} at {port.name}
                </span>
                <span className="mt-0.5 block text-[12px] text-slate-500">
                  {other.scopes.length} scopes
                </span>
              </span>
              <ArrowIcon className="size-4 shrink-0 text-slate-300 transition-transform duration-[140ms] group-hover:translate-x-0.5 group-hover:text-blue-600" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function NearbyPorts({
  port,
  line,
  scope,
  regionHubPath,
  regionLabel,
}: {
  port: Port;
  line: PortLine;
  /** When given, links stay on the same scope; otherwise on the port hubs. */
  scope?: PortScope;
  regionHubPath: string;
  regionLabel: string;
}) {
  const nearby = neighboursWithLine(port, line.key);
  if (nearby.length === 0) return null;

  return (
    <div className="card p-6">
      <h2 className="label-caps text-[12px] text-slate-500">
        {scope ? `${scope.titleStem} nearby` : `${line.name} nearby`}
      </h2>
      <ul className="mt-4 divide-y divide-line-100">
        {nearby.map((other) => (
          <li key={other.slug}>
            <Link
              href={`/${scope ? portScopeSlug(other, scope) : portHubSlug(other, line)}`}
              className="group flex items-center justify-between gap-3 py-3 transition-colors duration-[140ms]"
            >
              <span className="min-w-0">
                <span className="block text-[15px] text-ink-700 transition-colors duration-[140ms] group-hover:text-blue-600">
                  {portLabel(other)}
                </span>
                <span className="mt-0.5 block text-[12px] text-slate-500">
                  {other.state} · {other.unlocode}
                </span>
              </span>
              <ArrowIcon className="size-4 shrink-0 text-slate-300 transition-transform duration-[140ms] group-hover:translate-x-0.5 group-hover:text-blue-600" />
            </Link>
          </li>
        ))}
      </ul>
      <Link
        href={regionHubPath}
        className="label-caps mt-4 inline-flex items-center gap-2 text-blue-600"
      >
        All {regionLabel}
        <ArrowIcon className="size-4" />
      </Link>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Outcomes                                                            */
/* ------------------------------------------------------------------ */

export function PortOutcomes({ items }: { items: readonly string[] }) {
  return (
    <div className="mt-10 border border-line-200 bg-white p-7">
      <h2 className="font-display text-[20px] font-bold uppercase leading-tight text-ink-900">
        What it gets you
      </h2>
      <ul className="mt-5 space-y-3.5">
        {items.map((item) => (
          <li key={item} className="flex gap-3.5">
            <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center bg-blue-50 text-blue-600">
              <CheckIcon className="size-3.5" />
            </span>
            <span className="text-[15px] leading-[1.6] text-ink-700">
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
