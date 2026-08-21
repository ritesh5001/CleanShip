/**
 * UAE port coverage.
 *
 * These thirteen ports replace the hand-written location pages that used to
 * live at /hold-tank-cleaning-service-at-*-port. Those pages canonicalised to
 * their parent service page, which told Google to consolidate the signal
 * there and drop them — so they could never rank for the port term they were
 * written for. They are redirected onto these (see next.config.ts).
 *
 * Eleven come from the UN/LOCODE list in `Port Coverage.xlsx`. Ajman and Umm
 * Al Quwain are not on that sheet but had legacy pages pointing at them, and
 * Ajman is the registered head office, so both are carried here with their
 * UN/LOCODEs noted.
 *
 * Two things make the UAE genuinely different from the India set, and the
 * copy leans on both: the Arabian Gulf is shallow, hot and hypersaline, which
 * grows fouling faster than almost anywhere the fleet trades; and the summer
 * heat is a real constraint on enclosed-space work, not a comfort note.
 */

import type { Port } from "./types";

export const uaePorts: Port[] = [
  {
    slug: "jebel-ali-port",
    name: "Jebel Ali",
    officialName: "Port of Jebel Ali",
    aka: ["Mina Jebel Ali", "DP World Jebel Ali", "Dubai"],
    unlocode: "AEJEA",
    state: "Dubai",
    country: "United Arab Emirates",
    countryCode: "AE",
    coast: "Arabian Gulf",
    weather: "arabian-gulf",
    waterBody: "Arabian Gulf",
    authority: "DP World and the Dubai Maritime Authority",
    type: "Private Port",
    condition: "sheltered",
    waiting: "berth-driven",
    cargoes: [
      "Containers",
      "RoRo and vehicles",
      "Project cargo",
      "Liquid bulk",
      "General cargo",
    ],
    vesselTypes: [
      "Main-line and feeder container ships",
      "Pure car and truck carriers",
      "General cargo and project vessels",
      "Offshore support vessels",
    ],
    airports: ["Dubai (DXB)", "Al Maktoum (DWC)"],
    workAreas: [
      "container terminal berths",
      "RoRo and general cargo berths",
      "liquid bulk berths",
      "outer anchorage",
    ],
    conditions:
      "Jebel Ali is a large artificial harbour and thoroughly sheltered, so in-water work runs alongside for most of the year and the berth window, not the weather, is the constraint. What the Gulf takes back is biological: shallow, hot, hypersaline water grows fouling faster here than almost anywhere the fleet trades, and a hull that looked acceptable at the last call can be materially fouled three months later. Visibility in the basin is moderate and drops around dredging and bunkering activity.",
    profile:
      "Jebel Ali is the largest container port in the Middle East and the region's main transhipment and free-zone gateway, working containers, vehicles, project cargo and liquid bulk. Liner tonnage calls to fixed rotations, which makes hull cleaning and propeller polishing a scheduled maintenance item rather than a response to a speed complaint.",
    hook: "the largest container port in the Middle East",
    neighbours: ["rashid-port", "sharjah-port", "ajman-port"],
    holdNote:
      "Jebel Ali is container and RoRo tonnage, so hold work here means cell guides, hold bilges, tank tops and lashing gear rather than a bulk residue clean — confined-space and rope-access scope on liner ships working to a fixed rotation.",
    tankNote:
      "Liquid bulk at Jebel Ali works to terminal rules rather than port rules. Slop reception, gas-freeing and any hot work permit are agreed with the terminal before arrival, and where the berth will not carry the work it is planned for the anchorage instead.",
  },
  {
    slug: "rashid-port",
    name: "Port Rashid",
    officialName: "Port Rashid, Dubai",
    aka: ["Mina Rashid", "Rashid Port", "Dubai"],
    unlocode: "AEDXB",
    state: "Dubai",
    country: "United Arab Emirates",
    countryCode: "AE",
    coast: "Arabian Gulf",
    weather: "arabian-gulf",
    waterBody: "Arabian Gulf",
    authority: "DP World and the Dubai Maritime Authority",
    type: "Private Port",
    condition: "sheltered",
    waiting: "berth-driven",
    cargoes: [
      "Cruise and passenger",
      "General cargo",
      "Project cargo",
      "Ship repair",
    ],
    vesselTypes: [
      "Cruise ships",
      "General cargo and project vessels",
      "Tugs, workboats and harbour craft",
      "Superyachts",
    ],
    airports: ["Dubai (DXB)"],
    workAreas: [
      "cruise terminal berths",
      "general cargo berths",
      "ship repair quays",
    ],
    conditions:
      "Port Rashid is a compact, fully enclosed harbour, so work here is sheltered and predictable and can be scheduled against a berth rather than a weather window. Water is warm and still, which is exactly the condition that grows heavy fouling on anything lying idle — harbour craft and laid-up tonnage here foul faster than trading ships do. Basin visibility is moderate.",
    profile:
      "Port Rashid is Dubai's cruise and general cargo port and a ship repair centre, working passenger tonnage on season rotations alongside project cargo and a substantial harbour craft fleet. Cruise turnarounds are short and fixed, so underwater work is scoped to fit inside the port call or planned for the lay-up period.",
    hook: "Dubai's cruise and ship repair harbour",
    neighbours: ["jebel-ali-port", "sharjah-port", "ajman-port"],
    holdNote:
      "Hold and space cleaning at Port Rashid is mostly cruise and project tonnage — stores spaces, void spaces and tank tops rather than cargo residue — plus preparation work on vessels coming out of repair.",
  },
  {
    slug: "sharjah-port",
    name: "Sharjah",
    officialName: "Port Khalid, Sharjah",
    aka: ["Port Khalid", "Mina Khalid", "Khalid Port"],
    unlocode: "AESHJ",
    state: "Sharjah",
    country: "United Arab Emirates",
    countryCode: "AE",
    coast: "Arabian Gulf",
    weather: "arabian-gulf",
    waterBody: "Arabian Gulf",
    authority: "Sharjah Ports Authority",
    type: "State Port",
    condition: "sheltered",
    waiting: "mixed",
    cargoes: [
      "Containers",
      "General cargo",
      "Steel and project cargo",
      "Dry bulk",
    ],
    vesselTypes: [
      "Feeder container ships",
      "General cargo ships and coasters",
      "Handysize bulk carriers",
    ],
    airports: ["Sharjah (SHJ)", "Dubai (DXB)"],
    workAreas: ["container berths", "general cargo berths", "outer anchorage"],
    conditions:
      "Port Khalid is an enclosed harbour on the Gulf coast, sheltered enough that work alongside runs year-round, with the shamal winds through the winter and early summer the main interruption at the anchorage. Gulf water here is shallow, warm and hypersaline, so fouling establishes fast and the realistic cleaning interval is shorter than the same vessel would need on a cooler trade. Basin visibility is moderate to low.",
    profile:
      "Port Khalid is Sharjah's main general cargo and feeder container port, working steel, project cargo and dry bulk alongside the box traffic. The mix of regional coasters and feeder tonnage means shorter port calls and a working expectation that a job either fits the call or waits for the next one.",
    hook: "Sharjah's general cargo and feeder container harbour",
    holdNote:
      "Port Khalid mixes feeder containers with steel, project cargo and dry bulk, so the scope varies by caller — cell guides and bilge wells on the box ships, dunnage and lashing waste on the general cargo tonnage, residue removal on the bulk. Port calls are short, so the work is sized to the call before the gang boards.",
    neighbours: ["ajman-port", "hamriyah-port", "rashid-port"],
  },
  {
    slug: "khor-fakkan-port",
    name: "Khor Fakkan",
    officialName: "Khor Fakkan Container Terminal",
    aka: ["Khorfakkan", "KCT", "Khor Fakkan Port"],
    unlocode: "AEKLF",
    state: "Sharjah",
    country: "United Arab Emirates",
    countryCode: "AE",
    coast: "Gulf of Oman",
    weather: "gulf-of-oman",
    waterBody: "Gulf of Oman",
    authority: "Sharjah Ports Authority",
    type: "State Port",
    condition: "clear-water",
    waiting: "berth-driven",
    cargoes: ["Containers and transhipment", "General cargo"],
    vesselTypes: [
      "Main-line container ships",
      "Feeder container ships",
    ],
    airports: ["Fujairah (FJR)", "Dubai (DXB)", "Sharjah (SHJ)"],
    workAreas: ["container terminal berths", "outer anchorage"],
    conditions:
      "Khor Fakkan sits on the Gulf of Oman rather than inside the Gulf, and the difference is immediate: deeper, cooler and markedly clearer water, which makes it one of the best ports in the region for in-water survey and documented inspection. Swell from the Arabian Sea is the trade-off and it governs the anchorage, particularly around the cyclone windows in June and again in October and November. Berth windows on the transhipment terminal are tight and productivity-driven.",
    profile:
      "Khor Fakkan is a deep-water transhipment container terminal on the UAE east coast, outside the Strait of Hormuz, which is exactly why main-line tonnage calls there. Large container ships on fixed rotations dominate, so underwater work is planned as scheduled maintenance sized to a known berth window.",
    hook: "clear Gulf of Oman water outside the Strait of Hormuz",
    neighbours: ["fujairah-port", "sharjah-port", "hamriyah-port"],
    holdNote:
      "Khor Fakkan works main-line container tonnage, so hold scope is cell guides, hold bilges, tank tops and lashing gear — high-access confined-space work on large ships, sequenced around a berth window that will not be extended for it.",
  },
  {
    slug: "hamriyah-port",
    name: "Hamriyah",
    officialName: "Hamriyah Port, Sharjah",
    aka: ["Hamriyah Free Zone Port", "Al Hamriyah"],
    unlocode: "AEHAM",
    state: "Sharjah",
    country: "United Arab Emirates",
    countryCode: "AE",
    coast: "Arabian Gulf",
    weather: "arabian-gulf",
    waterBody: "Arabian Gulf",
    authority: "Sharjah Ports Authority",
    type: "State Port",
    condition: "sheltered",
    waiting: "mixed",
    cargoes: [
      "Steel and project cargo",
      "Oil and gas equipment",
      "Aggregates and dry bulk",
      "Liquid bulk",
      "General cargo",
    ],
    vesselTypes: [
      "General cargo and project vessels",
      "Handysize bulk carriers",
      "Offshore support vessels and barges",
      "Product and chemical tankers",
    ],
    airports: ["Sharjah (SHJ)", "Dubai (DXB)"],
    workAreas: [
      "free zone berths",
      "oil and gas quays",
      "bulk berths",
      "anchorage",
    ],
    conditions:
      "Hamriyah is a sheltered free-zone port with a heavy offshore and fabrication presence, so alongside work is straightforward and the constraint is usually access and permits rather than weather. Shallow, hot Gulf water grows fouling quickly on the offshore support vessels and barges that spend long periods here between charters — the heaviest growth we lift in the northern emirates is usually off idle tonnage at Hamriyah.",
    profile:
      "Hamriyah is Sharjah's free-zone and energy port, handling steel, oil and gas project cargo, aggregates and liquid bulk, with a large resident fleet of offshore support vessels and barges. That resident fleet, rather than the transiting traffic, is the regular user of in-water cleaning and tank work here.",
    hook: "an offshore and fabrication port with a large idle fleet",
    holdNote:
      "Hold and space work at Hamriyah is mostly offshore support tonnage and project carriers: void spaces, cargo rails, deck cargo areas and bulk tanks rather than a bulk residue clean. Vessels here often sit between charters, which gives a proper job the time it needs instead of the time a berth allows.",
    neighbours: ["sharjah-port", "ajman-port", "umm-al-quwain-port"],
    tankNote:
      "Hamriyah handles product and chemical parcels alongside the offshore fleet, so tank scope ranges from a full grade change on a product tanker to fuel and slop tank cleaning on OSVs coming off charter. Slop disposal is arranged through licensed contractors in the free zone as part of the job.",
  },
  {
    slug: "ajman-port",
    name: "Ajman",
    officialName: "Port of Ajman",
    aka: ["Mina Ajman", "Ajman Port"],
    /* Not on the coverage sheet; carried because Ajman is the registered head
       office and a legacy landing page pointed here. */
    unlocode: "AEAJM",
    state: "Ajman",
    country: "United Arab Emirates",
    countryCode: "AE",
    coast: "Arabian Gulf",
    weather: "arabian-gulf",
    waterBody: "Arabian Gulf",
    authority: "Ajman Ports and Customs",
    type: "State Port",
    condition: "sheltered",
    waiting: "mixed",
    cargoes: [
      "General cargo",
      "Aggregates and dry bulk",
      "Timber",
      "Steel",
    ],
    vesselTypes: [
      "General cargo ships and coasters",
      "Handysize bulk carriers",
      "Barges, dhows and workboats",
    ],
    airports: ["Sharjah (SHJ)", "Dubai (DXB)"],
    workAreas: ["general cargo berths", "bulk berths", "creek moorings"],
    conditions:
      "Ajman is a compact creek-mouth port, sheltered and shallow, working smaller tonnage than its neighbours. Warm, still creek water and long idle periods on the resident coaster and barge fleet mean fouling here is heavy, mixed and frequently past the soft stage — flat bottoms, sea chests and inlet gratings are the recurring problem rather than the vertical sides.",
    profile:
      "Ajman is a state port working general cargo, aggregates and timber for the northern emirates, with a resident fleet of coasters, dhows and barges. Cleanship's registered head office is in Ajman Free Zone, so this is the shortest mobilisation on the coverage list.",
    hook: "a shallow creek port on Cleanship's own doorstep",
    holdNote:
      "Ajman works aggregates, timber and steel on smaller coastal tonnage, so the holds are compact and the residues mixed — rock dust, dunnage and lashing waste in the same space, each needing a different approach. Cleanship's head office is here, so a gang can be on board within the hour.",
    neighbours: ["sharjah-port", "umm-al-quwain-port", "hamriyah-port"],
    base: true,
  },
  {
    slug: "umm-al-quwain-port",
    name: "Umm Al Quwain",
    officialName: "Port of Umm Al Quwain",
    aka: ["UAQ", "Umm Al Qaiwain", "Ahmed Bin Rashid Port"],
    /* Not on the coverage sheet; carried because a legacy /…-at-uaq-port
       landing page pointed here. */
    unlocode: "AEQIW",
    state: "Umm Al Quwain",
    country: "United Arab Emirates",
    countryCode: "AE",
    coast: "Arabian Gulf",
    weather: "arabian-gulf",
    waterBody: "Arabian Gulf",
    authority: "Umm Al Quwain Ports and Customs",
    type: "State Port",
    condition: "sheltered",
    waiting: "long-wait",
    cargoes: ["Aggregates and dry bulk", "General cargo", "Fishing catch"],
    vesselTypes: [
      "Barges and split hopper craft",
      "Coasters and small general cargo ships",
      "Fishing and workboat fleet",
    ],
    airports: ["Sharjah (SHJ)", "Ras Al Khaimah (RKT)", "Dubai (DXB)"],
    workAreas: ["free zone quay", "creek moorings", "offshore anchorage"],
    conditions:
      "Umm Al Quwain is a small, shallow creek port, and depth alongside limits what can be worked inside it — larger tonnage is taken at the anchorage off the port. The water is warm, shallow and still, so the resident barge and workboat fleet carries the heaviest and hardest fouling of any group on the coast. Visibility in the creek is low and improves offshore.",
    profile:
      "Umm Al Quwain works aggregates, general cargo and a substantial fishing fleet through a creek port and free zone quay. Traffic is small tonnage that spends long periods stationary, which is why the underwater work here is dominated by heavy hull growth, propeller clearance and sea chest work rather than routine maintenance cleaning.",
    hook: "a shallow creek fleet that fouls harder than deep-sea tonnage",
    holdNote:
      "Hold work at Umm Al Quwain is aggregate barges and small coasters: rock dust and fines packed into the frames and hopper corners, on craft that sit idle long enough for it to compact. Access is over the side rather than through a terminal, which changes the rigging more than it changes the cleaning.",
    neighbours: ["ajman-port", "ras-al-khaimah-port", "hamriyah-port"],
  },
  {
    slug: "ras-al-khaimah-port",
    name: "Ras Al Khaimah",
    officialName: "Port of Ras Al Khaimah",
    aka: ["RAK Port", "Mina Ras Al Khaimah"],
    unlocode: "AERKT",
    state: "Ras Al Khaimah",
    country: "United Arab Emirates",
    countryCode: "AE",
    coast: "Arabian Gulf",
    weather: "arabian-gulf",
    waterBody: "Arabian Gulf",
    authority: "RAK Ports",
    type: "State Port",
    condition: "sheltered",
    waiting: "mixed",
    cargoes: [
      "Aggregates and dry bulk",
      "Cement and clinker",
      "General cargo",
      "Ceramics and project cargo",
    ],
    vesselTypes: [
      "Handysize bulk carriers",
      "General cargo ships and coasters",
      "Barges and tugs",
    ],
    airports: ["Ras Al Khaimah (RKT)", "Dubai (DXB)"],
    workAreas: ["bulk berths", "general cargo berths", "anchorage"],
    conditions:
      "Ras Al Khaimah is a sheltered Gulf port working smaller bulk and general cargo tonnage, so alongside work is practical year-round with the winter shamal the main interruption at the anchorage. Water is shallow, hot and hypersaline, and the aggregate trade puts a constant film of rock dust into the basin that settles into sea chest gratings and inlet openings. Inlet clearance is a bigger part of the job here than the fouling itself.",
    profile:
      "Ras Al Khaimah works aggregates, cement and ceramics for the regional construction trade through the emirate's older port, alongside the larger bulk operation at Saqr Port a short distance up the coast. Traffic is Handysize bulk tonnage and coasters on short regional voyages.",
    hook: "aggregate dust and inlet clearance on the northern Gulf coast",
    holdNote:
      "Aggregate and cement residues are the standing job here, and cement is the one that sets — a hold washed late after a clinker or cement cargo needs mechanical removal, not a hose. Turnaround at RAK is quick, so the work starts as each hold empties rather than after the last grab.",
    neighbours: ["mina-saqr-port", "umm-al-quwain-port", "ajman-port"],
  },
  {
    slug: "mina-saqr-port",
    name: "Mina Saqr",
    officialName: "Saqr Port, Ras Al Khaimah",
    aka: ["Saqr Port", "Mina Saqr", "Ras Al Khaimah"],
    unlocode: "AEMSA",
    state: "Ras Al Khaimah",
    country: "United Arab Emirates",
    countryCode: "AE",
    coast: "Arabian Gulf",
    weather: "arabian-gulf",
    waterBody: "Arabian Gulf",
    authority: "RAK Ports",
    type: "State Port",
    condition: "sheltered",
    waiting: "mixed",
    cargoes: [
      "Aggregates and limestone",
      "Cement and clinker",
      "Coal",
      "General cargo",
      "Project cargo",
    ],
    vesselTypes: [
      "Handysize and Supramax bulk carriers",
      "General cargo ships",
      "Barges and tugs",
    ],
    airports: ["Ras Al Khaimah (RKT)", "Dubai (DXB)"],
    workAreas: ["bulk loading berths", "general cargo berths", "anchorage"],
    conditions:
      "Saqr Port is the largest bulk handling operation in the region and it runs continuously, so a vessel's time here is loading time and the underwater or hold window is whatever the loading sequence leaves. Shelter is good and the season rarely stops work. Limestone and aggregate dust is the defining local condition: it coats everything, settles into gratings and inlets, and makes the basin markedly dirtier than the emirate's other berths.",
    profile:
      "Saqr Port at Ras Al Khaimah is the Gulf's principal aggregate and limestone export terminal, shipping crushed rock and cement products across the region and into the Indian subcontinent. Bulk carriers on repeat short-haul voyages dominate, which makes both hold cleaning and hull condition recurring rather than occasional questions.",
    hook: "the Gulf's principal aggregate and limestone terminal",
    neighbours: ["ras-al-khaimah-port", "umm-al-quwain-port", "fujairah-port"],
    holdNote:
      "Limestone, aggregate and clinker are the standing residues at Saqr Port, and they are the abrasive, dusty kind: fines pack into frames, brackets and tank-top margins and set hard if the holds are washed late. Vessels loading here for a clean cargo elsewhere need the full sequence, and the time to do it is the ballast passage, not the berth.",
  },
  {
    slug: "fujairah-port",
    name: "Fujairah",
    officialName: "Port of Fujairah",
    aka: ["Mina Fujairah", "Fujairah anchorage"],
    unlocode: "AEFJR",
    state: "Fujairah",
    country: "United Arab Emirates",
    countryCode: "AE",
    coast: "Gulf of Oman",
    weather: "gulf-of-oman",
    waterBody: "Gulf of Oman",
    authority: "Port of Fujairah Authority",
    type: "State Port",
    condition: "anchorage",
    waiting: "long-wait",
    cargoes: [
      "Bunkers",
      "Crude and refined products",
      "Containers",
      "General cargo",
      "Aggregates",
    ],
    vesselTypes: [
      "Crude and product tankers, VLCC to coastal",
      "Bunker barges and tankers",
      "Container ships",
      "Offshore support vessels",
    ],
    airports: ["Fujairah (FJR)", "Dubai (DXB)"],
    workAreas: [
      "Fujairah anchorage",
      "oil terminal berths",
      "container and general cargo berths",
    ],
    conditions:
      "Fujairah is defined by its anchorage. One of the largest bunkering anchorages in the world sits off the port, and vessels lie there for days at a time — which is both why so much in-water work happens here and why so much of it is needed. Gulf of Oman water is deeper and clearer than inside the Gulf, so survey video is genuinely usable, but the anchorage is exposed to Arabian Sea swell and the June and October-November cyclone windows govern the working calendar.",
    profile:
      "Fujairah is the world's second-largest bunkering port and the UAE's only major port outside the Strait of Hormuz, working crude and product storage, bunkers, containers and general cargo. The standing anchorage population of tankers waiting for bunkers or orders is the single largest concentration of idle tonnage on the coverage list.",
    hook: "the world's second-largest bunkering anchorage",
    holdNote:
      "Fujairah's hold work is aggregates and general cargo rather than the liquid traffic the port is known for, and the real advantage here is the anchorage. Vessels wait for bunkers or orders for days at a time, and that is the cleanest hold cleaning window available anywhere on this coast.",
    neighbours: ["khor-fakkan-port", "mina-saqr-port", "sharjah-port"],
    tankNote:
      "Fujairah's storage and bunkering role means tank work here is constant: grade changes on product tankers, sludge and slop removal on bunker barges, and fuel tank cleaning ahead of a specification change. Slop disposal goes through licensed port reception facilities, arranged as part of the scope rather than left to the vessel.",
  },
  {
    slug: "khalifa-port",
    name: "Khalifa Port",
    officialName: "Khalifa Port, Abu Dhabi",
    aka: ["KHALIFA", "Abu Dhabi", "KIZAD"],
    unlocode: "AEKHL",
    state: "Abu Dhabi",
    country: "United Arab Emirates",
    countryCode: "AE",
    coast: "Arabian Gulf",
    weather: "arabian-gulf",
    waterBody: "Arabian Gulf",
    authority: "AD Ports Group and Abu Dhabi Maritime",
    type: "Private Port",
    condition: "sheltered",
    waiting: "berth-driven",
    cargoes: [
      "Containers",
      "General and project cargo",
      "Dry bulk",
      "RoRo",
    ],
    vesselTypes: [
      "Main-line and feeder container ships",
      "Bulk carriers",
      "General cargo and project vessels",
    ],
    airports: ["Abu Dhabi (AUH)", "Dubai (DXB)"],
    workAreas: [
      "container terminal berths",
      "general cargo and RoRo berths",
      "dry bulk berths",
      "anchorage",
    ],
    conditions:
      "Khalifa Port is a modern offshore island terminal behind a breakwater, so it is well sheltered and work alongside runs year-round against the berth window rather than the weather. The approach channel is dredged and the basin carries suspended sediment, so visibility is moderate. As everywhere inside the Gulf, water temperature and salinity mean fouling returns faster than the same vessel's northern-trade interval would suggest.",
    profile:
      "Khalifa Port is Abu Dhabi's deep-water container and industrial gateway, serving the KIZAD industrial zone with container, general cargo, RoRo and dry bulk traffic. Liner container tonnage on fixed rotations makes up the bulk of the calls.",
    hook: "Abu Dhabi's deep-water container and industrial gateway",
    holdNote:
      "Khalifa Port is container and project tonnage with dry bulk alongside, so the scope runs from cell guides and hold bilges on the box ships to full residue removal on the bulk callers. Terminal productivity targets mean the berth will not be extended, so the work is sequenced behind the discharge or finished on passage.",
    neighbours: ["zayed-port", "ruwais-port", "jebel-ali-port"],
  },
  {
    slug: "zayed-port",
    name: "Zayed Port",
    officialName: "Zayed Port, Abu Dhabi",
    aka: ["Mina Zayed", "Abu Dhabi", "Port Zayed"],
    unlocode: "AEAUH",
    state: "Abu Dhabi",
    country: "United Arab Emirates",
    countryCode: "AE",
    coast: "Arabian Gulf",
    weather: "arabian-gulf",
    waterBody: "Arabian Gulf",
    authority: "AD Ports Group and Abu Dhabi Maritime",
    type: "State Port",
    condition: "sheltered",
    waiting: "mixed",
    cargoes: [
      "Cruise and passenger",
      "General cargo",
      "Project cargo",
      "RoRo",
    ],
    vesselTypes: [
      "Cruise ships",
      "General cargo and project vessels",
      "RoRo vessels",
      "Harbour craft and workboats",
    ],
    airports: ["Abu Dhabi (AUH)"],
    workAreas: [
      "cruise terminal berths",
      "general cargo berths",
      "harbour moorings",
    ],
    conditions:
      "Zayed Port is a sheltered inner harbour, shallow and warm, working cruise and general cargo tonnage plus a resident harbour fleet. Conditions are benign for working but hard on hulls: still, hot, hypersaline water grows fouling quickly and the resident craft show it. Basin visibility is moderate to low.",
    profile:
      "Zayed Port is Abu Dhabi's cruise and general cargo harbour, working passenger tonnage on seasonal rotations alongside project and RoRo cargo. Cruise calls are short and fixed, so underwater work is scoped to fit the turnaround or planned for the off-season lay-up.",
    hook: "Abu Dhabi's cruise and general cargo harbour",
    holdNote:
      "Hold and space work at Zayed Port is cruise and project tonnage — stores spaces, void spaces, tank tops and RoRo decks rather than cargo residue. Cruise calls are short and fixed, so the scope is sized to the turnaround or held for the off-season lay-up.",
    neighbours: ["khalifa-port", "ruwais-port", "jebel-ali-port"],
  },
  {
    slug: "ruwais-port",
    name: "Ruwais",
    officialName: "Jabal Az Zannah / Ruwais, Abu Dhabi",
    aka: ["Jabal Az Zannah", "Ruways", "Al Ruwais"],
    unlocode: "AERUW",
    state: "Abu Dhabi",
    country: "United Arab Emirates",
    countryCode: "AE",
    coast: "Arabian Gulf",
    weather: "arabian-gulf",
    waterBody: "Arabian Gulf",
    authority: "AD Ports Group and the terminal operator",
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
      "Sulphur bulk carriers",
    ],
    airports: ["Abu Dhabi (AUH)", "Dubai (DXB)"],
    workAreas: ["crude loading berths", "product jetties", "sulphur berth"],
    conditions:
      "Ruwais is a refinery and petrochemical complex with dedicated loading berths, so it is sheltered and the working constraint is the terminal, not the weather. Access is controlled and the permit chain runs through the terminal operator as well as the port — for a gas or crude berth that is a lead time, not a formality. Gulf water here is shallow, warm and hypersaline with moderate visibility.",
    profile:
      "Ruwais is the UAE's largest refining and petrochemical export complex, loading crude, refined products, LPG and sulphur to dedicated berths. The tonnage is large and specialised, and the port calls are governed end to end by terminal windows.",
    hook: "the UAE's largest refining and petrochemical export complex",
    neighbours: ["khalifa-port", "zayed-port", "jebel-ali-port"],
    holdNote:
      "The hold scope at Ruwais is sulphur: an aggressive, acidic residue that attacks coatings and steel if it is left, and one that a following cargo will not tolerate. Washing and neutralising is a specification job, not a sweep, and it is normally worked on the passage out rather than at a loading berth.",
    tankNote:
      "Ruwais loads crude, product and petrochemical grades to strict specification, so tank cleaning here is driven by the next cargo and the terminal's acceptance criteria. Gas-freeing, marine chemist attendance and enclosed-space entry certification are arranged as part of the scope, and work at the berth needs the terminal's approval in advance.",
  },
];

const bySlug = new Map(uaePorts.map((port) => [port.slug, port]));

export function getUaePort(slug: string): Port | undefined {
  return bySlug.get(slug);
}

/** Ports grouped by emirate, largest group first. */
export function portsByEmirate() {
  const order: string[] = [];
  const groups = new Map<string, Port[]>();
  for (const port of uaePorts) {
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
