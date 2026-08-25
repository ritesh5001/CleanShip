/**
 * The three service lines that have a port programme, and the copy builders
 * that turn a `Port` into a page.
 *
 * A NOTE ON WHY THIS IS NOT ONE TEMPLATE
 *
 * Hull cleaning is a diving job: the local variables are visibility, tidal
 * stream, swell and the permit to dive. Hold and tank cleaning are not — the
 * local variables there are cargo residue, the discharge sequence, waste
 * reception, enclosed-space entry and, in the Gulf, working temperature.
 * Running all three through one "conditions" paragraph would produce pages
 * that talk about underwater visibility on a cargo hold page, which is the
 * tell of a generated site. Each line has its own framing below.
 */

import type { LineKey, Port, PortConditionKey, WaitingPattern } from "./types";
import {
  airportLine,
  areaPhrase,
  cargoFlags,
  listAnd,
  midSentence,
  portLabel,
  vesselLine,
} from "./types";

/* -------------------------------------------------------------------- */
/* Weather regimes                                                       */
/* -------------------------------------------------------------------- */

export const WEATHER: Record<
  Port["weather"],
  { season: string; window: string; risk: string; heat?: string }
> = {
  "india-west": {
    season: "south-west monsoon",
    window: "roughly June to September",
    risk: "Swell and reduced surface visibility close most open-water work on this coast for the duration, and the weeks either side are unreliable rather than unusable",
  },
  "india-east": {
    season: "north-east monsoon",
    window: "roughly October to December",
    risk: "The Bay of Bengal also carries cyclone risk in April to June and again from October to December, so an anchorage attendance on this coast is planned with a standby allowance rather than a single fixed date",
  },
  "arabian-gulf": {
    season: "shamal",
    window: "through the winter months and again in early summer",
    risk: "The shamal is a wind and sea-state problem rather than a rain one: it builds short, steep seas across the shallow Gulf that stop anchorage work while berths stay usable",
    heat: "The larger constraint here is heat. Between June and September, working temperatures inside a cargo hold or a tank at this port routinely exceed anything a full shift can be worked in, so enclosed-space work runs to shortened cycles with enforced rest, forced ventilation and more people than the same job needs in winter. Pricing a Gulf summer tank entry on a winter productivity assumption is the most common way these jobs overrun.",
  },
  "red-sea": {
    season: "northerly Red Sea wind",
    window: "strongest through the winter and spring",
    risk: "The Red Sea runs a persistent along-axis wind that builds a short chop at the anchorages while the berths stay workable, so the constraint here is almost always the anchorage rather than the season",
    heat: "Heat and humidity are the harder constraint. The Red Sea is among the warmest and most saline bodies of water the fleet trades in — which grows fouling faster than the Gulf does — and between June and September enclosed-space work runs to shortened cycles with enforced rest and forced ventilation.",
  },
  "sri-lanka": {
    season: "two monsoons",
    window: "the south-west from May to September and the north-east from December to February",
    risk: "Which one matters depends on which coast the port is on — the south-west monsoon closes the western and southern anchorages while the east coast stays workable, and the north-east monsoon reverses it. Sri Lanka is the one market on the coverage list where there is almost always a workable coast",
    heat: "Humidity is high year-round rather than seasonal, so enclosed-space work here is planned with ventilation and rest cycles in every month, not just the summer.",
  },
  "west-africa": {
    season: "Atlantic swell and the rains",
    window: "with the heaviest rain from May to October and swell running year-round",
    risk: "The swell here is long-period Atlantic ground swell rather than wind-driven sea, so it reaches the anchorages on days that look calm from the bridge and it is the single biggest cause of a lost in-water window on this coast",
    heat: "Humidity is high year-round and the rains make it worse, which matters more than temperature for enclosed-space work: holds will not dry, and a hold that cannot be dried cannot be closed.",
  },
  "gulf-of-oman": {
    season: "Arabian Sea swell",
    window: "with the sharpest risk around June and again in October and November",
    risk: "This coast sits outside the Strait of Hormuz and takes Indian Ocean weather directly, so the anchorage is the exposed part of the operation while alongside work carries on",
    heat: "Summer heat is the other constraint. Between June and September, enclosed-space work at this port runs to shortened cycles with enforced rest and forced ventilation — the job takes the time it takes, and a schedule built on winter productivity will not hold.",
  },
};

/* -------------------------------------------------------------------- */
/* Line-specific method framing                                          */
/* -------------------------------------------------------------------- */

const HULL_METHOD: Record<PortConditionKey, string> = {
  sheltered:
    "Because the harbour is sheltered, work here normally runs alongside or at a protected anchorage and can proceed in parallel with cargo operations rather than competing with them for the berth window.",
  anchorage:
    "Work here is done with the vessel riding to her anchor, so the dive plan is built around sea state and swell rather than a berth slot, and the team stands by for a workable window rather than a scheduled one.",
  riverine:
    "River current and sediment govern the method here: dives are cut to the slack either side of the tide, the team works by touch in near-zero visibility, and the vessel has to be properly secured against the stream before anyone enters the water.",
  "tidal-silt":
    "The tidal stream and the silt load govern the method here: the working window is slack water, not the working day, and the operation is planned by feel and surface supervision with video kept as the record rather than as the diver's means of navigation.",
  "clear-water":
    "Water clarity here is good by regional standards, so the operation can be properly documented on video as it happens — an advantage that turns a cleaning job into usable condition evidence at no extra mobilisation cost.",
};

const HOLD_METHOD: Record<WaitingPattern, string> = {
  "long-wait":
    "Waiting time is the opportunity here. Vessels sit at this port for extended periods, so holds can be worked properly and to a standard rather than rushed between grabs — and a gang put on board during the wait costs the vessel nothing in schedule.",
  "berth-driven":
    "Turnaround here is quick and the berth will not be held open for cleaning, so the work is either sequenced hold by hold behind the discharge as each one empties, or handed to a riding crew to complete on the passage out. Waiting for all holds to be empty is waiting past the berth window.",
  mixed:
    "Some vessels sit and some turn straight round, so the plan is agreed against the actual call rather than a standard package: a shore gang alongside where there is time, a riding crew on the outward passage where there is not.",
};

