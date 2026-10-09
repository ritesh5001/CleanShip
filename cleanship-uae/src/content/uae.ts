import type { Place, Service, SiteContent } from "./types";

/**
 * cleanship.ae — written for operators, agents and superintendents with a
 * ship calling a UAE port. Every page is about UAE water, UAE ports and UAE
 * port rules. None of this text is copied from cleanship.co: two domains
 * carrying the same paragraphs compete with each other in search.
 */

const services: Service[] = [
  {
    slug: "underwater-hull-cleaning",
    name: "Underwater Hull Cleaning",
    short: "Diver and brush-cart hull cleaning at UAE berths and anchorages.",
    seoTitle: "Underwater Hull Cleaning in the UAE",
    metaDescription:
      "Underwater hull cleaning at Jebel Ali, Khalifa, Fujairah, Khor Fakkan and every UAE port. Diver teams from our Ajman and Fujairah bases, port approvals handled.",
    icon: "hull",
    image: "/images/vessel-on-passage.jpg",
    intro: [
      "Gulf water is shallow, hot and saltier than the open ocean, and marine growth settles on a hull faster here than on almost any other trading route. A ship that left a European yard clean can be carrying a measurable fouling penalty after one summer of UAE calls.",
      "Our dive teams clean hulls in the water at UAE berths and anchorages, from our head office in Ajman Free Zone and our east-coast base in Fujairah. We arrange the port approval, size the job to your berth or anchorage window, and send before-and-after video with the report.",
    ],
    points: [
      "Diver-operated brush carts for flat bottom and vertical sides",
      "Hand cleaning of bilge keels, sea chests and gratings",
      "Port approval applied for on your behalf at each UAE port",
      "Before-and-after video and a written hull condition report",
      "Teams based in Ajman and Fujairah — no international mobilisation",
    ],
    sections: [
      {
        heading: "Why UAE hulls foul so quickly",
        body: "Sea temperatures inside the Arabian Gulf pass 30 °C in summer and salinity is well above the ocean average. Barnacles and tubeworm establish within weeks, not months, on ships that sit at anchor or alongside. Waiting at Fujairah for bunkers or orders is the classic case: a few idle days in warm water is enough to start hard growth on the flat bottom.",
      },
      {
        heading: "Working to the port, not around it",
        body: "Each UAE port authority sets its own conditions for in-water cleaning — DP World in Dubai, AD Ports in Abu Dhabi, Sharjah Ports Authority, RAK Ports and the Port of Fujairah. Some berths want the work done at anchorage, some need a debris capture system, and every one wants the dive plan in advance. We put the application in early so the approval is in hand before the ship arrives.",
      },
      {
        heading: "Summer working hours",
        body: "From 15 June to 15 September the UAE midday break stops outdoor work between 12:30 and 15:00. Dive teams work around it with early starts and evening shifts, and we plan the clean so the break does not push a job past your sailing time.",
      },
    ],
    faqs: [
      {
        q: "Which UAE ports do you clean hulls in?",
        a: "All of the main ones: Jebel Ali, Port Rashid, Khalifa Port, Zayed Port, Ruwais, Port Khalid in Sharjah, Hamriyah, Ajman, Ras Al Khaimah, Saqr Port, Fujairah and Khor Fakkan. Each port's approval process is different, and we handle it for you.",
      },
      {
        q: "How long does an underwater hull clean take?",
        a: "It depends on the ship and the fouling. A Supramax with light-to-medium growth is typically a day with one dive team; a heavily fouled hull or a large container ship takes longer or needs two teams. We give you a duration with the quote, based on the last hull report or a short inspection dive.",
      },
      {
        q: "Can you clean at Fujairah anchorage?",
        a: "Yes. Our Fujairah base works the anchorage directly. Ships waiting there for bunkers or orders are often the best candidates, because the waiting time is already part of the voyage.",
      },
    ],
    keywords: ["underwater hull cleaning UAE", "hull cleaning Dubai", "hull cleaning Fujairah", "hull cleaning Jebel Ali", "ship hull cleaning Abu Dhabi"],
  },
  {
    slug: "propeller-polishing",
    name: "Propeller Polishing",
    short: "In-water propeller polishing to cut fuel use and protect your CII rating.",
    seoTitle: "Propeller Polishing in the UAE",
    metaDescription:
      "In-water propeller polishing at UAE ports and anchorages. Restore blade finish, cut fuel consumption and support your CII rating without a dry dock.",
    icon: "hull",
    image: "/images/bulk-carrier-berth.jpg",
    intro: [
      "A propeller with a rough or fouled blade surface costs fuel on every mile. Polishing it in the water restores the finish without a dry dock, and on most ships it is the single cheapest efficiency gain available between dockings.",
      "We polish propellers at UAE berths and anchorages with diver-held grinding and polishing tools, working blade by blade from root to tip, and record the result on video for your technical department.",
    ],
    points: [
      "Fixed-pitch and controllable-pitch propellers",
      "Removal of calcareous growth and roughness",
      "Blade-by-blade video, before and after",
      "Combined with hull cleaning in one dive window",
      "Rope guard and stern tube seal area checked",
    ],
    sections: [
      {
        heading: "Fuel, CII and the UAE calling pattern",
        body: "Under IMO's Carbon Intensity Indicator every ship over 5,000 GT now carries an annual efficiency rating, and a rough propeller pulls that rating down. Many ships call the UAE on a regular rotation, which makes a UAE port the natural place to schedule polishing every few months rather than waiting for a docking.",
      },
      {
        heading: "Polish at the anchorage, not the berth",
        body: "Container terminals at Jebel Ali, Khalifa and Khor Fakkan rarely allow time alongside for anything except cargo. Polishing is usually done at the anchorage before or after the call. At Fujairah, ships waiting for bunkers can have it done during the wait.",
      },
    ],
    faqs: [
      {
        q: "How often should a propeller be polished in the Gulf?",
        a: "In warm Gulf water, every three to six months is common for ships trading regularly in the region. The right interval depends on speed, idle time and the propeller's condition at the last inspection.",
      },
      {
        q: "Can polishing and hull cleaning be done together?",
        a: "Yes, and it is usually the best value: one port approval, one mobilisation and one dive window for both jobs.",
      },
    ],
    keywords: ["propeller polishing UAE", "propeller polishing Dubai", "propeller polishing Fujairah", "in-water propeller polishing"],
  },
  {
    slug: "in-water-survey-uwild",
    name: "In-Water Survey & UWILD",
    short: "Class-attended underwater inspection in place of dry docking.",
    seoTitle: "In-Water Survey & UWILD in the UAE",
    metaDescription:
      "UWILD and in-water class surveys in the UAE, with live video to the attending surveyor. Khor Fakkan and Fujairah offer the clearest water in the region.",
    icon: "hull",
    image: "/images/oil-tanker-aerial.jpg",
    intro: [
      "An Underwater Inspection in Lieu of Dry-docking (UWILD) lets an eligible ship complete the bottom survey in the water, so the intermediate docking can be skipped. It needs a diving contractor the class society will accept, live video to the surveyor, and water clear enough for the surveyor to see what they are signing off.",
      "We run UWILD and in-water class inspections in the UAE with surface-supplied divers, live video and a structured report. On the east coast, Khor Fakkan and Fujairah sit on the Gulf of Oman, where the water is deeper and clearer than inside the Gulf — the best conditions in the country for survey work.",
    ],
    points: [
      "Live video and communications to the attending surveyor",
      "Sea chests, rudder, propeller, stern tube and hull plating",
      "Thickness readings where class requires them",
      "Report structured to the class society's checklist",
      "Eligibility confirmed with class before the job",
    ],
    sections: [
      {
        heading: "East coast or Gulf side?",
        body: "Visibility decides whether an in-water survey is accepted. Inside the Gulf, water at most berths is moderate to poor, especially near dredging. Khor Fakkan and the Fujairah anchorage, outside the Strait of Hormuz, usually give far better visibility. If the schedule allows, we recommend the east coast for any survey that has to satisfy class.",
      },
      {
        heading: "Planning with class",
        body: "UWILD eligibility depends on the ship's age, class notation and survey history, and it is the class society's decision. We confirm the scope with the society, agree the inspection plan and arrange the surveyor's attendance before the dive team mobilises.",
      },
    ],
    faqs: [
      {
        q: "What is UWILD?",
        a: "Underwater Inspection in Lieu of Dry-docking: a class survey of the underwater hull done in the water, with a surveyor watching live video, so an eligible ship can skip an intermediate dry docking.",
      },
      {
        q: "Which UAE location is best for an in-water survey?",
        a: "Khor Fakkan or the Fujairah anchorage, on the Gulf of Oman. The water there is clearer than at the Gulf ports, which makes the survey video more useful to the surveyor.",
      },
    ],
    keywords: ["UWILD UAE", "in-water survey UAE", "underwater inspection Fujairah", "class survey Khor Fakkan"],
  },
  {
    slug: "hold-cleaning",
    name: "Cargo Hold Cleaning",
    short: "Hold cleaning gangs and riding crews for bulk carriers in UAE ports.",
    seoTitle: "Cargo Hold Cleaning in the UAE",
    metaDescription:
      "Cargo hold cleaning in UAE ports: shore gangs and riding crews for limestone, aggregates, cement, sulphur and grain-clean preparation. Ajman-based teams.",
    icon: "hold",
    image: "/images/cargo-holds-open.jpg",
    intro: [
      "The UAE is a major loading coast for limestone, aggregates, cement and sulphur — some of the hardest residues a bulk carrier can carry. A hold that is washed late after cement or clinker needs chipping, not hosing, and sulphur left on steel corrodes it.",
      "Our gangs clean holds alongside at Saqr Port, Ras Al Khaimah, Ajman, Hamriyah and Port Khalid, and our riding crews sail with the ship to finish the job on passage. We work to the standard your next cargo needs, from shovel-clean to grain-clean.",
    ],
    points: [
      "Shore gangs at Saqr Port, RAK, Ajman, Hamriyah and Sharjah",
      "Riding crews that clean on the ballast passage",
      "Limestone, cement, clinker, aggregate and sulphur residues",
      "High-pressure washing, chemical cleaning and fresh-water rinse",
      "Grain-clean preparation for the next charter",
    ],
    sections: [
      {
        heading: "The UAE residues",
        body: "Limestone and aggregate dust packs into frames and tank-top corners. Cement and clinker set hard if they meet water before they are removed. Sulphur from Ruwais is acidic and attacks coatings. Each needs a different method and the order matters: dry removal first, then washing, then rinsing and drying.",
      },
      {
        heading: "Alongside or on passage",
        body: "Turnaround at UAE bulk berths is fast and loading runs around the clock, so there is rarely time to clean a full ship alongside. Where the next cargo needs a higher standard, a riding crew joins in the UAE and finishes the holds on the ballast leg.",
      },
    ],
    faqs: [
      {
        q: "Can you get holds grain-clean after a limestone cargo?",
        a: "Yes, but it takes the full sequence: dry removal of the residue, high-pressure washing, a fresh-water rinse to remove the salt, and drying. It is usually finished by a riding crew on passage.",
      },
      {
        q: "Do you supply riding crews from the UAE?",
        a: "Yes. Crews join at a UAE port with their own equipment and chemicals and sail with the ship until the holds pass inspection.",
      },
    ],
    keywords: ["hold cleaning UAE", "cargo hold cleaning Ras Al Khaimah", "hold cleaning Saqr Port", "riding crew UAE", "bulk carrier hold cleaning"],
  },
  {
    slug: "tank-cleaning",
    name: "Tank Cleaning",
    short: "Cargo, fuel and slop tank cleaning for tankers and offshore vessels.",
    seoTitle: "Tank Cleaning in the UAE",
    metaDescription:
      "Tank cleaning in the UAE: grade changes on product and chemical tankers, fuel and slop tanks on offshore vessels. Fujairah, Hamriyah and Abu Dhabi.",
    icon: "tank",
    image: "/images/product-tanker.jpg",
    intro: [
      "Fujairah is one of the world's largest bunkering hubs and the UAE has a large resident offshore fleet, so tank cleaning here is steady work: grade changes on product tankers, sludge and slop removal on bunker barges, and fuel tank cleaning on offshore support vessels coming off charter.",
      "We provide tank cleaning teams with gas-free monitoring, enclosed-space entry procedures and slop disposal through licensed UAE reception facilities.",
    ],
    points: [
      "Product and chemical tanker grade changes",
      "Fuel, sludge and slop tanks",
      "Gas-freeing and continuous atmosphere monitoring",
      "Slop disposal through licensed UAE facilities",
      "Offshore support vessel tanks between charters",
    ],
    sections: [
      {
        heading: "Fujairah and the anchorage",
        body: "Many tankers wait at the Fujairah anchorage for orders or bunkers. Where the next cargo needs a grade change, that waiting time can be used for tank cleaning, with slops landed to reception facilities in port.",
      },
      {
        heading: "Safety first",
        body: "Every tank entry runs under a written permit, with gas measurements before and during entry, ventilation and a rescue standby. If a tank cannot be made safe, the work stops and we tell you why.",
      },
    ],
    faqs: [
      {
        q: "Where do the slops go?",
        a: "To licensed port reception facilities in the UAE, arranged as part of the job, with the disposal paperwork returned to the ship.",
      },
      {
        q: "Do you clean offshore support vessel tanks?",
        a: "Yes, mainly at Hamriyah and Abu Dhabi, where offshore vessels lie between charters.",
      },
    ],
    keywords: ["tank cleaning UAE", "tank cleaning Fujairah", "tanker cleaning UAE", "slop tank cleaning", "OSV tank cleaning Hamriyah"],
  },
  {
    slug: "remote-inspection-ndt",
    name: "Remote Inspection (RIT) & NDT",
    short: "Class-approved drone and crawler inspection, plus NDT and thickness gauging.",
    seoTitle: "Remote Inspection & NDT in the UAE",
    metaDescription:
      "BW Class approved Remote Inspection Techniques (RIT) supplier in the UAE. Drone and crawler close-up survey of tanks and holds, plus NDT and thickness gauging.",
    icon: "ndt",
    image: "/images/ndt-technician.jpg",
    intro: [
      "A close-up survey of a ballast tank or cargo hold usually means staging or rope access to reach the structure. Remote Inspection Techniques — drones, crawlers and cameras — reach it without anyone working at height or entering a dangerous space.",
      "Cleanship Marine Services FZE is approved by Blue Wave Classification (BW Class) as a service supplier for survey using Remote Inspection Techniques as an alternative to close-up survey, certificate BW/096439, issued in Dubai. We also carry out NDT and ultrasonic thickness gauging in UAE ports.",
    ],
    points: [
      "BW Class approved RIT service supplier — certificate BW/096439",
      "Drone close-up survey of tanks, holds and voids",
      "Magnetic crawler thickness readings",
      "Ultrasonic thickness gauging and NDT",
      "Live feed to the attending surveyor",
    ],
    sections: [
      {
        heading: "Why RIT saves time in UAE ports",
        body: "Staging a large cargo hold or ballast tank can take longer than the inspection itself, and UAE turnarounds are short. A drone survey can cover the same structure in hours, and the surveyor watches the live feed and can ask for any area to be looked at again.",
      },
      {
        heading: "Acceptance by class",
        body: "Whether RIT is accepted in place of a conventional close-up survey is decided by the class society for each scope. We agree it with the society in writing before the survey.",
      },
    ],
    faqs: [
      {
        q: "Is Cleanship an approved RIT supplier?",
        a: "Yes. Blue Wave Classification approved Cleanship Marine Services FZE as a service supplier for survey using Remote Inspection Techniques, certificate BW/096439, issued in Dubai on 23 July 2026 and valid until 23 July 2029.",
      },
      {
        q: "Will my class society accept a drone survey?",
        a: "For many scopes, yes, but it is the society's decision. We confirm acceptance in writing before the survey starts.",
      },
    ],
    keywords: ["remote inspection techniques UAE", "RIT drone survey UAE", "drone tank inspection Dubai", "thickness gauging UAE", "NDT UAE"],
  },
];

