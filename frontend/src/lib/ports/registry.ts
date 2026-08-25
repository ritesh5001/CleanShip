/**
 * Route registry and copy builders for the port programme.
 *
 * ROUTE SHAPE
 *   /hull-cleaning-in-india                     region hub for one line
 *   /hold-cleaning-in-uae
 *   /hull-cleaning-in-kandla-port               port hub for one line
 *   /underwater-hull-cleaning-in-kandla-port    one scope at one port
 *   /cargo-hold-cleaning-in-kandla-port
 *   /tanker-tank-cleaning-in-kandla-port
 *
 * The URL prefix is the phrase people search, which is not always the
 * internal service slug — "propeller polishing" outsearches "propeller super
 * polishing" by a wide margin, and "cargo hold cleaning" outsearches "hold
 * cleaning shore gang" — so the route uses the former and the page links
 * through to the latter's canonical service page for the scope detail.
 *
 * WHY THESE PAGES SELF-CANONICALISE
 *
 * The location pages this programme replaces set `canonicalPath` to their
 * parent service page. That tells Google to consolidate the ranking signal
 * onto the service page and drop the location page from the index — correct
 * for a thin page, and the exact opposite of what is wanted here. A page that
 * canonicalises away cannot rank for its own term. These pages carry
 * port-specific facts, conditions, permitting, seasonality and FAQs, so they
 * self-canonicalise and compete on their own. The legacy URLs 301 onto them
 * (see next.config.ts) so nothing is orphaned and nothing competes.
 *
 * The obligation that comes with that: every page must stay genuinely
 * different from its siblings. The port data files do that work. If a future
 * port or scope is added with templated filler, the whole set is at risk, not
 * just the new page.
 */

import type { LineKey, Port } from "./types";
import {
  airportLine,
  areaPhrase,
  hasLine,
  linesFor,
  listAnd,
  midSentence,
  portLabel,
} from "./types";
import { indiaPorts } from "./india";
import { uaePorts } from "./uae";
import { saudiPorts } from "./saudi";
import { sriLankaPorts } from "./sri-lanka";
import { westAfricaPorts } from "./west-africa";
import {
  approvalRoute,
  conditionSummary,
  getLineByPrefix,
  getLine,
  onHireNote,
  supervisionNote,
  windowAnswer,
  portLines,
  type PortLine,
  type PortScope,
} from "./lines";

export { portLabel, listAnd } from "./types";

/* -------------------------------------------------------------------- */
/* Regions                                                              */
/* -------------------------------------------------------------------- */

export type Region = {
  slug: string;
  name: string;
  /** "Indian ports", "UAE ports" */
  portsLabel: string;
  /** Grouping label used on the hub: "state", "emirate". */
  groupNoun: string;
  ports: Port[];
  intro: string;
  /** Something true about working in this region that the port list is not. */
  regionNote: string;
};

