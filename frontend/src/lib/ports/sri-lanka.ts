/**
 * Sri Lankan port coverage.
 *
 * Cleanship holds an office in Colombo and `serviceCoverage` has listed Sri
 * Lanka for hold cleaning since before the rebuild, but the port programme
 * had no pages for it — one of the gaps the audit raised as F9.
 *
 * The island is worth covering properly for a reason no other market on the
 * list shares: it has two monsoons on opposite schedules, so there is almost
 * always a workable coast. That is a genuine operational argument, and the
 * port pages make it.
 */

import type { Port } from "./types";

export const sriLankaPorts: Port[] = [
  {
    slug: "colombo-port",
    name: "Colombo",
    officialName: "Port of Colombo",
    aka: ["Colombo Harbour", "Sri Lanka"],
    unlocode: "LKCMB",
    state: "Western Province",
    country: "Sri Lanka",
    countryCode: "LK",
    coast: "West Coast",
    weather: "sri-lanka",
    waterBody: "Indian Ocean",
    authority: "Sri Lanka Ports Authority",
    type: "Major Port",
    condition: "sheltered",
    waiting: "mixed",
    cargoes: [
      "Containers and transhipment",
      "Bunkers",
      "General cargo",
      "Cement and dry bulk",
      "Tea and agricultural cargo",
    ],
    vesselTypes: [
      "Main-line and feeder container ships",
      "Bunker tankers and barges",
      "General cargo ships",
      "Cruise ships",
    ],
    airports: ["Colombo (CMB)"],
    workAreas: [
      "container terminal berths",
      "bunkering anchorage",
      "general cargo quays",
    ],
    conditions:
      "Colombo works behind long breakwaters and is well sheltered, so alongside work runs year-round and the south-west monsoon from May to September governs the anchorage rather than the berth. The bunkering anchorage carries a standing population of vessels waiting for fuel or orders, which is where most in-water work here actually happens. Harbour water is warm and turbid with moderate visibility; fouling returns fast.",
    profile:
      "Colombo is South Asia's largest transhipment hub and one of the busiest bunkering ports on the Europe–Asia route, handling main-line container tonnage that would not otherwise call in the region. Cleanship keeps an office here, and the port sits directly on the rotation for vessels working the Indian coverage.",
    hook: "South Asia's largest transhipment and bunkering hub",
    neighbours: ["galle-port", "trincomalee-port", "puttalam-port"],
    base: true,
    holdNote:
      "Colombo's hold work is mostly transhipment container tonnage — cell guides, hold bilges, bilge wells and tank tops — plus cement and agricultural bulk on the regional callers. Tea and food-grade cargo out of Sri Lanka is odour-sensitive, so a hold that carried cement or fertiliser inbound needs the full sequence, not a sweep.",
    tankNote:
      "Bunkering drives the tank work here: fuel, slop and bunker tank cleaning on tankers and barges lying at the anchorage, rather than cargo grade changes. Licensed slop reception is arranged through the Ports Authority before the tanks are opened.",
  },
  {
    slug: "galle-port",
    name: "Galle",
    officialName: "Port of Galle",
    aka: ["Galle Harbour", "Sri Lanka"],
    unlocode: "LKGAL",
    state: "Southern Province",
    country: "Sri Lanka",
    countryCode: "LK",
    coast: "South Coast",
    weather: "sri-lanka",
    waterBody: "Indian Ocean",
    authority: "Sri Lanka Ports Authority",
    type: "State Port",
    condition: "clear-water",
    waiting: "mixed",
    cargoes: [
      "General cargo",
      "Fishing catch",
      "Cement and dry bulk",
      "Yachts and leisure craft",
    ],
    vesselTypes: [
      "Coasters and small general cargo ships",
      "Fishing fleet and support craft",
      "Yachts and leisure vessels",
    ],
    airports: ["Colombo (CMB)"],
    workAreas: ["inner harbour berths", "anchorage"],
    conditions:
      "Galle is a natural harbour on the south coast with markedly clearer water than Colombo, which makes it one of the better ports in the region for documented in-water inspection. The south-west monsoon from May to September hits this coast directly and closes most of the season; the north-east monsoon leaves it workable. Traffic is small tonnage, so jobs here are short but frequent.",
    profile:
      "Galle is Sri Lanka's southern harbour, working general cargo, a substantial fishing fleet and a growing yacht and leisure trade. Its clear water and small tonnage make it a practical place for survey and inspection work rather than large-area cleaning.",
    hook: "clear southern water suited to inspection work",
    neighbours: ["colombo-port", "trincomalee-port", "puttalam-port"],
    holdNote:
      "Hold work at Galle is coasters and small general cargo tonnage: dunnage, lashing waste, bilge wells and tank tops rather than a bulk residue clean. The jobs are short, which makes them worth combining with a Colombo attendance on the same trip.",
  },
  {
    slug: "trincomalee-port",
    name: "Trincomalee",
    officialName: "Port of Trincomalee",
    aka: ["Trinco", "Sri Lanka"],
    unlocode: "LKTRR",
    state: "Eastern Province",
    country: "Sri Lanka",
    countryCode: "LK",
    coast: "East Coast",
    weather: "sri-lanka",
    waterBody: "Bay of Bengal",
    authority: "Sri Lanka Ports Authority",
    type: "State Port",
    condition: "clear-water",
    waiting: "long-wait",
    cargoes: [
      "Cement and clinker",
      "Grain and agricultural bulk",
      "POL and fuel storage",
      "General cargo",
    ],
    vesselTypes: [
      "Handysize bulk carriers",
      "Product tankers",
      "General cargo ships",
    ],
    airports: ["Trincomalee", "Colombo (CMB)"],
    workAreas: ["inner harbour berths", "oil terminal jetty", "deep anchorage"],
    conditions:
      "Trincomalee is one of the largest natural deep-water harbours in the world and it is exceptionally sheltered — a vessel inside is out of the weather in a way no other port on this coverage list matches. Water is clear by regional standards and the harbour is deep enough to work large tonnage at anchor comfortably. The north-east monsoon from December to February is the limiting season here, which is the opposite of Colombo.",
    profile:
      "Trincomalee is Sri Lanka's deep-water eastern harbour, working cement, grain and a large oil tank farm, with far more natural capacity than its current traffic uses. Its shelter and clarity make it the best place in the region to do work that needs time and visibility — and its counter-seasonal monsoon means it is workable when Colombo is not.",
    hook: "one of the world's largest natural deep-water harbours",
    neighbours: ["colombo-port", "galle-port", "puttalam-port"],
    holdNote:
      "Cement and clinker inbound and grain outbound is the standing sequence at Trincomalee, and it is the unforgiving one — cement residue sets, and a grain surveyor will not pass a hold carrying it. The shelter here is the advantage: this is a port where the full sequence can actually be completed rather than started.",
    tankNote:
      "The tank farm and the product tonnage serving it drive the tank work here — grade changes, bunker and slop cleaning, and shore tank work at the terminal. The deep sheltered anchorage means work that cannot run alongside has a genuinely reliable fallback.",
  },
  {
    slug: "puttalam-port",
    name: "Puttalam",
    officialName: "Port of Puttalam",
    aka: ["Puttalam Lagoon", "Sri Lanka"],
    unlocode: "LKPTL",
    state: "North Western Province",
    country: "Sri Lanka",
    countryCode: "LK",
    coast: "West Coast",
    weather: "sri-lanka",
    waterBody: "Puttalam Lagoon",
    authority: "Sri Lanka Ports Authority",
    type: "State Port",
    condition: "tidal-silt",
    waiting: "mixed",
    cargoes: [
      "Cement and clinker",
      "Limestone",
      "Coal",
      "Salt",
      "General cargo",
    ],
    vesselTypes: [
      "Handysize bulk carriers",
      "Barges and coastal craft",
    ],
    airports: ["Colombo (CMB)"],
    workAreas: ["cement jetty", "lagoon anchorage", "lightering position"],
    conditions:
      "Puttalam is a shallow lagoon port serving the cement industry, so depth restricts what can come alongside and larger tonnage is lightened at anchor. Lagoon water is warm, brackish and silty with low visibility, and cement and limestone dust in the water column reduces it further around active loading. The south-west monsoon is the limiting season.",
    profile:
      "Puttalam is Sri Lanka's cement and limestone port, working clinker, coal and salt through a jetty and a lightering anchorage on the north-west coast. Traffic is smaller bulk tonnage and barges on short regional voyages.",
    hook: "a shallow cement lagoon on the north-west coast",
    neighbours: ["colombo-port", "trincomalee-port", "galle-port"],
    holdNote:
      "Cement, clinker and limestone are the standing residues and all three set hard if the holds are washed late. On the short runs out of Puttalam the cleaning is planned for immediately after discharge — carrying it to the next port is how a two-day job becomes a five-day one.",
  },
];

const bySlug = new Map(sriLankaPorts.map((p) => [p.slug, p]));
export function getSriLankaPort(slug: string) {
  return bySlug.get(slug);
}