const TANK_METHOD: Record<WaitingPattern, string> = {
  "long-wait":
    "The waiting time here is what makes the job practical. Tanks can be worked at anchorage under a proper entry regime rather than squeezed against a berth clock, which is the difference between a specification clean and a visual one.",
  "berth-driven":
    "Terminal windows here are tight and most operators will not permit tank work alongside, so the realistic plan is the anchorage or the outward passage. That is agreed before the vessel arrives, not argued at the berth.",
  mixed:
    "Whether the work runs alongside, at anchorage or on passage depends on the terminal and the grade, so the plan is built against the actual call. Where a terminal will not permit tank work at the berth, we say so at quoting stage rather than after mobilisation.",
};

const HULL_FINDING: Record<PortConditionKey, string> = {
  sheltered:
    "Shelter is a mixed blessing for a hull. The same calm that makes the port easy to work in is still water, and still water grows fouling faster than an exposed berth does.",
  anchorage:
    "Vessels here sit at anchor for long periods, and a stationary hull in warm water is the ideal fouling substrate. The heaviest growth we lift at this port is almost always off a vessel that has been waiting rather than working.",
  riverine:
    "River water changes what we find. Freshwater influence shifts the species mix and the growth is often softer but covers more of the hull, and sediment settles over the top of it on horizontal surfaces — two different problems on the same plate.",
  "tidal-silt":
    "Silt settles over the growth on the flat bottom and in the niches, which masks the true fouling state until the divers are actually on it. That is why the pre-clean survey here is a real step rather than a formality.",
  "clear-water":
    "Clearer water means the fouling state can be assessed properly before any tooling is selected, and the assessment can be shown to you rather than described.",
};

/* -------------------------------------------------------------------- */
/* Cargo-derived findings                                                */
/* -------------------------------------------------------------------- */

function hullCargoFinding(port: Port): string {
  const f = cargoFlags(port);
  if (f.dryBulk)
    return `Dry bulk handling here puts cargo dust into the water around the berths and anchorage. It settles on horizontal surfaces and packs into sea chest gratings and inlet openings, so inlet and grating clearance is routinely a larger part of the job at ${port.name} than owners budget for.`;
  if (f.liquid)
    return `Liquid and gas tonnage here spends long stretches at the terminal or waiting for a slot, so growth tends to be even and well established across the hull rather than patchy — heavier than the trading pattern suggests, and further along than a speed report alone would indicate.`;
  if (f.container)
    return `Container tonnage on a fixed rotation shows the familiar pattern: light slime over most of the vertical sides, with the real accumulation in the flat bottom, the bilge keels and the niches where flow is slowest. Those are the areas that cost fuel and the ones a quick clean tends to skip.`;
  return `The working fleet here spends most of its life at low speed in warm water, so growth is heavy, mixed and reaches the hard calcareous stage sooner than on deep-sea tonnage. Left too long it starts damaging the coating rather than just slowing the vessel.`;
}

function holdCargoFinding(port: Port): string {
  const f = cargoFlags(port);
  const cargo = midSentence(listAnd(port.cargoes.slice(0, 3)));
  if (f.dryBulk && f.agriBulk)
    return `${portLabel(port)} runs ${cargo} through the same holds, and that sequence is where the money is lost: mineral fines and dust from one fixture will fail an inspection for the next if the holds are only swept. The standard that matters is the one the next cargo demands, not the one the last one left.`;
  if (f.dryBulk)
    return `The standing residues at ${portLabel(port)} are ${cargo} — the dusty, abrasive kind that films every surface and packs into frames, brackets and the tank-top margins. Anything following into a clean or food-grade cargo needs the full sequence: sweep, wash, rinse and dry, not a hose down.`;
  if (f.agriBulk)
    return `Agricultural and fertiliser parcels dominate here, and they are the unforgiving residues: hygroscopic, corrosive to coatings if left damp, and an outright inspection failure ahead of a food-grade cargo. Holds shut up wet at ${port.name} are holds that need doing twice.`;
  if (f.container)
    return `This is container and unitised tonnage, so the scope is cell guides, hold bilges, bilge wells, tank tops and lashing gear rather than a bulk residue clean — steady maintenance work at height and in confined spaces, on ships that will not extend a berth window for it.`;
  return `Traffic here is general and project cargo, so the hold scope is dunnage, lashing residue, rust scale, bilge wells and tank tops rather than a bulk wash — preparation work against the next fixture rather than recovery from the last one.`;
}

function tankCargoFinding(port: Port): string {
  const text = port.cargoes.join(" ").toLowerCase();
  if (/lng|lpg/.test(text))
    return `Gas and specialised liquid tonnage calls here, which puts the certification chain ahead of the cleaning itself: gas-freeing, marine chemist attendance and enclosed-space entry certificates are the critical path, and the physical work is the short part of the job.`;
  if (/edible oil/.test(text))
    return `Edible oil parcels move through ${portLabel(port)}, and those are the strictest specifications in the trade. Prior-cargo restrictions and wall-wash results set the standard, not the visual condition, and a tank that looks clean can still fail on analysis.`;
  if (/crude/.test(text))
    return `Crude parcels here mean sludge, not just residue. The volume that comes out of a crude tank is a disposal problem as much as a cleaning one, so slop reception and licensed disposal are arranged before the work starts rather than discovered after it.`;
  if (/chemical|petrochemical/.test(text))
    return `Chemical and petrochemical grades move through here, so the cleaning specification changes with almost every voyage and is set by the next charterer's acceptance criteria. The wash plan is built from the prior-cargo and next-cargo pair, not from a standard procedure.`;
  return `Product parcels and bunkers dominate the liquid traffic here, so most of the work is grade changes and fuel and slop tank cleaning rather than full chemical specification work.`;
}

const CONDITION_VISIBILITY: Record<PortConditionKey, string> = {
  sheltered:
    "moderate, and it drops further around active bulk handling and after heavy rain",
  anchorage:
    "generally workable outside the monsoon, though cargo dust from lighterage reduces it sharply near an active transfer",
  riverine: "effectively nil for most of the year",
  "tidal-silt": "habitually very low, and often close to nil at the turn",
  "clear-water": "good by regional standards and usually adequate for video work",
};

/**
 * FAQ answer for "can this run while the vessel works cargo".
 *
 * Deliberately NOT `methodNote` — that text already appears in the planning
 * section, and an earlier version printed it up to four times on the same
 * page. Every one of these says the same thing in a different register,
 * because a reader who scrolls should not meet the same sentence twice.
 */