export const regions: Region[] = [
  {
    slug: "india",
    name: "India",
    portsLabel: "Indian ports",
    groupNoun: "state",
    ports: indiaPorts,
    intro:
      "Indian ports are not one working environment. A job at Kolkata on the Hooghly, at Kandla at the head of a tidal creek, and at Tuticorin in the Gulf of Mannar are three different operations with three different methods, windows and realistic outcomes.",
    regionNote:
      "Cleanship holds operating bases at Kandla and Visakhapatnam, so people and equipment are held in country. Teams mobilise from there across the coverage, and a single mobilisation is routinely sized to cover more than one vessel or more than one port on the same trip.",
  },
  {
    slug: "uae",
    name: "the UAE",
    portsLabel: "UAE ports",
    groupNoun: "emirate",
    ports: uaePorts,
    intro:
      "The UAE splits into two working environments that behave nothing alike. Inside the Arabian Gulf the water is shallow, hot and hypersaline, which grows hull fouling faster than almost anywhere the fleet trades and makes summer enclosed-space work a genuine constraint. Outside the Strait of Hormuz, Fujairah and Khor Fakkan sit in deeper, clearer Gulf of Oman water and take Indian Ocean swell instead.",
    regionNote:
      "Cleanship's registered head office is in Ajman Free Zone, with further bases at Fujairah and Khor Fakkan, so the UAE is the shortest mobilisation on the coverage list — both coasts reachable inside a day.",
  },
  {
    slug: "saudi-arabia",
    name: "Saudi Arabia",
    portsLabel: "Saudi ports",
    groupNoun: "province",
    ports: saudiPorts,
    intro:
      "Saudi Arabia is two coasts with nothing in common but the flag. Dammam and Jubail sit in the shallow, hypersaline Arabian Gulf under the shamal; Jeddah, King Abdullah and Yanbu sit on the Red Sea, warmer and saltier still, under a persistent along-axis wind. Both grow fouling faster than owners plan for, and on both the summer heat — not access — is what sizes an enclosed-space job.",
    regionNote:
      "Cleanship holds an office at Dammam, so the Gulf coast is a short mobilisation. The Red Sea ports are worked from there and from the UAE bases, and the industrial ports at Jubail and Yanbu need their permit lead time built into the plan rather than discovered at the gate.",
  },
  {
    slug: "sri-lanka",
    name: "Sri Lanka",
    portsLabel: "Sri Lankan ports",
    groupNoun: "province",
    ports: sriLankaPorts,
    intro:
      "Sri Lanka is the one market on this list where there is almost always a workable coast. The south-west monsoon closes Colombo and Galle from May to September while Trincomalee on the east stays open; the north-east monsoon from December to February reverses it. Planned properly, that means a vessel on an Indian Ocean rotation can nearly always be met somewhere on the island.",
    regionNote:
      "Cleanship holds an office in Colombo, which sits directly on the rotation for vessels working the Indian coverage — a single mobilisation frequently covers a Colombo call and an Indian port on the same trip.",
  },
  {
    slug: "west-africa",
    name: "West Africa",
    portsLabel: "West African ports",
    groupNoun: "country",
    ports: westAfricaPorts,
    intro:
      "West Africa is defined by two things: long-period Atlantic ground swell that reaches the anchorages on days that look calm, and congestion severe enough that waiting for a berth is the normal state rather than the exception. The swell costs windows; the waiting creates them. Between them they explain why so much in-water work on this coast is done at anchor and why the fouling found is heavier than the trading pattern predicts.",
    regionNote:
      "Cleanship holds a base at Conakry, and the West African range has been part of the hull-cleaning service coverage since before the port programme existed. Ports along this coast sit close enough that a single mobilisation routinely covers two or three attendances on one trip.",
  },
];

export function getRegion(slug: string) {
  return regions.find((r) => r.slug === slug);
}

export const allPorts: Port[] = regions.flatMap((r) => r.ports);

const portBySlug = new Map(allPorts.map((p) => [p.slug, p]));
export function getPort(slug: string) {
  return portBySlug.get(slug);
}

export function regionOf(port: Port): Region {
  return regions.find((r) => r.ports.includes(port))!;
}

export function neighbouringPorts(port: Port): Port[] {
  return port.neighbours
    .map((slug) => portBySlug.get(slug))
    .filter((p): p is Port => Boolean(p));
}

/** Neighbouring ports that also carry this line. */
export function neighboursWithLine(port: Port, line: LineKey): Port[] {
  return neighbouringPorts(port).filter((p) => hasLine(p, line));
}

/** Ports in a region grouped by state or emirate, largest group first. */
export function portsGrouped(region: Region, line?: LineKey) {
  const ports = line
    ? region.ports.filter((p) => hasLine(p, line))
    : region.ports;
  const order: string[] = [];
  const groups = new Map<string, Port[]>();
  for (const port of ports) {
    if (!groups.has(port.state)) {
      groups.set(port.state, []);
      order.push(port.state);
    }
    groups.get(port.state)!.push(port);
  }
  return order
    .map((state) => ({ state, ports: groups.get(state)! }))
    .sort(
      (a, b) =>
        b.ports.length - a.ports.length || a.state.localeCompare(b.state),
    );
}

export function portsWithLine(line: LineKey, region?: Region): Port[] {
  return (region ? region.ports : allPorts).filter((p) => hasLine(p, line));
}

