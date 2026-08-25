/**
 * Saudi Arabian port coverage.
 *
 * Cleanship holds an office in Dammam and the site has advertised it since
 * before the rebuild, but the port programme had no pages for the market —
 * one of the gaps the audit raised as F9.
 *
 * Saudi is two working environments, not one, and the pages have to say so.
 * Dammam and Jubail sit in the Arabian Gulf: shallow, hypersaline, shamal
 * winds, brutal summer heat. Jeddah, King Abdullah and Yanbu sit on the Red
 * Sea: even warmer and saltier, with a persistent along-axis wind. Fouling
 * rates on both coasts are among the highest anywhere the fleet trades.
 */

import type { Port } from "./types";

export const saudiPorts: Port[] = [
  {
    slug: "dammam-port",
    name: "Dammam",
    officialName: "King Abdulaziz Port, Dammam",
    aka: ["King Abdulaziz Port", "Ad Dammam"],
    unlocode: "SADMM",
    state: "Eastern Province",
    country: "Saudi Arabia",
    countryCode: "SA",
    coast: "Arabian Gulf",
    weather: "arabian-gulf",
    waterBody: "Arabian Gulf",
    authority: "Mawani, the Saudi Ports Authority",
    type: "Major Port",
    condition: "sheltered",
    waiting: "berth-driven",
    cargoes: [
      "Containers",
      "General and project cargo",
      "RoRo and vehicles",
      "Dry bulk",
      "Livestock",
    ],
    vesselTypes: [
      "Main-line and feeder container ships",
      "Pure car and truck carriers",
      "General cargo and project vessels",
      "Handysize bulk carriers",
    ],
    airports: ["Dammam (DMM)"],
    workAreas: [
      "container terminal berths",
      "general cargo and RoRo berths",
      "outer anchorage",
    ],
    conditions:
      "Dammam is a sheltered artificial harbour on the Gulf coast reached by a long dredged approach channel, so alongside work is comfortable and the berth window rather than the weather is the constraint. The shamal is the seasonal interruption at the anchorage. What the Gulf takes back is biological: shallow, hot, hypersaline water grows fouling faster here than almost anywhere the fleet trades, and a hull that passed at the last call can be materially fouled three months later.",
    profile:
      "King Abdulaziz Port at Dammam is Saudi Arabia's principal Gulf-coast port and the main container and general cargo gateway for the Eastern Province and the industrial belt behind it. Cleanship holds an office here, so this is the shortest mobilisation in the Kingdom.",
    hook: "Saudi Arabia's principal Gulf-coast gateway",
    neighbours: ["jubail-port", "jeddah-port", "king-abdullah-port"],
    base: true,
    holdNote:
      "Dammam is container, RoRo and project tonnage rather than dirty bulk, so hold work here is cell guides, hold bilges, tank tops and lashing gear — confined-space maintenance scope on liner ships working a fixed rotation, not residue removal. Summer heat, not access, is what sizes the job between June and September.",
  },
  {
    slug: "jubail-port",
    name: "Jubail",
    officialName: "Jubail Commercial Port",
    aka: ["Jubail Commercial Port", "Al Jubail"],
    unlocode: "SAJBI",
    state: "Eastern Province",
    country: "Saudi Arabia",
    countryCode: "SA",
    coast: "Arabian Gulf",
    weather: "arabian-gulf",
    waterBody: "Arabian Gulf",
    authority: "Mawani and the Royal Commission for Jubail",
    type: "Major Port",
    condition: "sheltered",
    waiting: "berth-driven",
    cargoes: [
      "Petrochemicals",
      "Liquid chemicals",
      "Sulphur",
      "Containers",
      "Project cargo and steel",
    ],
    vesselTypes: [
      "Chemical and product tankers",
      "LPG carriers",
      "Bulk carriers",
      "General cargo and project vessels",
    ],
    airports: ["Dammam (DMM)"],
    workAreas: [
      "chemical and liquid berths",
      "general cargo quays",
      "outer anchorage",
    ],
    conditions:
      "Jubail is a purpose-built industrial port serving the largest petrochemical complex in the region, so access is controlled and the permit chain runs through the terminal and the Royal Commission as well as the port. That is a lead time, not a formality. The harbour is sheltered and alongside work is straightforward once cleared; the shamal governs the anchorage and summer heat governs anything done inside a tank.",
    profile:
      "Jubail Commercial Port serves Saudi Arabia's petrochemical heartland, loading chemicals, polymers and sulphur alongside containers and project cargo. The tonnage is specialised and the port calls are governed end to end by terminal windows.",
    hook: "the loading port for the region's largest petrochemical complex",
    neighbours: ["dammam-port", "jeddah-port", "yanbu-port"],
    holdNote:
      "The hold scope at Jubail is sulphur and bulk polymer: sulphur is acidic, it attacks coatings and steel if it is left, and no following cargo will tolerate it. Washing and neutralising is a specification job worked on the passage out rather than at a loading berth.",
    tankNote:
      "Jubail loads chemical and polymer grades to strict specification, so the cleaning plan is built from the prior-cargo and next-cargo pair and the charterer's acceptance criteria, not from a standard procedure. Gas-freeing, marine chemist attendance and enclosed-space entry certification are the critical path, and terminal approval for any work alongside has to be in hand before arrival.",
  },
  {
    slug: "jeddah-port",
    name: "Jeddah",
    officialName: "Jeddah Islamic Port",
    aka: ["Jeddah Islamic Port", "Jiddah"],
    unlocode: "SAJED",
    state: "Makkah Province",
    country: "Saudi Arabia",
    countryCode: "SA",
    coast: "Red Sea",
    weather: "red-sea",
    waterBody: "Red Sea",
    authority: "Mawani, the Saudi Ports Authority",
    type: "Major Port",
    condition: "sheltered",
    waiting: "berth-driven",
    cargoes: [
      "Containers and transhipment",
      "General cargo",
      "Grain and agricultural bulk",
      "RoRo and vehicles",
      "Passenger and pilgrim traffic",
    ],
    vesselTypes: [
      "Main-line and feeder container ships",
      "Pure car and truck carriers",
      "Bulk carriers",
      "Passenger and RoPax vessels",
    ],
    airports: ["Jeddah (JED)"],
    workAreas: [
      "container terminal berths",
      "general cargo and grain berths",
      "outer anchorage",
    ],
    conditions:
      "Jeddah is the largest port on the Red Sea and it works to genuine liner productivity targets, so the berth will not be held open for anything and in-water work is either sequenced around cargo operations or taken at the anchorage. The Red Sea is warmer and more saline than the Gulf, which makes it one of the most aggressive fouling environments the fleet encounters — intervals that hold elsewhere are too long here. Visibility in the basin is moderate.",
    profile:
      "Jeddah Islamic Port is Saudi Arabia's largest port and a major Red Sea transhipment hub sitting directly on the Suez–Asia route, working containers, grain, vehicles and pilgrim traffic. Main-line tonnage calls here that would not otherwise stop in the region.",
    hook: "the largest port on the Red Sea, on the Suez–Asia route",
    neighbours: ["king-abdullah-port", "yanbu-port", "dammam-port"],
    holdNote:
      "Grain and agricultural bulk inbound is the food-grade end of Jeddah's traffic and it is surveyor-attended, so a hold that carried anything mineral needs the full sequence. Container tonnage here is the other half of the workload — cell guides, bilges and tank tops on a berth clock that will not move.",
  },
  {
    slug: "king-abdullah-port",
    name: "King Abdullah Port",
    officialName: "King Abdullah Port, Rabigh",
    aka: ["KAP", "Rabigh", "King Abdullah Economic City"],
    unlocode: "SAKAC",
    state: "Makkah Province",
    country: "Saudi Arabia",
    countryCode: "SA",
    coast: "Red Sea",
    weather: "red-sea",
    waterBody: "Red Sea",
    authority: "King Abdullah Port and Mawani",
    type: "Private Port",
    condition: "sheltered",
    waiting: "berth-driven",
    cargoes: [
      "Containers and transhipment",
      "RoRo and vehicles",
      "Dry bulk",
      "General cargo",
    ],
    vesselTypes: [
      "Main-line and feeder container ships",
      "Pure car and truck carriers",
      "Bulk carriers",
    ],
    airports: ["Jeddah (JED)"],
    workAreas: [
      "container terminal berths",
      "RoRo and bulk berths",
      "anchorage",
    ],
    conditions:
      "King Abdullah Port is a modern privately operated terminal north of Jeddah, deep-water, well sheltered and run to high productivity — which means access is a commercial decision by the terminal as much as a port one, and it needs arranging in advance. Red Sea water here is warm and hypersaline with the fouling rate that implies. Alongside work runs year-round; summer heat is the constraint on anything enclosed.",
    profile:
      "King Abdullah Port is Saudi Arabia's newest deep-water container and RoRo gateway, built to serve the industrial city at Rabigh and to take Red Sea transhipment volume. Traffic is liner container and vehicle tonnage on fixed rotations.",
    hook: "Saudi Arabia's newest deep-water Red Sea terminal",
    neighbours: ["jeddah-port", "yanbu-port", "dammam-port"],
    holdNote:
      "This is container and RoRo tonnage, so hold scope is cell guides, hold bilges, tank tops and lashing gear rather than residue removal — planned maintenance on ships that keep to a rotation, sized to a berth window that will not be extended.",
  },
  {
    slug: "yanbu-port",
    name: "Yanbu",
    officialName: "King Fahd Industrial Port, Yanbu",
    aka: ["King Fahd Industrial Port", "Yanbu al Bahr", "Yenbo"],
    unlocode: "SAYBI",
    state: "Al Madinah Province",
    country: "Saudi Arabia",
    countryCode: "SA",
    coast: "Red Sea",
    weather: "red-sea",
    waterBody: "Red Sea",
    authority: "Mawani and the Royal Commission for Yanbu",
    type: "Private Port",
    condition: "sheltered",
    waiting: "berth-driven",
    cargoes: [
      "Crude oil",
      "Refined products",
      "Petrochemicals",
      "LPG",
      "Sulphur",
    ],
    vesselTypes: [
      "VLCC and Suezmax crude tankers",
      "Product and chemical tankers",
      "LPG carriers",
      "Bulk carriers",
    ],
    airports: ["Yanbu (YNB)", "Jeddah (JED)"],
    workAreas: ["crude loading berths", "product jetties", "sulphur berth"],
    conditions:
      "Yanbu is a refinery and petrochemical export complex with dedicated loading berths, so the constraint is the terminal rather than the weather and the permit chain runs through the Royal Commission as well as the port. Access is controlled and the lead time is real. The Red Sea here is warm, hypersaline and clear enough for usable inspection video — unusual for an industrial port and worth taking advantage of when the berth allows.",
    profile:
      "King Fahd Industrial Port at Yanbu is Saudi Arabia's Red Sea crude and petrochemical export terminal, loading VLCC crude alongside refined products, LPG and sulphur. Tonnage is large and specialised and the calls are governed end to end by terminal windows.",
    hook: "Saudi Arabia's Red Sea crude and petrochemical export terminal",
    neighbours: ["jeddah-port", "king-abdullah-port", "jubail-port"],
    holdNote:
      "The hold scope at Yanbu is sulphur — acidic, aggressive to coating and steel, and unacceptable to any following cargo if it is left. Washing and neutralising is a specification job, and the loading berth is not where it happens; the passage out is.",
    tankNote:
      "Yanbu loads crude and product to strict specification, so tank work is driven by the next cargo and the terminal's acceptance criteria. On the crude side the sludge volume is the governing factor and the disposal route is booked before the tanks are opened. Gas-freeing, marine chemist attendance and entry certification are part of the scope.",
  },
];

const bySlug = new Map(saudiPorts.map((p) => [p.slug, p]));
export function getSaudiPort(slug: string) {
  return bySlug.get(slug);
}