const HULL_WINDOW: Record<PortConditionKey, string> = {
  sheltered:
    "Yes, in most cases. The harbour is sheltered enough that divers work alongside while cargo operations continue, and neither holds the other up.",
  anchorage:
    "Yes — it is the norm here, because the work is done at anchor rather than at a berth. Barge operations carry on around the dive, with the working side agreed with the master beforehand.",
  riverine:
    "Usually yes, but the constraint is the river rather than the cargo plan. Diving is held to the slack either side of the tide, so the real question is whether the vessel's stay covers enough slacks.",
  "tidal-silt":
    "Usually yes, but the tide sets the schedule rather than the cargo plan. The practical question is how many slack windows fall inside the vessel's stay, not what the holds are doing.",
  "clear-water":
    "Yes. Conditions here are good enough that the dive runs alongside cargo operations without either holding the other up, and the work is documented on video as it goes.",
};

const HOLD_WINDOW: Record<WaitingPattern, string> = {
  "long-wait":
    "Yes, and the better answer here is usually to start before discharge finishes. Vessels wait at this port, so a gang boards during the wait and works the holds as they empty — no port time is lost, because the vessel was not sailing anyway.",
  "berth-driven":
    "Partly. Holds are worked one at a time behind the discharge as each empties, but the berth will not be held for the remainder — so the realistic plan is to start alongside and finish with a riding crew on the passage out.",
  mixed:
    "It depends on the call. Where the vessel has time, a shore gang works the holds alongside as they empty; where she turns straight round, a riding crew completes them on the passage.",
};

const TANK_WINDOW: Record<WaitingPattern, string> = {
  "long-wait":
    "Usually not at the berth — but that matters less here, because vessels wait. Tank work is taken at the anchorage under a full entry regime, which gives a specification clean the time it actually needs.",
  "berth-driven":
    "Most terminals here will not permit tank work alongside, so the plan is the anchorage or the outward passage. We confirm the terminal's position before quoting rather than discovering it at the gangway.",
  mixed:
    "It depends on the terminal and the grade. Some berths here permit tank work alongside and some do not; we establish which before the vessel arrives and plan for the anchorage or the passage where the answer is no.",
};

export function windowAnswer(port: Port, line: LineKey): string {
  if (line === "hull-cleaning") return HULL_WINDOW[port.condition];
  if (line === "hold-cleaning") return HOLD_WINDOW[port.waiting];
  return TANK_WINDOW[port.waiting];
}

/**
 * Where the work physically happens. Distinct from `windowAnswer`, which
 * answers whether it can run against cargo operations — the two questions
 * look similar and must not share a sentence, or the page repeats itself.
 */
const WORK_ENV: Record<WaitingPattern, string> = {
  "long-wait":
    "Most of the work at this port happens at the anchorage, simply because that is where vessels spend their time.",
  "berth-driven":
    "Work here starts alongside, and where the berth window runs out it continues on the outward passage with a riding crew — the berth will not be held open for it.",
  mixed:
    "Work here runs both alongside and at anchorage depending on the call, and on the passage out where neither gives enough time.",
};

/**
 * FAQ answer about local conditions. Summarised rather than lifted from
 * `port.conditions`, which already renders in full in its own section.
 */
export function conditionSummary(port: Port, line: LineKey): string {
  if (line === "hull-cleaning") {
    return `Visibility at ${portLabel(port)} is ${CONDITION_VISIBILITY[port.condition]}, and the ${WEATHER[port.weather].season} sets the outer limits of the calendar. How the tide and sea state shape the dive plan is set out in full in the working-conditions section on this page.`;
  }
  const heat = WEATHER[port.weather].heat
    ? " Between June and September the binding constraint is working temperature inside the space rather than access to it."
    : "";
  return `${WORK_ENV[port.waiting]}${heat}`;
}

/**
 * Who actually controls access, by port type.
 *
 * The delivery step used to be one string with the authority name substituted
 * in, which is the shape of copy that reads as generated. The underlying fact
 * genuinely differs: a major port runs a statutory permit process, a private
 * port is the terminal operator's commercial decision, a state port goes
 * through a maritime board and the local harbour master.
 */
export function approvalRoute(port: Port): string {
  if (port.type === "Major Port")
    return `${port.authority} runs a statutory permit process here, so the lead time is real and the application goes in early rather than on arrival.`;
  if (port.type === "Private Port")
    return `Access at ${portLabel(port)} is the terminal operator's decision as much as ${port.authority}'s, so both are in the approval chain from the start — a berth-side refusal discovered at the gangway costs the whole attendance.`;
  return `${port.authority} approves the work alongside the local harbour master, and at a state port that conversation is quicker but less formal — it is worth having in writing.`;
}

/** Why this line never takes the vessel off hire. One sentence, per line. */
export function onHireNote(line: LineKey): string {
  if (line === "hull-cleaning")
    return "Divers work with the vessel afloat at the berth or the anchorage, so there is no dry dock, no diversion and no off-hire.";
  if (line === "hold-cleaning")
    return "Shore gangs work alongside or at anchorage and riding crews finish on the passage, so no port time is spent on cleaning and the vessel is never off hire.";
  return "Tank work runs alongside where the terminal permits it, and otherwise at anchorage or on the passage out — none of which takes the vessel off hire.";
}

/**
 * The "working conditions" paragraph, per line.
 *
 * `port.conditions` is written about diving — visibility, tidal stream, swell,
 * the dive plan. Rendering it on a cargo hold or tank cleaning page produced
 * text about underwater visibility above a list of hold cleaning scopes, which
 * is exactly the tell of a generated site. Hull keeps the hand-written
 * paragraph; hold and tank get an operational one composed from the port's own
 * access pattern, season, heat regime and approving authority.
 *
 * The work areas are NOT repeated here — the definition list directly beneath
 * this paragraph already lists them.
 */
export function workingConditions(port: Port, line: LineKey): string {
  if (line === "hull-cleaning") return port.conditions;

  const w = WEATHER[port.weather];
  const season = `The ${w.season} sets the outer limits of the calendar, ${w.window}, and it affects the anchorage far more than the berth.`;
  const heat = w.heat ? ` ${w.heat}` : "";
  const approvals =
    line === "hold-cleaning"
      ? `Access approval runs through ${port.authority} and the terminal, and the disposal route for residues and washings is fixed before the gang boards rather than found afterwards.`
      : `Approval runs through ${port.authority} and the terminal operator, and licensed slop reception is booked before the tanks are opened — at most ports on this list that booking, not the cleaning, is what sets the date.`;

  return `${WORK_ENV[port.waiting]} ${season}${heat} ${approvals}`;
}