/* -------------------------------------------------------------------- */
/* Route registry                                                       */
/* -------------------------------------------------------------------- */

export type PortPage =
  | { kind: "region"; slug: string; region: Region; line: PortLine }
  | { kind: "port"; slug: string; port: Port; line: PortLine }
  | {
      kind: "scope";
      slug: string;
      port: Port;
      line: PortLine;
      scope: PortScope;
    };

export const regionHubSlug = (line: PortLine, region: Region) =>
  `${line.urlPrefix}-in-${region.slug}`;

export const portHubSlug = (port: Port, line: PortLine) =>
  `${line.urlPrefix}-in-${port.slug}`;

export const portScopeSlug = (port: Port, scope: PortScope) =>
  `${scope.urlPrefix}-in-${port.slug}`;

export const portPages: PortPage[] = [
  ...regions.flatMap((region) =>
    portLines
      .filter((line) => portsWithLine(line.key, region).length > 0)
      .map((line) => ({
        kind: "region" as const,
        slug: regionHubSlug(line, region),
        region,
        line,
      })),
  ),
  ...allPorts.flatMap((port) =>
    linesFor(port).flatMap((key) => {
      const line = getLine(key);
      return [
        { kind: "port" as const, slug: portHubSlug(port, line), port, line },
        ...line.scopes.map((scope) => ({
          kind: "scope" as const,
          slug: portScopeSlug(port, scope),
          port,
          line,
          scope,
        })),
      ];
    }),
  ),
];

const pageBySlug = new Map(portPages.map((page) => [page.slug, page]));

export function getPortPage(slug: string): PortPage | undefined {
  return pageBySlug.get(slug);
}

/* A slug clash would silently shadow a page: two entries mapping to one URL
   means one port quietly stops existing, and nothing else in the build would
   notice. Fail the build instead. */
if (pageBySlug.size !== portPages.length) {
  const seen = new Set<string>();
  const dupes = portPages
    .map((p) => p.slug)
    .filter((s) => (seen.has(s) ? true : (seen.add(s), false)));
  throw new Error(`Duplicate port page slug(s): ${[...new Set(dupes)].join(", ")}`);
}

export { getLineByPrefix, portLines, getLine };

/* -------------------------------------------------------------------- */
/* Indexation policy                                                     */
/* -------------------------------------------------------------------- */

/**
 * Whether a generated page is allowed into the index.
 *
 * THE PROBLEM. Six URLs per port compete for one query. Someone searching
 * "hull cleaning Kandla" could land on the line hub or any of five scope
 * pages, all carrying the same port facts table, the same working-conditions
 * section and a near-identical FAQ block. Google picks one and largely
 * ignores the rest — and on a domain with no authority behind it, it may
 * index none of them.
 *
 * THE POLICY. Region hubs and port line hubs are indexable. Scope pages are
 * `noindex, follow`: they stay live, they stay linked, they still pass signal
 * up to the hub, and a visitor who lands on one from an internal link gets
 * the detail they came for. They just stop competing with their own hub.
 *
 * ~140 indexable pages instead of ~600. That is a sensible number for this
 * domain's current authority, and it concentrates the ranking signal instead
 * of splitting it six ways.
 *
 * REVERSING IT. Flip `INDEX_SCOPE_PAGES` to true. Do that once Search Console
 * shows the hubs earning impressions and the site has authority to spend —
 * or sooner, if the Pages report shows the scope pages were indexing cleanly
 * all along. This is a bet, not a fact, and it is built to be undone.
 *
 * A per-scope carve-out is supported: UWILD is a distinct high-value query
 * with its own vocabulary and a buyer who searches for it by name, so it is
 * the obvious first candidate if you want to let one back in. Add its
 * urlPrefix to `ALWAYS_INDEX` rather than flipping the whole set.
 */
const INDEX_SCOPE_PAGES = false;

/** Scope urlPrefixes that stay indexable regardless of the flag above. */
const ALWAYS_INDEX: string[] = [];

