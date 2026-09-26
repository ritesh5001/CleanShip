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
 * Ports are taken from the UN/LOCODE list in `Port Coverage.xlsx`. Sierra
 * Leone, Guinea-Bissau and The Gambia appear in the service coverage claim in
 * lib/site.ts but have no entry on that sheet, so they get no pages —
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
    neighbours: ["san-pedro-port", "monrovia-port", "tema-port"],
    holdNote:
      "Cocoa and coffee are food-grade cargoes with strict cleanliness and odour requirements, and Abidjan loads both in volume. A hold that carried a mineral or fertiliser cargo inbound and is fixed for cocoa outbound needs the full sequence and a dry, odour-free result — the lagoon humidity is what makes the drying stage the hard part.",
    tankNote:
      "Abidjan refines and exports product, so the tank work here is grade changes on product tankers plus bunker and slop cleaning. Licensed slop reception is limited on this coast, so it is booked before the tanks are opened rather than assumed.",
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
    neighbours: ["abidjan-port", "monrovia-port", "tema-port"],
    holdNote:
      "Cocoa is the whole story here. It is food-grade, it is odour-sensitive, and it will reject a hold that carried manganese or timber treatment residue without a full clean. San Pédro is where the difference between a swept hold and a grain-clean hold turns into a rejected fixture.",
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
    neighbours: ["conakry-port", "monrovia-port", "abidjan-port"],
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
];

const bySlug = new Map(westAfricaPorts.map((p) => [p.slug, p]));
export function getWestAfricaPort(slug: string) {
  return bySlug.get(slug);
}