/** Closing line for the delivery step where the work actually happens. */
export function supervisionNote(line: LineKey): string {
  if (line === "hull-cleaning")
    return "Teams work under surface supervision with continuous diver communications and video throughout.";
  if (line === "hold-cleaning")
    return "Gas testing, standby cover and continuous supervision run throughout, and progress is reported hold by hold rather than only at the end.";
  return "Standby cover and atmosphere monitoring run continuously while anyone is inside, and progress is reported tank by tank.";
}

/* -------------------------------------------------------------------- */
/* Public: method and finding text for a line at a port                  */
/* -------------------------------------------------------------------- */

export function methodNote(port: Port, line: LineKey): string {
  if (line === "hull-cleaning") return HULL_METHOD[port.condition];
  if (line === "hold-cleaning") return HOLD_METHOD[port.waiting];
  return TANK_METHOD[port.waiting];
}

const HOLD_FINDING: Record<WaitingPattern, string> = {
  "long-wait":
    "The other thing that shows up here is time. Vessels wait, holds sit shut with residue still in them, and residue that sits gets harder to shift — the job found after a long wait at anchorage is not the job that would have been found on the day of discharge.",
  "berth-driven":
    "What we usually find here is a partial job already attempted: crew sweeping between grabs, with the frames, brackets and tank-top margins untouched because there was never the time to reach them. Those are exactly the places an inspection looks.",
  mixed:
    "The condition we find here varies more than at most ports, because some vessels have had days at anchor to work the holds and some have had none. The scope is confirmed on boarding rather than assumed from the fixture.",
};

const TANK_FINDING: Record<WaitingPattern, string> = {
  "long-wait":
    "The waiting time cuts both ways. It gives room to do the work properly, but residue left standing in a warm tank sets and stratifies, so a tank opened after a long wait needs more hand work than the same tank opened on the day of discharge.",
  "berth-driven":
    "Tanks here are usually presented with a machine wash already done and the hand work outstanding — bottom structure, suction wells, heating coils and the areas the machines cannot reach. That remainder is what a wall wash actually fails on.",
  mixed:
    "What we find depends on whether the vessel has had time at anchorage or come straight off a berth, so the tank condition is confirmed on inspection rather than assumed from the previous cargo alone.",
};

/**
 * Two paragraphs on what the work at this port actually turns up.
 *
 * The first is cargo-derived (or the hand-written note where one exists); the
 * second is driven by the working pattern. They must never be the same
 * paragraph — an earlier version fell back to the cargo text for both on any
 * port without a hand-written note, and printed it twice.
 */
export function findingNotes(port: Port, line: LineKey, extra?: string) {
  const tail = (text: string) => `${text} ${extra ?? ""}`.trim();

  if (line === "hull-cleaning") {
    return [hullCargoFinding(port), tail(HULL_FINDING[port.condition])];
  }
  /* The hand-written hold/tank notes now open their scope pages, so they are
     deliberately NOT repeated here — the cargo-derived and waiting-derived
     paragraphs carry this section instead. */
  if (line === "hold-cleaning") {
    return [holdCargoFinding(port), tail(HOLD_FINDING[port.waiting])];
  }
  return [tankCargoFinding(port), tail(TANK_FINDING[port.waiting])];
}

/** Seasonal planning note. Weather sets the regime, the line sets the driver. */
export function seasonNotes(port: Port, line: LineKey): string[] {
  const w = WEATHER[port.weather];
  const mobilise = port.base
    ? `Cleanship holds an operating base at ${port.name}, so we can hold a team ready against a shifting ETA rather than committing travel to a date that may move.`
    : `Teams mobilise via ${airportLine(port)}, so give us the ETA as early as you have it — the travel is the flexible part, the approvals and the working window are not.`;

  const driver =
    line === "hull-cleaning"
      ? HULL_METHOD[port.condition]
      : line === "hold-cleaning"
        ? HOLD_METHOD[port.waiting]
        : TANK_METHOD[port.waiting];

  /* The Gulf heat paragraph deliberately does NOT appear here: it lives in
     workingConditions() for hold and tank, and hull work is underwater so it
     does not apply. Printing it in both put the same paragraph on the page
     twice. */
  const areas =
    line === "hull-cleaning"
      ? `Work is taken at ${areaPhrase(port)}, and which of those a vessel ends up at changes the dive plan more than the season does. `
      : "";

  const risk =
    line === "hull-cleaning"
      ? w.risk
      : line === "hold-cleaning"
        ? `For hold work the wind matters less than the rain: holds cannot be washed, dried and closed in wet weather, and a hold shut up damp fails inspection however clean it looks`
        : `For tank work it is the anchorage that suffers — where the terminal will not permit work alongside, weather that closes the anchorage closes the job`;

  return [
    `The ${w.season} governs the calendar at ${portLabel(port)}, ${w.window}. ${risk}. ${driver}`,
    `${areas}${mobilise}`,
  ];
}

/* -------------------------------------------------------------------- */
/* Scope definitions                                                     */
/* -------------------------------------------------------------------- */

export type PortScope = {
  /** Matches the service slug in lib/services.ts — the canonical detail page. */
  serviceSlug: string;
  /** URL prefix: `${urlPrefix}-in-${port.slug}`. */
  urlPrefix: string;
  name: string;
  /** Short form for running prose. */
  noun: string;
  /** Title stem before " at <Port>". The brand suffix eats 12 characters. */
  titleStem: string;
  tagline: string;
  lead: (port: Port) => string;
  angle: (port: Port) => string;
  localScope: (port: Port) => string[];
  outcomes: string[];
  keywords: string[];
};

export type PortLine = {
  key: LineKey;
  /** Hub URL prefix: `${urlPrefix}-in-${port.slug}`. */
  urlPrefix: string;
  name: string;
  noun: string;
  /** Category slug in lib/services.ts. */
  categorySlug: LineKey;
  eyebrow: string;
  hubTagline: string;
  hubIntro: (port: Port) => string;
  scopes: PortScope[];
  keywords: string[];
};

