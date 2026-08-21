/**
 * Shared types for the port landing-page programme.
 *
 * One `Port` shape covers every region. Regions live in their own data files
 * (./india.ts, ./uae.ts) and are combined in ./registry.ts.
 *
 * WHY THE SERVICE LINES ARE DERIVED, NOT DECLARED
 *
 * Which lines a port gets is computed from its cargo profile rather than
 * hand-flagged, so a port that handles no liquid bulk never generates a tank
 * cleaning page. That matters for more than tidiness: a "tank cleaning at
 * Belekeri" page for an iron ore anchorage is a page no reader could ever
 * need, and a set of pages nobody needs is the definition of the doorway
 * pattern Google penalises. Overrides exist for the handful of ports where
 * the cargo list does not tell the whole story.
 */

export type PortConditionKey =
  | "sheltered"
  | "anchorage"
  | "riverine"
  | "tidal-silt"
  | "clear-water";

/** The three service lines with a port programme. Matches lib/services.ts. */
export type LineKey = "hull-cleaning" | "hold-cleaning" | "tank-cleaning";

/**
 * How long vessels typically sit idle at this port. Drives the hold and tank
 * copy, where the commercial question is "is there a window", not "can the
 * divers see".
 */
export type WaitingPattern = "long-wait" | "berth-driven" | "mixed";

export type Port = {
  /** URL fragment. Always ends "-port" so routes read as a place. */
  slug: string;
  /** Short display name used in headings: "Kandla", "Nhava Sheva". */
  name: string;
  /** Official name where it differs from the trading name. */
  officialName?: string;
  /** Names agents and charterers actually use. Feeds page keywords. */
  aka: string[];
  unlocode: string;
  /** State, emirate or province. */
  state: string;
  /** Country display name. */
  country: string;
  /** ISO 3166-1 alpha-2, for PostalAddress in schema. */
  countryCode: string;
  coast: string;
  /** Monsoon / weather regime key — see WEATHER in ./lines.ts. */
  weather: "india-west" | "india-east" | "arabian-gulf" | "gulf-of-oman";
  waterBody: string;
  /** Who issues the permit. Named on every page for a reason. */
  authority: string;
  type: "Major Port" | "Private Port" | "State Port";
  condition: PortConditionKey;
  waiting: WaitingPattern;
  cargoes: string[];
  vesselTypes: string[];
  /** Nearest airports for crew and diver mobilisation, best first. */
  airports: string[];
  /**
   * Where work actually happens at this port.
   *
   * Written in MID-SENTENCE casing ("outer anchorage", but "Willingdon
   * Island berths") because these are joined into running prose on every
   * port page. Display surfaces capitalise the first letter themselves —
   * blanket-lowercasing at render time destroyed the proper nouns.
   */
  workAreas: string[];
  /** Hand-written. In-water working conditions. */
  conditions: string;
  /** Hand-written. What the port is and who calls there. */
  profile: string;
  /** Short noun phrase used in meta descriptions so no two are identical. */
  hook: string;
  /** Slugs of nearby ports, for internal linking and single-mobilisation copy. */
  neighbours: string[];
  /** True where Cleanship holds an operating base (see lib/site.ts offices). */
  base?: boolean;
  /**
   * Hand-written, optional. Something about hold or tank work here that the
   * cargo list alone does not convey — a nearby recycling belt, a grain
   * surveyor bottleneck, a slop reception restriction. Renders above the
   * derived copy where present.
   */
  holdNote?: string;
  tankNote?: string;
  /** Forces a line on or off where the cargo list misleads. */
  lineOverrides?: Partial<Record<LineKey, boolean>>;
};

/* -------------------------------------------------------------------- */
/* Cargo classification                                                  */
/* -------------------------------------------------------------------- */

const DRY_BULK =
  /coal|iron ore|bauxite|limestone|manganese|\bore\b|clinker|gypsum|alumina|pellet|sulphur|aggregate/i;
const AGRI_BULK =
  /grain|agricultural|rice|sugar|fertiliser|salt|soda ash|bentonite|feed/i;
const LIQUID =
  /\bpol\b|crude|lng|lpg|chemical|edible oil|petrochemical|liquid|bunker|coastal fuel/i;
const GENERAL =
  /general|project|steel|timber|scrap|cement|automobile|roro|granite|breakbulk/i;
const CONTAINER = /container/i;

export type CargoFlags = {
  dryBulk: boolean;
  agriBulk: boolean;
  liquid: boolean;
  general: boolean;
  container: boolean;
};

export function cargoFlags(port: Port): CargoFlags {
  const text = port.cargoes.join(" ");
  return {
    dryBulk: DRY_BULK.test(text),
    agriBulk: AGRI_BULK.test(text),
    liquid: LIQUID.test(text),
    general: GENERAL.test(text),
    container: CONTAINER.test(text),
  };
}

/**
 * Which service lines this port gets a page for.
 *
 * Hull cleaning applies everywhere a vessel floats. Hold cleaning needs dry,
 * agricultural or general cargo in the trade. Tank cleaning needs liquid
 * bulk. `lineOverrides` wins over all of it.
 */
export function linesFor(port: Port): LineKey[] {
  const flags = cargoFlags(port);
  const derived: Record<LineKey, boolean> = {
    "hull-cleaning": true,
    "hold-cleaning": flags.dryBulk || flags.agriBulk || flags.general,
    "tank-cleaning": flags.liquid,
  };

  return (Object.keys(derived) as LineKey[]).filter(
    (line) => port.lineOverrides?.[line] ?? derived[line],
  );
}

export function hasLine(port: Port, line: LineKey): boolean {
  return linesFor(port).includes(line);
}

/* -------------------------------------------------------------------- */
/* Small shared helpers                                                  */
/* -------------------------------------------------------------------- */

/**
 * Joins a list the way a person writes one. Worth the lines: these fragments
 * end up mid-sentence on hundreds of pages, and `join(", ")` produced
 * "tankers, bulk carriers, feeder container ships" on every one of them.
 *
 * Items that already contain "and" fall back to a plain comma series —
 * otherwise "Handysize and Supramax bulk carriers" plus "barges and tugs"
 * came out as three consecutive "and"s in one clause.
 */
export function listAnd(
  items: readonly string[],
  conjunction = "and",
): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.some((item) => / and /i.test(item))) return items.join(", ");
  return `${items.slice(0, -1).join(", ")} ${conjunction} ${items[items.length - 1]}`;
}

/** "Kandla Port", but never "Chennai Port Port". */
export function portLabel(port: Port): string {
  return port.name.toLowerCase().endsWith("port")
    ? port.name
    : `${port.name} Port`;
}

/** "the dock complex berths, oil jetties and river anchorage" */
export function areaPhrase(port: Port, limit?: number): string {
  return `the ${listAnd(limit ? port.workAreas.slice(0, limit) : port.workAreas)}`;
}

export function airportLine(port: Port): string {
  return port.airports.length > 1
    ? `${port.airports[0]} or ${port.airports[1]}`
    : port.airports[0];
}

export function vesselLine(port: Port): string {
  return listAnd(port.vesselTypes.slice(0, 3)).toLowerCase();
}