export function shouldIndex(page: PortPage): boolean {
  if (page.kind !== "scope") return true;
  return INDEX_SCOPE_PAGES || ALWAYS_INDEX.includes(page.scope.urlPrefix);
}

/* -------------------------------------------------------------------- */
/* Titles and descriptions                                              */
/* -------------------------------------------------------------------- */

const BRAND_SUFFIX = 12; // " | Cleanship"
const TITLE_LIMIT = 60;
const DESCRIPTION_LIMIT = 162;

/**
 * Appends " Port" only when the full SERP title still fits. Search results
 * truncate at roughly 60 characters including the brand suffix, and a title
 * cut mid-place-name is worse than one without the word "Port" in it.
 */
function fitTitle(stem: string, port: Port): string {
  const withPort = `${stem} at ${portLabel(port)}`;
  if (withPort.length + BRAND_SUFFIX <= TITLE_LIMIT) return withPort;
  const bare = `${stem} at ${port.name}`;
  if (bare.length + BRAND_SUFFIX <= TITLE_LIMIT) return bare;
  return `${stem} — ${port.name}`;
}

/**
 * Acronyms that must survive a lowercasing step.
 *
 * `scope.titleStem.toLowerCase()` was turning "UWILD Inspection" into "uwild
 * inspection" in ~1,000 meta descriptions. Google does not care, but a human
 * scanning a results page does, and click-through is the only lever left once
 * several hundred near-identical listings are competing.
 */
const ACRONYMS = [
  "UWILD",
  "NDT",
  "IRATA",
  "MARPOL",
  "POL",
  "CPP",
  "DPP",
  "OSV",
  "LNG",
  "LPG",
  "RoRo",
  "UN/LOCODE",
];

function restoreAcronyms(text: string): string {
  return ACRONYMS.reduce(
    (out, word) =>
      out.replace(new RegExp(`\\b${word}\\b`, "gi"), word),
    text,
  );
}

/** Sentence-cases the first character without touching the rest. */
function sentenceStart(text: string): string {
  return text ? text[0].toUpperCase() + text.slice(1) : text;
}

/**
 * Truncates on a word boundary with an ellipsis — never mid-clause.
 *
 * The previous version cut at the limit and appended a full stop, which
 * produced snippets ending "...permits and." A trailing dangling conjunction
 * reads as broken, and it was shipping on the region hubs.
 */
function clamp(text: string, limit = DESCRIPTION_LIMIT): string {
  const clean = restoreAcronyms(sentenceStart(text.replace(/\s+/g, " ").trim()));
  if (clean.length <= limit) return clean;

  const cut = clean.slice(0, limit - 1);
  let end = cut.lastIndexOf(" ");
  /* Do not end on a dangling connective — walk back another word. */
  while (end > 0 && /\b(and|or|with|for|at|in|to|the|a|of)$/i.test(cut.slice(0, end))) {
    end = cut.lastIndexOf(" ", end - 1);
  }
  return `${cut.slice(0, end).replace(/[,;:]$/, "")}…`;
}

export function pageTitle(page: PortPage): string {
  if (page.kind === "region") {
    const n = portsWithLine(page.line.key, page.region).length;
    return clamp(
      `${page.line.name} in ${page.region.name} — ${n} Ports`,
      TITLE_LIMIT - BRAND_SUFFIX,
    );
  }
  if (page.kind === "port") return fitTitle(page.line.name, page.port);
  return fitTitle(page.scope.titleStem, page.port);
}

export function pageDescription(page: PortPage): string {
  if (page.kind === "region") {
    const n = portsWithLine(page.line.key, page.region).length;
    const scopes = listAnd(page.line.scopes.map((s) => s.titleStem));
    return clamp(
      `${scopes} at ${n} ${page.region.portsLabel}. Local conditions, approvals and waste disposal handled — vessel stays on hire.`,
    );
  }
  /* Emirates and single-port states repeat the port name — "at Fujairah Port,
     Fujairah." reads as a template bug because it is one. Drop the region
     when it adds nothing. */
  const where = (port: typeof page.port) =>
    port.state.toLowerCase() === port.name.toLowerCase()
      ? portLabel(port)
      : `${portLabel(port)}, ${port.state}`;

  if (page.kind === "port") {
    return clamp(
      `${listAnd(page.line.scopes.map((s) => s.titleStem))} at ${where(page.port)}. Crews, gear and approvals handled — vessel stays on hire.`,
    );
  }
  return clamp(
    `${page.scope.name} at ${where(page.port)}. ${page.port.base ? "Crew and gear held locally" : `Crews mobilised via ${page.port.airports[0]}`}, ${page.port.authority} approvals handled, vessel stays on hire.`,
  );
}