const CONDITION_SURVEY_FIT: Record<PortConditionKey, string> = {
  sheltered:
    "Shelter is on your side here — the vessel is stable and the dive is uninterrupted — but basin silt means the lighting and camera plan has to be agreed with the surveyor before the class attendance is booked, not improvised on the day.",
  anchorage:
    "Survey work at an open anchorage lives and dies on the weather window, so class attendance is booked with a realistic standby allowance rather than a single optimistic date.",
  riverine:
    "River visibility here rules out conventional wide-shot survey video, so any class attendance has to be agreed in advance on a close-quarters, high-intensity lighting basis, and some scopes will simply not be accepted in these conditions. We will say so before you book the surveyor rather than after.",
  "tidal-silt":
    "Low visibility and short slack windows make this a demanding survey port. Scope, lighting and the surveyor's acceptance criteria are agreed up front, and where the conditions will not support the scope we say so before the attendance is booked.",
  "clear-water":
    "This is one of the better ports on the coverage list for in-water survey work: clarity supports the wide shots and the close detail a surveyor needs, and the record that comes out of it stands up in the class file.",
};

/* ---------------------------- HULL ---------------------------------- */

const hullScopes: PortScope[] = [
  {
    serviceSlug: "underwater-hull-cleaning",
    urlPrefix: "underwater-hull-cleaning",
    name: "Underwater Hull Cleaning",
    noun: "underwater hull cleaning",
    titleStem: "Underwater Hull Cleaning",
    tagline: "Full hull cleaned in the water, vessel stays on hire",
    lead: (port) =>
      `Cleanship Marine provides underwater hull cleaning at ${portLabel(port)}, ${port.state}, working ${areaPhrase(port, 2)}. Commercial dive teams remove slime, weed and shell growth from the vertical sides, flat bottom, bilge keels, sea chests and niche areas with the vessel afloat and on hire — no dry dock, no diversion, no off-hire.`,
    angle: (port) => port.profile,
    localScope: (port) => [
      "Pre-clean fouling survey to establish coverage, growth type and coating condition before any tool touches the hull",
      "Brush cart cleaning of the flat bottom and vertical sides, with brush hardness selected against your antifouling specification",
      "Hand cleaning of bilge keels, rudder, stern frame, thruster tunnels, anodes and the niches a cart cannot follow",
      "Sea chest gratings and inlet openings cleared of growth and debris to restore cooling water flow",
      `Diving permission cleared with ${port.authority} and the terminal before mobilisation`,
      "Before-and-after video and stills, with a written report on coating condition and anode wastage",
    ],
    outcomes: [
      "Hydrodynamic smoothness restored before fouling reaches the calcareous stage that damages coating",
      "Fuel and emissions penalty from drag reduced without taking the vessel off hire",
      "Documented condition record for the technical file and the next docking specification",
      "Sea chests and inlets cleared, protecting cooling water flow",
    ],
    keywords: [
      "underwater hull cleaning",
      "in water hull cleaning",
      "ship hull fouling removal",
      "diver hull cleaning",
    ],
  },
  {
    serviceSlug: "propeller-super-polishing",
    urlPrefix: "propeller-polishing",
    name: "Propeller Polishing",
    noun: "propeller polishing",
    titleStem: "Propeller Polishing",
    tagline: "Mirror finish, measurably lower fuel burn",
    lead: (port) =>
      `Cleanship Marine carries out underwater propeller super polishing at ${portLabel(port)}, ${port.state}. Divers work the blades through a multi-stage sequence to a Class A mirror finish, removing fouling, calcareous deposits and accumulated surface roughness while the vessel lies ${port.condition === "anchorage" ? "at the anchorage" : "alongside or at anchor"}.`,
    angle: (port) =>
      `The propeller is the highest-leverage surface on any vessel calling at ${port.name}: it runs at high relative velocity, so roughness there costs disproportionately more than the same roughness spread over the hull. For the ${vesselLine(port)} working this port, polishing is the shortest route to a measurable fuel saving.`,
    localScope: (port) => [
      "Blade condition assessment covering both faces, the leading and trailing edges and the tips",
      "Multi-stage polishing sequence worked down to a Class A mirror finish",
      "Boss, hub and fairing cone cleaned, with rope guard and seal area inspected",
      "Edge damage, cavitation erosion and any deformation photographed and reported rather than polished over",
      `Diving permission cleared with ${port.authority}, and the shaft confirmed immobilised with the master before the dive`,
      "Before-and-after video and a written finish record for the performance file",
    ],
    outcomes: [
      "Blade roughness removed where it costs the most, at the highest-velocity surface on the vessel",
      "Propeller efficiency restored between dockings without off-hire",
      "Cavitation erosion and edge damage documented before it becomes a repair item",
      "A finish record that supports hull and propeller performance monitoring",
    ],
    keywords: [
      "propeller polishing",
      "propeller super polishing",
      "underwater propeller cleaning",
      "class A propeller finish",
    ],
  },
  {
    serviceSlug: "thruster-cleaning-polishing",
    urlPrefix: "thruster-cleaning",
    name: "Thruster Cleaning & Polishing",
    noun: "thruster cleaning",
    titleStem: "Thruster Cleaning",
    tagline: "Full thrust restored when you need it most",
    lead: (port) =>
      `Cleanship Marine cleans and polishes bow and stern thrusters at ${portLabel(port)}, ${port.state}. Divers clear the full tunnel bore, polish the blades and hub, and clear the gratings, restoring the manoeuvring thrust that quietly disappears while a vessel sits idle.`,
    angle: (port) =>
      `Thruster tunnels are the worst fouling trap on a hull — sheltered, still and almost never inspected. That matters more than usual at ${port.name}, where ${port.hook} keeps vessels stationary in warm water for extended periods and growth builds on tunnel walls, blades and gratings until manoeuvring performance is noticeably down at exactly the moment it is needed.`,
    localScope: (port) => [
      "Full tunnel bore cleaned end to end, both openings, including the areas behind the gratings",
      "Blade and hub polished, with seal and boss condition inspected and reported",
      "Tunnel gratings cleared of growth and debris so flow is restored, not just the visible face",
      "Anodes inside the tunnel checked and wastage recorded",
      `Diving permission cleared with ${port.authority}, with the thruster confirmed isolated and tagged out before the dive`,
      "Video record of tunnel and blade condition before and after",
    ],
    outcomes: [
      "Manoeuvring thrust restored ahead of a berthing or a pilotage that needs it",
      "Tunnel and grating flow cleared, not just the visible blade faces",
      "Seal, boss and anode condition documented while the divers are already down",
      "Reduced reliance on tug assistance where thrust had quietly degraded",
    ],
    keywords: [
      "thruster cleaning",
      "bow thruster cleaning",
      "thruster tunnel cleaning",
      "bow thruster polishing",
    ],
  },
  {
    serviceSlug: "in-water-class-survey",
    urlPrefix: "in-water-survey",
    name: "In-Water Class Survey",
    noun: "in-water class survey",
    titleStem: "In-Water Survey",
    tagline: "Class attendance without opening a dry dock",
    lead: (port) =>
      `Cleanship Marine delivers class-approved in-water surveys at ${portLabel(port)}, ${port.state}, with high-definition live video to a surface monitoring station, diver-to-surveyor communications and a full report package for the class file.`,
    angle: (port) =>
      `Classification societies accept in-water survey in place of drydocking for many vessels and inspection scopes, provided the work is done by an approved diving contractor to a defined procedure with the surveyor able to see the structure in real time. ${CONDITION_SURVEY_FIT[port.condition]}`,
    localScope: (port) => [
      `Survey programme agreed in advance with the class society and the surveyor attending at ${port.name}`,
      "Hull plating, welds, sea chests, rudder, propeller and stern gear inspected to the agreed scope",
      "Live high-definition video to the surface station with two-way diver-to-surveyor communications",
      "Hull markings and reference points confirmed so the surveyor can locate every feature precisely",
      `Diving permission and any environmental clearance cleared with ${port.authority}`,
      "Full report package with video, stills and findings issued for the class file",
    ],
    outcomes: [
      "Survey requirement satisfied without opening a dry dock or taking the vessel off hire",
      "Surveyor sees the structure live rather than reviewing a recording after the fact",
      "Defects located precisely against hull reference marks, not described approximately",
      "A report package built for the class file, not a video dump",
    ],
    keywords: [
      "in water survey",
      "in water class survey",
      "class approved diving inspection",
      "underwater hull survey",
    ],
  },
  {
    serviceSlug: "uwild",
    urlPrefix: "uwild-inspection",
    name: "UWILD",
    noun: "UWILD",
    titleStem: "UWILD Inspection",
    tagline: "Survey credit earned without leaving the water",
    lead: (port) =>
      `Cleanship Marine runs full UWILD programmes — Underwater Inspection In Lieu of Drydocking — at ${portLabel(port)}, ${port.state}, from eligibility discussion through class liaison to the final report package.`,
    angle: (port) =>
      `UWILD lets a vessel satisfy a survey requirement that would otherwise mean a dry docking, at a fraction of the cost and with none of the off-hire. The requirements are exacting: the contractor must hold class approval, the vessel must be eligible, hull markings must let the surveyor locate features precisely, and the inspection has to be delivered live and documented. ${CONDITION_SURVEY_FIT[port.condition]}`,
    localScope: (port) => [
      "Eligibility review against the vessel's age, type, class notation and survey history before anything is booked",
      `Programme agreed with the class society and the surveyor attending at ${port.name}`,
      "Hull, rudder, propeller, stern gear, sea chests and appendages inspected to the UWILD scope",
      "Live video, thickness measurement and clearance readings where the programme calls for them",
      `Diving permission cleared with ${port.authority}, with the vessel secured and machinery immobilised`,
      "Complete report package submitted for the class file and the drydocking credit",
    ],
    outcomes: [
      "Drydocking deferred and the survey credit earned in the water",
      "Class liaison handled end to end rather than left with the superintendent",
      "Eligibility confirmed before cost is committed, not discovered afterwards",
      "A documented inspection record that stands up to class review",
    ],
    keywords: [
      "UWILD",
      "underwater inspection in lieu of drydocking",
      "UWILD diving contractor",
      "UWILD inspection",
    ],
  },
];

