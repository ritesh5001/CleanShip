import type { Place, Service, SiteContent } from "./types";

/**
 * cleanship.gr — written for Greek shipowners, technical managers and
 * superintendents in Piraeus and Athens.
 *
 * Cleanship has no office in Greece and this site does not claim one. The
 * Greek-owned fleet is the largest in the world and trades everywhere; the
 * offer here is "your ship is calling the Gulf, India, Sri Lanka or West
 * Africa — we are already there". Every port listed is one where Cleanship has
 * an office or a working base. Do not add Greek ports without real work there.
 */

const services: Service[] = [
  {
    slug: "hold-cleaning",
    name: "Hold Cleaning & Riding Crews",
    short: "Riding crews and shore gangs that get bulk carrier holds passed first time.",
    seoTitle: "Hold Cleaning Riding Crews for Greek Bulkers",
    metaDescription:
      "Hold cleaning riding crews and shore gangs for Greek-managed bulk carriers in the Gulf, India, Sri Lanka and West Africa. Grain-clean to pass surveyor inspection.",
    icon: "hold",
    image: "/images/cargo-holds-open.jpg",
    intro: [
      "For a dry bulk technical department, a failed hold inspection is one of the most expensive surprises a fixture can bring: off-hire, re-cleaning at port rates, and a charterer who remembers. The cleaning itself is rarely the hard part — doing it in the time between discharge and the next load port is.",
      "Cleanship supplies riding crews that join your ship at a discharge port and clean the holds on the ballast passage, and shore gangs that work alongside at our base ports in the UAE, Saudi Arabia, India, Sri Lanka and Guinea. We work to the standard the next cargo needs and report hold by hold to your superintendent.",
    ],
    points: [
      "Riding crews join at the discharge port with their own equipment",
      "Shovel-clean to grain-clean, ready for surveyor inspection",
      "Limestone, cement, coal, bauxite, sulphur and fertiliser residues",
      "Daily hold-by-hold progress report with photos to the office",
      "Chemicals, high-pressure pumps and PPE supplied by us",
    ],
    sections: [
      {
        heading: "Cleaning on the ballast leg",
        body: "Most Greek-managed bulkers do not have the time alongside to bring holds from a dirty cargo to grain-clean. A riding crew uses the ballast passage instead: dry removal and washing on the first days, fresh-water rinse and drying before arrival. The ship reaches the load port ready for the surveyor rather than waiting for a shore gang.",
      },
      {
        heading: "Residues from the trades we serve",
        body: "Our base ports load and discharge some of the hardest residues in dry bulk — limestone and aggregates in the UAE, bauxite in Guinea, coal, salt and fertiliser in western India. Each needs its own method, and we send crews who have cleaned it before.",
      },
      {
        heading: "Reporting your office can use",
        body: "The superintendent in Piraeus sees progress every day: which holds are finished, what remains, and photographs of the frames, hopper corners and hatch coamings that surveyors check first. No surprises on arrival.",
      },
    ],
    faqs: [
      {
        q: "Where can your riding crews join a ship?",
        a: "At any port where we have an office or base — the UAE, Saudi Arabia, India, Sri Lanka and Guinea — and at other ports by arrangement, subject to visas and crew change rules.",
      },
      {
        q: "Can you bring holds to grain-clean after coal or limestone?",
        a: "Yes, with enough passage time. The sequence is dry removal, high-pressure sea-water wash, chemical cleaning where needed, fresh-water rinse and drying. We tell you before the crew joins whether the passage is long enough.",
      },
      {
        q: "How do we receive progress updates?",
        a: "A daily report with hold-by-hold status and photos is sent to the office and the master.",
      },
    ],
    keywords: ["hold cleaning riding crew", "bulk carrier hold cleaning", "grain clean holds", "hold cleaning Greece", "Greek ship management hold cleaning"],
  },
  {
    slug: "underwater-hull-cleaning",
    name: "Underwater Hull Cleaning",
    short: "In-water hull cleaning that protects CII ratings and EU ETS costs.",
    seoTitle: "Underwater Hull Cleaning for Greek Fleets",
    metaDescription:
      "Underwater hull cleaning for Greek-managed ships calling the UAE, Saudi Arabia, India, Sri Lanka and West Africa. Cut fuel, protect CII ratings and EU ETS costs.",
    icon: "hull",
    image: "/images/vessel-on-passage.jpg",
    intro: [
      "Since 2023 every ship over 5,000 GT carries an annual Carbon Intensity Indicator rating, and since 2024 voyages to and from EU ports pay for their emissions under the EU Emissions Trading System. A fouled hull now costs more than extra fuel — it costs a worse rating and more allowances to surrender.",
      "We clean hulls in the water at our base ports in the Gulf, the Indian subcontinent and West Africa — warm-water regions where fouling builds fastest. A clean in Fujairah or Kandla before a long voyage pays back over the whole passage.",
    ],
    points: [
      "Diver-operated brush carts and hand cleaning",
      "Sea chests, gratings and bilge keels included",
      "Port approval handled at each port",
      "Before-and-after video and hull condition report",
      "Timed to waiting periods at anchorage where possible",
    ],
    sections: [
      {
        heading: "Where fouling happens",
        body: "Warm water and idle time cause fouling. The ports we work in — the Arabian Gulf, western India, Sri Lanka and the Gulf of Guinea — are all warm-water ports, and many ships wait at anchorage there for berths, bunkers or orders. That waiting is when growth starts, and also the best time to remove it.",
      },
      {
        heading: "CII, EU ETS and FuelEU",
        body: "A smoother hull means less fuel for the same speed, which improves the CII rating and reduces the emissions the ship pays for under EU ETS and counts under FuelEU Maritime. For a fleet trading into Europe, hull condition is now a commercial figure, not only a technical one.",
      },
    ],
    faqs: [
      {
        q: "Where can you clean a hull?",
        a: "At our base ports in the UAE (including the Fujairah anchorage), Saudi Arabia, India, Sri Lanka and Guinea. Each port's approval process is different and we handle it.",
      },
      {
        q: "Will you send evidence for our records?",
        a: "Yes — before-and-after video of each area cleaned and a written hull condition report for the vessel file.",
      },
    ],
    keywords: ["underwater hull cleaning", "hull cleaning CII", "hull cleaning EU ETS", "in-water hull cleaning Fujairah", "hull cleaning Greek shipowners"],
  },
  {
    slug: "propeller-polishing",
    name: "Propeller Polishing",
    short: "In-water propeller polishing between dockings.",
    seoTitle: "Propeller Polishing for Greek-Managed Ships",
    metaDescription:
      "In-water propeller polishing for Greek-managed bulk carriers and tankers at ports in the UAE, India, Sri Lanka and West Africa. Lower fuel use between dockings.",
    icon: "hull",
    image: "/images/bulk-carrier-berth.jpg",
    intro: [
      "Propeller polishing is the cheapest efficiency measure a technical manager can order between dry dockings. A rough blade surface costs fuel on every mile; polishing it in the water restores the finish in a few hours.",
      "We polish propellers at our base ports, usually combined with a hull clean under the same port approval and in the same dive window.",
    ],
    points: [
      "Fixed-pitch and controllable-pitch propellers",
      "Blade-by-blade video before and after",
      "Combined with hull cleaning in one approval",
      "Rope guard and seal area inspected",
      "Done at anchorage while the ship waits",
    ],
    sections: [
      {
        heading: "Fit it into the voyage",
        body: "Polishing takes hours, not days. Booked for a known waiting period — bunkers at Fujairah, a berth at Kandla or Conakry — it costs no extra time at all.",
      },
      {
        heading: "Evidence for the vessel file",
        body: "Each blade is filmed before and after, and the report goes to the office, so performance analysis can match the polishing date to the fuel curve.",
      },
    ],
    faqs: [
      { q: "How long does propeller polishing take?", a: "Usually a few hours for a bulk carrier or tanker propeller, depending on size and condition." },
      { q: "Can it be done with the hull clean?", a: "Yes, under the same port approval and dive window, which is the most cost-effective way to book it." },
    ],
    keywords: ["propeller polishing", "in-water propeller polishing", "propeller polishing bulk carrier", "propeller polishing tanker"],
  },
  {
    slug: "in-water-survey-uwild",
    name: "In-Water Survey & UWILD",
    short: "Class-attended underwater inspection in lieu of dry docking.",
    seoTitle: "UWILD & In-Water Survey for Greek Fleets",
    metaDescription:
      "UWILD and in-water class surveys for Greek-managed ships, with live video to the surveyor. Clear-water locations on the UAE east coast, plus India and Sri Lanka.",
    icon: "hull",
    image: "/images/oil-tanker-aerial.jpg",
    intro: [
      "An Underwater Inspection in Lieu of Dry-docking (UWILD) lets an eligible ship complete its bottom survey in the water and skip the intermediate docking — keeping her trading instead of sailing to a yard.",
      "We carry out UWILD and in-water class inspections with surface-supplied divers, live video to the attending surveyor and reports structured to the society's checklist. For the clearest water we recommend the UAE east coast, at Khor Fakkan or the Fujairah anchorage.",
    ],
    points: [
      "Live video and voice to the surveyor",
      "Hull plating, sea chests, rudder, propeller and stern tube",
      "Thickness readings where required",
      "Eligibility agreed with class before mobilising",
      "Clear-water locations on the Gulf of Oman",
    ],
    sections: [
      {
        heading: "Keep the ship trading",
        body: "An intermediate docking means a deviation, yard time and off-hire. Where class allows UWILD, the survey is done during a normal port call or anchorage wait, and the ship continues her voyage.",
      },
      {
        heading: "Choosing the location",
        body: "The surveyor has to see what they sign off. Khor Fakkan and Fujairah, outside the Strait of Hormuz, generally offer far better visibility than ports inside the Arabian Gulf. We advise on location when the voyage plan allows a choice.",
      },
    ],
    faqs: [
      { q: "Is our ship eligible for UWILD?", a: "Eligibility depends on age, class notation and survey history, and it is decided by the class society. We confirm it with the society before planning." },
      { q: "Which location do you recommend?", a: "Khor Fakkan or Fujairah on the UAE east coast, where the water is clearest. India and Sri Lanka are also possible depending on season and visibility." },
    ],
    keywords: ["UWILD", "in-water survey", "underwater inspection in lieu of dry docking", "UWILD Fujairah", "class in-water survey"],
  },
  {
    slug: "tank-cleaning",
    name: "Tank Cleaning",
    short: "Tank cleaning for product and chemical tankers.",
    seoTitle: "Tank Cleaning for Greek-Managed Tankers",
    metaDescription:
      "Tank cleaning for Greek-managed product and chemical tankers at Fujairah, the Gulf and India — grade changes, slop and sludge removal, gas-freeing.",
    icon: "tank",
    image: "/images/product-tanker.jpg",
    intro: [
      "Greek owners control one of the world's largest tanker fleets, and many of those ships pass through Fujairah, the Gulf and western India. When the next cargo needs a grade change, the tanks must be ready on arrival at the load port.",
      "We provide tank cleaning teams with gas-free monitoring, enclosed-space entry procedures and slop disposal through licensed reception facilities.",
    ],
    points: [
      "Grade changes on product and chemical tankers",
      "Slop, sludge and fuel tank cleaning",
      "Continuous atmosphere monitoring",
      "Slop disposal through licensed facilities",
      "Work during anchorage waits at Fujairah",
    ],
    sections: [
      {
        heading: "Using the wait at Fujairah",
        body: "Tankers often wait at the Fujairah anchorage for orders or bunkers. That time can be used to clean tanks for the next grade, with slops landed ashore before departure.",
      },
      {
        heading: "Safety and paperwork",
        body: "Every entry is under a written permit with gas readings before and during the work. Disposal receipts and cleaning records are returned to the ship and the office.",
      },
    ],
    faqs: [
      { q: "Where can you clean tanks?", a: "Mainly at Fujairah and in the UAE, at Dammam, and at Indian ports such as Kandla and Mumbai." },
      { q: "Do you handle slop disposal?", a: "Yes, through licensed reception facilities, with receipts returned for the vessel's records." },
    ],
    keywords: ["tanker tank cleaning", "tank cleaning Fujairah", "grade change tank cleaning", "slop tank cleaning", "chemical tanker cleaning"],
  },
  {
    slug: "remote-inspection-ndt",
    name: "Remote Inspection (RIT) & NDT",
    short: "BW Class approved drone survey, thickness gauging and NDT.",
    seoTitle: "Remote Inspection (RIT) & Thickness Gauging",
    metaDescription:
      "BW Class approved Remote Inspection Techniques (RIT) supplier: drone close-up survey of holds and tanks, thickness gauging and NDT for Greek-managed fleets.",
    icon: "ndt",
    image: "/images/ndt-technician.jpg",
    intro: [
      "Close-up surveys of holds and ballast tanks normally need staging or rope access, which costs time and money and puts people at height. Remote Inspection Techniques — drones, crawlers and cameras — reach the same structure without it.",
      "Cleanship Marine Services FZE is approved by Blue Wave Classification (BW Class) as a service supplier for survey using Remote Inspection Techniques as an alternative means of close-up survey, certificate BW/096439. We also provide ultrasonic thickness gauging and NDT.",
    ],
    points: [
      "BW Class approved RIT supplier — certificate BW/096439",
      "Drone close-up survey of holds, tanks and voids",
      "Ultrasonic thickness gauging",
      "NDT inspection",
      "Live feed to the attending surveyor",
    ],
    sections: [
      {
        heading: "Faster special surveys",
        body: "For ageing bulk carriers and tankers, close-up survey and gauging is a large part of a special survey. Doing it remotely cuts staging time and can move part of the work from the yard to a port call.",
      },
      {
        heading: "Agreed with class first",
        body: "Acceptance of RIT in place of conventional close-up survey is decided by the class society for each scope. We confirm it in writing before the inspection.",
      },
    ],
    faqs: [
      { q: "Which class approval do you hold?", a: "Blue Wave Classification (BW Class) Certificate of Approval of Service Supplier no. BW/096439, for survey using Remote Inspection Techniques, valid until 23 July 2029." },
      { q: "Does every class society accept RIT?", a: "Acceptance is scope-specific and each society decides. We agree it with your society before the survey." },
    ],
    keywords: ["remote inspection techniques", "RIT drone survey", "thickness gauging bulk carrier", "close-up survey drone", "NDT ship inspection"],
  },
];