export function pageKeywords(page: PortPage): string[] {
  if (page.kind === "region") {
    return [
      ...page.line.keywords.map((k) => `${k} ${page.region.name}`),
      ...page.line.keywords,
      ...page.line.scopes.flatMap((s) => s.keywords.slice(0, 2)),
      `marine services ${page.region.name}`,
    ];
  }

  const port = page.port;
  const place = [port.name, ...port.aka];
  const nouns =
    page.kind === "scope"
      ? [page.scope.noun, ...page.scope.keywords]
      : page.line.keywords;

  return [
    ...place.flatMap((p) => nouns.slice(0, 3).map((n) => `${n} ${p}`)),
    ...nouns,
    `${nouns[0]} ${port.country}`,
    `${port.name} port services`,
    port.unlocode,
  ];
}

/* -------------------------------------------------------------------- */
/* Delivery steps — line-aware, because the approvals differ            */
/* -------------------------------------------------------------------- */

function mobilisationStep(port: Port, who: string) {
  return port.base
    ? `Cleanship holds an operating base at ${port.name}, so ${who} are on the ground rather than in transit. That is the difference between meeting a window and missing it.`
    : `${who[0].toUpperCase()}${who.slice(1)} mobilise via ${airportLine(port)}. Where a vessel is also calling at ${neighbouringPorts(port)[0]?.name ?? "a nearby port"}, one mobilisation is normally sized to cover both.`;
}

export function deliverySteps(
  port: Port,
  line: PortLine,
  scope?: PortScope,
): { title: string; body: string }[] {
  const noun = scope ? scope.noun : line.noun;

  const first = {
    title: "Scope and vessel details",
    body: `Tell us the vessel, her particulars${line.key === "hull-cleaning" ? ", the coating specification" : line.key === "hold-cleaning" ? ", the last and next cargo" : ", the prior and next grade"} and the window at ${port.name}. We come back with a defined scope, a crew size and a duration we will stand behind. Where the conditions here will not support what has been asked for, we say so at this stage rather than after mobilisation.`,
  };

  const last = {
    title: "Report and handover",
    body: `A completion report covering ${noun} is issued with before-and-after imagery${line.key === "hull-cleaning" ? ", coating and anode condition" : line.key === "hold-cleaning" ? ", hold by hold" : ", tank by tank"} and anything found that you should know about. The findings are discussed with the vessel rather than emailed and forgotten.`,
  };

  if (line.key === "hull-cleaning") {
    return [
      first,
      {
        title: "Permits and approvals",
        body: `${approvalRoute(port)} Diving permission, terminal approval and any environmental clearance for in-water work are handled by us, not left with the agent to chase.`,
      },
      {
        title: `Mobilisation to ${port.name}`,
        body: mobilisationStep(port, "divers, compressors, brush carts and cameras"),
      },
      {
        title: "Safety setup and the dive",
        body: `The vessel is secured for diving — main engine, shaft and thrusters immobilised, sea suctions confirmed shut, permit agreed with the master. ${supervisionNote(line.key)}`,
      },
      last,
    ];
  }

  if (line.key === "hold-cleaning") {
    return [
      first,
      {
        title: "Approvals and waste routing",
        body: `${approvalRoute(port)} The disposal route for residues and washings is fixed before the gang boards — MARPOL Annex V compliance is a documented chain, not an assurance. Where reception at ${port.name} is limited, the plan changes rather than the paperwork.`,
      },
      {
        title: `Mobilisation to ${port.name}`,
        body: mobilisationStep(port, "gangs, pumps, chemicals and equipment"),
      },
      {
        title: "Entry, sequencing and the work",
        body: `Enclosed-space entry runs to the vessel's own permit system, with a fresh gas test before every entry and after every break. ${supervisionNote(line.key)}`,
      },
      last,
    ];
  }

  return [
    first,
    {
      title: "Approvals, slops and certification",
      body: `${approvalRoute(port)} Licensed slop and sludge reception is booked and marine chemist attendance arranged where the grade change requires it. At ${port.name} the disposal route is the item that most often sets the schedule, so it is fixed first.`,
    },
    {
      title: `Mobilisation to ${port.name}`,
      body: mobilisationStep(port, "crews, pumps, machines and chemicals"),
    },
    {
      title: "Gas-freeing, entry and cleaning",
      body: `Atmosphere testing, gas-freeing and enclosed-space entry certification come before any entry, and are repeated after every break. ${supervisionNote(line.key)}`,
    },
    last,
  ];
}