/* ---------------------------- HOLD ---------------------------------- */

const holdScopes: PortScope[] = [
  {
    serviceSlug: "shore-gang",
    urlPrefix: "cargo-hold-cleaning",
    name: "Cargo Hold Cleaning (Shore Gang)",
    noun: "cargo hold cleaning",
    titleStem: "Cargo Hold Cleaning",
    tagline: "Holds ready for the next fixture before the vessel sails",
    lead: (port) =>
      `Cleanship Marine puts shore gangs on board at ${portLabel(port)}, ${port.state}, to clean cargo holds between fixtures — sweeping, washing, rinsing and drying to the standard the next cargo demands, worked at ${areaPhrase(port, 2)}.`,
    /* NOT port.profile — that paragraph opens the hull page at this port too,
       and reproducing it here word for word was the heaviest cross-service
       duplication in the set. The hold note is the same port's cargo story. */
    angle: (port) => port.holdNote ?? holdCargoFinding(port),
    localScope: (port) => [
      "Sweeping and removal of cargo residues, dunnage and lashing waste from tank tops, frames and brackets",
      "Fresh or sea water washing with the correct chemical treatment for the residue found, followed by a fresh water rinse",
      "Bilge wells, strum boxes, bilge lines and hold ladders cleaned and tested",
      "Drying and ventilation so holds pass inspection rather than merely look clean",
      `Residue and washing water handled to MARPOL Annex V requirements and the disposal rules in force at ${port.name}`,
      "Hold-by-hold photographic record and a completion report ahead of the inspection",
    ],
    outcomes: [
      "Holds presented to the standard the next fixture actually requires",
      "Inspection failures and the resulting demurrage avoided",
      "Residue and washings disposed of to MARPOL Annex V rather than left as the master's problem",
      "Crew kept on their own work instead of on cleaning duty",
    ],
    keywords: [
      "cargo hold cleaning",
      "ship hold cleaning",
      "hold cleaning shore gang",
      "bulk carrier hold cleaning",
    ],
  },
  {
    serviceSlug: "riding-crew",
    urlPrefix: "hold-cleaning-riding-crew",
    name: "Hold Cleaning Riding Crew",
    noun: "riding crew hold cleaning",
    titleStem: "Hold Cleaning Riding Crew",
    tagline: "Holds cleaned on passage, no port time spent",
    lead: (port) =>
      `Cleanship Marine embarks riding crews at ${portLabel(port)}, ${port.state}, to clean cargo holds on the passage out. The gang joins here, works the holds at sea and disembarks at a nominated port — the cleaning costs the vessel no port time at all.`,
    angle: (port) =>
      `Every other way of cleaning holds competes with something — the discharge, the berth window, the crew's own work. A riding crew competes with nothing: the work happens on a passage the vessel was making anyway. That is why it is the standard answer for tonnage leaving ${port.name} on a ballast leg with a clean-cargo fixture waiting at the other end, and why it is the only method whose cost does not rise when the port gets busy.`,
    localScope: (port) => [
      `Crew embarked at ${port.name} with tools, chemicals and PPE, cleared through the agent and the port`,
      "Full hold cleaning programme worked at sea, hold by hold, to the standard the next fixture requires",
      "Bilge wells, strum boxes and hold bilge lines cleaned and tested on passage",
      "Enclosed-space entry procedures, gas testing and safety supervision run to the vessel's own permit system",
      "Disembarkation at the nominated port arranged with visas, tickets and clearances handled",
      "Daily progress reporting to the vessel and the office, with a completion record on landing",
    ],
    outcomes: [
      "Zero port time spent on hold cleaning — the work happens on a passage already being made",
      "Holds ready for inspection on arrival rather than starting the job there",
      "Ship's crew kept on watchkeeping and maintenance instead of cleaning",
      "One team and one standard across a multi-port voyage",
    ],
    keywords: [
      "hold cleaning riding crew",
      "riding squad hold cleaning",
      "hold cleaning at sea",
      "hold cleaning on passage",
    ],
  },
  {
    serviceSlug: "rope-access",
    urlPrefix: "rope-access-hold-cleaning",
    name: "Rope Access Hold Cleaning",
    noun: "rope access hold cleaning",
    titleStem: "Rope Access Hold Cleaning",
    tagline: "The upper hold reached without staging",
    lead: (port) =>
      `Cleanship Marine provides IRATA rope access teams at ${portLabel(port)}, ${port.state}, to clean, inspect and treat the upper areas of cargo holds — hatch coamings, upper frames, transverse bulkheads and the underside of hatch covers — without staging or cherry pickers.`,
    angle: (port) =>
      `The top third of a cargo hold is where staging costs, schedule and risk all concentrate, and it is the part a deck-level gang cannot reach properly. Rope access removes the scaffolding from the equation entirely. At ${port.name} it also fits the schedule: the upper hold can be worked from ropes while the lower hold is still discharging, so the two do not queue behind each other.`,
    localScope: (port) => [
      "IRATA-certified technicians working to a written rope access plan with a rescue plan in place",
      "Hatch coamings, upper frames, transverse bulkheads and hatch cover undersides cleaned",
      "Spot blasting, rust removal and touch-up coating at height where the scope calls for it",
      "Close visual inspection of upper structure, reported with photographs at position",
      `Work planned around the discharge sequence and the working rules in force at ${port.name}`,
      "Completion report with before-and-after imagery by hold and by area",
    ],
    outcomes: [
      "Upper hold areas actually reached and cleaned, not just the parts a gang can stand on",
      "No staging cost, no cherry picker and no lost days erecting and striking it",
      "Structural condition at height inspected while the technicians are already there",
      "Fewer people working at height, under a written plan with a rescue capability",
    ],
    keywords: [
      "rope access hold cleaning",
      "IRATA rope access marine",
      "hold cleaning at height",
      "hatch coaming cleaning",
    ],
  },
];