const places: Place[] = [
  {
    slug: "fujairah",
    name: "Fujairah",
    area: "United Arab Emirates",
    waterBody: "Gulf of Oman",
    unlocode: "AEFJR",
    hook: "Bunkering anchorage — the best waiting-time window in the region.",
    seoTitle: "Fujairah: Hull Cleaning, UWILD & Tank Cleaning",
    metaDescription:
      "Hull cleaning, propeller polishing, UWILD and tank cleaning at Fujairah anchorage for Greek-managed tankers and bulk carriers. Local Cleanship base.",
    body: [
      "Fujairah is one of the world's largest bunkering hubs, and Greek-managed tankers and bulk carriers call it constantly. Ships lie at the anchorage for days waiting for bunkers or orders — time that can be used for hull cleaning, propeller polishing, tank cleaning or a UWILD.",
      "The water on the Gulf of Oman is clearer than inside the Gulf, which suits in-water class surveys. Cleanship has a base in Fujairah, so the team is already there when your ship anchors.",
    ],
    work: [
      "Hull cleaning and polishing during bunkering waits",
      "UWILD in clear Gulf of Oman water",
      "Tanker grade changes and slop removal",
      "Hold cleaning gangs and riding crew joining",
    ],
    services: ["underwater-hull-cleaning", "propeller-polishing", "in-water-survey-uwild", "tank-cleaning"],
    faqs: [
      { q: "Do you have a team in Fujairah?", a: "Yes. Our Fujairah base (Al Maha Trading, Al Hail) works the anchorage directly." },
      { q: "Can a UWILD be done during a bunkering stop?", a: "Often, yes, if class agrees the scope and the wait is long enough. We plan it with the agent and the surveyor." },
    ],
  },
  {
    slug: "saqr-port",
    name: "Saqr Port (Ras Al Khaimah)",
    area: "United Arab Emirates",
    waterBody: "Arabian Gulf",
    unlocode: "AEMSA",
    hook: "Limestone loading for Handysize and Supramax bulkers.",
    seoTitle: "Saqr Port: Hold Cleaning After Limestone",
    metaDescription:
      "Hold cleaning riding crews for Greek-managed bulk carriers loading limestone and aggregates at Saqr Port, Ras Al Khaimah, UAE.",
    body: [
      "Saqr Port in Ras Al Khaimah is the Gulf's main limestone and aggregate export terminal, and Handysize and Supramax bulkers — many of them Greek-managed — load there for the Gulf and the Indian subcontinent.",
      "Limestone dust packs into frames and hopper corners. If the next cargo needs clean holds, a riding crew joining after discharge can bring them back on the ballast leg. Our head office in Ajman is a short drive away.",
    ],
    work: [
      "Riding crews for the ballast passage after discharge",
      "Limestone and aggregate fines removed from frames",
      "Clinker and cement residue removal",
      "Hull cleaning and inlet clearance",
    ],
    services: ["hold-cleaning", "underwater-hull-cleaning"],
    faqs: [
      { q: "Can holds go to grain-clean after limestone?", a: "Yes, with the full sequence on passage: dry removal, washing, fresh-water rinse and drying." },
      { q: "How close is your team?", a: "Our head office in Ajman Free Zone is about an hour from Saqr Port." },
    ],
  },
  {
    slug: "dammam",
    name: "Dammam",
    area: "Saudi Arabia",
    waterBody: "Arabian Gulf",
    unlocode: "SADMM",
    hook: "Saudi Arabia's main Gulf-coast gateway.",
    seoTitle: "Dammam: Hull, Hold & Tank Cleaning",
    metaDescription:
      "Hull cleaning, hold cleaning and tank cleaning in Dammam and Jubail for Greek-managed ships, from Cleanship's office in Dammam, Saudi Arabia.",
    body: [
      "Dammam's King Abdulaziz Port is Saudi Arabia's main gateway on the Arabian Gulf, handling containers, bulk and general cargo, with the industrial port of Jubail close by.",
      "Cleanship has an office in Dammam, at the Hamra Commercial Centre, covering the Saudi Gulf coast. Warm, salty Gulf water fouls hulls quickly, so ships trading regularly to Saudi ports benefit from cleaning on a planned interval.",
    ],
    work: [
      "Hull cleaning and propeller polishing",
      "Hold cleaning for bulk and general cargo ships",
      "Tank cleaning in the Dammam–Jubail area",
      "Riding crews joining in Saudi Arabia",
    ],
    services: ["underwater-hull-cleaning", "hold-cleaning", "tank-cleaning"],
    faqs: [
      { q: "Where is your Saudi office?", a: "Hamra Commercial Centre, 1st Floor, Office 106, Dammam, Saudi Arabia." },
      { q: "Do you cover Jubail too?", a: "Yes, Jubail is covered from our Dammam office." },
    ],
  },
  {
    slug: "kandla",
    name: "Kandla (Deendayal Port)",
    area: "India",
    waterBody: "Gulf of Kutch",
    unlocode: "INIXY",
    hook: "Bulk, salt, fertiliser and grain on India's west coast.",
    seoTitle: "Kandla: Hold & Hull Cleaning for Bulk Carriers",
    metaDescription:
      "Hold cleaning, hull cleaning and propeller polishing at Kandla (Deendayal Port) and the Kutch ports for Greek-managed bulk carriers and tankers.",
    body: [
      "Kandla — Deendayal Port — is one of India's largest ports by cargo volume, handling coal, salt, fertiliser, grain and edible oils, and many Greek-managed bulkers and tankers call there and at nearby Mundra.",
      "Cleanship's Gujarat office is in Gandhidham, close to the port, with divers, compressors and hold cleaning gangs kept locally. Ships waiting at the anchorage for a berth can have hull work done during the wait.",
    ],
    work: [
      "Hold cleaning after coal, salt and fertiliser",
      "Hull cleaning and polishing during berth waits",
      "Riding crews joining in India",
      "Tank cleaning for edible oil and product tankers",
    ],
    services: ["hold-cleaning", "underwater-hull-cleaning", "propeller-polishing", "tank-cleaning"],
    faqs: [
      { q: "Where is your Kandla office?", a: "Plot No. 77, Bhageshree Township 1, Nr. Airport Chowkdi, Gandhidham, Kachchh, Gujarat 370210, India." },
      { q: "Do you also work at Mundra?", a: "Yes, the Kutch ports including Mundra are covered from our Kandla office." },
    ],
  },
  {
    slug: "mumbai",
    name: "Mumbai & Nhava Sheva",
    area: "India",
    waterBody: "Arabian Sea",
    unlocode: "INBOM",
    hook: "India's busiest west-coast port complex.",
    seoTitle: "Mumbai: Hull Cleaning & Tank Cleaning",
    metaDescription:
      "Hull cleaning, propeller polishing and tank cleaning at Mumbai and Nhava Sheva (JNPT) for Greek-managed ships, from Cleanship's Mumbai office.",
    body: [
      "Mumbai port and Nhava Sheva across the harbour together handle much of India's west-coast container, liquid bulk and general cargo traffic.",
      "Cleanship's Mumbai office is on P D'Mello Road beside the Victoria Docks. The monsoon from June to September limits diving at exposed anchorages, so we plan underwater work for the dry season where the schedule allows.",
    ],
    work: [
      "Hull cleaning and propeller polishing",
      "Tank cleaning for product and chemical tankers",
      "Hold and space cleaning",
      "Work planned around the monsoon season",
    ],
    services: ["underwater-hull-cleaning", "propeller-polishing", "tank-cleaning"],
    faqs: [
      { q: "Where is your Mumbai office?", a: "1st Floor, Loha Bhavan, Room No. 3, P D'Mello Road, Carnac Road, Victoria Docks, Masjid Bandar East, Mumbai, Maharashtra 400009." },
      { q: "Can you work during the monsoon?", a: "Sheltered work continues, but diving at exposed anchorages is limited from June to September. We advise on timing when you send the voyage plan." },
    ],
  },
  {
    slug: "colombo",
    name: "Colombo",
    area: "Sri Lanka",
    waterBody: "Indian Ocean",
    unlocode: "LKCMB",
    hook: "Transhipment and bunkering stop on the East–West route.",
    seoTitle: "Colombo: Hull Cleaning & Propeller Polishing",
    metaDescription:
      "Hull cleaning, propeller polishing and in-water inspection at Colombo, Sri Lanka, for Greek-managed ships on the Asia–Europe route.",
    body: [
      "Colombo sits on the main shipping lane between Asia, the Middle East and Europe, and many ships stop there for transhipment, bunkers or crew changes.",
      "Cleanship's Sri Lanka office is in Colombo. A stop on the way to or from the Suez Canal is a practical point to clean the hull and polish the propeller before a long passage.",
    ],
    work: [
      "Hull cleaning before long passages",
      "Propeller polishing during bunker stops",
      "In-water inspection",
      "Riding crews joining in Sri Lanka",
    ],
    services: ["underwater-hull-cleaning", "propeller-polishing", "in-water-survey-uwild"],
    faqs: [
      { q: "Where is your Colombo office?", a: "Colombo Mercantile Logistics, No 23, Alfred Place, Colombo, Sri Lanka." },
      { q: "Why clean at Colombo?", a: "It is on the Asia–Europe route, so a clean hull and propeller there benefit the whole remaining passage." },
    ],
  },
  {
    slug: "conakry",
    name: "Conakry",
    area: "Guinea",
    waterBody: "Atlantic Ocean",
    unlocode: "GNCKY",
    hook: "Bauxite country — West Africa's biggest dry bulk export trade.",
    seoTitle: "Conakry: Hold & Hull Cleaning, West Africa",
    metaDescription:
      "Hold cleaning, hull cleaning and propeller polishing at Conakry, Guinea, for Greek-managed bulk carriers in the bauxite trade. Local Cleanship office.",
    body: [
      "Guinea is one of the world's largest bauxite exporters, and Greek-managed bulk carriers are a large part of the fleet loading on its coast. Ships often wait off the coast for loading slots in warm tropical water, where fouling builds quickly.",
      "Cleanship's West African office is in Conakry. Our teams clean hulls during anchorage waits and clean holds after bauxite, a fine residue that gets everywhere and must be removed before most next cargoes.",
    ],
    work: [
      "Hull cleaning and polishing during loading waits",
      "Hold cleaning after bauxite",
      "Riding crews joining in West Africa",
      "Inspection and reporting to the Piraeus office",
    ],
    services: ["underwater-hull-cleaning", "propeller-polishing", "hold-cleaning"],
    faqs: [
      { q: "Where is your Conakry office?", a: "CleanShip Marine SUCC, 8th Avenue, Sonoco Trade, Conakry, Guinea." },
      { q: "Why does bauxite residue need careful cleaning?", a: "It is fine and sticky when wet, gets into frames and hatch coamings, and stains — so it must be removed fully before a clean cargo." },
    ],
  },
  {
    slug: "visakhapatnam",
    name: "Visakhapatnam",
    area: "India",
    waterBody: "Bay of Bengal",
    unlocode: "INVTZ",
    hook: "Deep-water bulk ports on India's east coast.",
    seoTitle: "Visakhapatnam: Hold & Hull Cleaning",
    metaDescription:
      "Hold cleaning and hull cleaning at Visakhapatnam, Gangavaram and Kakinada for Greek-managed bulk carriers, from Cleanship's east coast office.",
    body: [
      "Visakhapatnam and nearby Gangavaram are deep-water ports on India's east coast, handling iron ore, coal and other bulk cargoes — trades where Greek-managed Capesize and Panamax tonnage is common.",
      "Cleanship's east coast office is in Visakhapatnam. One mobilisation often covers more than one ship across Visakhapatnam, Gangavaram and Kakinada.",
    ],
    work: [
      "Hold cleaning after iron ore and coal",
      "Hull cleaning and propeller polishing",
      "Riding crews joining on India's east coast",
      "Several ships covered in one mobilisation",
    ],
    services: ["hold-cleaning", "underwater-hull-cleaning", "propeller-polishing"],
    faqs: [
      { q: "Do you cover Gangavaram and Kakinada?", a: "Yes, both are covered from our Visakhapatnam office." },
      { q: "Can riding crews join on the east coast?", a: "Yes, subject to the ship's schedule and port crew change rules." },
    ],
  },
];