/* -------------------------------------------------------------------- */
/* FAQs — answers embed real port facts, which is what keeps sibling    */
/* pages from being one page repeated. Also the FAQPage schema source.   */
/* -------------------------------------------------------------------- */

const COST_TAIL = (port: Port) =>
  `We would rather scope it properly and give you a specific figure than quote a headline rate that changes once the work starts. Send the details and the window at ${port.name} and you get a scoped price, usually the same working day.`;

function mobiliseAnswer(port: Port, line: LineKey, who: string) {
  if (port.base)
    return `Cleanship keeps an operating base at ${port.name}, so response here is fast — the constraint is normally the approvals and the working window rather than getting ${who} to the port.`;
  const near = neighboursWithLine(port, line)
    .slice(0, 2)
    .map((p) => p.name);
  return `${who[0].toUpperCase()}${who.slice(1)} mobilise via ${airportLine(port)}. Give us the ETA and the window and we will confirm what is achievable rather than promise a date we cannot hold.${near.length ? ` Where the vessel also calls at ${listAnd(near, "or")}, one mobilisation is often sized to cover both.` : ""}`;
}

export function scopeFaqs(port: Port, line: PortLine, scope: PortScope) {
  const label = portLabel(port);
  const base = [
    {
      q: `Do you provide ${scope.noun} at ${label}?`,
      a: `Yes. Cleanship Marine works ${label} (${port.unlocode}) in ${port.state}, ${port.country}, covering ${areaPhrase(port)}. ${port.base ? `We hold an operating base at ${port.name}, so people and equipment are held locally rather than mobilised against a window.` : `Teams mobilise via ${airportLine(port)} with the full spread.`}`,
    },
    {
      q: `Can ${scope.noun} be done while the vessel works cargo at ${port.name}?`,
      a: `${windowAnswer(port, line.key)} The vessel stays on hire throughout, and there is no diversion and no dry dock. We scope against the conditions at ${port.name} and tell you honestly whether the window you have is enough.`,
    },
  ];

  const permit =
    line.key === "hull-cleaning"
      ? {
          q: `Do you need a diving permit from ${port.authority}?`,
          a: `Yes, and we obtain it. Diving permission from ${port.authority}, terminal approval where the berth requires it, and any environmental clearance for in-water work are arranged as part of the job rather than left with the agent. The master's permit to work and the immobilisation of machinery are agreed on board before anyone enters the water.`,
        }
      : line.key === "hold-cleaning"
        ? {
            q: `How are hold washings and cargo residues disposed of at ${port.name}?`,
            a: `To MARPOL Annex V, through the reception route agreed with ${port.authority} and the terminal before the gang boards. Residues, sweepings and washing water are tracked from the hold to reception with documentation, so the vessel has a record rather than an assurance. Where reception capacity at ${port.name} is limited, we change the plan rather than the paperwork.`,
          }
        : {
            q: `How is slop and sludge disposal handled at ${port.name}?`,
            a: `Through licensed reception, booked with ${port.authority} and the terminal operator before the tanks are opened. At ${port.name} the disposal route is usually what sets the schedule, so it is fixed first and documented tank by tank. Gas-freeing, atmosphere testing and enclosed-space entry certification are part of the same scope.`,
          };

  const conditions = {
    q:
      line.key === "hull-cleaning"
        ? `What is underwater visibility like at ${port.name}?`
        : `Where is the work done at ${port.name} — alongside, at anchorage or on passage?`,
    a: conditionSummary(port, line.key),
  };

  const vessels = {
    q: `Which vessels do you carry out ${scope.noun} on at ${port.name}?`,
    a: `${listAnd(port.vesselTypes)} — the traffic at ${label} runs to ${midSentence(listAnd(port.cargoes.slice(0, 3)))}, so those are the profiles we see most. The scope is sized to the vessel, not to a standard package.`,
  };

  const mobilise = {
    q: `How quickly can a team mobilise to ${port.name}?`,
    a: mobiliseAnswer(
      port,
      line.key,
      line.key === "hull-cleaning" ? "divers and equipment" : "crews and equipment",
    ),
  };

  const cost = {
    q: `What does ${scope.noun} at ${port.name} cost?`,
    a:
      line.key === "hull-cleaning"
        ? `It depends on the vessel's dimensions and wetted area, the fouling state found, the coating specification and the working window available at ${port.name}. ${COST_TAIL(port)}`
        : line.key === "hold-cleaning"
          ? `It depends on the number of holds, the residue from the last cargo, the standard the next fixture demands and how much time the call at ${port.name} actually gives. ${COST_TAIL(port)}`
          : `It depends on the tank count and volume, the prior and next grade, how much sludge is in there and whether the work runs alongside, at anchorage or on passage from ${port.name}. ${COST_TAIL(port)}`,
  };

  return [...base, permit, conditions, vessels, mobilise, cost];
}