/* ---------------------------- TANK ---------------------------------- */

const tankScopes: PortScope[] = [
  {
    serviceSlug: "oil-tanker-dpp-cpp",
    urlPrefix: "tanker-tank-cleaning",
    name: "Tanker Tank Cleaning — DPP & CPP",
    noun: "tanker tank cleaning",
    titleStem: "Tanker Tank Cleaning",
    tagline: "Grade change delivered to the surveyor's standard",
    lead: (port) =>
      `Cleanship Marine carries out cargo tank cleaning on dirty and clean petroleum product tankers at ${portLabel(port)}, ${port.state} — grade changes, wall-wash preparation and gas-freeing worked to the acceptance criteria of the next cargo, not to a generic procedure.`,
    /* See the note on the shore-gang scope: the port's liquid story, not the
       shared profile paragraph. */
    angle: (port) => port.tankNote ?? tankCargoFinding(port),
    localScope: (port) => [
      "Cleaning plan built from the prior-cargo and next-cargo pair, with the acceptance criteria agreed in writing first",
      "Tank washing, steaming and chemical treatment as the grade change requires",
      "Gas-freeing, atmosphere testing and enclosed-space entry certification before any entry",
      "Hand mopping, wall wash and final presentation for surveyor inspection",
      `Slops and residues transferred to licensed reception at ${port.name} with documentation`,
      "Tank-by-tank record and a completion report for the vessel and the charterer",
    ],
    outcomes: [
      "Tanks presented to the standard the next charterer will actually accept",
      "Wall-wash failures and the resulting rejection or delay avoided",
      "Slop disposal documented through licensed reception, not improvised",
      "Entry and gas-freeing certified rather than assumed",
    ],
    keywords: [
      "tanker tank cleaning",
      "cargo tank cleaning",
      "DPP CPP tank cleaning",
      "wall wash tank cleaning",
    ],
  },
  {
    serviceSlug: "demucking",
    urlPrefix: "tank-demucking",
    name: "Tank Demucking",
    noun: "tank demucking",
    titleStem: "Tank Demucking",
    tagline: "Sludge out, capacity back",
    lead: (port) =>
      `Cleanship Marine removes accumulated sludge, scale and sediment from cargo and bunker tanks at ${portLabel(port)}, ${port.state} — the manual, enclosed-space work that washing alone will not do.`,
    angle: () =>
      `Sludge is a slow loss: it takes cargo capacity, it fouls heating coils and suctions, and it turns every subsequent tank clean into a longer job. Disposal is the part that actually governs the schedule here — the muck has to go somewhere licensed, and that is arranged before the tanks are opened.`,
    localScope: (port) => [
      "Atmosphere testing, gas-freeing and enclosed-space entry certification before entry",
      "Manual removal of sludge, scale and sediment from tank bottoms, frames and structure",
      "Heating coils, suction wells and bell mouths cleared and confirmed",
      "Material bagged, transferred and tracked from tank to reception",
      `Disposal through licensed reception facilities at ${port.name} with the paperwork to prove it`,
      "Tank condition photographed and reported, including anything found under the sludge",
    ],
    outcomes: [
      "Cargo and bunker capacity recovered rather than carried as dead weight",
      "Heating coils and suctions cleared, restoring discharge performance",
      "Disposal documented through licensed reception",
      "Tank structure inspected while it is open and empty",
    ],
    keywords: [
      "tank demucking",
      "sludge removal ship",
      "cargo tank sludge cleaning",
      "bunker tank cleaning",
    ],
  },
  {
    serviceSlug: "shore-tank-cleaning",
    urlPrefix: "shore-tank-cleaning",
    name: "Shore Tank Cleaning",
    noun: "shore tank cleaning",
    titleStem: "Shore Tank Cleaning",
    tagline: "Terminal tanks returned to service, safely certified",
    lead: (port) =>
      `Cleanship Marine cleans shore storage tanks at the terminals serving ${portLabel(port)}, ${port.state} — product changeovers, inspection preparation and statutory maintenance, delivered under a full enclosed-space and hot-work regime.`,
    angle: (port) =>
      `A shore tank out of service is storage capacity earning nothing, so the schedule matters as much as the standard. ${port.profile} Work is planned with the terminal's own permit system and safety case, and the certification chain — gas-free, entry, hot work where needed — is treated as the critical path it actually is.`,
    localScope: (port) => [
      "Method statement and risk assessment agreed with the terminal before mobilisation",
      "Draining, purging, gas-freeing and atmosphere monitoring throughout",
      "Sludge and residue removal, floor and shell cleaning, roof and internal structure",
      "Preparation for internal inspection, thickness measurement or recoating",
      `Waste transferred to licensed disposal under the rules in force at ${port.name}`,
      "Certification and completion documentation for the terminal's records",
    ],
    outcomes: [
      "Tank returned to service on a schedule the terminal can plan around",
      "Inspection or recoating preparation done to a standard the inspector accepts",
      "Waste and sludge disposal fully documented",
      "Work carried out under the terminal's permit system, not alongside it",
    ],
    keywords: [
      "shore tank cleaning",
      "storage tank cleaning",
      "terminal tank cleaning",
      "oil storage tank cleaning",
    ],
  },
  {
    serviceSlug: "offshore-vessel-tank-cleaning",
    urlPrefix: "offshore-vessel-tank-cleaning",
    name: "Offshore Vessel Tank Cleaning",
    noun: "offshore vessel tank cleaning",
    titleStem: "OSV Tank Cleaning",
    tagline: "Mud, brine and base oil tanks turned round between charters",
    lead: (port) =>
      `Cleanship Marine cleans offshore support vessel tanks at ${portLabel(port)}, ${port.state} — drilling mud, brine, base oil, cement and bulk tanks turned round between charters and prepared for the next product.`,
    angle: () =>
      `An OSV between charters is an asset earning nothing, and the tank turnaround is usually the item on the critical path. The products involved — mud, brine, base oil, cement — each leave a different residue and need a different method, so the plan is built product by product rather than tank by tank.`,
    localScope: (port) => [
      "Product-specific cleaning plan for mud, brine, base oil, cement and bulk tanks",
      "Gas-freeing, atmosphere testing and enclosed-space entry certification",
      "Manual and mechanical cleaning of tanks, lines, valves and pump rooms",
      "Preparation and presentation for the incoming charterer's inspection",
      `Residue and washings disposed of through licensed reception at ${port.name}`,
      "Tank-by-tank completion record for the vessel and the charterer",
    ],
    outcomes: [
      "Vessel handed to the next charter on time rather than held on the tank turnaround",
      "Cross-contamination between products avoided",
      "Inspection passed at the first attempt",
      "Disposal documented, not improvised",
    ],
    keywords: [
      "offshore vessel tank cleaning",
      "OSV tank cleaning",
      "drilling mud tank cleaning",
      "brine tank cleaning",
    ],
  },
];