export const greece: SiteContent = {
  brand: "CleanShip Greece",
  tag: "Greece",
  topBar: "Marine cleaning for Greek-managed fleets",
  primaryPhone: 0,
  servicesTitle: "Marine Cleaning Services for Greek Fleets",
  portsPageTitle: "Ports Where We Serve Greek Fleets",
  whyTitle: "Why Greek managers choose us",
  areaLabel: "Country",
  servicePortsLabel: "Where we do it",
  officesNote:
    "We do not have an office in Greece. Greek shipowners and managers work with our 24/7 operations desk by email, phone and WhatsApp, and our teams deliver the work from the offices above.",
  sisterSites: [
    { label: "cleanship.co — Global", url: "https://www.cleanship.co", hreflang: "x-default" },
    { label: "cleanship.ae — UAE", url: "https://www.cleanship.ae", hreflang: "en-AE" },
  ],
  domain: "cleanship.gr",
  url: "https://www.cleanship.gr",
  locale: "en_GR",
  lang: "en-GR",
  countryName: "Greece",
  countryCode: "GR",
  defaultTitle: "CleanShip Greece | Hull & Hold Cleaning for Shipowners",
  description:
    "Hold cleaning riding crews, underwater hull cleaning, UWILD and tank cleaning for Greek-managed fleets — at ports in the UAE, Saudi Arabia, India, Sri Lanka and West Africa.",
  keywords: [
    "hold cleaning riding crew",
    "underwater hull cleaning",
    "UWILD",
    "Greek ship management",
    "Piraeus ship managers",
    "hull cleaning CII",
    "bulk carrier hold cleaning",
  ],
  placesLabel: "Ports We Serve",
  placesTitle: "Where your ships trade, we are already there",
  placesIntro:
    "Every port below is one where Cleanship has an office or a working base. When your ship's next call is on this list, the team is local — not flown in.",
  home: {
    eyebrow: "For Greek shipowners & managers",
    title: "Hull, hold and tank cleaning wherever your ships trade",
    lead: "Riding crews, dive teams and tank cleaners for Greek-managed bulk carriers and tankers — at our bases in the UAE, Saudi Arabia, India, Sri Lanka and West Africa, with daily reporting to your office in Piraeus.",
    image: "/images/bulk-carrier-berth.jpg",
    imageAlt: "Bulk carrier alongside at a loading berth",
    introTitle: "Built for the way Greek fleets work",
    intro: [
      "Greek owners control the largest merchant fleet in the world, and it trades everywhere. When a superintendent in Piraeus needs holds passed at a West African load port or a hull cleaned before a long voyage out of the Gulf, the question is who is already there.",
      "Cleanship Marine Services FZE has offices in the UAE, Saudi Arabia, India, Sri Lanka and Guinea. Our teams know those ports, those residues and those waiting times — and we report in a way a technical department can act on.",
    ],
    why: [
      { title: "Already where you trade", body: "Offices and bases in the UAE, Saudi Arabia, India, Sri Lanka and Guinea." },
      { title: "Reports for the office", body: "Daily progress with photos, video and a written report for the vessel file." },
      { title: "CII and EU ETS aware", body: "Hull and propeller work planned around efficiency ratings and emission costs." },
      { title: "Class-approved inspection", body: "BW Class approved Remote Inspection Techniques supplier, certificate BW/096439." },
    ],
    process: [
      { title: "Send the voyage plan", body: "Vessel, next ports, ETA and the job. The operations desk answers 24/7." },
      { title: "Scope and quote", body: "We confirm what fits the call or passage and quote it, usually the same day." },
      { title: "Local team mobilises", body: "Divers, gangs or a riding crew join from our nearest base." },
      { title: "Daily reports", body: "Progress, photos and a final report go to the office and the master." },
    ],
    faqs: [
      { q: "Do you have an office in Greece?", a: "No. Our offices are in the UAE, Saudi Arabia, India, Sri Lanka and Guinea — the regions where we do the work. We serve Greek shipowners and managers remotely, with a 24/7 operations desk and reporting to your office." },
      { q: "Which ports do you work in?", a: "Our base ports include Fujairah, Saqr Port and the other UAE ports, Dammam, Kandla, Mumbai, Visakhapatnam, Colombo and Conakry. Riding crews can join elsewhere by arrangement." },
      { q: "How do we request a quote?", a: "Send the vessel name or IMO, the next ports and ETA, and the job through the contact form, by email to admin@cleanship.co or by WhatsApp. We reply within one working day." },
      { q: "Do you work with all class societies?", a: "We work to the requirements of the ship's class society and agree survey scopes with the society in advance. Our Remote Inspection Techniques approval is from BW Class, certificate BW/096439." },
      { q: "Which time zone does your desk work in?", a: "The operations desk is manned 24/7, so Athens office hours are always covered." },
    ],
  },
  about: {
    title: "Cleanship for Greek fleets",
    lead: "A marine cleaning contractor in the regions your ships trade, reporting to your office in Greece.",
    paras: [
      "Cleanship Marine Services FZE is a marine cleaning and inspection contractor registered in Ajman Free Zone, UAE, under licence B.C. 1302955, working since 2019.",
      "We clean cargo holds with shore gangs and riding crews, clean hulls and polish propellers in the water, carry out UWILD and in-water surveys, clean tanks, and provide class-approved remote inspection.",
      "We do not have an office in Greece. Our offices are in Ajman, Fujairah, Khor Fakkan, Dammam, Kandla, Mumbai, Lucknow, Visakhapatnam, Colombo and Conakry — the ports where the work happens. What we offer Greek owners and managers is a team that is already at the next port, and reporting their office can rely on.",
    ],
  },
  servicesIntro:
    "Six service lines for bulk carriers, tankers and other tonnage, delivered by our own teams at our base ports and on passage.",
  contactIntro:
    "Send the vessel, the next ports and the job. We reply with a scope, a team and an honest duration, usually within one working day.",
  officeOrder: ["United Arab Emirates", "Saudi Arabia", "India", "Sri Lanka", "Guinea"],
  services,
  places,
  areaServed: ["Greece", "United Arab Emirates", "Saudi Arabia", "India", "Sri Lanka", "Guinea"],
};