export function portHubFaqs(port: Port, line: PortLine) {
  const label = portLabel(port);
  const near = neighboursWithLine(port, line.key).map((p) => p.name);

  return [
    {
      q: `Does Cleanship provide ${line.noun} at ${label}?`,
      a: `Yes. We cover the full ${line.noun} scope at ${label} (${port.unlocode}), ${port.state} — ${midSentence(listAnd(line.scopes.map((s) => s.name)))}. ${port.base ? `Cleanship holds an operating base at ${port.name}.` : `Teams mobilise via ${airportLine(port)}.`}`,
    },
    {
      q:
        line.key === "hull-cleaning"
          ? `What is underwater visibility like at ${port.name}?`
          : `Where is the work done at ${port.name} — alongside, at anchorage or on passage?`,
      a: conditionSummary(port, line.key),
    },
    {
      q: `Who approves ${line.noun} work at ${port.name}?`,
      a: `${port.authority} issues the port-side approval at ${label}, with terminal approval on top where the berth requires it. We arrange both${line.key === "hull-cleaning" ? ", along with any environmental clearance for in-water cleaning" : ", along with the waste reception and disposal route"}, so it does not fall to the agent or the master.`,
    },
    {
      q: `Which vessels call at ${port.name}?`,
      a: `${listAnd(port.vesselTypes)} — ${portLabel(port)} is ${port.hook}, handling ${midSentence(listAnd(port.cargoes))}. ${
        line.key === "hull-cleaning"
          ? "Wetted area, coating specification and how long the vessel has been sitting are what size a hull job, so the same berth can produce very different attendances."
          : line.key === "hold-cleaning"
            ? "What sizes a hold job is the number of holds, the last cargo and the standard the next fixture demands — not the vessel's dimensions."
            : "What sizes a tank job is the tank count, the prior and next grade and how much sludge is carried, not the vessel's dimensions."
      }`,
    },
    {
      q: `Can this be done without taking the vessel off hire at ${port.name}?`,
      a: `Yes — that is the point of it. Every scope listed here is carried out with the vessel afloat and working, at the berth, at the anchorage or on the passage out. ${onHireNote(line.key)}`,
    },
    {
      q: `Do you cover other ports near ${port.name}?`,
      a: near.length
        ? `Yes. ${listAnd(near)} all sit within the same operating range for ${line.noun}, and a single mobilisation is often sized to cover more than one vessel on the same trip. We work ${portsWithLine(line.key).length} ports on the coverage list for this line.`
        : `Yes — we work ${portsWithLine(line.key).length} ports on the coverage list for ${line.noun}. Tell us the rotation and we will tell you where we can meet the vessel.`,
    },
  ];
}