const places: Place[] = [
  {
    slug: "jebel-ali",
    name: "Jebel Ali",
    area: "Dubai",
    waterBody: "Arabian Gulf",
    unlocode: "AEJEA",
    hook: "The region's biggest container port, worked to fixed liner rotations.",
    seoTitle: "Hull Cleaning at Jebel Ali Port, Dubai",
    metaDescription:
      "Underwater hull cleaning, propeller polishing and hold cleaning at Jebel Ali Port, Dubai. Scheduled around liner rotations, with DP World approvals handled.",
    body: [
      "Jebel Ali is the busiest container port in the Middle East and the hub of Dubai's free zone. Most ships here call on fixed liner rotations, so underwater work is best planned as routine maintenance on a known call rather than a reaction to lost speed.",
      "The harbour is large and well sheltered, so weather rarely stops the work. The limit is time: terminals run to productivity targets, and in-water cleaning is often done at the anchorage before or after the berth. Warm, salty water means a hull cleaned here can need attention again within a few months.",
    ],
    work: [
      "Hull cleaning and propeller polishing planned on the liner rotation",
      "Anchorage work where the terminal will not allow it alongside",
      "Cell guide, bilge and tank-top cleaning on container ships",
      "Approvals arranged with DP World and Dubai Maritime Authority",
    ],
    services: ["underwater-hull-cleaning", "propeller-polishing", "hold-cleaning"],
    faqs: [
      { q: "Can you clean a hull alongside at Jebel Ali?", a: "Sometimes, with the terminal's agreement. More often the work is done at the anchorage before the ship berths, so no berth time is lost." },
      { q: "How far is Jebel Ali from your base?", a: "Our head office is in Ajman, roughly an hour's drive, so teams reach Jebel Ali the same day." },
    ],
  },
  {
    slug: "port-rashid",
    name: "Port Rashid",
    area: "Dubai",
    waterBody: "Arabian Gulf",
    unlocode: "AEDXB",
    hook: "Dubai's cruise and ship repair harbour.",
    seoTitle: "Hull Cleaning at Port Rashid, Dubai",
    metaDescription:
      "Hull cleaning, propeller polishing and in-water inspection at Port Rashid (Mina Rashid), Dubai — cruise ships, superyachts and harbour craft.",
    body: [
      "Port Rashid is Dubai's cruise terminal and a ship repair centre, with project cargo and a large fleet of harbour craft and yachts. Cruise calls are short and fixed, so any underwater work has to fit the turnaround or wait for the off-season.",
      "The harbour is small, enclosed and still. That makes it easy to work in, but hard on anything that lies idle: laid-up ships and harbour craft here grow heavy fouling quickly.",
    ],
    work: [
      "Hull and propeller work sized to the cruise turnaround",
      "Off-season cleaning for laid-up tonnage",
      "Harbour craft and superyacht hull cleaning",
      "Inspection before and after repair",
    ],
    services: ["underwater-hull-cleaning", "propeller-polishing", "in-water-survey-uwild"],
    faqs: [
      { q: "Do you work on superyachts at Port Rashid?", a: "Yes — hull cleaning, propeller polishing and running gear inspection, scheduled around the yacht's programme." },
      { q: "Can work be done during a cruise call?", a: "Short scopes such as propeller polishing can fit inside a turnaround. Full hull cleans are usually planned for the off-season lay-up." },
    ],
  },
  {
    slug: "khalifa-port",
    name: "Khalifa Port",
    area: "Abu Dhabi",
    waterBody: "Arabian Gulf",
    unlocode: "AEKHL",
    hook: "Abu Dhabi's deep-water container and industrial gateway.",
    seoTitle: "Hull Cleaning at Khalifa Port, Abu Dhabi",
    metaDescription:
      "Underwater hull cleaning, propeller polishing and hold cleaning at Khalifa Port, Abu Dhabi. AD Ports approvals handled, work planned around terminal windows.",
    body: [
      "Khalifa Port is an offshore island terminal behind a breakwater, serving the KIZAD industrial zone with containers, general cargo, RoRo and dry bulk. Liner container ships make up most calls.",
      "Shelter is good, so the berth window is the constraint rather than the weather. The dredged approach keeps sediment in the water, so visibility is moderate — fine for cleaning, less ideal for a class survey.",
    ],
    work: [
      "Hull cleaning and polishing scheduled to the liner call",
      "Residue removal on dry bulk callers",
      "Cell guide and bilge cleaning on container ships",
      "Approvals through AD Ports Group and Abu Dhabi Maritime",
    ],
    services: ["underwater-hull-cleaning", "propeller-polishing", "hold-cleaning"],
    faqs: [
      { q: "Is Khalifa Port good for an in-water survey?", a: "Visibility is moderate because of the dredged channel. For a survey that has to satisfy class, the east coast at Khor Fakkan or Fujairah is usually better." },
      { q: "Who approves in-water work at Khalifa Port?", a: "AD Ports Group and Abu Dhabi Maritime. We apply on your behalf." },
    ],
  },
  {
    slug: "zayed-port",
    name: "Zayed Port",
    area: "Abu Dhabi",
    waterBody: "Arabian Gulf",
    unlocode: "AEAUH",
    hook: "Abu Dhabi's cruise, RoRo and general cargo harbour.",
    seoTitle: "Hull Cleaning at Zayed Port, Abu Dhabi",
    metaDescription:
      "Hull cleaning and propeller polishing at Zayed Port (Mina Zayed), Abu Dhabi — cruise ships, RoRo, general cargo and harbour craft.",
    body: [
      "Zayed Port is Abu Dhabi's inner harbour, handling cruise ships, RoRo, general and project cargo alongside a resident fleet of harbour craft.",
      "The water is shallow, warm and still. It is calm to work in, but it grows fouling fast, especially on ships and craft that stay in port for long periods.",
    ],
    work: [
      "Hull cleaning for cruise and RoRo tonnage",
      "Heavy-growth removal on harbour craft",
      "Propeller polishing within short calls",
      "Space and tank-top cleaning on project vessels",
    ],
    services: ["underwater-hull-cleaning", "propeller-polishing"],
    faqs: [
      { q: "Do you clean harbour craft at Zayed Port?", a: "Yes. Tugs, workboats and harbour craft that stay in port are among the most heavily fouled vessels in Abu Dhabi." },
      { q: "Can you work during a cruise call?", a: "Shorter scopes, yes. Full cleans are planned for the off-season." },
    ],
  },
  {
    slug: "ruwais",
    name: "Ruwais",
    area: "Abu Dhabi",
    waterBody: "Arabian Gulf",
    unlocode: "AERUW",
    hook: "The UAE's refining and petrochemical export complex.",
    seoTitle: "Tank & Hold Cleaning at Ruwais, Abu Dhabi",
    metaDescription:
      "Tank cleaning, sulphur hold cleaning and hull work for tankers, LPG carriers and bulk carriers loading at Ruwais, Abu Dhabi.",
    body: [
      "Ruwais is the UAE's largest refining and petrochemical export complex, loading crude, refined products, LPG and sulphur at dedicated berths. Access is controlled and the terminal operator's permit process sets the lead time.",
      "Sulphur is the hold residue here. It is acidic, damages coatings and steel if left, and the next cargo will not tolerate it, so the holds are washed and neutralised — usually on the passage after loading.",
    ],
    work: [
      "Sulphur residue washing and neutralising on bulk carriers",
      "Tank cleaning to the next cargo's specification",
      "Gas-freeing and enclosed-space entry certification",
      "Permits arranged through the terminal operator in advance",
    ],
    services: ["tank-cleaning", "hold-cleaning", "underwater-hull-cleaning"],
    faqs: [
      { q: "Why must sulphur residue be removed quickly?", a: "Wet sulphur forms acids that attack hold coatings and steel. The longer it stays, the more damage it does and the harder it is to remove." },
      { q: "Can you work at the Ruwais berths?", a: "Only with the terminal's prior approval, which we apply for well before arrival. Much of the work is done on passage or at anchorage instead." },
    ],
  },
  {
    slug: "sharjah-port-khalid",
    name: "Port Khalid, Sharjah",
    area: "Sharjah",
    waterBody: "Arabian Gulf",
    unlocode: "AESHJ",
    hook: "Sharjah's feeder container and general cargo harbour.",
    seoTitle: "Hull & Hold Cleaning at Port Khalid, Sharjah",
    metaDescription:
      "Hull cleaning, propeller polishing and hold cleaning at Port Khalid, Sharjah — feeders, coasters, steel and dry bulk. Minutes from our Ajman base.",
    body: [
      "Port Khalid is Sharjah's main port for feeder containers, general cargo, steel, project cargo and dry bulk. Calls are short, so jobs are sized to fit the call or held for the next one.",
      "It is a sheltered harbour where work alongside continues year-round. The winter shamal is the main interruption at the anchorage. Our head office in Ajman is a short drive away.",
    ],
    work: [
      "Quick hull and propeller jobs within short calls",
      "Hold cleaning for steel, project and bulk cargo",
      "Cell guide and bilge cleaning on feeders",
      "Same-day mobilisation from Ajman",
    ],
    services: ["underwater-hull-cleaning", "propeller-polishing", "hold-cleaning"],
    faqs: [
      { q: "How quickly can you reach Port Khalid?", a: "Our Ajman head office is close by, so a team can usually be at the ship the same day." },
      { q: "What stops work at Sharjah?", a: "Rarely anything alongside. At the anchorage, strong shamal winds in winter and early summer can pause diving." },
    ],
  },
  {
    slug: "hamriyah",
    name: "Hamriyah",
    area: "Sharjah",
    waterBody: "Arabian Gulf",
    unlocode: "AEHAM",
    hook: "Free-zone energy port with a large resident offshore fleet.",
    seoTitle: "Hull & Tank Cleaning at Hamriyah Port, Sharjah",
    metaDescription:
      "Hull cleaning, tank cleaning and hold work at Hamriyah Port, Sharjah — offshore support vessels, barges, project carriers and product tankers.",
    body: [
      "Hamriyah is Sharjah's free-zone and energy port, handling steel, oil and gas project cargo, aggregates and liquid bulk. A large fleet of offshore support vessels and barges lies here between charters.",
      "Those idle vessels carry some of the heaviest fouling in the northern emirates. Because they are often waiting for their next contract, there is time to do a full job properly.",
    ],
    work: [
      "Heavy-growth hull cleaning on idle offshore vessels",
      "Fuel and slop tank cleaning between charters",
      "Product tanker grade changes",
      "Deck cargo areas, voids and bulk tanks",
    ],
    services: ["underwater-hull-cleaning", "tank-cleaning", "hold-cleaning"],
    faqs: [
      { q: "Do you prepare offshore vessels for a new charter?", a: "Yes — hull cleaning, propeller polishing and tank cleaning so the vessel joins the charter clean and on performance." },
      { q: "Where are slops disposed of at Hamriyah?", a: "Through licensed contractors in the free zone, arranged as part of the job." },
    ],
  },
  {
    slug: "ajman",
    name: "Ajman",
    area: "Ajman",
    waterBody: "Arabian Gulf",
    unlocode: "AEAJM",
    hook: "Our home port — head office in Ajman Free Zone.",
    seoTitle: "Hull & Hold Cleaning at Ajman Port",
    metaDescription:
      "Hull cleaning, propeller polishing and hold cleaning at Ajman Port, from Cleanship's head office in Ajman Free Zone. The fastest mobilisation in the UAE.",
    body: [
      "Ajman is a compact creek-mouth port handling general cargo, aggregates, timber and steel for the northern emirates, with a resident fleet of coasters, dhows and barges.",
      "Cleanship's head office is in Ajman Free Zone, so this is our shortest mobilisation anywhere. Shallow, warm creek water and long idle spells mean hulls here foul heavily, with sea chests and gratings the usual problem.",
    ],
    work: [
      "Heavy fouling removal on coasters and barges",
      "Sea chest and inlet grating clearance",
      "Mixed-residue hold cleaning on small bulk tonnage",
      "Teams on board within hours",
    ],
    services: ["underwater-hull-cleaning", "hold-cleaning", "propeller-polishing"],
    faqs: [
      { q: "Where is your office in Ajman?", a: "B.C. 1302955, Ajman Free Zone C1 Building, Ajman — our registered head office." },
      { q: "Why do sea chests block so often at Ajman?", a: "The creek is shallow and warm, and vessels sit idle for long periods, so growth builds up in the sea chests and gratings." },
    ],
  },
  {
    slug: "ras-al-khaimah",
    name: "Ras Al Khaimah",
    area: "Ras Al Khaimah",
    waterBody: "Arabian Gulf",
    unlocode: "AERKT",
    hook: "Aggregates, cement and ceramics on the northern Gulf coast.",
    seoTitle: "Hold & Hull Cleaning at Ras Al Khaimah Port",
    metaDescription:
      "Cargo hold cleaning and hull work at Ras Al Khaimah Port — aggregates, cement and clinker residues, inlet clearance and fast turnarounds.",
    body: [
      "The Port of Ras Al Khaimah handles aggregates, cement and ceramics for the regional construction trade, mostly on Handysize bulk carriers and coasters.",
      "Rock dust from the aggregate trade settles into sea chest gratings and inlets, so inlet clearance is often a bigger job here than the hull fouling. In the holds, cement and clinker set hard if washed late.",
    ],
    work: [
      "Cement and clinker residue removal before it sets",
      "Hold cleaning started as each hold empties",
      "Sea chest and inlet clearance",
      "Hull cleaning at berth or anchorage",
    ],
    services: ["hold-cleaning", "underwater-hull-cleaning"],
    faqs: [
      { q: "Why is cement residue difficult?", a: "Cement and clinker react with water and harden. Once set, they need mechanical removal instead of washing, which takes far longer." },
      { q: "Can holds be cleaned during discharge?", a: "Yes. Our gangs start on each hold as it empties, so the ship is not held after the last grab." },
    ],
  },
  {
    slug: "saqr-port",
    name: "Saqr Port",
    area: "Ras Al Khaimah",
    waterBody: "Arabian Gulf",
    unlocode: "AEMSA",
    hook: "The Gulf's main limestone and aggregate loading terminal.",
    seoTitle: "Hold Cleaning at Saqr Port (Mina Saqr), RAK",
    metaDescription:
      "Hold cleaning and riding crews for bulk carriers loading limestone, aggregates and clinker at Saqr Port, Ras Al Khaimah. Hull and inlet work too.",
    body: [
      "Saqr Port is the Gulf's principal limestone and aggregate export terminal, loading crushed rock and cement products for the Gulf and the Indian subcontinent. Handysize and Supramax bulk carriers on short repeat voyages dominate.",
      "Limestone dust covers everything and packs into frames and brackets. Ships that load here and then need a clean hold for the next cargo need the full washing sequence, and the time to do it is the ballast passage.",
    ],
    work: [
      "Riding crews joining for the ballast passage",
      "Limestone and aggregate fines removed from frames and brackets",
      "Clinker residue removal",
      "Inlet and sea chest clearance from rock dust",
    ],
    services: ["hold-cleaning", "underwater-hull-cleaning"],
    faqs: [
      { q: "Can you make holds ready for grain after limestone?", a: "Yes, with a riding crew working the full sequence on passage: dry removal, high-pressure wash, fresh-water rinse and drying." },
      { q: "Is Saqr Port the same as Mina Saqr?", a: "Yes. Saqr Port and Mina Saqr are names for the same terminal in Ras Al Khaimah." },
    ],
  },
  {
    slug: "fujairah",
    name: "Fujairah",
    area: "Fujairah",
    waterBody: "Gulf of Oman",
    unlocode: "AEFJR",
    hook: "One of the world's largest bunkering anchorages.",
    seoTitle: "Hull Cleaning & UWILD at Fujairah Anchorage",
    metaDescription:
      "Underwater hull cleaning, propeller polishing, UWILD and tank cleaning at Fujairah port and anchorage, from our Fujairah base on the Gulf of Oman.",
    body: [
      "Fujairah is one of the world's biggest bunkering ports and the UAE's main port outside the Strait of Hormuz. Tankers and bulk carriers lie at the anchorage for days, waiting for bunkers or orders.",
      "That waiting time is the best in-water work window in the UAE, and the Gulf of Oman water here is clearer than inside the Gulf, which suits class surveys. Arabian Sea swell and the cyclone periods in June and October–November are the limits. Our Fujairah base works the anchorage directly.",
    ],
    work: [
      "Hull cleaning and polishing during bunker or orders waits",
      "UWILD and in-water surveys in clear water",
      "Product tanker grade changes and slop removal",
      "Bunker barge sludge and tank cleaning",
    ],
    services: ["underwater-hull-cleaning", "propeller-polishing", "in-water-survey-uwild", "tank-cleaning"],
    faqs: [
      { q: "Do you have an office in Fujairah?", a: "Yes — Al Maha Trading, Al Hail, Fujairah. It covers the anchorage and the east coast." },
      { q: "When is the weather a problem at Fujairah?", a: "Swell from the Arabian Sea affects the anchorage, especially in the cyclone periods around June and October–November. We plan dives around the forecast." },
    ],
  },
  {
    slug: "khor-fakkan",
    name: "Khor Fakkan",
    area: "Sharjah",
    waterBody: "Gulf of Oman",
    unlocode: "AEKLF",
    hook: "Deep-water transhipment terminal with the clearest water in the UAE.",
    seoTitle: "In-Water Survey & Hull Cleaning at Khor Fakkan",
    metaDescription:
      "In-water class surveys, UWILD and hull cleaning at Khor Fakkan Container Terminal on the Gulf of Oman — the clearest water of any UAE port.",
    body: [
      "Khor Fakkan is a deep-water transhipment container terminal on the east coast, outside the Strait of Hormuz, and that position is why main-line container ships call there.",
      "The water is deeper, cooler and much clearer than inside the Gulf, which makes Khor Fakkan one of the best places in the region for in-water surveys and documented inspections. Berth windows are tight, so work is planned to the minute.",
    ],
    work: [
      "UWILD and in-water class surveys",
      "Hull cleaning and polishing planned to the berth window",
      "Cell guide and bilge cleaning on large container ships",
      "Survey-grade video and reports",
    ],
    services: ["in-water-survey-uwild", "underwater-hull-cleaning", "propeller-polishing"],
    faqs: [
      { q: "Why choose Khor Fakkan for an in-water survey?", a: "Visibility. It sits on the Gulf of Oman, where the water is far clearer than at the Gulf ports, so the surveyor gets usable video." },
      { q: "Do you have a team at Khor Fakkan?", a: "Yes, we have a base at Khor Fakkan, alongside our Fujairah team on the same coast." },
    ],
  },
];