/* -------------------------------------------------------------------- */
/* Lines                                                                 */
/* -------------------------------------------------------------------- */

export const portLines: PortLine[] = [
  {
    key: "hull-cleaning",
    urlPrefix: "hull-cleaning",
    name: "Hull Cleaning",
    noun: "hull cleaning",
    categorySlug: "hull-cleaning",
    eyebrow: "Hull Cleaning",
    hubTagline: "In-water hull, propeller and survey work",
    hubIntro: (port) =>
      `Cleanship Marine provides the full underwater scope at ${portLabel(port)} (${port.unlocode}), ${port.state} — hull cleaning, propeller super polishing, bow and stern thruster work, class-approved in-water survey and UWILD. Every scope is carried out with the vessel afloat and on hire, at the berth or at the anchorage.`,
    scopes: hullScopes,
    keywords: [
      "hull cleaning",
      "underwater hull cleaning",
      "propeller polishing",
      "in water survey",
      "UWILD",
    ],
  },
  {
    key: "hold-cleaning",
    urlPrefix: "hold-cleaning",
    name: "Hold Cleaning",
    noun: "hold cleaning",
    categorySlug: "hold-cleaning",
    eyebrow: "Hold Cleaning",
    hubTagline: "Holds ready for the next fixture",
    hubIntro: (port) =>
      `Cleanship Marine cleans cargo holds at ${portLabel(port)} (${port.unlocode}), ${port.state} — shore gangs alongside, riding crews on the passage out, and IRATA rope access teams for the upper hold. ${port.holdNote ?? holdCargoFinding(port)}`,
    scopes: holdScopes,
    keywords: [
      "hold cleaning",
      "cargo hold cleaning",
      "ship hold cleaning",
      "hold cleaning riding crew",
    ],
  },
  {
    key: "tank-cleaning",
    urlPrefix: "tank-cleaning",
    name: "Tank Cleaning",
    noun: "tank cleaning",
    categorySlug: "tank-cleaning",
    eyebrow: "Tank Cleaning",
    hubTagline: "Grade changes, sludge removal and shore tanks",
    hubIntro: (port) =>
      `Cleanship Marine cleans cargo, bunker and shore tanks at ${portLabel(port)} (${port.unlocode}), ${port.state} — grade changes on product and chemical tankers, sludge demucking, terminal storage tanks and offshore support vessel turnarounds. ${port.tankNote ?? tankCargoFinding(port)}`,
    scopes: tankScopes,
    keywords: [
      "tank cleaning",
      "cargo tank cleaning",
      "shore tank cleaning",
      "tank demucking",
    ],
  },
];

const lineByKey = new Map(portLines.map((line) => [line.key, line]));
const lineByPrefix = new Map(portLines.map((line) => [line.urlPrefix, line]));

export function getLine(key: LineKey) {
  return lineByKey.get(key)!;
}

export function getLineByPrefix(prefix: string) {
  return lineByPrefix.get(prefix);
}