export function regionHubFaqs(region: Region, line: PortLine) {
  const ports = portsWithLine(line.key, region);
  const bases = region.ports.filter((p) => p.base).map((p) => p.name);

  return [
    {
      q: `Which ${region.portsLabel} does Cleanship cover for ${line.noun}?`,
      a: `${ports.length} of them: ${listAnd(ports.map((p) => p.name))}. Each has its own page covering the local conditions, the approving authority and the vessel traffic that calls there.`,
    },
    {
      q: `Do you have crews based in ${region.name}?`,
      a: bases.length
        ? `Yes. Cleanship holds operating bases at ${listAnd(bases)}, so people and equipment are held in region rather than mobilised against a window. Teams work out from there to the rest of the coverage.`
        : `Teams mobilise into ${region.name} from the nearest base. Give us the rotation as early as you have it and we will confirm what is achievable.`,
    },
    {
      q: `Can ${line.noun} be done without dry docking or off-hire?`,
      a:
        line.key === "hull-cleaning"
          ? "Yes — that is the whole point of in-water work. Cleaning, propeller polishing, thruster work, in-water class survey and UWILD are all carried out with the vessel afloat and on hire. Where a class survey or UWILD is involved, the class society approves the programme in advance and we handle that liaison."
          : line.key === "hold-cleaning"
            ? "Yes. Shore gangs work alongside during or after discharge, and riding crews complete the holds on the passage out, so the cleaning costs no port time at all. Neither takes the vessel off hire."
            : "Yes. Depending on the terminal and the grade, tank work runs alongside, at anchorage or on the passage out. Where a terminal will not permit work at the berth we say so at quoting stage rather than after mobilisation.",
    },
    {
      q: `Who approves this work at ${region.portsLabel}?`,
      a: `It varies by port, which is why each page names its own. ${listAnd(
        [...new Set(ports.map((p) => p.authority))].slice(0, 4),
      )} are among the authorities involved, and private terminals add their own approval on top. We obtain all of it as part of the job rather than leaving it with the agent.`,
    },
    {
      q: `How do working conditions differ between ${region.portsLabel}?`,
      a: `Enough that the method changes, which is why every port here has its own page rather than a shared one. Water body, tidal stream, visibility, shelter, waiting pattern, waste reception and — in the Gulf — working temperature all vary port to port, and each of those changes what is realistic in a given window. We scope against the port, not against a regional average.`,
    },
    {
      q: `Can one mobilisation cover more than one vessel or port?`,
      a: `Frequently, and it is worth asking — the mobilisation is usually the largest fixed cost in a small job, so splitting it across two attendances changes the economics more than any rate negotiation will. Ports that sit within a single trip are listed as neighbours on each port page, so you can see at a glance what can be combined.`,
    },
  ];
}

/* -------------------------------------------------------------------- */
/* Facts table                                                          */
/* -------------------------------------------------------------------- */

export function portFactRows(port: Port) {
  return [
    { label: "UN/LOCODE", value: port.unlocode },
    { label: "Port type", value: port.type },
    { label: port.countryCode === "AE" ? "Emirate" : "State", value: port.state },
    { label: "Country", value: port.country },
    { label: "Water body", value: port.waterBody },
    { label: "Port authority", value: port.authority },
    { label: "Main cargoes", value: port.cargoes.join(", ") },
    { label: "Crew mobilisation", value: port.airports.join(" / ") },
    {
      label: "Services here",
      value: listAnd(linesFor(port).map((k) => getLine(k).name)),
    },
  ];
}

/** Other lines available at this port, for cross-line internal linking. */
export function otherLinesAt(port: Port, current: LineKey) {
  return linesFor(port)
    .filter((k) => k !== current)
    .map((k) => getLine(k));
}
