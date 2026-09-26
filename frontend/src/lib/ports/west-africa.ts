/**
 * West African port coverage.
 *
 * Cleanship holds a base at Conakry, and `serviceCoverage` has claimed a West
 * Africa hull-cleaning range since before the rebuild — but the port
 * programme had no pages for any of it. That was the gap the audit called out
 * as F9: eight advertised bases, location pages for two and a half markets.
 *
 * This coast is also where the competitive argument is strongest. Almost no
 * marine cleaning contractor publishes anything specific about working at
 * Conakry, Kpémé or San Pédro, so a page that names the authority and
 * describes the swell is competing against nothing.
 *
 * Ports are taken from the UN/LOCODE list in `Port Coverage.xlsx`, plus the
 * Benin, Ivorian and Gambian terminals added from checked sources (UN/LOCODE,
 * the port authorities, terminal data). Sierra Leone and Guinea-Bissau appear
 * in the service coverage claim in lib/site.ts but have no pages yet —
 * publishing a port page for a port we cannot name correctly would undo the
 * point of the exercise.
 */

import type { Port } from "./types";

export const westAfricaPorts: Port[] = [
  {
    slug: "conakry-port",
    name: "Conakry",
    officialName: "Port Autonome de Conakry",
    aka: ["Port de Conakry", "Guinea"],
    unlocode: "GNCKY",
    state: "Conakry",
    country: "Guinea",
    countryCode: "GN",
    coast: "Atlantic",
    weather: "west-africa",
    waterBody: "Atlantic Ocean",
    authority: "Port Autonome de Conakry",
    type: "State Port",
    condition: "anchorage",
    waiting: "long-wait",
    cargoes: [
      "Bauxite and alumina",
      "Iron ore",
      "Containers",
      "General cargo",
      "Rice and food aid",
      "Fuel",
    ],
    vesselTypes: [
      "Capesize and Panamax bulk carriers",
      "Feeder container ships",
      "General cargo ships",
      "Transhipment barges and tugs",
    ],
    airports: ["Conakry (CKY)"],
    workAreas: [
      "bauxite loading anchorage",
      "container and general cargo berths",
      "outer anchorage",
    ],
    conditions:
      "Conakry works a congested anchorage as much as a berth, and vessels routinely wait days for a slot — which is why so much in-water work here is done at anchor. The Atlantic swell running onto this coast is long-period ground swell rather than wind sea, so it reaches the anchorage on days that look calm from the bridge, and it is the main reason a booked window is lost. Water is warm year-round and visibility is moderate, dropping sharply around active bauxite transfer.",
    profile:
      "Conakry is Guinea's principal port and the outlet for the largest bauxite reserves in the world, working ore and alumina alongside containers, food aid and general cargo. Cleanship holds an operating base at the Sonoco Trade Center here, so this is the one West African port where people and equipment are on the ground rather than flown in.",
    hook: "the outlet for the world's largest bauxite reserves",
    neighbours: ["monrovia-port", "dakar-port", "abidjan-port"],
    base: true,
    holdNote:
      "Bauxite is the standing residue at Conakry and it is the difficult kind: fine, red and it stains, so it needs chemical treatment and rinsing rather than sweeping. Vessels loading here for a clean cargo elsewhere need the full sequence, and the anchorage wait is the time to do it — a ballast leg out of Guinea is long enough for a riding crew to finish what the anchorage started.",
  },
  {
    slug: "lome-port",
    name: "Lomé",
    officialName: "Port Autonome de Lomé",
    aka: ["Lome", "Port de Lomé", "Togo"],
    unlocode: "TGLFW",
    state: "Maritime Region",
    country: "Togo",
    countryCode: "TG",
    coast: "Gulf of Guinea",
    weather: "west-africa",
    waterBody: "Gulf of Guinea",
    authority: "Port Autonome de Lomé",
    type: "State Port",
    condition: "sheltered",
    waiting: "mixed",
    cargoes: [
      "Containers and transhipment",
      "Bunkers",
      "Clinker and cement",
      "General cargo",
      "Cotton and agricultural bulk",
    ],
    vesselTypes: [
      "Main-line and feeder container ships",
      "Bunker tankers and barges",
      "Handysize bulk carriers",
      "General cargo ships",
    ],
    airports: ["Lomé (LFW)"],
    workAreas: [
      "container terminal berths",
      "bunkering anchorage",
      "general cargo and bulk berths",
    ],
    conditions:
      "Lomé is the deepest natural harbour on the West African coast and it does not silt the way the lagoon and river ports along this shore do, so the working conditions here are the best in the region by a clear margin. Alongside work runs year-round. The bunkering anchorage off the port carries a standing population of tankers waiting for orders, which is where most of the in-water work actually happens — and where the Atlantic swell is the only real constraint.",
    profile:
      "Lomé is the transhipment and bunkering hub of West Africa, the region's only naturally deep-water port and the reason main-line container tonnage calls this coast at all. The standing anchorage population makes it the West African equivalent of Fujairah: idle tonnage, in warm water, for days at a time.",
    hook: "West Africa's only natural deep-water transhipment hub",
    neighbours: ["kpeme-port", "cotonou-port", "tema-port"],
    holdNote:
      "Lomé's hold work splits between clinker and agricultural bulk on the regional tonnage and cell guides, bilges and tank tops on the transhipment container ships. Clinker is the one that sets — a hold washed late after a cement cargo needs mechanical removal rather than a hose.",
    tankNote:
      "Lomé is a bunkering port, so most of the tank work here is fuel, slop and bunker tank cleaning on tankers and barges waiting at the anchorage rather than cargo grade changes. Slop reception is arranged through the port before the tanks are opened — capacity on this coast is limited and it is what sets the date.",
  },
  {
    slug: "kpeme-port",
    name: "Kpémé",
    officialName: "Kpémé Phosphate Terminal",
    aka: ["Kpeme", "Togo phosphate terminal"],
    unlocode: "TGKPE",
    state: "Maritime Region",
    country: "Togo",
    countryCode: "TG",
    coast: "Gulf of Guinea",
    weather: "west-africa",
    waterBody: "Gulf of Guinea",
    authority: "Société Nouvelle des Phosphates du Togo",
    type: "Private Port",
    condition: "anchorage",
    waiting: "long-wait",
    cargoes: ["Phosphate rock"],
    vesselTypes: [
      "Handysize and Supramax bulk carriers",
      "Support and mooring craft",
    ],
    airports: ["Lomé (LFW)"],
    workAreas: ["offshore loading jetty", "outer anchorage"],
    conditions:
      "Kpémé loads over an offshore jetty with no enclosed basin, so there is no shelter at all and the Atlantic swell decides whether work happens. Vessels lie exposed for the whole loading operation, which makes this one of the more demanding in-water working environments on the coverage list and one where the window has to be taken when it appears rather than booked. Water is warm and reasonably clear away from the loading point.",
    profile:
      "Kpémé is a single-commodity phosphate export terminal on the Togolese coast, loading rock over an offshore jetty for the fertiliser trade. Traffic is bulk carriers on repeat voyages, and the exposure means most attendances here are combined with a call at Lomé a short distance along the coast.",
    hook: "an exposed offshore phosphate jetty with no shelter",
    neighbours: ["lome-port", "cotonou-port", "tema-port"],
    holdNote:
      "Phosphate rock is dusty, mildly abrasive and — critically — it is a fertiliser feedstock, so anything following into a food-grade cargo needs the holds taken back to a grain-clean standard. That is not a job for the exposed loading window at Kpémé; it is a job for the passage out.",
  },
  {
    slug: "abidjan-port",
    name: "Abidjan",
    officialName: "Port Autonome d'Abidjan",
    aka: ["Port d'Abidjan", "Côte d'Ivoire"],
    unlocode: "CIABJ",
    state: "Abidjan",
    country: "Côte d'Ivoire",
    countryCode: "CI",
    coast: "Gulf of Guinea",
    weather: "west-africa",
    waterBody: "Ébrié Lagoon, via the Vridi Canal",
    authority: "Port Autonome d'Abidjan",
    type: "State Port",
    condition: "sheltered",
    waiting: "mixed",
    cargoes: [
      "Containers",
      "Cocoa and coffee",
      "Crude and refined products",
      "General cargo",
      "Fishing catch",
    ],
    vesselTypes: [
      "Container ships",
      "Product tankers",
      "General cargo and reefer vessels",
      "Fishing fleet and support craft",
    ],
    airports: ["Abidjan (ABJ)"],
    workAreas: [
      "container terminal berths",
      "oil and general cargo quays",
      "lagoon anchorage",
    ],
    conditions:
      "Abidjan sits inside the Ébrié Lagoon behind the Vridi Canal, so once a vessel is through the entrance she is in genuinely sheltered water — the Atlantic swell that governs the rest of this coast stops at the canal. The trade-off is lagoon water: warm, brackish, low visibility, and a fouling environment that is among the most aggressive in the region. Growth returns here faster than owners plan for.",
    profile:
      "Abidjan is the largest port in francophone West Africa and the region's main container, cocoa and refined product gateway, with a substantial fishing fleet in the same lagoon. The shelter makes it the practical base for in-water work along this stretch of coast.",
    hook: "sheltered lagoon water behind the Vridi Canal",
    neighbours: ["vridi-port", "lion-terminal-port", "san-pedro-port", "espoir-terminal-port"],
    holdNote:
      "Cocoa and coffee are food-grade cargoes with strict cleanliness and odour requirements, and Abidjan loads both in volume. A hold that carried a mineral or fertiliser cargo inbound and is fixed for cocoa outbound needs the full sequence and a dry, odour-free result — the lagoon humidity is what makes the drying stage the hard part.",
    tankNote:
      "Abidjan refines and exports product, so the tank work here is grade changes on product tankers plus bunker and slop cleaning. Licensed slop reception is limited on this coast, so it is booked before the tanks are opened rather than assumed.",
    scopeNotes: {
      "underwater-hull-cleaning": {
        note:
          "Abidjan is the one port on this coast where the hull problem is the water itself. Once a vessel is through the Vridi Canal she is lying in the Ébrié Lagoon — warm, brackish and rich in nutrients — and fouling grows back faster here than at the open-sea ports along the coast. A container ship on a regular Abidjan rotation is picking up growth on every call, so the clean is best treated as a recurring item timed to the rotation, not a one-off when the speed has already dropped.",
        faq: {
          q: "Why does the hull foul so quickly in Abidjan?",
          a: "Because the port is inside the Ébrié Lagoon. The water is warm, brackish and rich in nutrients, which is ideal for marine growth, and it is sheltered and still. Vessels that call Abidjan regularly pick up fouling on every call, so we suggest cleaning on a schedule tied to the rotation rather than waiting for a speed loss.",
        },
      },
      "propeller-polishing": {
        note:
          "The container, reefer and cocoa tonnage that works Abidjan leaves through the Vridi Canal onto long legs to Europe and Asia. A propeller that has sat for days in the lagoon comes out with a film and early growth on the blades, and that roughness is carried the whole way. Polishing inside the lagoon, while the vessel works cargo, puts a clean blade on for the departure — the inner basins are sheltered enough to take the finish properly.",
        faq: {
          q: "Can the propeller be polished while the vessel works cargo in Abidjan?",
          a: "Usually, yes. The berths are inside the sheltered lagoon, and propeller polishing can run alongside cargo operations once the shaft is immobilised and the terminal agrees. The vessel then leaves through the Vridi Canal with a freshly polished propeller.",
        },
      },
      "thruster-cleaning": {
        note:
          "Every vessel entering Abidjan comes through the Vridi Canal and then manoeuvres within the lagoon basins to reach her berth, and the lagoon is where thruster tunnels foul fastest: still, warm, brackish water inside a sheltered tunnel. Liner vessels berthing at the container terminals on a tight window depend on full thrust. A thruster clean at the berth, with the unit isolated, restores it before the next departure through the canal.",
        faq: {
          q: "Which vessels in Abidjan need thruster cleaning most often?",
          a: "Vessels that call regularly and spend time in the lagoon — container ships and reefers on fixed rotations, and the resident fishing and support fleet. The lagoon water fouls thruster tunnels quickly, so regular callers benefit from a clean every few calls rather than waiting until thrust is visibly down.",
        },
      },
      "in-water-survey": {
        note:
          "Lagoon water is the difficulty for survey work in Abidjan: brackish, full of suspended matter and low in visibility, especially in the rainy season when the rivers feeding the Ébrié Lagoon are running. A surveyor cannot pass what they cannot see, so a class survey here is planned with close-quarters lighting and agreed acceptance criteria in advance — or, where the vessel's schedule allows, done outside the canal at the anchorage, where the sea water is clearer.",
        faq: {
          q: "Is it better to do an in-water survey inside the Abidjan lagoon or outside at the anchorage?",
          a: "Outside, if the vessel's schedule allows. The anchorage beyond the Vridi Canal has clearer sea water than the lagoon, which gives the surveyor a better picture. Inside the lagoon, visibility is low — especially in the rainy season — so the lighting plan and acceptance criteria have to be agreed with class beforehand.",
        },
      },
      "uwild-inspection": {
        note:
          "Abidjan has ship repair facilities, so for a vessel trading here UWILD is a choice rather than the only way to avoid a long deviation. It makes most sense for the regular callers — liner vessels on a fixed schedule — where a dock slot means breaking the rotation. The inspection is best done at the anchorage outside the canal, in clearer water, and eligibility is checked with class first.",
        faq: {
          q: "Should we do UWILD in Abidjan or dock at a local yard?",
          a: "It depends on the vessel and the scope. If she is eligible and no repairs below the waterline are expected, UWILD keeps her on her rotation. If repairs are likely, a docking may be the better call. We check eligibility with class and give you an honest comparison before anything is booked.",
        },
      },
    },
  },
  {
    slug: "san-pedro-port",
    name: "San Pédro",
    officialName: "Port Autonome de San Pédro",
    aka: ["San Pedro", "Côte d'Ivoire"],
    unlocode: "CISPY",
    state: "Bas-Sassandra",
    country: "Côte d'Ivoire",
    countryCode: "CI",
    coast: "Gulf of Guinea",
    weather: "west-africa",
    waterBody: "Gulf of Guinea",
    authority: "Port Autonome de San Pédro",
    type: "State Port",
    condition: "sheltered",
    waiting: "mixed",
    cargoes: [
      "Cocoa",
      "Timber and logs",
      "Manganese ore",
      "Containers",
      "General cargo",
    ],
    vesselTypes: [
      "Handysize bulk carriers",
      "General cargo and reefer vessels",
      "Feeder container ships",
    ],
    airports: ["San Pédro (SPY)", "Abidjan (ABJ)"],
    workAreas: ["breakwater berths", "outer anchorage"],
    conditions:
      "San Pédro is a breakwater harbour with reasonable shelter inside and clearer Atlantic water than the lagoon ports, which makes documented inspection worth commissioning here. The swell still governs the outer anchorage. The port is quieter than Abidjan, so berth windows are less contested and a job that needs a full shift can usually have one.",
    profile:
      "San Pédro is the world's largest cocoa export port and Côte d'Ivoire's second harbour, working timber, manganese and containers alongside it. Traffic is smaller bulk and reefer tonnage on seasonal cocoa rotations.",
    hook: "the world's largest cocoa export port",
    neighbours: ["sassandra-port", "abidjan-port", "monrovia-port", "tema-port"],
    holdNote:
      "Cocoa is the whole story here. It is food-grade, it is odour-sensitive, and it will reject a hold that carried manganese or timber treatment residue without a full clean. San Pédro is where the difference between a swept hold and a grain-clean hold turns into a rejected fixture.",
    scopeNotes: {
      "underwater-hull-cleaning": {
        note:
          "San Pédro's trade moves with the cocoa season, and the reefer and bulk tonnage that comes for it often waits for cargo to be ready. That waiting, in warm Gulf of Guinea water, is when the hull fouls. The port sits behind a breakwater in open-sea water rather than a lagoon, so it is a good place to clean properly and film it well — and the quieter berths mean a full shift is usually available without fighting for time.",
        faq: {
          q: "When is the best time to clean a hull at San Pédro?",
          a: "While the vessel is waiting for cargo, which is common during the cocoa season. The water here is clearer than in the lagoon ports and the berths are less congested than Abidjan, so a full clean with a good video record can usually be done in one visit.",
        },
      },
      "propeller-polishing": {
        note:
          "Many of the vessels loading cocoa at San Pédro are reefers and general cargo ships heading on a long voyage to Europe, where their fuel bill is set by the condition they leave in. The clearer water behind the breakwater lets a diver work the blades to an even Class A finish and record it properly, so the owner gets both the fuel saving and the evidence for the performance file.",
        faq: {
          q: "Is San Pédro a good place for propeller polishing?",
          a: "Yes. The water behind the breakwater is clearer than at the lagoon ports, which helps the diver finish the blades evenly and film the result. For vessels leaving on a long voyage to Europe with cocoa, the polish pays for itself over that passage.",
        },
      },
      "thruster-cleaning": {
        note:
          "San Pédro's smaller reefer and general cargo tonnage calls on a seasonal pattern, and between seasons vessels can sit idle for long spells — the conditions in which a thruster tunnel fills up with growth without anyone noticing. The first berthing of the season is where it shows. Cleaning the tunnel, blades and gratings on arrival, while the vessel waits for cargo, restores the thrust before it is needed.",
        faq: {
          q: "Why check the thruster at the start of the cocoa season at San Pédro?",
          a: "Because vessels often sit idle between seasons, and that is when thruster tunnels foul most. A clean on arrival, while waiting for cargo, restores thrust before the busy berthing period begins.",
        },
      },
      "in-water-survey": {
        note:
          "San Pédro is one of the better survey ports on this coast. It is open-sea water behind a breakwater rather than lagoon or river water, so visibility is generally good enough for the wide shots and close detail a surveyor needs. The swell still governs the outer anchorage, so a survey is best done inside the breakwater when a berth or a quiet corner of the basin is available.",
        faq: {
          q: "How does San Pédro compare with Abidjan for an in-water survey?",
          a: "San Pédro usually has clearer water, because it is open sea behind a breakwater rather than a lagoon. That makes it a good choice for class survey work, done inside the breakwater where the swell does not reach.",
        },
      },
      "uwild-inspection": {
        note:
          "For a vessel on the San Pédro cocoa trade, the nearest ship repair yard is a voyage away along the coast, and a docking in the middle of the season costs cargo as well as time. UWILD lets an eligible vessel earn the survey credit during the wait for cargo instead. The clear water behind the breakwater helps produce a strong inspection record, and eligibility is checked with class before anything is booked.",
        faq: {
          q: "Can UWILD be done at San Pédro during the cocoa season?",
          a: "Yes, if the vessel is eligible — and doing it while she waits for cargo means no time is lost. We confirm eligibility with the class society first and plan the inspection inside the breakwater, where the water is clearer and calmer.",
        },
      },
    },
  },
  {
    slug: "monrovia-port",
    name: "Monrovia",
    officialName: "Freeport of Monrovia",
    aka: ["Freeport of Monrovia", "Liberia"],
    unlocode: "LRMLW",
    state: "Montserrado",
    country: "Liberia",
    countryCode: "LR",
    coast: "Atlantic",
    weather: "west-africa",
    waterBody: "Atlantic Ocean",
    authority: "National Port Authority of Liberia",
    type: "State Port",
    condition: "sheltered",
    waiting: "long-wait",
    cargoes: [
      "Iron ore",
      "Containers",
      "General cargo",
      "Fuel",
      "Rubber and latex",
    ],
    vesselTypes: [
      "Panamax and Handysize bulk carriers",
      "Feeder container ships",
      "General cargo ships",
      "Product tankers",
    ],
    airports: ["Monrovia (ROB)"],
    workAreas: ["breakwater berths", "ore terminal", "outer anchorage"],
    conditions:
      "Monrovia works behind a breakwater, so there is shelter alongside, but the approach and anchorage take the full Atlantic swell and the rainy season from May to October is heavy enough to stop deck work outright. Vessels wait for berths, and that waiting time at anchor in warm water is where the fouling load builds. Visibility is moderate and drops around ore handling.",
    profile:
      "The Freeport of Monrovia is Liberia's principal port, working iron ore exports alongside containers, fuel and general cargo. It is a port where waiting is normal and where the in-water job found on arrival is usually heavier than the trading pattern would predict.",
    hook: "long anchorage waits on the Liberian ore run",
    neighbours: ["conakry-port", "abidjan-port", "dakar-port"],
    holdNote:
      "Iron ore fines are the standing residue and they stain — chemical treatment and rinsing, not sweeping. The rains are the complication: between May and October a washed hold will not dry on its own, so ventilation and timing matter more here than the washing itself.",
  },
  {
    slug: "dakar-port",
    name: "Dakar",
    officialName: "Port Autonome de Dakar",
    aka: ["Port de Dakar", "Senegal"],
    unlocode: "SNDKR",
    state: "Dakar",
    country: "Senegal",
    countryCode: "SN",
    coast: "Atlantic",
    weather: "west-africa",
    waterBody: "Atlantic Ocean",
    authority: "Port Autonome de Dakar",
    type: "State Port",
    condition: "sheltered",
    waiting: "mixed",
    cargoes: [
      "Containers",
      "Phosphate",
      "Groundnuts and agricultural bulk",
      "Fuel and bunkers",
      "Fishing catch",
      "General cargo",
    ],
    vesselTypes: [
      "Container ships",
      "Handysize bulk carriers",
      "Product tankers and bunker barges",
      "Fishing fleet and reefer vessels",
    ],
    airports: ["Dakar (DSS)"],
    workAreas: [
      "container and general cargo berths",
      "bunkering anchorage",
      "fishing port quays",
    ],
    conditions:
      "Dakar sits on the sheltered side of the Cap-Vert peninsula, which puts it out of the worst of the Atlantic swell and makes it the most reliably workable port on this stretch of coast. Water is cooler here than in the Gulf of Guinea because of the Canary Current, so fouling is slower than at Conakry or Abidjan — an unusual thing to be able to say in West Africa. Bunkering traffic gives a steady anchorage population.",
    profile:
      "Dakar is West Africa's northern gateway and a major bunkering and fishing port, working containers, phosphate and agricultural bulk for Senegal and the landlocked Sahel. Its shelter and its position on the Europe–South America routes make it a natural call for in-water work on this coast.",
    hook: "cooler Canary Current water and reliable shelter",
    neighbours: ["banjul-port", "conakry-port", "monrovia-port", "abidjan-port"],
    holdNote:
      "Groundnuts and agricultural bulk out of Dakar are food-grade fixtures, and phosphate inbound is exactly the residue they will not tolerate. That inbound-outbound pairing is the standing hold cleaning brief here.",
    tankNote:
      "Dakar's tank work is bunker and slop cleaning on the tankers and barges serving the bunkering trade, plus product grade changes on the regional coastal fleet. Reception capacity is better here than further south, which makes it a practical place to schedule a sludge job.",
  },
  {
    slug: "takoradi-port",
    name: "Takoradi",
    officialName: "Port of Takoradi",
    aka: ["Sekondi-Takoradi", "Ghana"],
    unlocode: "GHTKD",
    state: "Western Region",
    country: "Ghana",
    countryCode: "GH",
    coast: "Gulf of Guinea",
    weather: "west-africa",
    waterBody: "Gulf of Guinea",
    authority: "Ghana Ports and Harbours Authority",
    type: "State Port",
    condition: "sheltered",
    waiting: "mixed",
    cargoes: [
      "Manganese ore",
      "Bauxite",
      "Cocoa",
      "Timber",
      "Oil and gas project cargo",
      "Containers",
    ],
    vesselTypes: [
      "Handysize and Supramax bulk carriers",
      "Offshore support vessels",
      "General cargo and reefer vessels",
      "Feeder container ships",
    ],
    airports: ["Takoradi (TKD)", "Accra (ACC)"],
    workAreas: [
      "breakwater berths",
      "bulk loading quays",
      "offshore support base",
      "anchorage",
    ],
    conditions:
      "Takoradi is a breakwater harbour with good shelter and it is the shore base for Ghana's offshore oil industry, so there is a resident support fleet here as well as transiting bulk tonnage. That resident fleet is the regular in-water customer: OSVs between charters sit in warm water and foul heavily. Atlantic swell governs the anchorage; the basin itself works year-round.",
    profile:
      "Takoradi is Ghana's bulk and energy port, exporting manganese, bauxite and cocoa and serving the Jubilee and TEN offshore fields. The mix of export bulk carriers and a resident offshore fleet gives it two quite different in-water workloads in the same harbour.",
    hook: "Ghana's offshore support base and bulk export port",
    neighbours: ["tema-port", "abidjan-port", "san-pedro-port"],
    holdNote:
      "Manganese and bauxite fines are the standing residues and both stain. The complication at Takoradi is the cocoa trade in the same port: a vessel discharging ore and fixing for cocoa needs the full sequence and a dry, odour-free hold, and the rains make the drying stage the constraint.",
    tankNote:
      "Tank work at Takoradi is mostly the offshore fleet — mud, brine, base oil and bulk tanks turned round between charters — alongside bunker and slop cleaning. Product grade changes are the smaller share.",
  },
  {
    slug: "tema-port",
    name: "Tema",
    officialName: "Port of Tema",
    aka: ["Tema Harbour", "Accra", "Ghana"],
    unlocode: "GHTEM",
    state: "Greater Accra",
    country: "Ghana",
    countryCode: "GH",
    coast: "Gulf of Guinea",
    weather: "west-africa",
    waterBody: "Gulf of Guinea",
    authority: "Ghana Ports and Harbours Authority",
    type: "State Port",
    condition: "sheltered",
    waiting: "berth-driven",
    cargoes: [
      "Containers",
      "Clinker and cement",
      "Grain and agricultural bulk",
      "Crude and refined products",
      "General cargo",
      "Fishing catch",
    ],
    vesselTypes: [
      "Main-line and feeder container ships",
      "Handysize bulk carriers",
      "Product tankers",
      "Fishing fleet and reefer vessels",
    ],
    airports: ["Accra (ACC)"],
    workAreas: [
      "container terminal berths",
      "bulk and general cargo quays",
      "oil berth",
      "anchorage",
    ],
    conditions:
      "Tema is a large artificial harbour serving Accra, well sheltered and with a modern container terminal that runs to tight productivity targets — the berth will not be held for anything. Work here is either sequenced behind cargo operations or taken at the anchorage. The harbour water is warm and turbid with moderate to low visibility, and fouling returns quickly.",
    profile:
      "Tema is Ghana's principal container port and the gateway for Accra and the interior, working clinker, grain and refined products alongside the box traffic. Liner tonnage on fixed rotations makes it a port where in-water work is a planned maintenance item.",
    hook: "Ghana's main container gateway on a tight berth clock",
    neighbours: ["takoradi-port", "lome-port", "cotonou-port"],
    holdNote:
      "Tema discharges clinker and loads grain, which is the sequence that fails inspections: cement residue sets hard and a grain surveyor will not pass a hold carrying it. The berth clock means the honest plan is usually to start alongside and finish with a riding crew on the passage.",
    tankNote:
      "Refined product parcels move through Tema for the Ghanaian market, so tank work is grade changes plus bunker and slop cleaning. Terminal permission governs whether it can run alongside, and it usually cannot.",
  },
  {
    slug: "cotonou-port",
    name: "Cotonou",
    officialName: "Port Autonome de Cotonou",
    aka: ["Port de Cotonou", "Benin"],
    unlocode: "BJCOO",
    state: "Littoral",
    country: "Benin",
    countryCode: "BJ",
    coast: "Gulf of Guinea",
    weather: "west-africa",
    waterBody: "Gulf of Guinea",
    authority: "Port Autonome de Cotonou",
    type: "State Port",
    condition: "sheltered",
    waiting: "long-wait",
    cargoes: [
      "Containers",
      "Cotton",
      "Grain and agricultural bulk",
      "General cargo",
      "Vehicles and RoRo",
      "Fuel",
    ],
    vesselTypes: [
      "Feeder container ships",
      "RoRo and vehicle carriers",
      "Handysize bulk carriers",
      "General cargo ships",
    ],
    airports: ["Cotonou (COO)"],
    workAreas: [
      "container and general cargo berths",
      "RoRo berth",
      "outer anchorage",
    ],
    conditions:
      "Cotonou is a breakwater harbour that handles a large share of the transit trade into Niger and Burkina Faso, which means congestion and long anchorage waits are routine rather than exceptional. That wait is the in-water opportunity. The Atlantic swell reaches the anchorage and the rains from May to October are heavy; the basin itself stays workable.",
    profile:
      "Cotonou is Benin's only deep-water port and the transit gateway for the landlocked Sahel, working containers, cotton, vehicles and agricultural bulk. Congestion is its defining operational feature and the reason so much tonnage sits here long enough to need a hull clean.",
    hook: "the transit gateway to the Sahel, and the queue that comes with it",
    neighbours: ["seme-port", "lome-port", "kpeme-port", "tema-port"],
    holdNote:
      "Cotonou loads cotton and agricultural bulk and discharges general cargo and fertiliser, so the standing brief is preparing holds for a food-grade or fibre cargo after a dirty inbound. Cotton in particular will reject a hold on odour and residue alone.",
    scopeNotes: {
      "underwater-hull-cleaning": {
        note:
          "The Cotonou queue decides what a diver finds. A vessel that has swung at the outer anchorage for a week in water close to 28°C arrives at the berth with the soft slime and weed stage already giving way to the first hard shell, and every further day moves the job from a brush-cart clean towards a slower hand clean. So the hull is best done while she is still waiting — the anchorage wait is otherwise dead time, and it means she leaves the berth clean rather than carrying the queue's growth onto her next leg. Vehicle carriers are the other Cotonou-specific case: their tall, flat sides are exactly where a cart works fastest, so a car carrier's hull is often a shorter job here than her size suggests.",
        faq: {
          q: "Is it better to clean the hull at the Cotonou anchorage or once the vessel is alongside?",
          a: "Usually at the anchorage. Congestion means most vessels wait there anyway, the berth time is governed by cargo operations and the terminal, and cleaning before berthing means the growth picked up during the wait does not sail with the vessel. Alongside work is possible where the terminal allows it, but at Cotonou the anchorage wait is the more reliable window.",
        },
      },
      "propeller-polishing": {
        note:
          "Most of the tonnage at Cotonou is feeder and regional liner tonnage on fixed West African rotations, calling here every few weeks and spending a large share of each call at anchor. A propeller that stands still for days in warm water collects a slime film and early calcareous growth on the blade faces, and the roughness it leaves costs fuel on every sea passage until it is removed. Because these vessels come back on a schedule, polishing at Cotonou works best as a planned item on alternate calls — tied to the performance data — rather than a reaction once the fuel curve has already drifted.",
        faq: {
          q: "How often should a feeder on the Cotonou rotation have the propeller polished?",
          a: "It depends on the rotation and the time spent idle, so we set it from the vessel's performance monitoring rather than a fixed calendar. As a starting point, a vessel that routinely waits several days at the Cotonou anchorage should have the propeller checked on every call and polished whenever the blade roughness has come back — often every second or third call.",
        },
      },
      "thruster-cleaning": {
        note:
          "Cotonou handles a steady flow of vehicle carriers and RoRo tonnage for the transit trade, and those ships berth on their thrusters: a car carrier bringing her stern ramp onto the RoRo berth leans on the bow thruster far harder than a bulk carrier ever does. A tunnel that has fouled through a long anchorage wait costs exactly that thrust, at exactly that moment. Cleaning the tunnel, blades and gratings while she is still waiting for her berthing slot means the thrust is back before it is needed, instead of being discovered missing with the pilot on board.",
        faq: {
          q: "Can the bow thruster be cleaned before our RoRo berthing slot at Cotonou?",
          a: "Yes — that is the usual plan. The thruster is isolated and tagged out with the master, the divers clean the tunnel, blades and gratings at the anchorage, and it is handed back in time for the berthing. Give us the slot time and we work back from it.",
        },
      },
      "in-water-survey": {
        note:
          "Survey work at Cotonou has a season. The lagoon channel that joins Lake Nokoué to the sea opens onto the coast right beside the harbour, and when the Ouémé river floods — typically peaking around September and October — that outflow carries fresh water and sediment past the port entrance. The basin is sheltered, but visibility in the weeks after the flood is at its worst of the year. Where a survey date has any flexibility, the dry season from roughly November to March gives the surveyor a far better picture; where it does not, the lighting and camera plan is agreed with class before the attendance is booked.",
        faq: {
          q: "When is the best time of year for an in-water class survey at Cotonou?",
          a: "The dry season, roughly November to March, when visibility in the harbour is at its best. The weeks after the Ouémé flood — usually around September and October — are the hardest, because the lagoon outflow beside the port entrance brings sediment into the approaches. If the survey is due then, we agree close-quarters lighting and the acceptance criteria with the surveyor in advance.",
        },
      },
      "uwild-inspection": {
        note:
          "There is no dry dock in Benin, and the nearest docking yards on this coast are days away in another country with their own queue. For a vessel trading the Gulf of Guinea, a drydocking survey therefore means a deviation, a yard slot and the off-hire that comes with both. That is what makes UWILD worth checking at Cotonou: the long anchorage wait here is already paid-for time with the vessel stationary, and an eligible vessel can earn the survey credit during it instead of steaming away to find a dock.",
        faq: {
          q: "Is there a dry dock near Cotonou?",
          a: "Not in Benin. A drydocking survey means a deviation to a yard elsewhere on the coast, plus that yard's queue. For eligible vessels, UWILD at Cotonou — done during the anchorage wait — earns the survey credit without the deviation. We check eligibility with the class society before anything is booked.",
        },
      },
    },
  },
  {
    slug: "seme-port",
    name: "Sèmè",
    label: "Sèmè Terminal",
    officialName: "Sèmè Terminal (Niger–Benin pipeline export terminal)",
    aka: ["Seme", "Seme Terminal", "Sèmè-Podji", "Benin"],
    unlocode: "BJSEM",
    state: "Ouémé",
    country: "Benin",
    countryCode: "BJ",
    coast: "Gulf of Guinea",
    weather: "west-africa",
    waterBody: "Bight of Benin, Gulf of Guinea",
    authority: "WAPCO, the terminal operator",
    type: "Private Port",
    condition: "anchorage",
    waiting: "mixed",
    cargoes: ["Crude oil"],
    vesselTypes: [
      "Crude oil tankers",
      "Mooring and terminal support vessels",
      "Offshore supply and crew boats",
    ],
    airports: ["Cotonou (COO)"],
    workAreas: [
      "tanker waiting area off the terminal",
      "sea area outside the SPM safety zone",
    ],
    conditions:
      "Sèmè has no harbour at all. Tankers load offshore at a single point mooring, so every vessel here lies in open Gulf of Guinea water with nothing between her and the long-period Atlantic swell that runs onto this coast. That swell, not visibility, decides whether a dive goes ahead. The water itself is warm and — away from the lagoon outflows further west at Cotonou — clearer than the harbour ports, which helps inspection work on the days the sea allows it. No work is ever done at the buoy or while a tanker is connected.",
    profile:
      "Sèmè Terminal is the export end of the Niger–Benin crude pipeline, operated by WAPCO, a CNPC subsidiary. Crude from Niger's Agadem fields arrives by pipeline and is loaded onto tankers at an offshore single point mooring; the first cargo loaded in May 2024. It is a single-purpose oil terminal rather than a port, served from Cotonou a short way along the coast.",
    hook: "the offshore crude buoy at the end of the Niger–Benin pipeline",
    neighbours: ["cotonou-port", "lome-port", "kpeme-port"],
    visibility:
      "good for this coast — open sea water, away from the lagoon outflows at Cotonou — so the limit here is the swell rather than what a diver can see",
    hullFinding:
      "Tankers coming to Sèmè have usually crossed from their last discharge in ballast and may then wait offshore for their loading slot, and it is that waiting in warm Gulf of Guinea water that adds growth fastest. A clean done before loading removes it before the laden voyage, where it would cost the most.",
    hullWindow:
      "No — nothing is done while a tanker is connected to the buoy and loading. Hull work is done in the waiting area off the terminal before she is called in, or after she is released, which at Sèmè is usually time she is spending waiting anyway.",
    /* A crude terminal, so the derived lines would include tank cleaning. The
       programme here is hull work only until tank work at the terminal is
       something we can describe properly. */
    hullMethod:
      "The buoy itself is off limits, so hull work is done with the tanker in the waiting area off the terminal, before she is called to the SPM or after she is released; the dive plan is built around the loading schedule and the swell.",
    lineOverrides: { "tank-cleaning": false, "hold-cleaning": false },
    scopeNotes: {
      "underwater-hull-cleaning": {
        note:
          "A crude tanker comes to Sèmè in ballast to load, and that is the useful fact for hull work. Sitting light, she has less hull underwater than she will for the whole laden voyage that follows, so the wetted area to clean is smaller and the job shorter — and she then takes a clean bottom into the leg where drag costs the most fuel. The clean is done in the waiting area before she is called to the buoy, never inside the terminal's safety zone and never while she is connected. With no harbour craft at Sèmè itself, the dive support boat runs out from Cotonou.",
        faq: {
          q: "Can the hull be cleaned while the tanker is on the Sèmè buoy?",
          a: "No. Nothing is done at the single point mooring or while the vessel is connected and loading. The clean is done in the waiting area off the terminal before she is called in, or after she has been released, and it is agreed with WAPCO and the master beforehand.",
        },
      },
      "propeller-polishing": {
        note:
          "The voyage out of Sèmè is the one that matters for propeller condition: a fully laden crude tanker on a long passage to her discharge port, where every point of propeller efficiency is paid for in fuel for weeks. Polishing in the waiting area before she loads puts the smoothest possible blade on for exactly that leg. The window is set by the loading schedule rather than by a berth, so we plan against the terminal's nomination and the swell forecast together, and polish the moment both line up.",
        faq: {
          q: "When should the propeller be polished on a tanker loading at Sèmè?",
          a: "Before loading, while she waits to be called to the buoy — so the freshly polished propeller is working for the whole laden voyage out, which is where it saves the most fuel. We plan it against the loading nomination and the swell forecast, and it is never done while the vessel is connected.",
        },
      },
      "thruster-cleaning": {
        note:
          "Many large crude tankers that load at Sèmè are not fitted with a bow thruster at all — they are brought onto the buoy with the help of the terminal's support craft. So thruster cleaning here is mostly for the vessels that keep the terminal running: the mooring and support boats that work the buoy day after day, and the smaller tankers that do carry a thruster. The support craft in particular sit in warm water between jobs and depend on their thrusters for close-quarters work at the buoy, which is where a fouled tunnel shows first.",
        faq: {
          q: "Do tankers loading at Sèmè need thruster cleaning?",
          a: "Only if they are fitted with one, and many large crude tankers are not — they are assisted onto the buoy by the terminal's support vessels. Thruster cleaning at Sèmè is mainly for those support and mooring craft, and for the smaller tankers that do have a thruster.",
        },
      },
      "in-water-survey": {
        note:
          "Sèmè's water is clearer than the harbour ports to the west because it is open sea rather than a basin fed by a lagoon, and on a calm day that gives a surveyor a good picture. The difficulty is the other way round from Cotonou: not what the camera can see, but whether the swell lets a diver hold position alongside the hull for the length of a survey. Survey dates here are therefore planned with standby built in, and the survey is fitted into the wait for the loading slot so the vessel loses no time to it.",
        faq: {
          q: "Can a class survey be done while the tanker waits for her Sèmè loading slot?",
          a: "Yes, and that is the best time for it — the vessel is waiting anyway. The survey programme is agreed with the class society in advance, and because Sèmè is an open-sea location we build standby into the plan for the swell rather than committing to a single date.",
        },
      },
      "uwild-inspection": {
        note:
          "Most of the tonnage at Sèmè is crude tankers, and UWILD for tankers is narrower than for most other ship types: under the enhanced survey programme, older tankers face tighter conditions on which surveys can be done in the water. That is why a UWILD enquiry for a vessel loading at Sèmè starts with her age, class and survey history before anything is booked. Where she is eligible, the payoff is large — there is no dry dock anywhere near this terminal, and a docking would mean steaming away from the loading programme to find one.",
        faq: {
          q: "Is UWILD possible for a crude tanker at Sèmè?",
          a: "It can be, but eligibility for tankers — especially older ones under the enhanced survey programme — is narrower than for other vessels. We check the vessel's age, class notation and survey history with the class society first. If she qualifies, the inspection is done in the waiting area off the terminal, outside the safety zone, and never while she is connected.",
        },
      },
    },
  },
  {
    slug: "vridi-port",
    name: "Vridi",
    label: "Vridi Oil Terminals",
    officialName: "Vridi–Port-Bouët oil terminals, Port of Abidjan",
    aka: ["Vridi", "Port-Bouët", "Port Bouet", "Vridi Canal", "Abidjan oil terminal"],
    unlocode: "CIPBT",
    state: "Abidjan",
    country: "Côte d'Ivoire",
    countryCode: "CI",
    coast: "Gulf of Guinea",
    weather: "west-africa",
    waterBody: "Vridi Canal and the Ébrié Lagoon",
    authority: "Port Autonome d'Abidjan",
    type: "State Port",
    condition: "sheltered",
    waiting: "mixed",
    cargoes: ["Crude oil and refined products", "Bitumen", "LPG"],
    vesselTypes: ["Product tankers", "Bitumen tankers", "LPG carriers", "Bunker barges"],
    airports: ["Abidjan (ABJ)"],
    workAreas: ["oil berths along the Vridi Canal", "Petroci and SIAP tanker berths", "anchorage off the canal entrance"],
    conditions:
      "The Vridi Canal is a straight cut 2.7 kilometres long, 370 metres wide and about 13.5 metres deep, opened in 1950 to join the sea to the Ébrié Lagoon, and the oil terminals line its banks. That puts the tanker berths in a narrow, busy channel with a current running through it as the lagoon exchanges water with the sea, rather than in a quiet basin. In-water work at these berths is therefore timed around the current and the canal traffic, and always agreed with the terminal, because every one of them is a hazardous-cargo berth.",
    profile:
      "Vridi, in the commune of Port-Bouët, is where Abidjan handles oil. Five oil terminals line the Vridi Canal — including the Petroci and SIAP tanker berths — alongside the SIR refinery and the Abidjan–Vridi Petroleum Terminal, a GESTOCI depot commissioned in 1983 with 324,400 cubic metres of storage and one of the largest in West Africa. The traffic is product, bitumen and LPG tankers supplying Côte d'Ivoire and its landlocked neighbours.",
    hook:
      "Abidjan's oil terminals along the Vridi Canal",
    neighbours: ["lion-terminal-port", "abidjan-port", "espoir-terminal-port"],
    visibility:
      "low to moderate — the canal carries lagoon water out to sea and sea water in, and the brackish, sediment-laden lagoon side is much cloudier than the open sea outside",
    hullWindow:
      "Only with the terminal's agreement, because every berth on the Vridi Canal is a hazardous-cargo berth. Where the terminal permits it, work is done alongside at slack water in the canal; where it does not, the vessel is cleaned at the anchorage off the canal entrance before or after her berth.",
    lineOverrides: { "hold-cleaning": false, "tank-cleaning": false },
    scopeNotes: {
      "underwater-hull-cleaning": {
        note:
          "The tankers at Vridi lie in a canal, not a basin, and the current through the Vridi Canal changes as the lagoon exchanges water with the sea. That current — not the swell — is what governs a hull clean here. The dive is timed to the slack water, and the terminal's safety rules come first, because these are hazardous-cargo berths where no in-water work happens without the terminal's written permission.",
        faq: {
          q: "Can a tanker's hull be cleaned at a Vridi oil berth?",
          a: "Only with the terminal's written permission, and only at slack water, because the canal has a current and every berth handles hazardous cargo. Where the terminal will not permit it, we clean at the anchorage off the Vridi Canal entrance before or after the vessel's berth.",
        },
      },
      "propeller-polishing": {
        note:
          "Product and bitumen tankers supplying Abidjan and the inland markets run short regional voyages and return often, which means their propellers spend a lot of time idle at the berth or waiting off the canal. Polishing at Vridi is usually done at the anchorage outside the canal, where there is no current, clear sea water and no hazardous-cargo restrictions — so the blades are finished properly before the next loaded passage.",
        faq: {
          q: "Where is propeller polishing done for tankers calling at Vridi?",
          a: "Usually at the anchorage off the Vridi Canal entrance, where there is no canal current, the water is clearer and there are no berth restrictions. It can be done alongside only if the terminal agrees and the current allows.",
        },
      },
      "thruster-cleaning": {
        note:
          "Berthing a tanker in the Vridi Canal means manoeuvring in a narrow channel with a current and passing traffic, and the thruster is doing real work the whole time. A tunnel fouled by the brackish lagoon water that flows through the canal gives less thrust exactly when it matters. The thruster is cleaned at the anchorage or, with the terminal's permission, at slack water alongside, and isolated with the master first.",
        faq: {
          q: "Why is thruster condition important for tankers berthing in the Vridi Canal?",
          a: "Because the canal is narrow, has a current and carries passing traffic, so the thruster is working hard during every berthing. A fouled tunnel gives less thrust when it is needed most. We clean it at the anchorage, or alongside at slack water where the terminal allows.",
        },
      },
      "in-water-survey": {
        note:
          "Survey work at the Vridi berths faces two limits at once: the cloudy lagoon water that flows through the canal, and the hazardous-cargo rules at every terminal. For a class survey, the anchorage outside the canal is usually the better place — clearer sea water and no terminal restrictions. Where it has to be done alongside, the lighting plan and the terminal's approval are both agreed before the surveyor attends.",
        faq: {
          q: "Can an in-water class survey be done alongside at Vridi?",
          a: "It can, with the terminal's approval and a close-quarters lighting plan agreed with the surveyor, because the canal water is cloudy. In most cases the anchorage outside the canal is the better choice: clearer water and no hazardous-cargo restrictions.",
        },
      },
      "uwild-inspection": {
        note:
          "The tankers serving Vridi are the fuel supply for Côte d'Ivoire and its landlocked neighbours, and taking one out of service for a docking leaves a gap in that supply. UWILD lets an eligible tanker earn the survey credit without leaving the trade. Tanker eligibility is narrower than for most ships, especially for older vessels, so it is checked with class first; the inspection itself is done at the anchorage outside the canal.",
        faq: {
          q: "Is UWILD possible for a product tanker trading to Vridi?",
          a: "It can be, but tanker eligibility is narrower than for other ships, especially older ones, so we check it with the class society first. If she qualifies, the inspection is done at the anchorage off the Vridi Canal, where the water is clearer and there are no berth restrictions.",
        },
      },
    },
  },
  {
    slug: "lion-terminal-port",
    name: "Lion",
    label: "Lion Terminal",
    officialName: "Lion Terminal (single point mooring off Port-Bouët)",
    aka: ["Lion SPM", "Port-Bouët SPM", "Abidjan crude terminal"],
    state: "Abidjan",
    country: "Côte d'Ivoire",
    countryCode: "CI",
    coast: "Gulf of Guinea",
    weather: "west-africa",
    waterBody: "Gulf of Guinea, off Port-Bouët",
    authority: "Port Autonome d'Abidjan",
    type: "Private Port",
    condition: "anchorage",
    waiting: "mixed",
    cargoes: ["Crude oil"],
    vesselTypes: ["Crude tankers of 80,000 to 250,000 dwt", "Mooring and support craft"],
    airports: ["Abidjan (ABJ)"],
    workAreas: ["temporary anchorage off the Vridi Canal entrance", "sea area outside the SPM safety zone"],
    conditions:
      "Lion Terminal is a single point mooring in open sea about 1.2 nautical miles off the Port-Bouët lighthouse, so there is no shelter at all: a tanker on the buoy, or waiting for it, takes the full Atlantic swell running onto this coast. Mooring is in daylight only, and pilots board at a temporary anchorage a few miles off the Vridi Canal entrance. No in-water work is done at the buoy or while a tanker is connected; it happens at that anchorage, before or after.",
    profile:
      "Lion Terminal is the crude oil discharge buoy off Port-Bouët, just outside the Vridi Canal, where tankers of 80,000 to 250,000 deadweight tonnes — up to a 21-metre draft — discharge crude for the refinery and storage complex at Vridi. It is one of the few places on this coast that takes very large crude carriers, and it is too deep and too exposed for anything but a buoy.",
    hook:
      "the crude discharge buoy off Port-Bouët",
    neighbours: ["vridi-port", "abidjan-port", "espoir-terminal-port"],
    visibility:
      "good by the standards of this coast — it is open sea water, clearer than the lagoon inside the Vridi Canal — so the swell rather than visibility decides when a diver can work",
    hullFinding:
      "The large crude tankers that discharge at Lion Terminal often wait at the anchorage for their daylight mooring slot, and waiting in warm Gulf of Guinea water is what adds growth fastest. Because they arrive laden and leave light, the hull they present at the anchorage before discharge is at its deepest — the full wetted area is underwater.",
    hullWindow:
      "No — nothing is done while a tanker is connected to the buoy. Hull work is done at the temporary anchorage off the Vridi Canal entrance, typically while she waits for her daylight mooring slot, or after she is released.",
    hullMethod:
      "The buoy itself is off limits, so hull work is done with the tanker at the temporary anchorage off the Vridi Canal entrance, before she is moored or after she is released; the dive plan is built around the daylight mooring schedule and the swell.",
    lineOverrides: { "hold-cleaning": false, "tank-cleaning": false },
    scopeNotes: {
      "underwater-hull-cleaning": {
        note:
          "A crude tanker coming to Lion Terminal arrives laden, so the whole of her flat bottom is deep underwater — the largest wetted area she will present all voyage. Moorings are made in daylight only, so tankers routinely wait at the anchorage off the Vridi Canal for their slot, and that wait is the window for a clean. It is done there, well outside the buoy's safety zone, and she then discharges and sails light.",
        faq: {
          q: "When can a tanker's hull be cleaned at Lion Terminal?",
          a: "While she waits at the anchorage for her daylight mooring slot, or after she has been released from the buoy. Nothing is done at the SPM or while she is connected. The anchorage wait is the usual window.",
        },
      },
      "propeller-polishing": {
        note:
          "After discharging at Lion Terminal a crude tanker sails light, often on a long ballast voyage back to her loading area. A propeller polished at the anchorage off Port-Bouët — before she moors, or after she leaves the buoy — works for that whole passage. With the anchorage in open swell, the polish is fitted to a calm spell and planned alongside the terminal's mooring schedule.",
        faq: {
          q: "Is it worth polishing the propeller of a VLCC or Suezmax at Lion Terminal?",
          a: "Yes, especially before a long ballast voyage. The polish is done at the anchorage off the Vridi Canal, before mooring or after release, in a calm spell. We plan it around the terminal's daylight mooring schedule so it costs no extra time.",
        },
      },
      "thruster-cleaning": {
        note:
          "Most very large crude carriers calling at Lion Terminal have no bow thruster — they are brought onto the buoy with the help of tugs and mooring craft. So thruster cleaning here is mostly for the smaller tankers that do carry one, and for the support and mooring craft that work the buoy. Those boats spend their time in warm water between jobs and depend on their thrusters when handling hoses and hawsers at the SPM.",
        faq: {
          q: "Do the large tankers at Lion Terminal need thruster cleaning?",
          a: "Many very large crude carriers have no bow thruster, so usually not. Thruster cleaning at Lion Terminal is mainly for the smaller tankers that are fitted with one and for the support and mooring craft that work the buoy.",
        },
      },
      "in-water-survey": {
        note:
          "Open sea water gives Lion Terminal better visibility than the lagoon ports, but the anchorage is fully exposed to the Atlantic swell, and a surveyor needs the diver to hold steady on the hull for the length of a survey. Surveys here are planned with standby time built in, fitted to the wait for the daylight mooring slot, and agreed with class beforehand.",
        faq: {
          q: "Can a class survey be done while a tanker waits for Lion Terminal?",
          a: "Yes — the wait for the daylight mooring slot is a good time for it. The anchorage has clear sea water but is exposed to swell, so we plan the survey with standby time and agree the programme with the class society in advance.",
        },
      },
      "uwild-inspection": {
        note:
          "The tankers that discharge at Lion Terminal are large crude carriers, and UWILD rules for tankers — particularly older ones under the enhanced survey programme — are narrower than for most ships. So a UWILD enquiry here starts with the vessel's age, class and survey history. Where she is eligible, the inspection can be done at the anchorage off Port-Bouët during the wait for the mooring slot, saving a long deviation to a dock that could take a ship of her size.",
        faq: {
          q: "Is UWILD possible for a large crude tanker at Lion Terminal?",
          a: "It can be, if she is eligible — and for large and older tankers eligibility needs careful checking with class. If she qualifies, the inspection is done at the anchorage off Port-Bouët during the wait for the mooring slot, never while she is connected to the buoy.",
        },
      },
    },
  },
  {
    slug: "espoir-terminal-port",
    name: "Espoir",
    label: "Espoir Marine Terminal",
    officialName: "Espoir Marine Terminal (FPSO Espoir Ivoirien)",
    aka: ["Espoir", "Espoir field", "FPSO Espoir Ivoirien", "Block CI-26"],
    unlocode: "CIESP",
    state: "Block CI-26",
    country: "Côte d'Ivoire",
    countryCode: "CI",
    coast: "Gulf of Guinea",
    weather: "west-africa",
    waterBody: "Gulf of Guinea",
    authority: "CNR International",
    type: "Private Port",
    condition: "anchorage",
    waiting: "mixed",
    cargoes: ["Crude oil", "Associated gas piped ashore"],
    vesselTypes: ["FPSO Espoir Ivoirien", "Shuttle tankers", "Offshore support vessels"],
    airports: ["Abidjan (ABJ)"],
    workAreas: ["FPSO Espoir Ivoirien on station", "shuttle tanker offloading area", "field support vessel moorings"],
    conditions:
      "Espoir lies in open sea about 10 nautical miles south of Jacqueville and 32 nautical miles south-west of Abidjan, so everything here — the FPSO, the shuttle tankers and the support vessels — works in the full Atlantic swell with no shelter. The field has a wellhead platform feeding the FPSO, and all diving is done under the operator's field permit system, planned around production, offloading and the weather rather than a berth.",
    profile:
      "Espoir is an offshore oil field in Block CI-26, operated by CNR International with Petroci and Tullow as partners. A wellhead platform feeds the FPSO Espoir Ivoirien, which stores up to 1.16 million barrels and offloads crude to shuttle tankers, while gas goes ashore by subsea pipeline to generate electricity in Abidjan. The FPSO is owned by BW Offshore and has stayed on station under successive lease extensions.",
    hook:
      "an FPSO field off Jacqueville that never comes into port",
    neighbours: ["baobab-terminal-port", "lion-terminal-port", "vridi-port"],
    visibility:
      "good — this is clear open-sea water well offshore — so the swell and the field's operations rather than visibility decide the window",
    hullFinding:
      "An FPSO that has been on station for years has never had its hull cleaned by a dock, so growth builds in layers, and it matters most at the sea chests, water intakes and caissons, where fouling cuts the cooling and process water flow the plant depends on. Shuttle tankers and support vessels show the more familiar pattern of growth from long periods of slow steaming and waiting.",
    hullWindow:
      "Only within the operator's permit system. On the FPSO, in-water work is planned around production and offloading; on a shuttle tanker, it is done while she waits in the field rather than during a connected offloading.",
    hullMethod:
      "There is no anchor and no berth here: the FPSO is held on station by her own moorings, and shuttle tankers and support vessels work around her, so the dive plan is built around the field's production and offloading programme and the swell, under the operator's permit system.",
    lineOverrides: { "hold-cleaning": false, "tank-cleaning": false },
    scopeNotes: {
      "underwater-hull-cleaning": {
        note:
          "The FPSO Espoir Ivoirien has been moored on the field for years and will not see a dry dock while she produces, so her hull is cleaned where she is. The priority on an FPSO is not speed but flow: sea chests, water intakes and caissons clogged with growth reduce the cooling and process water the plant needs. At Espoir, hull cleaning is therefore planned with the operator as maintenance of the production system, not as a fuel-saving job.",
        faq: {
          q: "Why clean the hull of an FPSO that never sails?",
          a: "Because fouling on an FPSO blocks sea chests, intakes and caissons and reduces the water flow the production plant depends on. At Espoir the cleaning is planned with the operator as part of keeping the plant running, within the field's permit system.",
        },
      },
      "propeller-polishing": {
        note:
          "The FPSO at Espoir is moored on station and does not use a propeller in service, so propeller polishing here is for the vessels that come and go: the shuttle tankers that take the crude away and the support vessels that serve the field. A shuttle tanker waiting for her offloading slot in warm water collects growth on the blades, and a polish before she loads means she carries a clean propeller on the laden voyage.",
        faq: {
          q: "Is propeller polishing relevant at Espoir if the FPSO does not move?",
          a: "For the FPSO, no — she stays moored on station. But the shuttle tankers and support vessels working the field do benefit. A shuttle tanker can be polished while she waits for her offloading slot, so she leaves laden with a clean propeller.",
        },
      },
      "thruster-cleaning": {
        note:
          "The support vessels that serve an offshore field like Espoir use their thrusters constantly — holding position alongside the FPSO or the wellhead platform, often on dynamic positioning. A thruster that loses power to fouling limits what those vessels can do in the swell. Cleaning the tunnels and blades on the field support fleet is the main thruster work here, planned between their tasks so field operations are not interrupted.",
        faq: {
          q: "Which vessels at Espoir need thruster cleaning?",
          a: "Mainly the offshore support vessels, which rely on their thrusters to hold position near the FPSO and the platform, often on dynamic positioning. We clean them between tasks so the field is not left without support.",
        },
      },
      "in-water-survey": {
        note:
          "An FPSO that stays on station for years has to have its hull and moorings surveyed where it is, because it cannot go to a dry dock without stopping production. That makes in-water class survey work at Espoir a routine requirement, not an alternative. The survey programme — hull plating, sea chests, mooring connections and appendages — is agreed with the class society and the operator in advance and fitted around production and offloading.",
        faq: {
          q: "How is an FPSO like Espoir Ivoirien surveyed for class?",
          a: "In the water, because she cannot go to a dry dock without stopping production. The survey programme is agreed with the class society and the operator in advance, covering the hull, sea chests and moorings, and fitted around production and offloading with live video to the surveyor.",
        },
      },
      "uwild-inspection": {
        note:
          "For the Espoir Ivoirien, underwater inspection in lieu of dry-docking is not an option to weigh up; it is how an FPSO on a long-term lease stays in class. The question is doing it well: a defined programme, live video to the surveyor, thickness readings where required, and a report that stands up to class review. With the FPSO's lease extended, those inspections will continue to be the backbone of keeping her in class on station.",
        faq: {
          q: "Is UWILD standard for the FPSO at Espoir?",
          a: "Yes. An FPSO on a long-term lease meets her dry-docking survey requirement in the water, because she stays on station. We deliver the UWILD programme with live video to the surveyor, thickness readings where required and a full report for class, planned with the operator around production.",
        },
      },
    },
  },
  {
    slug: "baobab-terminal-port",
    name: "Baobab",
    label: "Baobab Marine Terminal",
    officialName: "Baobab Marine Terminal (FPSO Baobab Ivoirien MV10)",
    aka: ["Baobab", "Baobab field", "FPSO Baobab Ivoirien", "MV10", "Block CI-40"],
    unlocode: "CIBAO",
    state: "Block CI-40",
    country: "Côte d'Ivoire",
    countryCode: "CI",
    coast: "Gulf of Guinea",
    weather: "west-africa",
    waterBody: "Gulf of Guinea",
    authority: "CNR International",
    type: "Private Port",
    condition: "anchorage",
    waiting: "mixed",
    cargoes: ["Crude oil"],
    vesselTypes: ["FPSO Baobab Ivoirien MV10", "Shuttle tankers", "Offshore support vessels"],
    airports: ["Abidjan (ABJ)"],
    workAreas: ["FPSO Baobab Ivoirien on station", "shuttle tanker offloading area", "field support vessel moorings"],
    conditions:
      "Baobab is a deep-water field about 25 kilometres off the coast in 900 to 1,300 metres of water, so the FPSO is held by a spread mooring far above the sea bed and everything on the field works in open Atlantic swell. The depth means all work stays close to the surface — on the FPSO's hull, the mooring connections at the hull and the offloading vessels — and it is done under the operator's field permit system.",
    profile:
      "Baobab is a deep-water oil field in Block CI-40, operated by CNR International with Svenska Petroleum and Petroci as partners. Its crude is produced and stored on the FPSO Baobab Ivoirien MV10, a 346,000-deadweight-tonne vessel, and exported by shuttle tanker through the Baobab Marine Terminal — the FPSO with its bow moorings, hoses and pipeline end manifold.",
    hook:
      "a deep-water FPSO field in up to 1,300 metres of water",
    neighbours: ["espoir-terminal-port", "lion-terminal-port", "vridi-port"],
    visibility:
      "good — clear, deep open-sea water — so the swell and the field's operations set the window, not what a diver can see",
    hullFinding:
      "On a 346,000-tonne FPSO that stays on station, the growth that matters is at the sea chests, water intakes and caissons, and around the mooring and riser connections at the hull, where it adds weight and blocks flow. The shuttle tankers show the ordinary pattern of growth from waiting in warm water for their offloading slot.",
    hullWindow:
      "Only within the operator's permit system. Work on the FPSO is planned around production and offloading; shuttle tankers are cleaned while they wait in the field, never during a connected offloading.",
    hullMethod:
      "There is no anchor and no berth here: the FPSO is held on station by her own moorings, and shuttle tankers and support vessels work around her, so the dive plan is built around the field's production and offloading programme and the swell, under the operator's permit system.",
    lineOverrides: { "hold-cleaning": false, "tank-cleaning": false },
    scopeNotes: {
      "underwater-hull-cleaning": {
        note:
          "The Baobab Ivoirien MV10 is a very large FPSO — 346,000 deadweight tonnes — moored in deep water where she will stay for her working life. Cleaning a hull that size is planned area by area over a campaign, not in a single dive, with priority given to the sea chests and intakes that feed the plant and the areas around the mooring and riser connections. It is organised with the operator around production and offloading.",
        faq: {
          q: "How is the hull of a large FPSO like Baobab Ivoirien cleaned?",
          a: "In stages, as a planned campaign rather than a single dive, starting with the sea chests, water intakes and the areas around the mooring and riser connections. We organise it with the operator around production and offloading, under the field's permit system.",
        },
      },
      "propeller-polishing": {
        note:
          "The Baobab FPSO stays on its moorings and does not rely on a propeller in service, so propeller polishing at Baobab is for the shuttle tankers and support vessels. A shuttle tanker that waits for its slot in warm water picks up growth on the blades, and polishing her before she loads — in the field, under the operator's rules — sends her off on the laden voyage with a clean propeller.",
        faq: {
          q: "Who needs propeller polishing at the Baobab field?",
          a: "The shuttle tankers and field support vessels, not the FPSO, which stays moored. A shuttle tanker can be polished while she waits for her offloading slot, so the polished propeller works for the whole laden voyage.",
        },
      },
      "thruster-cleaning": {
        note:
          "Deep water means everything at Baobab is done from vessels holding position at the surface — support vessels alongside the FPSO, and shuttle tankers during the approach to offloading. Their thrusters, often on dynamic positioning, are what keep them in place in the swell. A fouled thruster reduces the margin in exactly those operations, so thruster cleaning on the field fleet is planned between tasks to keep that margin intact.",
        faq: {
          q: "Why does thruster condition matter so much at Baobab?",
          a: "Because in deep water there is nothing to anchor to near the FPSO — support vessels and shuttle tankers hold position with their thrusters, often on dynamic positioning. A fouled thruster reduces that capability. We clean the field fleet's thrusters between tasks.",
        },
      },
      "in-water-survey": {
        note:
          "An FPSO of this size in deep water can only be surveyed where she is. The class survey covers a very large hull and the attachment points for its moorings and risers, so it is planned as a programme over several dive windows rather than a single visit, agreed in advance with the class society and the operator, and fitted around production and offloading.",
        faq: {
          q: "How long does an in-water class survey of the Baobab FPSO take?",
          a: "It depends on the scope agreed with class, but a hull of 346,000 deadweight tonnes is surveyed as a programme over several dive windows, not in a single visit. We plan it with the operator and the class society in advance and fit it around production and offloading.",
        },
      },
      "uwild-inspection": {
        note:
          "For an FPSO moored in up to 1,300 metres of water, the dry-docking survey is met under water — there is no realistic alternative while she produces. At Baobab the value is in how the programme is run: planned over several windows, with live video to the surveyor, thickness readings where required, and a report the class society can accept, so that the FPSO stays in class without interrupting the field.",
        faq: {
          q: "Is UWILD how the Baobab FPSO meets her dry-docking survey?",
          a: "Yes — an FPSO in deep water on long-term station meets it under water. We deliver the UWILD programme over several planned dive windows, with live video to the surveyor and a full report for class, organised with the operator so production is not interrupted.",
        },
      },
    },
  },
  {
    slug: "sassandra-port",
    name: "Sassandra",
    officialName: "Port de pêche de Sassandra",
    aka: ["Sassandra wharf", "Sassandra fishing port"],
    unlocode: "CIZSS",
    state: "Gbôklé",
    country: "Côte d'Ivoire",
    countryCode: "CI",
    coast: "Gulf of Guinea",
    weather: "west-africa",
    waterBody: "Gulf of Guinea, at the mouth of the Sassandra River",
    authority: "the local maritime authority",
    type: "State Port",
    condition: "anchorage",
    waiting: "berth-driven",
    cargoes: ["Fishing catch"],
    vesselTypes: ["Fishing vessels", "Coastal craft", "Artisanal fishing boats"],
    airports: ["San Pédro (SPY)", "Abidjan (ABJ)"],
    workAreas: ["fishing port quay", "roadstead off Sassandra"],
    conditions:
      "Sassandra is an open roadstead at the mouth of the Sassandra River, with no breakwater harbour of the size found at San Pédro, so the Atlantic swell reaches the anchorage directly. The river brings fresh water and sediment into the bay, especially in the rainy season, which clouds the water close to the town. In-water work is planned for calm spells and done away from the river plume where possible.",
    profile:
      "Sassandra was one of Côte d'Ivoire's colonial-era ports — its wharf dates from 1951 and still stands, partly broken, in the middle of the bay — and it lost its trade to San Pédro when the deep-water port opened along the coast. Today it is a fishing town, with a fishing port built with Japanese cooperation, and the vessels that call are fishing boats and small coastal craft.",
    hook:
      "a colonial-era wharf town that is now a fishing port",
    neighbours: ["san-pedro-port", "abidjan-port", "vridi-port"],
    visibility:
      "variable — reasonable in calm, dry weather away from the shore, but the Sassandra River carries sediment into the bay, especially in the rainy season, and that clouds the water near the town",
    hullFinding:
      "The boats working out of Sassandra are fishing vessels and small coastal craft that spend long hours slow or stationary in warm water, so growth is heavy and mixed and builds quickly in the niches. Nets and lines around the propeller and rudder are as common a find as the growth itself.",
    hullWindow:
      "For fishing vessels, between trips — usually alongside the fishing port quay in calm weather, or at the roadstead when the swell allows.",
    lineOverrides: { "hold-cleaning": false, "tank-cleaning": false },
    scopeNotes: {
      "underwater-hull-cleaning": {
        note:
          "The working fleet at Sassandra is fishing vessels, not cargo ships, and their hull work is about staying at sea: a fishing boat with a fouled hull burns more fuel on every trip to the grounds and back. Cleaning is fitted between trips, alongside the fishing port quay or at the roadstead in calm weather, and kept away from the Sassandra River plume where the water is cloudiest.",
        faq: {
          q: "Do you clean fishing vessel hulls at Sassandra?",
          a: "Yes — fishing vessels are the main in-water customers here. We clean between trips, alongside the fishing port quay or at the roadstead when the swell allows, so the vessel loses no fishing time.",
        },
      },
      "propeller-polishing": {
        note:
          "For a fishing boat, the propeller's biggest enemy at Sassandra is not only growth but gear: rope and netting wrapped around the shaft, which cuts power and can damage the seal. A diver's visit here usually combines clearing anything fouling the propeller, shaft and rope guard with a polish of the blades, so the boat goes back out with full power and no hidden damage.",
        faq: {
          q: "Can you clear nets and rope from a propeller at Sassandra?",
          a: "Yes, and we inspect the shaft seal and rope guard at the same time. For fishing vessels it makes sense to combine this with a propeller polish in one dive.",
        },
      },
      "thruster-cleaning": {
        note:
          "Few of the fishing boats and small craft at Sassandra have a bow thruster at all, so thruster cleaning here is a small job for the vessels that do — typically larger fishing or support vessels visiting from San Pédro or Abidjan. Where a thruster is fitted, the tunnel is cleaned and the blades and gratings cleared during a stay, with the unit isolated first.",
        faq: {
          q: "Is thruster cleaning common at Sassandra?",
          a: "Not very — most boats here have no thruster. It applies to the larger fishing and support vessels that do, often visiting from San Pédro or Abidjan, and it is done during a normal stay with the thruster isolated.",
        },
      },
      "in-water-survey": {
        note:
          "A formal class survey is rarely done at Sassandra: the vessels are mostly small fishing craft outside the usual class survey regime, and the river sediment clouds the water near the town. Where an underwater inspection is needed — after damage, or for an insurer — it is done in calm weather away from the river plume. For a full class survey, San Pédro, a short distance along the coast with clearer water, is usually the better choice.",
        faq: {
          q: "Should a class survey be done at Sassandra or San Pédro?",
          a: "Usually San Pédro, which is close by and has clearer water behind its breakwater. Sassandra is better suited to a quick underwater inspection or damage check, done in calm weather away from the river plume.",
        },
      },
      "uwild-inspection": {
        note:
          "UWILD at Sassandra would only apply to a larger vessel that is both eligible and calling here, which is uncommon — most of the fleet is small fishing craft outside that regime. For an eligible vessel working this stretch of coast, the inspection is normally planned at San Pédro, where the water is clearer and the surveyor can attend more easily. We will always say which port gives the better result.",
        faq: {
          q: "Can UWILD be done at Sassandra?",
          a: "It is possible for an eligible vessel, but it is uncommon here. For most vessels working this coast, San Pédro — nearby, with clearer water and easier surveyor access — is the better place, and we will advise honestly.",
        },
      },
    },
  },
  {
    slug: "banjul-port",
    name: "Banjul",
    officialName: "Port of Banjul",
    aka: ["Port of Banjul", "Gambia", "Banjul Wharf"],
    unlocode: "GMBJL",
    state: "Banjul",
    country: "The Gambia",
    countryCode: "GM",
    coast: "Atlantic",
    weather: "west-africa",
    waterBody: "Gambia River estuary",
    authority: "Gambia Ports Authority",
    type: "State Port",
    condition: "tidal-silt",
    waiting: "mixed",
    cargoes: ["Containers", "Rice, sugar and flour", "Cement and general cargo", "Fuel", "Fishing catch"],
    vesselTypes: ["Feeder container ships", "General cargo ships", "Banjul–Barra ferries", "Fishing vessels", "Small cruise ships"],
    airports: ["Banjul (BJL)"],
    workAreas: ["Banjul Wharf", "New Banjul Jetty and container berths", "fisheries jetty", "Banjul–Barra ferry terminal"],
    conditions:
      "Banjul sits at the mouth of the Gambia River, and the water at its berths is estuary water: tidal, fast-flowing on the ebb and flood, and carrying sediment down from a river that drains a large part of West Africa. A sand bar in the entrance channel limits vessels to about a 9-metre draft, and the deepest-drafted ships time their passage to the flood tide. For in-water work that means two things — dives are timed to slack water, and visibility at the berths is low enough that divers work by touch under surface supervision.",
    profile:
      "Banjul is The Gambia's only seaport and the gateway for most of what the country imports — rice, sugar, flour, cement, fuel and containers — with some cargo moving on into Senegal and further inland. The Gambia Ports Authority runs about 750 metres of quay, including the Banjul Wharf, the New Banjul Jetty and its container berths, a fisheries jetty and the terminal for the Banjul–Barra ferries across the river mouth.",
    hook:
      "The Gambia's only seaport, at the mouth of a tidal river",
    neighbours: ["gambia-river-port", "dakar-port", "conakry-port"],
    lineOverrides: { "hold-cleaning": false, "tank-cleaning": false },
    scopeNotes: {
      "underwater-hull-cleaning": {
        note:
          "At Banjul the tide sets the working day. The Gambia River runs hard on the ebb and flood past the berths, and divers can only work safely at slack water — a window of an hour or so, twice a day. A full hull clean is therefore planned across several slack-water windows rather than one continuous shift, sized to the time the vessel is alongside, and the team uses brush carts on the flat sides where they can work largely by feel in the cloudy estuary water.",
        faq: {
          q: "How long does a hull clean take at Banjul?",
          a: "Longer in elapsed time than at a sheltered port, because divers can only work at slack water in the Gambia River's tidal stream — roughly an hour or so, twice a day. We plan the clean across several slack-water windows while the vessel is alongside and tell you in advance how many she needs.",
        },
      },
      "propeller-polishing": {
        note:
          "Vessels bound for Banjul cross a sand bar in the entrance channel, often on the flood tide with limited water under the keel, and they work in estuary water full of sand and silt. Both wear on a propeller: suspended sand is mildly abrasive, and a propeller turning close to the bottom can pick up damage at the blade edges. A polish at Banjul is therefore also a careful inspection of both faces, the edges and the tips, with anything found photographed and reported.",
        faq: {
          q: "Do you check for damage when polishing a propeller at Banjul?",
          a: "Always. Vessels cross the sand bar in the entrance channel, often with little water under the keel, and the estuary water carries sand and silt. We inspect the blade edges, tips and both faces during the polish, and report any damage rather than polishing over it.",
        },
      },
      "thruster-cleaning": {
        note:
          "The Banjul–Barra ferries cross the mouth of the Gambia River many times a day and berth across a strong tidal stream at both ends of the crossing. That is the hardest thruster work on this coast, and a thruster tunnel fouled by the warm, nutrient-rich estuary water gives up exactly the thrust needed to hold a ferry against the current. Cleaning is fitted between crossings, at slack water, with the thruster isolated first.",
        faq: {
          q: "Can a Banjul–Barra ferry's thruster be cleaned without stopping the service?",
          a: "We plan it between crossings or during a scheduled stand-down, at slack water, so the crossing is interrupted as little as possible. The thruster is isolated and tagged out with the master before the dive.",
        },
      },
      "in-water-survey": {
        note:
          "The estuary water at Banjul is too cloudy for the wide shots a surveyor normally relies on, and slack-water windows are short. An in-water class survey here is possible, but only with close-quarters lighting, agreed acceptance criteria and a survey plan split across several tidal windows. Where a vessel's schedule allows, a survey at Dakar — a day's steaming north, in clearer Canary Current water — may give class a better picture, and we will say so up front.",
        faq: {
          q: "Is Banjul a good place for an in-water class survey?",
          a: "It is possible, but the estuary water is cloudy and slack-water windows are short, so the survey needs close-quarters lighting and several tidal windows. If the vessel's route allows, Dakar has much clearer water and may be the better choice. We advise honestly before the surveyor is booked.",
        },
      },
      "uwild-inspection": {
        note:
          "For vessels trading to The Gambia, the nearest major ship repair centre is Dakar, with its Dakarnave yard. That makes UWILD attractive for regular Banjul callers — feeders and general cargo ships on fixed rotations — as long as the inspection can be done properly. Because the estuary is cloudy and tidal, UWILD for a Banjul caller is often best planned at Dakar or at the outer anchorage rather than alongside, after eligibility has been confirmed with class.",
        faq: {
          q: "Where should UWILD be done for a vessel trading to Banjul?",
          a: "Often at Dakar or the outer anchorage rather than alongside at Banjul, because the estuary water is cloudy and tidal. We first confirm the vessel's eligibility with the class society, then plan the inspection where the surveyor will get the clearest picture.",
        },
      },
    },
  },
  {
    slug: "gambia-river-port",
    name: "Gambia River",
    label: "Gambia River Terminals",
    officialName: "Banjul Anchorage and the Mandinari tanker moorings",
    aka: ["Banjul Anchorage", "Banjul Roads", "Mandinari", "Mandinari CBM", "Gambia River"],
    unlocode: "GMBJL",
    state: "Banjul",
    country: "The Gambia",
    countryCode: "GM",
    coast: "Atlantic",
    weather: "west-africa",
    waterBody: "Gambia River estuary",
    authority: "Gambia Ports Authority",
    type: "State Port",
    condition: "anchorage",
    waiting: "long-wait",
    cargoes: ["Fuel and petroleum products", "Transhipment and lightering cargo"],
    vesselTypes: ["Product tankers", "Vessels waiting for a Banjul berth", "Lightering and bunker barges"],
    airports: ["Banjul (BJL)"],
    workAreas: ["inner anchorage off Banjul", "Mandinari conventional buoy mooring", "outer anchorage beyond the bar"],
    conditions:
      "The inner anchorage off Banjul is 14 to 15 metres deep, a wide stretch of the estuary about a mile across and two miles long — far deeper than the port's own oil berth, which has only 5 to 6 metres. So the larger tankers bringing fuel to The Gambia either lie at anchor or moor at the conventional buoy mooring at Mandinari, about four nautical miles south of the commercial port, where they are held fore and aft between buoys. It is all tidal estuary water: the stream runs hard on the ebb and flood, and visibility is low.",
    profile:
      "This is the part of the Port of Banjul where the big ships wait and where the fuel comes in. The inner anchorage holds vessels waiting for a berth at Banjul and tankers too deep for the oil berth, and the Mandinari buoy mooring handles tanker discharge for the country's fuel supply. For most tankers calling The Gambia, the anchorage and Mandinari — not the quays — are where they spend their time.",
    hook:
      "the deep-water anchorage and tanker moorings of the Gambia River",
    neighbours: ["banjul-port", "dakar-port", "conakry-port"],
    visibility:
      "low — this is a tidal estuary carrying sediment down the Gambia River, and it is at its worst in the rainy season when the river is in flood",
    hullFinding:
      "Vessels at the Banjul anchorage are waiting, often for days, in warm, nutrient-rich estuary water — ideal conditions for growth. Tankers waiting for Mandinari or for lighterage collect fouling across the flat bottom, and the sea chests pick up both growth and river silt.",
    hullWindow:
      "Not while a tanker is moored at Mandinari and discharging. Hull work is done at the inner anchorage at slack water — usually during the wait for a berth or for the buoys, which at Banjul is time the vessel is spending anyway.",
    hullMethod:
      "The tidal stream in the estuary sets the method here: dives are timed to slack water at the anchorage, the team works by touch under surface supervision in low visibility, and nothing is done at the Mandinari buoys while a tanker is moored and discharging.",
    lineOverrides: { "hold-cleaning": false, "tank-cleaning": false },
    scopeNotes: {
      "underwater-hull-cleaning": {
        note:
          "Most tankers bringing fuel to The Gambia cannot use the port's oil berth, which has only 5 to 6 metres of water, so they spend their call at the inner anchorage or on the Mandinari buoys. The time at anchor waiting for the buoys is the window for a hull clean, done at slack water in the estuary's tidal stream. Nothing is done while the tanker is moored at Mandinari and discharging.",
        faq: {
          q: "When can a tanker's hull be cleaned at the Gambia River terminals?",
          a: "While she waits at the inner anchorage off Banjul — for the Mandinari buoys or for lighterage — at slack water. Nothing is done while she is moored at Mandinari and discharging. The anchorage wait is usually long enough to plan the clean across several slack-water windows.",
        },
      },
      "propeller-polishing": {
        note:
          "A tanker leaving the Gambia River after discharge sails light, usually on a long ballast passage back to her loading port. Polishing the propeller at the inner anchorage before she leaves — at slack water, while she waits for the tide and the pilot to take her back over the bar — gives her a clean propeller for that whole voyage. The estuary's sand and silt are checked for too: blade edges and tips are inspected and any wear reported.",
        faq: {
          q: "Is it worth polishing a tanker's propeller at the Banjul anchorage?",
          a: "Yes, especially before a long ballast voyage out of the Gambia River. We polish at the inner anchorage at slack water and inspect the blade edges for wear from the sandy estuary water at the same time.",
        },
      },
      "thruster-cleaning": {
        note:
          "Mooring at Mandinari is a conventional buoy mooring: the tanker is held between buoys at bow and stern, placed there with her own anchors and winches, mooring boats and — where she has one — her bow thruster, all against the tidal stream. A thruster that has fouled during a long wait at anchor makes that harder. For tankers fitted with one, the tunnel is cleaned at the anchorage at slack water before she is called to the buoys.",
        faq: {
          q: "Why clean the thruster before mooring at Mandinari?",
          a: "Because mooring between buoys at Mandinari is done against the Gambia River's tidal stream, and a fouled thruster gives less control. For tankers fitted with a bow thruster, we clean it at the inner anchorage at slack water before the mooring.",
        },
      },
      "in-water-survey": {
        note:
          "The Banjul anchorage is where a vessel is most likely to need an unplanned underwater inspection: the entrance channel has a sand bar with limited water over it, and a ship that touches on the way in should be checked before she goes further. We can put a diver down at the anchorage at slack water for a damage survey with live video to the surface. For a planned class survey, the cloudy estuary water makes Dakar the better choice where the schedule allows.",
        faq: {
          q: "Can you do an underwater damage survey at the Banjul anchorage after touching the bar?",
          a: "Yes. We carry out a damage survey at the inner anchorage at slack water, with live video to the surface so the master, owner, insurer and surveyor can see the damage, followed by a full report. For a planned class survey, clearer water at Dakar is usually better.",
        },
      },
      "uwild-inspection": {
        note:
          "The tankers serving The Gambia are its fuel supply, and a tanker away for a dry dock is a gap in it. UWILD can keep an eligible tanker in service, but tanker eligibility is narrower than for most ships, especially for older vessels, so it is checked with class first. With the estuary water cloudy and tidal, the inspection itself is usually better planned at Dakar or at the outer anchorage beyond the bar than inside the river.",
        faq: {
          q: "Is UWILD possible for a tanker trading to the Gambia River?",
          a: "It can be, but tanker eligibility needs to be checked with the class society first, especially for older tankers. If she qualifies, we usually plan the inspection at Dakar or the outer anchorage, where the water is clearer than inside the estuary.",
        },
      },
    },
  },
];

const bySlug = new Map(westAfricaPorts.map((p) => [p.slug, p]));
export function getWestAfricaPort(slug: string) {
  return bySlug.get(slug);
}