export const uae: SiteContent = {
  brand: "CleanShip UAE",
  tag: "UAE",
  topBar: "Hull, hold and tank cleaning across the UAE",
  primaryPhone: 1,
  servicesTitle: "Marine Cleaning Services in the UAE",
  portsPageTitle: "Hull, Hold & Tank Cleaning at UAE Ports",
  whyTitle: "Why UAE operators choose us",
  areaLabel: "Emirate",
  servicePortsLabel: "UAE ports",
  sisterSites: [
    { label: "cleanship.co — Global", url: "https://www.cleanship.co", hreflang: "x-default" },
    { label: "cleanship.gr — Greece", url: "https://www.cleanship.gr", hreflang: "el-GR" },
  ],
  domain: "cleanship.ae",
  url: "https://www.cleanship.ae",
  locale: "en_AE",
  lang: "en-AE",
  countryName: "United Arab Emirates",
  countryCode: "AE",
  defaultTitle: "CleanShip UAE | Underwater Hull, Hold & Tank Cleaning",
  description:
    "Underwater hull cleaning, propeller polishing, UWILD, hold and tank cleaning across UAE ports — Jebel Ali, Khalifa, Fujairah, Khor Fakkan, Sharjah and RAK. Head office in Ajman.",
  keywords: [
    "hull cleaning UAE",
    "underwater hull cleaning Dubai",
    "ship cleaning UAE",
    "hold cleaning UAE",
    "tank cleaning Fujairah",
    "UWILD UAE",
    "marine services Ajman",
  ],
  placesLabel: "UAE Ports",
  placesTitle: "Every major UAE port, east coast and Gulf",
  placesIntro:
    "From Ruwais in the west to Khor Fakkan on the Gulf of Oman. Each port has its own authority, its own approval process and its own water — here is what the work looks like at each one.",
  home: {
    eyebrow: "CleanShip UAE",
    title: "Hull, hold and tank cleaning in every UAE port",
    lead: "Diver teams, hold gangs and tank crews based in Ajman, Fujairah and Khor Fakkan — working Jebel Ali, Abu Dhabi, Sharjah, Ras Al Khaimah and the Fujairah anchorage, with the port approvals handled for you.",
    image: "/images/oil-tanker-aerial.jpg",
    imageAlt: "Tanker at anchor seen from above",
    introTitle: "A UAE contractor, not a visiting one",
    intro: [
      "Cleanship Marine Services FZE is registered in Ajman Free Zone, with bases in Fujairah and Khor Fakkan. Our teams, dive equipment and cleaning gear are kept in the UAE, so a job in Dubai, Abu Dhabi or Fujairah is a drive, not a flight.",
      "That matters in a country where ships move fast. We know how each port authority wants in-water work applied for, which berths allow it and which push it to the anchorage, and how to fit a job around the summer midday break.",
    ],
    why: [
      { title: "Local teams, same-day reach", body: "Head office in Ajman, bases in Fujairah and Khor Fakkan. Most UAE ports are within a few hours." },
      { title: "Port approvals handled", body: "DP World, AD Ports, Sharjah Ports Authority, RAK Ports, Port of Fujairah — we apply, you get on with the call." },
      { title: "Built for Gulf water", body: "Hot, salty water fouls hulls fast. We plan cleaning intervals for Gulf conditions, not northern-trade averages." },
      { title: "Class-approved inspection", body: "BW Class approved Remote Inspection Techniques supplier, certificate BW/096439, issued in Dubai." },
    ],
    process: [
      { title: "Tell us the ship, port and window", body: "Vessel, port, ETA and what you need. The operations desk answers 24/7." },
      { title: "Scope and approval", body: "We size the job, quote it and apply to the port authority." },
      { title: "The team works", body: "Divers or gangs arrive with their own equipment, at berth or anchorage." },
      { title: "Report and video", body: "Before-and-after video and a written report go to your technical department." },
    ],
    faqs: [
      { q: "Where in the UAE do you work?", a: "Every major UAE port: Jebel Ali and Port Rashid in Dubai, Khalifa Port, Zayed Port and Ruwais in Abu Dhabi, Port Khalid, Hamriyah and Khor Fakkan in Sharjah, Ajman, Ras Al Khaimah, Saqr Port and Fujairah." },
      { q: "Where are your UAE offices?", a: "Our head office is at B.C. 1302955, Ajman Free Zone C1 Building, Ajman. We also have bases in Fujairah (Al Maha Trading, Al Hail) and Khor Fakkan." },
      { q: "How fast can you mobilise?", a: "Teams are kept in the UAE, so most jobs can start within a day of approval. Ajman and Sharjah can often be the same day." },
      { q: "Do you handle the port authority approval?", a: "Yes. We apply to the relevant port authority with the dive or work plan, so the approval is ready when the ship arrives." },
      { q: "Do you work outside the UAE?", a: "Yes. Cleanship also has offices in Saudi Arabia, India, Sri Lanka and Guinea, and riding crews that sail anywhere. See cleanship.co for our full coverage." },
    ],
  },
  about: {
    title: "Cleanship in the UAE",
    lead: "Registered in Ajman Free Zone, working every UAE port since 2019.",
    paras: [
      "Cleanship Marine Services FZE is a marine cleaning and inspection contractor registered in Ajman Free Zone under licence B.C. 1302955. The UAE is where the company is based, and where its teams, equipment and dive spreads are kept.",
      "We clean hulls, polish propellers, carry out in-water surveys and UWILD, clean cargo holds and tanks, and provide class-approved remote inspection — at berths, at anchorage and on passage.",
      "Our UAE bases are Ajman, Fujairah and Khor Fakkan. Beyond the UAE we have offices in Dammam, Kandla, Mumbai, Lucknow, Visakhapatnam, Colombo and Conakry, so a ship that leaves the UAE can be picked up again at its next port.",
    ],
  },
  servicesIntro:
    "Six service lines, each delivered by our own UAE-based teams with their own equipment — at berth, at anchorage or on passage.",
  contactIntro:
    "Tell us the vessel, the UAE port and the window. You get a scope, a team size and an honest duration, usually the same working day.",
  officeOrder: ["United Arab Emirates", "Saudi Arabia", "India", "Sri Lanka", "Guinea"],
  services,
  places,
  areaServed: ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah", "Fujairah", "Umm Al Quwain", "Khor Fakkan"],
};
