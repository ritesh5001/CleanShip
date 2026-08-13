/**
 * The complete service taxonomy.
 *
 * Everything downstream is generated from this file: the mega-menu, the
 * /services index, every category page, every service detail page, the XML
 * sitemap, the breadcrumb trail and the Service structured data. Add a service
 * here and it is fully routed, linked and indexed — no other file to touch.
 */

export type Faq = { q: string; a: string };

export type Service = {
  slug: string;
  name: string;
  /** Used in the browser tab / SERP headline. Keep under ~60 characters. */
  seoTitle: string;
  metaDescription: string;
  tagline: string;
  /** One-liner used on cards and in the mega-menu. */
  summary: string;
  intro: string[];
  highlights: string[];
  scope: { title: string; body: string }[];
  process: { title: string; body: string }[];
  appliesTo: string[];
  faqs: Faq[];
  keywords: string[];
};

export type ServiceCategory = {
  slug: string;
  name: string;
  seoTitle: string;
  metaDescription: string;
  tagline: string;
  summary: string;
  intro: string[];
  icon: IconKey;
  keywords: string[];
  faqs: Faq[];
  services: Service[];
};

export type IconKey =
  | "hold"
  | "tank"
  | "hull"
  | "offshore"
  | "ndt";

export const serviceCategories: ServiceCategory[] = [
  /* ------------------------------------------------------------------ */
  /* 1. HULL CLEANING                                                    */
  /* ------------------------------------------------------------------ */
  {
    slug: "hull-cleaning",
    name: "Hull Cleaning",
    icon: "hull",
    seoTitle: "Underwater Hull Cleaning & Propeller Polishing",
    metaDescription:
      "Underwater hull cleaning, propeller super polishing, thruster cleaning, in-water class survey and UWILD by commercial dive teams.",
    tagline: "Fuel savings that start the moment the divers surface",
    summary:
      "Commercial dive teams delivering hull cleaning, propeller polishing, thruster work, in-water surveys and UWILD.",
    keywords: [
      "underwater hull cleaning",
      "propeller polishing",
      "in water survey",
      "UWILD",
      "diving services UAE",
    ],
    intro: [
      "Hull fouling is the quietest cost on a vessel's P&L. A moderate layer of slime and barnacle growth can add double-digit percentages to fuel consumption, and it accumulates steadily between dry dockings without ever producing a defect report.",
      "Our commercial dive teams remove that fouling in the water, at anchorage or alongside, without taking the vessel off hire. The same teams carry out propeller polishing, thruster work, in-water class surveys and UWILD, so a single mobilisation can cover both the performance and the compliance side of underwater work.",
    ],
    faqs: [
      {
        q: "Will hull cleaning damage the antifouling coating?",
        a: "Not when the method is matched to the coating. Brush hardness, tool selection and operating pressure are chosen against the coating type and its remaining service life. An aggressive clean on a soft self-polishing coating shortens its life, which is why we ask for the coating specification before quoting.",
      },
      {
        q: "Do you need port permission to dive?",
        a: "Yes, and we obtain it. Diving permits, port authority approval and, where required, environmental clearance for cleaning operations are arranged as part of the job rather than left to the agent.",
      },
      {
        q: "How much fuel can hull cleaning actually save?",
        a: "It depends entirely on the fouling state, the hull form and the trade. Independently published studies put the penalty from heavy fouling well into double digits, but we would rather survey your hull and give you a specific assessment than quote a headline number.",
      },
    ],
    services: [
      {
        slug: "underwater-hull-cleaning",
        name: "Underwater Hull Cleaning",
        seoTitle: "Underwater Hull Cleaning | In-Water Fouling",
        metaDescription:
          "In-water hull cleaning by commercial divers at anchorage or alongside. Removal of slime, weed and barnacle fouling to restore speed and reduce fuel.",
        tagline: "Full hull cleaned in the water, vessel stays on hire",
        summary:
          "Diver-operated brush cart and hand cleaning of the full underwater hull, flat bottom and vertical sides.",
        keywords: [
          "underwater hull cleaning",
          "in water hull cleaning",
          "ship hull fouling removal",
          "brush cart hull cleaning",
        ],
        intro: [
          "We clean the complete underwater hull in the water — vertical sides, bilge keels, flat bottom, sea chests and niche areas — using diver-operated brush carts for large flat areas and hand tools for the geometry a cart cannot follow.",
          "The result is a hull returned to a hydrodynamically smooth condition, with the fouling removed before it reaches the calcareous stage where it starts damaging the coating itself. Work is carried out at anchorage or alongside, day or night, without interrupting cargo operations.",
        ],
        highlights: [
          "Full hull: vertical sides, flat bottom, bilge keels and niches",
          "Brush hardness selected against the antifouling specification",
          "Sea chests, gratings and inlet areas cleared",
          "Before-and-after video and photographic records",
          "No off-hire — work runs alongside cargo operations",
        ],
        scope: [
          {
            title: "Fouling survey",
            body: "A pre-clean dive establishes fouling type, coverage and severity, and confirms coating condition so the correct tooling is selected.",
          },
          {
            title: "Flat bottom and vertical sides",
            body: "Brush cart cleaning of large areas, removing slime, weed and shell growth to restore surface smoothness.",
          },
          {
            title: "Niche areas",
            body: "Hand cleaning of bilge keels, bow thruster tunnels, rudder, stern frame, anodes and other niche areas where fouling concentrates.",
          },
          {
            title: "Sea chests and gratings",
            body: "Sea chest gratings and inlet openings cleared of growth and debris to restore cooling water flow.",
          },
          {
            title: "Documentation",
            body: "Underwater video and stills before and after, with a written report covering coating condition and anode wastage.",
          },
        ],
        process: [
          {
            title: "Permits and approvals",
            body: "Port authority diving permission and any environmental approval for in-water cleaning are obtained before mobilisation.",
          },
          {
            title: "Safety setup",
            body: "Vessel is secured for diving — main engine and thrusters immobilised, sea suctions confirmed shut, and a permit agreed with the master.",
          },
          {
            title: "Cleaning dives",
            body: "Teams work the hull in planned panels under surface supervision with continuous diver communications and video.",
          },
          {
            title: "Report and debrief",
            body: "Completion report with video evidence is issued and the coating and anode condition discussed with the vessel.",
          },
        ],
        appliesTo: [
          "Bulk carriers and tankers",
          "Container ships",
          "Offshore vessels and barges",
          "Vessels idling at anchorage",
        ],
        faqs: [
          {
            q: "What is underwater hull cleaning?",
            a: "Underwater hull cleaning is the process of removing marine growth, algae, barnacles, and biofouling from a vessel's hull while it remains afloat. CleanShip Marine uses professional divers and specialized equipment to clean hulls without dry-docking, saving time and cost.",
          },
          {
            q: "Why is underwater hull cleaning important for ships?",
            a: "Marine growth on a hull increases drag, which raises fuel consumption and reduces vessel speed. Regular underwater hull cleaning restores hydrodynamic efficiency, improves fuel efficiency, lowers emissions, and extends the hull's coating life.",
          },
          {
            q: "How often should a ship's hull be cleaned underwater?",
            a: "Cleaning frequency depends on vessel trading routes, water temperature, and coating type, but most vessels benefit from underwater hull cleaning every 3-6 months to prevent heavy fouling buildup and maintain optimal fuel performance.",
          },
          {
            q: "Does underwater hull cleaning require dry docking?",
            a: "No. One of the biggest advantages of in-water hull cleaning is that it is performed by divers while the vessel is docked or anchored, eliminating costly dry-dock downtime and keeping the ship in service.",
          },
          {
            q: "What equipment and methods do you use for hull cleaning?",
            a: "CleanShip Marine uses diver-operated brush systems, ROV-assisted inspection tools, and eco-friendly cleaning techniques designed to remove hull fouling safely without damaging antifouling coatings or the ship's hull surface.",
          },
          {
            q: "Do you offer propeller polishing along with hull cleaning?",
            a: "Yes. Our underwater hull cleaning service includes propeller polishing, which removes marine growth and corrosion from propeller blades to restore smooth rotation, improve thrust efficiency, and reduce fuel costs.",
          },
          {
            q: "Is underwater hull cleaning safe for the vessel's coating?",
            a: "Yes. Our divers use controlled-pressure cleaning methods calibrated to the hull's antifouling coating type, ensuring effective marine growth removal without stripping or damaging the paint system.",
          },
          {
            q: "How does underwater hull cleaning improve fuel efficiency?",
            a: "A clean hull reduces drag through water, allowing the vessel to move more efficiently. Studies show that heavy hull fouling can increase fuel consumption significantly - regular hull cleaning helps recover lost efficiency and cut fuel costs.",
          },
          {
            q: "Do you provide underwater hull inspection and video survey reports?",
            a: "Yes. Along with cleaning, we offer underwater video survey and hull condition inspection reports, giving shipowners and fleet managers documented evidence of hull condition for compliance and maintenance records.",
          },
          {
            q: "Is underwater hull cleaning environmentally safe?",
            a: "Yes. CleanShip Marine follows eco-friendly hull cleaning practices and complies with port and environmental regulations to safely capture debris and prevent invasive marine species from spreading during the cleaning process.",
          },
          {
            q: "Which vessels can use your underwater hull cleaning service?",
            a: "We provide underwater hull cleaning services for bulk carriers, tankers, container ships, and offshore vessels of all sizes, with divers mobilized to ports worldwide on request.",
          },
          {
            q: "How do I book an underwater hull cleaning service?",
            a: "You can request a quote for underwater hull cleaning directly through our website, or contact our team by phone, email, or WhatsApp, and we'll schedule diver mobilization at your vessel's port of call.",
          },
        ],
      },
      {
        slug: "thruster-cleaning-polishing",
        name: "Thruster Cleaning & Polishing",
        seoTitle: "Thruster Cleaning & Polishing | Bow & Stern",
        metaDescription:
          "Underwater bow and stern thruster cleaning and polishing. Tunnel fouling removal, blade polishing and grating clearance to restore full manoeuvring thrust.",
        tagline: "Full thrust restored when you need it most",
        summary:
          "Tunnel, blade and grating cleaning that restores lost manoeuvring thrust on bow and stern units.",
        keywords: [
          "thruster cleaning",
          "bow thruster polishing",
          "thruster tunnel cleaning",
        ],
        intro: [
          "Thruster tunnels are among the worst fouling traps on any vessel. They are sheltered, they sit in still water for long periods, and they are rarely inspected — so growth accumulates on tunnel walls, blades and gratings until manoeuvring performance is noticeably down at exactly the moment it matters.",
          "We clean the full tunnel bore, polish the propeller blades and hub, and clear the gratings, restoring flow and thrust. Blade and seal condition is inspected and reported during the same dive.",
        ],
        highlights: [
          "Bow and stern tunnel thrusters, and azimuth units",
          "Full tunnel bore cleaned end to end",
          "Blade and hub cleaning and polishing",
          "Grating clearance and rope guard inspection",
          "Seal and blade condition reported with video",
        ],
        scope: [
          {
            title: "Tunnel cleaning",
            body: "Fouling removed from the full length of the tunnel bore, including the areas behind gratings where growth is heaviest.",
          },
          {
            title: "Blade cleaning and polishing",
            body: "Propeller blades and hub cleaned and polished to restore surface finish and reduce cavitation-inducing roughness.",
          },
          {
            title: "Grating and guard clearance",
            body: "Gratings and rope guards cleared of growth, netting and debris that restrict flow or risk fouling the unit.",
          },
          {
            title: "Condition inspection",
            body: "Blade edges, seals and visible gearcase condition inspected and recorded, with any damage reported immediately.",
          },
        ],
        process: [
          {
            title: "Isolation and permit",
            body: "Thruster is electrically isolated and locked out, with a permit signed by the master before any diver approaches the tunnel.",
          },
          {
            title: "Survey dive",
            body: "Initial inspection establishes fouling extent and confirms there is no existing damage.",
          },
          {
            title: "Cleaning and polishing",
            body: "Tunnel, blades and gratings are worked under surface supervision with continuous video.",
          },
          {
            title: "Report",
            body: "Video and written report issued covering work done and component condition.",
          },
        ],
        appliesTo: [
          "Bow and stern tunnel thrusters",
          "Azimuth and retractable thrusters",
          "Offshore vessels with DP systems",
          "Cruise, ferry and container tonnage",
        ],
        faqs: [
          {
            q: "What is thruster cleaning and polishing?",
            a: "Thruster cleaning and polishing is the underwater removal of marine growth, rust, and fouling from a vessel's bow and stern thrusters and thruster tunnels, restoring smooth blade surfaces for optimal maneuvering performance.",
          },
          {
            q: "Why is regular thruster cleaning important?",
            a: "Fouled or corroded thrusters lose thrust power and maneuvering precision, especially during port entry and dynamic positioning. Bow thruster cleaning restores full thrust output, reduces vibration, and prevents premature blade wear.",
          },
          {
            q: "Can thruster cleaning be done without dry-docking?",
            a: "Yes. CleanShip Marine's divers perform underwater thruster cleaning and polishing while the vessel is afloat, eliminating the need for dry-docking and keeping the vessel operational.",
          },
          {
            q: "Does thruster polishing improve fuel efficiency?",
            a: "Yes. A polished, fouling-free thruster blade reduces drag and improves hydrodynamic efficiency, which supports better maneuvering response and lowers unnecessary fuel consumption during port operations.",
          },
          {
            q: "How often should thrusters be cleaned?",
            a: "Cleaning frequency depends on the vessel's trading pattern and fouling rate, but most operators schedule thruster cleaning services every 6-12 months, or alongside routine hull and propeller maintenance.",
          },
          {
            q: "What vessels need thruster cleaning services?",
            a: "Any vessel fitted with bow or stern thrusters - including tankers, bulk carriers, container ships, and offshore support vessels - benefits from regular thruster tunnel cleaning to maintain safe, efficient maneuvering.",
          },
          {
            q: "What causes marine growth build-up inside thruster tunnels?",
            a: "Thruster tunnels create low-flow zones that trap warm, still water, making them highly prone to barnacle and algae growth. Vessels on long port stays or tropical routes need more frequent thruster tunnel cleaning.",
          },
          {
            q: "Is thruster cleaning safe for the thruster's coating and mechanics?",
            a: "Yes. Our divers use controlled cleaning tools sized specifically for thruster tunnels, removing fouling without damaging blade coatings, seals, or the thruster housing.",
          },
          {
            q: "What equipment is used for underwater thruster polishing?",
            a: "CleanShip Marine uses diver-operated rotary polishing tools and abrasive pads calibrated for thruster blade alloys, delivering a smooth, low-friction finish similar to propeller super polishing techniques.",
          },
          {
            q: "How do I book a thruster cleaning and polishing service?",
            a: "You can request a quote for thruster cleaning and polishing through our website, or contact our team by phone, email, or WhatsApp to schedule diver mobilization at your vessel's port of call.",
          },
        ],
      },
      {
        slug: "propeller-super-polishing",
        name: "Propeller Super Polishing",
        seoTitle: "Propeller Super Polishing | Mirror Finish",
        metaDescription:
          "Underwater propeller super polishing to a Class A mirror finish. Removes fouling, calcareous deposits and roughness to cut fuel consumption and reduce.",
        tagline: "Mirror finish, measurably lower fuel burn",
        summary:
          "Multi-stage underwater polishing of propeller blades to a Class A mirror finish for maximum efficiency.",
        keywords: [
          "propeller polishing",
          "propeller super polishing",
          "class A propeller finish",
          "underwater propeller cleaning",
        ],
        intro: [
          "The propeller is the single highest-leverage surface on the vessel. It operates at high relative velocity, so roughness there costs disproportionately more than the same roughness on the hull — which is why propeller polishing consistently returns among the best fuel-saving-per-dirham figures in ship operation.",
          "We polish in progressive stages, working from coarse abrasives that remove calcareous deposits and marine growth through to fine grades that bring the blade to a Class A mirror finish, on both pressure and suction faces from boss to tip.",
        ],
        highlights: [
          "Progressive multi-stage polish to Class A mirror finish",
          "Pressure and suction faces, leading and trailing edges",
          "Removes calcareous deposits, growth and surface roughness",
          "Reduces cavitation, blade erosion and radiated noise",
          "Rope guard and stern seal inspected in the same dive",
        ],
        scope: [
          {
            title: "Deposit removal",
            body: "Calcareous growth, shell and hard deposits removed from both blade faces without gouging or scoring the blade surface.",
          },
          {
            title: "Progressive polishing",
            body: "Successive abrasive grades work the blade from rough to fine, finishing at a Class A mirror surface across the full blade area.",
          },
          {
            title: "Edge finishing",
            body: "Leading and trailing edges dressed to restore profile and remove the roughness that seeds cavitation.",
          },
          {
            title: "Boss and hub",
            body: "Boss, hub and rope guard cleaned, with stern tube seal condition inspected and reported.",
          },
        ],
        process: [
          {
            title: "Immobilisation",
            body: "Main engine immobilised and shaft secured against rotation, confirmed in writing with the chief engineer.",
          },
          {
            title: "Condition survey",
            body: "Blade condition, roughness and any existing damage recorded on video before work starts.",
          },
          {
            title: "Staged polishing",
            body: "Blades polished in sequence through the abrasive stages under surface supervision.",
          },
          {
            title: "Final inspection",
            body: "Finished blades filmed and reported, with any damage or erosion flagged for your technical department.",
          },
        ],
        appliesTo: [
          "Fixed pitch propellers",
          "Controllable pitch propellers",
          "All merchant vessel types",
          "Combined with hull cleaning mobilisations",
        ],
        faqs: [
          {
            q: "What is propeller super polishing?",
            a: "Propeller super polishing is a precision underwater treatment that removes fouling, corrosion, and surface roughness from propeller blades, achieving a mirror-smooth finish that reduces drag and improves propulsion efficiency.",
          },
          {
            q: "How is propeller super polishing different from regular cleaning?",
            a: "While standard cleaning removes marine growth, propeller super polishing goes further - reducing blade surface roughness (Ra value) to near-factory smoothness, delivering measurably better fuel savings and performance.",
          },
          {
            q: "How does propeller polishing save fuel?",
            a: "A polished propeller moves through water with less resistance, requiring less engine power to maintain speed. Regular propeller super polishing can meaningfully cut fuel consumption and reduce a vessel's carbon emissions.",
          },
          {
            q: "Is propeller polishing done underwater?",
            a: "Yes. CleanShip Marine's certified divers perform underwater propeller polishing using specialized abrasive systems calibrated for marine-grade propeller alloys, with no need for dry-docking.",
          },
          {
            q: "How often should propellers be polished?",
            a: "Most vessels benefit from propeller super polishing every 6-12 months, though high-fouling routes or older coatings may require more frequent servicing to maintain peak propulsion efficiency.",
          },
          {
            q: "Does propeller polishing include an inspection report?",
            a: "Yes. Our propeller polishing service includes before-and-after inspection documentation, giving fleet managers a clear performance and condition record for maintenance planning and class compliance.",
          },
          {
            q: "What is Ra value and why does it matter for propellers?",
            a: "Ra value measures blade surface roughness at a microscopic level. Lower Ra means smoother blades and less water resistance. Propeller super polishing is designed to reduce Ra to near-original factory specification.",
          },
          {
            q: "Can propeller polishing be combined with hull cleaning?",
            a: "Yes. Most operators schedule propeller super polishing alongside underwater hull cleaning in a single dive mobilization, saving time and cost while addressing both drag sources together.",
          },
          {
            q: "Does propeller polishing help reduce vibration and noise?",
            a: "Yes. Removing surface roughness and imbalance-causing fouling from propeller blades helps reduce cavitation, vibration, and underwater noise, contributing to smoother vessel operation and crew comfort.",
          },
          {
            q: "How do I request a propeller super polishing service?",
            a: "Contact CleanShip Marine with your vessel's propeller specifications and port of call, and our diving team will schedule an underwater propeller polishing service with full inspection reporting.",
          },
        ],
      },
      {
        slug: "in-water-class-survey",
        name: "In-Water Class Survey",
        seoTitle: "In-Water Class Survey | Diver Inspection",
        metaDescription:
          "Class-approved in-water surveys with live video and surveyor attendance. Hull, rudder, propeller.",
        tagline: "Class attendance without opening a dry dock",
        summary:
          "Class-approved underwater inspection with live video feed and surveyor attendance in real time.",
        keywords: [
          "in water survey",
          "class approved diving inspection",
          "underwater survey ship",
        ],
        intro: [
          "Classification societies accept in-water survey in place of drydocking for many vessels and inspection scopes, provided the work is carried out by an approved diving contractor to a defined procedure with the surveyor able to see the structure in real time.",
          "We provide that service — a documented inspection programme, high-definition live video to a surface monitoring station, diver-to-surveyor communications, and a full report package for the class file.",
        ],
        highlights: [
          "Live high-definition video to the surveyor's monitor",
          "Two-way diver-to-surveyor communication throughout",
          "Full hull, rudder, propeller, sea chest and anode coverage",
          "Thickness measurement and close-up inspection where required",
          "Complete report package for the classification file",
        ],
        scope: [
          {
            title: "Hull structure inspection",
            body: "Shell plating, welds, bilge keels and openings inspected with continuous video and commentary, with cleaning of areas as needed for meaningful viewing.",
          },
          {
            title: "Rudder and steering gear",
            body: "Rudder plating, pintles, bearings and clearances inspected and, where required, measured.",
          },
          {
            title: "Propeller and stern arrangement",
            body: "Propeller, boss, rope guard and stern tube seal inspected for damage, erosion and leakage.",
          },
          {
            title: "Sea chests and openings",
            body: "Sea chests, gratings, valves and overboard discharges inspected and recorded.",
          },
          {
            title: "Anodes and coating",
            body: "Sacrificial anode wastage assessed and coating condition mapped for planning the next dry docking.",
          },
        ],
        process: [
          {
            title: "Class liaison",
            body: "The survey scope and procedure are agreed with the classification society and the attending surveyor in advance.",
          },
          {
            title: "Setup",
            body: "Surface supervision, video recording and surveyor monitoring position are established on board.",
          },
          {
            title: "Inspection dives",
            body: "The programme is worked systematically with live commentary, and the surveyor can direct the diver to any area at any time.",
          },
          {
            title: "Reporting",
            body: "A full report with video, stills and findings is issued for the class file.",
          },
        ],
        appliesTo: [
          "Vessels on in-water survey schemes",
          "Intermediate and special survey scopes",
          "Damage and grounding assessments",
          "Pre-purchase condition inspections",
        ],
        faqs: [
          {
            q: "What is an In-Water Class Survey?",
            a: "An In-Water Class Survey (IWS) is a classification society-approved underwater inspection of a vessel's hull, sea chests, propeller, rudder, and appendages, used as an alternative to dry-docking for periodic class renewal.",
          },
          {
            q: "How does an In-Water Class Survey replace dry-docking?",
            a: "Classification societies permit in-water surveys in place of scheduled dry-dock inspections for eligible vessels, allowing hull and underwater equipment checks to be conducted by approved divers while the ship remains afloat.",
          },
          {
            q: "Who is qualified to carry out an In-Water Class Survey?",
            a: "CleanShip Marine coordinates in-water class surveys using classification society-approved divers and inspection equipment, ensuring the survey meets the documentation and video standards required for class certification.",
          },
          {
            q: "What does an In-Water Class Survey include?",
            a: "The survey typically covers hull plating, sea chests, propeller, rudder, bow thruster, anodes, and draft mark verification, with underwater video and photographic evidence submitted to the classifying society.",
          },
          {
            q: "Which vessels are eligible for In-Water Class Survey?",
            a: "Eligibility depends on vessel age, class notation, and classification society rules. CleanShip Marine can advise whether your vessel qualifies for an in-water survey in place of dry-dock inspection.",
          },
          {
            q: "How do I schedule an In-Water Class Survey?",
            a: "Contact CleanShip Marine with your vessel's class society, survey due date, and port of call, and our team will coordinate diver mobilization and survey documentation in line with class requirements.",
          },
          {
            q: "How long does an In-Water Class Survey take to complete?",
            a: "Most in-water class surveys are completed within one to two days depending on vessel size, hull condition, and underwater visibility, with the vessel remaining alongside or at anchor throughout.",
          },
          {
            q: "What documentation is provided after an In-Water Class Survey?",
            a: "CleanShip Marine provides a full survey report with underwater video footage, photographic evidence, and measurement data formatted to meet classification society submission requirements.",
          },
          {
            q: "Does poor underwater visibility affect an In-Water Class Survey?",
            a: "Visibility can affect video quality, so surveys are typically scheduled during favorable tidal and weather conditions. Our team assesses site conditions in advance to ensure survey footage meets class standards.",
          },
          {
            q: "What is the difference between an In-Water Class Survey and UWILD?",
            a: "Both are underwater alternatives to dry-docking, but In-Water Class Survey refers broadly to any class-required underwater inspection, while UWILD specifically denotes inspection in lieu of dry-docking for hull and appendage checks.",
          },
        ],
      },
      {
        slug: "uwild",
        name: "UWILD",
        seoTitle: "UWILD | Underwater Inspection In Lieu of Drydock",
        metaDescription:
          "UWILD \u2014 Underwater Inspection In Lieu of Drydocking. Class-approved diver and ROV inspection programmes that satisfy survey requirements without taking the.",
        tagline: "Survey credit earned without leaving the water",
        summary:
          "Full Underwater Inspection In Lieu of Drydocking programmes, executed and documented to class requirements.",
        keywords: [
          "UWILD",
          "underwater inspection in lieu of drydocking",
          "UWILD diving contractor",
        ],
        intro: [
          "UWILD — Underwater Inspection In Lieu of Drydocking — lets a vessel satisfy a survey requirement that would otherwise mean a dry docking, at a fraction of the cost and with none of the off-hire. For vessels on a five-year cycle it is one of the most significant savings available to a technical department.",
          "The requirements are exacting. The contractor must hold class approval, the vessel must be eligible, hull markings and reference points must allow the surveyor to locate features precisely, and the inspection must be delivered live with a documented record. We handle the whole programme, from eligibility discussion through to the final report package.",
        ],
        highlights: [
          "Complete UWILD programmes to classification society requirements",
          "Diver and ROV inspection capability",
          "Hull marking and reference gridding for accurate location",
          "Live video with surveyor attendance and two-way communication",
          "Report package formatted for direct submission to class",
        ],
        scope: [
          {
            title: "Eligibility and planning",
            body: "Vessel eligibility, survey scope and the society's specific requirements are established and agreed before mobilisation.",
          },
          {
            title: "Hull preparation",
            body: "Reference markings and cleaning of inspection areas so structure and features can be located and viewed unambiguously.",
          },
          {
            title: "Systematic inspection",
            body: "Shell plating, welds, rudder, propeller, sea chests, openings, anodes and appendages inspected to the agreed programme.",
          },
          {
            title: "Measurement and NDT",
            body: "Clearance measurement and underwater NDT carried out where the survey scope requires it.",
          },
          {
            title: "Documentation",
            body: "Video, stills, measurements and findings compiled into a report package suitable for submission to the classification society.",
          },
        ],
        process: [
          {
            title: "Class approval and scope",
            body: "The programme is agreed with the society and the surveyor, and the vessel's eligibility is confirmed in writing.",
          },
          {
            title: "Mobilisation and setup",
            body: "Dive spread, video system and surveyor monitoring station are established at the agreed location.",
          },
          {
            title: "Inspection execution",
            body: "The programme runs with the surveyor watching live and able to direct additional inspection at any point.",
          },
          {
            title: "Report and credit",
            body: "The report package is issued and submitted so the survey credit is recorded against the vessel.",
          },
        ],
        appliesTo: [
          "Vessels eligible for in-water survey credit",
          "Intermediate and special surveys",
          "Bulk carriers, tankers and container ships",
          "Offshore units and barges",
        ],
        faqs: [
          {
            q: "What does UWILD mean?",
            a: "UWILD stands for Underwater Inspection in Lieu of Dry Docking - a diver-based underwater hull and equipment survey accepted by classification societies and flag states as a substitute for a physical dry-dock inspection.",
          },
          {
            q: "What is included in a UWILD survey?",
            a: "A UWILD survey covers the hull structure, sea chests, propeller, rudder, bow thruster tunnel, cathodic protection anodes, and other underwater fittings, all documented with video and photographic evidence.",
          },
          {
            q: "Why do shipowners choose UWILD over dry-docking?",
            a: "UWILD allows vessels to remain in service while completing a required class survey, avoiding dry-dock costs and off-hire time, making it a cost-effective option for eligible vessels.",
          },
          {
            q: "Who performs a UWILD survey?",
            a: "CleanShip Marine's certified diving teams carry out UWILD inspections in accordance with classification society requirements, ensuring the survey is properly documented and accepted for class and statutory purposes.",
          },
          {
            q: "How long does a UWILD survey take?",
            a: "Duration depends on vessel size and underwater conditions, but most UWILD surveys can be completed within one to two days while the vessel remains alongside or at anchor.",
          },
          {
            q: "Is UWILD accepted by all classification societies?",
            a: "Most major classification societies accept UWILD for eligible vessels under specific age and class conditions. CleanShip Marine can confirm requirements with your classification society before scheduling the survey.",
          },
          {
            q: "What are the eligibility requirements for a UWILD survey?",
            a: "Eligibility generally depends on vessel age, class notation, and prior survey history, with most societies requiring the vessel to be under a certain age and free of major outstanding hull conditions.",
          },
          {
            q: "What equipment is used during a UWILD inspection?",
            a: "CleanShip Marine uses diver-operated cameras, underwater lighting, and measurement tools to capture detailed footage of the hull, sea chests, propeller, and rudder for class-compliant UWILD documentation.",
          },
          {
            q: "Can UWILD be combined with hull cleaning or propeller polishing?",
            a: "Yes. Many shipowners schedule UWILD inspections alongside underwater hull cleaning or propeller super polishing in the same mobilization, reducing costs and downtime by combining services in one dive operation.",
          },
          {
            q: "How do I arrange a UWILD survey for my vessel?",
            a: "Contact CleanShip Marine with your vessel's class society, survey due date, and port of call, and our certified dive team will coordinate the UWILD survey and prepare full class-compliant documentation.",
          },
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* 2. HOLD CLEANING                                                    */
  /* ------------------------------------------------------------------ */
  {
    slug: "hold-cleaning",
    name: "Hold Cleaning",
    icon: "hold",
    seoTitle: "Cargo Hold Cleaning Services | Bulk Carriers",
    metaDescription:
      "Professional cargo hold cleaning for bulk carriers and container ships. Shore gangs, riding crews and rope access teams delivering grain-clean and.",
    tagline: "Grain-clean holds, on schedule, first inspection",
    summary:
      "Shore gangs, riding crews and rope access teams that take cargo holds from previous-cargo dirty to grain-clean and inspection-ready.",
    keywords: [
      "cargo hold cleaning",
      "hold cleaning services",
      "grain clean holds",
      "bulk carrier hold cleaning",
      "hold cleaning company UAE",
    ],
    intro: [
      "A failed hold inspection is one of the most expensive delays a bulk carrier can suffer. Cleanship exists to make sure that call never comes. We prepare cargo holds to the standard your next fixture demands — whether that is normal clean, grain clean, or the hospital-clean condition required for sensitive cargoes.",
      "Our teams mobilise to vessels at anchorage, alongside, or under way. We arrive with our own chemicals, high-pressure equipment, staging and PPE, and we work to a documented procedure that satisfies both the surveyor and the port's environmental regime.",
    ],
    faqs: [
      {
        q: "What is hold cleaning and why is it important?",
        a: "Hold cleaning is the process of removing cargo residue, rust, and debris from a ship's cargo holds to prepare the vessel for its next cargo. It ensures cargo hold cleanliness, safety compliance, and prevents cargo contamination.",
      },
      {
        q: "What types of vessels require hold cleaning services?",
        a: "Cargo hold cleaning is required for bulk carriers and general cargo vessels, especially when switching between different cargo types that demand strict cleanliness standards.",
      },
      {
        q: "How does hold cleaning ensure cargo readiness?",
        a: "Proper hold cleaning services remove leftover cargo residue, oil stains, and loose rust, ensuring the hold surface meets the next cargo's cleanliness specification and passes surveyor or charterer inspection before loading.",
      },
      {
        q: "Does CleanShip Marine offer hold cleaning at port and at sea?",
        a: "Yes. We provide hold cleaning at port and hold cleaning at sea, giving shipowners flexibility to complete cleaning during cargo discharge or while the vessel is on passage, minimizing turnaround delays.",
      },
      {
        q: "What cleaning standards do you follow for cargo holds?",
        a: "Our ship hold cleaning teams follow international cleanliness standards, including grain clean, hospital clean, and load-on-top specifications, depending on the cargo type and charterer or receiver requirements.",
      },
      {
        q: "How long does a typical hold cleaning job take?",
        a: "Cleaning duration depends on hold size, previous cargo type, and required cleanliness standard, but most cargo hold cleaning jobs are completed within a single port call to avoid vessel delays.",
      },
      {
        q: "Is hold cleaning safe for the ship's coating and structure?",
        a: "Yes. Our hold cleaning services use controlled cleaning methods and equipment suited to the hold's coating type, removing residue effectively without damaging paintwork or structural surfaces.",
      },
      {
        q: "Do you provide before-and-after inspection reports for hold cleaning?",
        a: "Yes. CleanShip Marine documents each hold cleaning job with photographic evidence and inspection reports, giving shipowners and charterers verified proof of cleanliness for cargo readiness and compliance.",
      },
      {
        q: "Which ports does CleanShip Marine provide hold cleaning services in?",
        a: "We provide hold cleaning services across major global ports, with mobilized teams ready to respond quickly wherever your vessel is berthed or scheduled for cargo operations.",
      },
      {
        q: "How do I book a hold cleaning service for my vessel?",
        a: "You can request a quote for cargo hold cleaning through our website, or contact our team by phone, email, or WhatsApp to arrange scheduling ahead of your vessel's port call.",
      },
    ],
    services: [
      {
        slug: "shore-gang",
        name: "Hold Cleaning Shore Gang",
        seoTitle: "Hold Cleaning Shore Gang | In-Port Cleaning",
        metaDescription:
          "Experienced hold cleaning shore gangs mobilised to your berth or anchorage. High-volume cargo hold cleaning between discharge and load.",
        tagline: "Full crews, mobilised to your berth or anchorage",
        summary:
          "Large shore-based teams that clean every hold inside the port stay, between discharge and next load.",
        keywords: [
          "hold cleaning shore gang",
          "shore gang cargo hold cleaning",
          "in port hold cleaning",
        ],
        intro: [
          "When the schedule is tight and every hold has to be ready before the next fixture, volume of labour is what wins. Our shore gangs put a full complement of trained cleaners on board the moment the last grab lifts, so cleaning runs in parallel with your other port operations rather than after them.",
          "Gang size is matched to the number of holds, the previous cargo and the hours available. We bring our own high-pressure units, chemicals, lighting and safety equipment, so nothing is drawn from the ship's stores or the crew's working hours.",
        ],
        highlights: [
          "Gangs scaled to the vessel — from 6 to 40+ cleaners",
          "Mobilisation at berth, anchorage or during STS operations",
          "Own equipment, chemicals, lighting and PPE",
          "Sweeping, washing, rinsing and drying in one continuous sequence",
          "Hold inspection attended and defects rectified on the spot",
        ],
        scope: [
          {
            title: "Sweeping and residue removal",
            body: "Full manual and mechanical sweep of tank tops, hoppers, brackets and frames, with residues bagged for landing ashore in line with MARPOL Annex V.",
          },
          {
            title: "High-pressure washing",
            body: "Fresh or sea water washing at working pressures suited to the coating condition, covering tank top, hopper plating, side frames, bulkheads and the underside of hatch covers.",
          },
          {
            title: "Chemical treatment",
            body: "Application of marine-approved, biodegradable degreasers and hold cleaners where previous cargoes have left oily, staining or odour-bearing residues.",
          },
          {
            title: "Rinsing and drying",
            body: "Fresh water rinse to remove salt and chemical traces, followed by forced drying and bilge drying so holds present dry, odour-free and free of loose scale.",
          },
          {
            title: "Bilge wells and hatch coamings",
            body: "Bilge wells cleaned, strainers cleared and non-return valves tested; coamings, drain channels and compression bars cleaned so hatch covers seal correctly.",
          },
        ],
        process: [
          {
            title: "Pre-arrival briefing",
            body: "We confirm previous cargo, next cargo, required standard, coating condition and available working window with the master and superintendent.",
          },
          {
            title: "Mobilisation and safety",
            body: "Gang boards with a toolbox talk, enclosed-space entry permits, gas readings and rescue arrangements agreed with the ship's command.",
          },
          {
            title: "Cleaning sequence",
            body: "Holds are worked in a planned order so drying time is maximised and completed holds are never re-contaminated by adjacent work.",
          },
          {
            title: "Inspection and handover",
            body: "We attend the surveyor's inspection, rectify any observations immediately, and hand over a photographic completion report.",
          },
        ],
        appliesTo: [
          "Bulk carriers",
          "Container ships",
          "General cargo vessels",
          "Self-unloaders",
        ],
        faqs: [
          {
            q: "What is a hold cleaning shore gang?",
            a: "A hold cleaning shore gang is a land-based labor team deployed at port to clean cargo holds using shore-supplied equipment and manpower, typically engaged during cargo discharge or before loading operations.",
          },
          {
            q: "How is a shore gang different from a riding crew?",
            a: "A shore gang works only while the vessel is in port, whereas a riding crew stays aboard and continues hold cleaning while the vessel is underway between ports.",
          },
          {
            q: "When should a shore gang be used for hold cleaning?",
            a: "A hold cleaning shore gang is ideal when the vessel has sufficient port time to complete cleaning before the next loading, avoiding the cost of carrying additional crew at sea.",
          },
          {
            q: "What equipment does CleanShip Marine's shore gang use?",
            a: "Our shore gang cargo hold cleaning teams use pressure washers, scraping tools, sweepers, and approved cleaning agents suited to the cargo residue type and required cleanliness standard.",
          },
          {
            q: "How quickly can a shore gang be mobilized?",
            a: "CleanShip Marine can mobilize port hold cleaning labor on short notice at major ports, coordinating directly with the vessel's agent to align with the discharge and loading schedule.",
          },
          {
            q: "Does the shore gang work under port safety regulations?",
            a: "Yes. Our hold cleaning shore gang operates in full compliance with port safety regulations, confined space entry protocols, and the vessel's own safety management procedures.",
          },
          {
            q: "Can shore gangs handle large bulk carrier holds?",
            a: "Yes. CleanShip Marine deploys scalable shore gang teams sized to the vessel, capable of cleaning multiple large cargo holds on bulk carriers within tight port turnaround windows.",
          },
          {
            q: "How do I arrange a shore gang for hold cleaning?",
            a: "Contact CleanShip Marine with your vessel's port of call, discharge schedule, and required cleanliness standard, and we'll coordinate a hold cleaning shore gang to meet your turnaround timeline.",
          },
          {
            q: "What cleanliness standards can a shore gang achieve?",
            a: "Our shore gang cargo hold cleaning teams can achieve standard, grain-clean, and hospital-clean specifications, depending on job scope and time available before the next cargo loading.",
          },
        ],
      },
      {
        slug: "riding-crew",
        name: "Hold Cleaning Riding Crew",
        seoTitle: "Hold Cleaning Riding Crew | Cleaning at Sea",
        metaDescription:
          "Certified hold cleaning riding crews that sail with your vessel and clean cargo holds on passage.",
        tagline: "Cleaning that happens while you are already earning",
        summary:
          "Certified teams that sail with the vessel and complete every hold on passage — zero port time lost.",
        keywords: [
          "hold cleaning riding crew",
          "riding squad hold cleaning",
          "cleaning during sea passage",
        ],
        intro: [
          "The most economical hold cleaning is the cleaning that costs you no port time at all. Our riding crews join at the discharge port, sail with the vessel, and work through the ballast passage so the holds are finished before the load port pilot is even ordered.",
          "Riding crews carry full seafarer documentation, medicals and flag-state paperwork, and integrate with the ship's safety management system from the moment they board. They work under the master's authority and to the ship's permit-to-work regime throughout.",
        ],
        highlights: [
          "Vessel loses zero commercial time to cleaning",
          "Fully documented seafarers — STCW, medicals, visas, flag endorsements",
          "Work continues in transit, weather and sea state permitting",
          "Team sizes from 4 to 20 depending on holds and passage length",
          "Crew can disembark at the load port or continue for further voyages",
        ],
        scope: [
          {
            title: "Passage planning of the cleaning programme",
            body: "The cleaning sequence is planned against the passage length, expected weather and ballast condition so every hold is completed with drying time in hand.",
          },
          {
            title: "Complete hold preparation",
            body: "Sweeping, washing, chemical treatment, rinsing and drying of all cargo holds to the agreed standard, exactly as delivered by a shore gang.",
          },
          {
            title: "Hatch cover and coaming work",
            body: "Cleaning of compression bars, drain channels and gaskets, with defects reported to the chief officer for rectification before loading.",
          },
          {
            title: "Bilge and drainage systems",
            body: "Bilge wells emptied and cleaned, strainers cleared and non-return valves tested so holds pass the water-ingress checks at inspection.",
          },
          {
            title: "Additional deck work",
            body: "Where the passage allows, the crew can extend to deck chipping, spot priming and painting under the same mobilisation.",
          },
        ],
        process: [
          {
            title: "Documentation and clearance",
            body: "We prepare crew documents, flag-state approvals, visas and P&I notifications well ahead of the join port so boarding is never the bottleneck.",
          },
          {
            title: "Joining and familiarisation",
            body: "The crew boards, completes ship familiarisation and safety induction, and agrees the working programme with the chief officer.",
          },
          {
            title: "Cleaning on passage",
            body: "Work proceeds hold by hold under the ship's permit-to-work system, with daily progress reported to the master and to your office.",
          },
          {
            title: "Completion and disembarkation",
            body: "Holds are presented for the master's inspection, a photographic report is issued, and the crew disembarks at the agreed port.",
          },
        ],
        appliesTo: [
          "Bulk carriers on ballast passage",
          "Container ships",
          "General cargo vessels",
          "Vessels between long-haul fixtures",
        ],
        faqs: [
          {
            q: "What is a hold cleaning riding crew?",
            a: "A hold cleaning riding crew is a team of cleaning personnel who board the vessel and remain onboard, cleaning cargo holds while the ship is underway between discharge and the next loading port.",
          },
          {
            q: "Why choose a riding crew over a shore gang?",
            a: "A riding crew is ideal when port time is limited, allowing hold cleaning at sea to continue during the voyage so the vessel arrives at the next port fully cargo-ready.",
          },
          {
            q: "How does a riding crew work while the vessel is at sea?",
            a: "Our onboard hold cleaning crew follows strict safety procedures for working in cargo holds underway, including ventilation checks, confined space protocols, and coordination with the ship's officers.",
          },
          {
            q: "What cleanliness standards can a riding crew achieve during a voyage?",
            a: "Depending on voyage length and hold condition, our hold cleaning riding crew can achieve standard, grain-clean, or hospital-clean specifications by the time the vessel reaches its next loading port.",
          },
          {
            q: "Is a riding crew safe to deploy during rough sea conditions?",
            a: "Our teams assess weather and sea conditions continuously, pausing hold cleaning operations when necessary to ensure crew safety, in line with the vessel's safety management system.",
          },
          {
            q: "How many days in advance should I book a riding crew?",
            a: "We recommend booking a hold cleaning riding crew as early as possible, ideally at the discharge port, to ensure crew availability, visa arrangements, and boarding logistics are completed in time.",
          },
          {
            q: "Does the riding crew bring their own cleaning equipment?",
            a: "Yes. CleanShip Marine's riding squad cargo hold cleaning teams bring their own rope kits and safety gear, minimizing reliance on the vessel's onboard equipment. Pressure washers, chemical sprayers and other manual tools are required from the vessel.",
          },
          {
            q: "What documentation is provided for insurance and boarding purposes?",
            a: "We provide crew certificates, safety training records, and boarding documentation required by the vessel and port authorities prior to riding crew embarkation.",
          },
          {
            q: "Can a riding crew handle multiple cargo holds during one voyage?",
            a: "Yes. Our hold cleaning riding crew teams are sized according to the number of holds and voyage duration, ensuring all holds are cleaned to specification before arrival.",
          },
          {
            q: "How do I book a hold cleaning riding crew for my vessel?",
            a: "Contact CleanShip Marine with your vessel's discharge port, next loading port, and voyage duration, and we'll arrange a riding crew to board and complete hold cleaning en route.",
          },
        ],
      },
      {
        slug: "rope-access",
        name: "Hold Cleaning Rope Access",
        seoTitle: "Rope Access Hold Cleaning | IRATA Teams",
        metaDescription:
          "IRATA-certified rope access teams for cargo hold cleaning, inspection and coating work at height.",
        tagline: "Every surface reachable — without a single stage board",
        summary:
          "IRATA-certified technicians reaching upper frames, bulkheads and overheads without scaffolding or cherry pickers.",
        keywords: [
          "rope access hold cleaning",
          "IRATA marine rope access",
          "cargo hold cleaning at height",
        ],
        intro: [
          "The parts of a cargo hold that fail inspection are almost always the parts nobody could reach. Upper side frames, the underside of hatch covers, transverse bulkhead stiffeners and the hold overhead sit far beyond the reach of deck-level equipment, and building staging for them consumes days the schedule rarely has.",
          "Rope access solves it. Our IRATA-certified technicians descend from anchor points at the coaming and work the full height of the hold with hand tools, lances and inspection equipment. There is no scaffolding to erect, no cherry picker to land on board, and no hold left half-prepared because access ran out.",
        ],
        highlights: [
          "IRATA Level 1, 2 and 3 certified technicians",
          "No staging, scaffolding or heavy access equipment required",
          "Full-height access to frames, bulkheads and hold overheads",
          "Combined cleaning, close-up inspection and spot coating in one descent",
          "Independent rigging and rescue plan for every work site",
        ],
        scope: [
          {
            title: "Upper frame and bulkhead cleaning",
            body: "Washing and residue removal on upper side frames, brackets, stiffeners and transverse bulkheads that deck-level equipment cannot reach.",
          },
          {
            title: "Hold overhead and hatch underside",
            body: "Cleaning of the hold overhead, hatch cover undersides and coaming internals, where cargo dust and previous-cargo residue routinely accumulate.",
          },
          {
            title: "Close-up visual inspection",
            body: "Structural condition, coating breakdown and corrosion recorded at height with photographs, giving you inspection-quality data as a by-product of the clean.",
          },
          {
            title: "Spot preparation and coating",
            body: "Localised descaling, surface preparation and touch-up coating applied at height, so identified breakdown is treated in the same mobilisation.",
          },
          {
            title: "Rigging, rescue and supervision",
            body: "Every work site is rigged with independent working and backup lines under a Level 3 supervisor, with a documented rescue plan in place before the first descent.",
          },
        ],
        process: [
          {
            title: "Access survey and rigging plan",
            body: "We assess anchor points, hold geometry and obstructions, then produce a rigging and rescue plan specific to the vessel.",
          },
          {
            title: "Permits and safety brief",
            body: "Enclosed-space entry, work-at-height and hot-work permits are raised with the ship, and the rescue arrangement is briefed to all parties.",
          },
          {
            title: "Rope access work",
            body: "Technicians work in pairs under Level 3 supervision, descending in planned passes so no area is missed and progress is auditable.",
          },
          {
            title: "Reporting",
            body: "A photographic report is issued covering work completed and any structural or coating defects observed at height.",
          },
        ],
        appliesTo: [
          "Deep-hold bulk carriers",
          "Container ships and cell guides",
          "Vessels with restricted staging access",
          "Combined cleaning and inspection scopes",
        ],
        faqs: [
          {
            q: "What is hold cleaning rope access?",
            a: "Hold cleaning rope access uses trained rope access technicians to reach and clean high or difficult-to-access areas of cargo holds, such as upper bulkheads, hatch coamings, and hopper areas, without scaffolding.",
          },
          {
            q: "When is rope access needed for hold cleaning?",
            a: "Rope access hold cleaning is used when cargo holds have tall bulkheads, complex structures, or areas unreachable by standard equipment, requiring technicians to work safely at height using ropes and harnesses.",
          },
          {
            q: "Are your rope access technicians certified?",
            a: "Yes. CleanShip Marine's IRATA rope access cleaning teams are trained and certified to internationally recognized rope access safety standards for working at height in confined marine spaces.",
          },
          {
            q: "What safety measures are used during rope access hold cleaning?",
            a: "Our technicians follow strict fall-protection protocols, use redundant rope systems, and conduct pre-job risk assessments to ensure safe operations during high-level hold cleaning.",
          },
          {
            q: "Does rope access reduce hold cleaning time compared to scaffolding?",
            a: "Yes. Rope access cargo hold cleaning eliminates the time needed to erect scaffolding, allowing technicians to access difficult areas quickly and reduce overall cleaning turnaround time.",
          },
          {
            q: "Can rope access reach areas standard cleaning crews cannot?",
            a: "Yes. Rope access technicians can clean high bulkheads, ledges, and structural areas that are difficult or unsafe to reach with ladders or scaffolding, ensuring thorough hold cleanliness.",
          },
          {
            q: "Is rope access hold cleaning suitable for all vessel types?",
            a: "Hold cleaning rope access is particularly effective for bulk carriers and general cargo vessels with tall or structurally complex holds, where full residue removal at height is required.",
          },
          {
            q: "What equipment do rope access technicians use for cleaning?",
            a: "Our technicians use rope access rigging combined with pressure washing tools, scrapers, and vacuum systems to clean residue from elevated hold surfaces safely and efficiently.",
          },
          {
            q: "Does rope access hold cleaning meet cargo cleanliness certification standards?",
            a: "Yes. Rope access cleaning is performed to the same grain-clean and hospital-clean standards as standard hold cleaning, with full inspection and documentation provided on completion.",
          },
          {
            q: "How do I request a rope access hold cleaning service?",
            a: "Contact CleanShip Marine with details of your vessel's hold structure and cleanliness requirements, and our certified rope access hold cleaning team will be mobilized to your port of call.",
          },
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* 3. TANK CLEANING                                                    */
  /* ------------------------------------------------------------------ */
  {
    slug: "tank-cleaning",
    name: "Tank Cleaning",
    icon: "tank",
    seoTitle: "Marine Tank Cleaning | Oil & Shore Tanks",
    metaDescription:
      "Certified marine tank cleaning for oil tankers carrying DPP and CPP cargoes, plus demucking, shore tank cleaning and offshore vessel tanks.",
    tagline: "Gas-free, entry-ready, certified",
    summary:
      "Cargo and slop tank cleaning for DPP and CPP trades, demucking, shore terminal tanks and offshore vessel tankage.",
    keywords: [
      "tank cleaning services",
      "oil tanker tank cleaning",
      "marine tank cleaning UAE",
      "sludge removal vessel",
    ],
    intro: [
      "Tank cleaning is where marine cleaning stops being housekeeping and becomes a safety-critical operation. Hydrocarbon vapour, oxygen deficiency, residual toxicity and confined geometry combine into a job that punishes shortcuts, and we treat it accordingly.",
      "Cleanship cleans cargo tanks, slop tanks, bunker tanks, cofferdams and shore terminal tanks — from a simple grade change to a full gas-free-for-hot-work certification ahead of dry dock. Every operation runs under a written procedure with continuous atmospheric monitoring and a standby rescue team.",
    ],
    faqs: [
      {
        q: "Do you provide gas-free certification?",
        a: "We prepare the tank to the required condition and coordinate with an independent, accredited marine chemist or competent person who issues the certificate. Keeping certification independent of the contractor doing the cleaning is the correct arrangement and we do not deviate from it.",
      },
      {
        q: "How is sludge and slop disposed of?",
        a: "Recovered sludge, slops and oily residues are transferred to approved reception facilities or licensed waste contractors, with manifests and disposal certificates provided for the vessel's MARPOL records.",
      },
      {
        q: "Can you clean tanks between different cargo grades?",
        a: "Yes. Grade-change cleaning is planned against the previous and next cargo specification, the wall-wash requirement and the charterer's acceptance criteria, then verified by test before the tank is presented.",
      },
    ],
    services: [
      {
        slug: "oil-tanker-dpp-cpp",
        name: "Tanker Cleaning — DPP & CPP",
        seoTitle: "Oil Tanker Tank Cleaning | DPP & CPP Grades",
        metaDescription:
          "Cargo tank cleaning for oil tankers in DPP and CPP trades. Crude oil washing support, grade-change cleaning, wall wash preparation.",
        tagline: "Crude, fuel oil or clean products — cleaned to specification",
        summary:
          "Cargo tank cleaning for dirty and clean petroleum product trades, including grade changes and wall-wash preparation.",
        keywords: [
          "DPP tank cleaning",
          "CPP tank cleaning",
          "oil tanker cargo tank cleaning",
          "wall wash preparation",
        ],
        intro: [
          "Dirty petroleum product and clean petroleum product trades demand very different things from a tank cleaning contractor. DPP work is a fight against heavy residue, wax and sludge. CPP work is a fight against the last few parts per million of contamination standing between you and a passed wall wash.",
          "We do both, and we plan each one from the cargo pair rather than from a generic procedure. The previous cargo, the nominated cargo, the coating condition and the charterer's acceptance criteria determine the wash media, temperature, cycle count and verification method before a single machine is dropped.",
        ],
        highlights: [
          "DPP: crude, fuel oil, bitumen and heavy residue removal",
          "CPP: gasoil, jet, naphtha and chemical-grade preparation",
          "Crude oil washing support and post-COW hand hosing",
          "Wall wash preparation to hydrocarbon and colour test criteria",
          "Slop consolidation, decanting and disposal documentation",
        ],
        scope: [
          {
            title: "Pre-clean assessment",
            body: "Cargo history, tank coating condition, heating coil status and the next cargo specification are reviewed to fix the cleaning method and realistic acceptance criteria.",
          },
          {
            title: "Machine washing",
            body: "Fixed and portable tank cleaning machines run to a calculated cycle programme, using hot or cold sea water, fresh water and approved chemicals as the cargo pair requires.",
          },
          {
            title: "Hand hosing and manual finishing",
            body: "Bellmouths, suction wells, framing, heating coils and structural shadows are hand-hosed and manually finished — the areas machines geometrically cannot reach.",
          },
          {
            title: "Draining, mopping and drying",
            body: "Tanks are stripped, mopped and dried so no free water or residue remains to contaminate the next grade or skew the wall wash result.",
          },
          {
            title: "Gas-freeing and verification",
            body: "Ventilation to safe-for-entry or gas-free-for-hot-work condition, with continuous monitoring and independent certification arranged where required.",
          },
        ],
        process: [
          {
            title: "Method statement and risk assessment",
            body: "A cargo-pair-specific procedure, JSA and permit package is agreed with the vessel and, where applicable, the charterer's inspector.",
          },
          {
            title: "Washing and stripping",
            body: "Machine cycles run to plan with stripping, recirculation and slop management controlled throughout the operation.",
          },
          {
            title: "Manual finishing and inspection",
            body: "Teams enter under full enclosed-space procedure to finish shadow areas and confirm the tank visually before testing.",
          },
          {
            title: "Testing and presentation",
            body: "Wall wash or visual inspection is carried out with the surveyor, and the tank is presented for acceptance with full documentation.",
          },
        ],
        appliesTo: [
          "Crude oil tankers (VLCC, Suezmax, Aframax)",
          "Product tankers (MR, LR1, LR2)",
          "Chemical and IMO II/III tankers",
          "Bunker barges and small tankers",
        ],
        faqs: [
          {
            q: "Can you guarantee a passed wall wash?",
            a: "No contractor honestly can, because the result also depends on coating age and condition, the previous cargo history and the inspector's criteria. What we do guarantee is that the method is correct for the cargo pair, that we will tell you before mobilisation if the tank condition makes the target unrealistic, and that we will keep working until the agreed standard is met or the limiting factor is clearly identified.",
          },
          {
            q: "Do you supply the tank cleaning chemicals?",
            a: "Yes. We supply marine-approved cleaning chemicals with current safety data sheets, selected for the cargo pair and compatible with the tank coating system.",
          },
        ],
      },
      {
        slug: "demucking",
        name: "Demucking",
        seoTitle: "Tank Demucking | Sludge & Residue Removal",
        metaDescription:
          "Manual and mechanical tank demucking for oil tankers and bulk carriers. Removal of sludge, scale, wax and solid residue from cargo tanks.",
        tagline: "The heavy residue that washing alone will not lift",
        summary:
          "Manual and mechanical removal of sludge, scale and solid residue from tanks before survey, repair or grade change.",
        keywords: [
          "tank demucking",
          "sludge removal tanker",
          "mucking out cargo tanks",
        ],
        intro: [
          "After enough voyages, every tank accumulates material that no cleaning machine will move — settled sludge, oxidised wax, rust scale and cargo solids compacted around bellmouths, framing and suction wells. Demucking is the physical removal of that material, and it is the step that usually stands between a tank and a class survey or a hot-work permit.",
          "Our teams work under full enclosed-space entry procedure with continuous gas monitoring, forced ventilation and a standby rescue team. Material is bagged or pumped out, quantified, and landed to an approved reception facility with full disposal documentation.",
        ],
        highlights: [
          "Manual mucking of sludge, wax, scale and cargo solids",
          "Vacuum and pump-out recovery for pumpable residues",
          "Full enclosed-space entry regime with standby rescue",
          "Quantified removal with disposal manifests",
          "Prepares tanks for survey, repair or hot work",
        ],
        scope: [
          {
            title: "Tank entry preparation",
            body: "Ventilation, gas testing, lighting, access rigging and rescue arrangements are established before any entry is authorised.",
          },
          {
            title: "Manual residue removal",
            body: "Sludge, wax and scale are removed by hand from tank bottoms, suction wells, bellmouths, heating coils and structural pockets.",
          },
          {
            title: "Vacuum and pump-out",
            body: "Pumpable residues are recovered by vacuum unit or portable pump directly to slop tanks, road tankers or barges.",
          },
          {
            title: "Scale and hard deposit removal",
            body: "Adhered rust scale and hardened deposits are removed by scraping, chipping or hydroblasting where the coating system permits.",
          },
          {
            title: "Waste handling and documentation",
            body: "Recovered material is quantified, transferred to licensed reception facilities and documented with manifests for the vessel's MARPOL records.",
          },
        ],
        process: [
          {
            title: "Assessment and quantification",
            body: "Tank condition is surveyed and the residue volume estimated so manpower, equipment and disposal capacity are correctly sized.",
          },
          {
            title: "Permit and entry setup",
            body: "Enclosed-space entry permits are raised, ventilation established and atmosphere confirmed and continuously monitored.",
          },
          {
            title: "Removal operations",
            body: "Teams work in controlled rotations with an attendant at the entry point and rescue equipment rigged and manned.",
          },
          {
            title: "Final clean and handover",
            body: "The tank is washed down, drained and presented for inspection, with disposal documentation issued.",
          },
        ],
        appliesTo: [
          "Crude and product tankers",
          "Bunker and slop tanks",
          "Bulk carrier ballast and void spaces",
          "Pre-drydock and pre-survey preparation",
        ],
        faqs: [
          {
            q: "How long does demucking take?",
            a: "It scales with residue volume rather than tank size. A lightly fouled tank may take a shift; heavily compacted sludge in a large crude tank can run several days with multiple rotating teams. We survey first and quote against an estimated volume rather than a flat guess.",
          },
          {
            q: "Is hot work possible immediately after demucking?",
            a: "Not automatically. Demucking removes the material, but hot work requires a gas-free-for-hot-work certificate issued by a competent person after testing, which we arrange as a separate and independent step.",
          },
        ],
      },
      {
        slug: "shore-tank-cleaning",
        name: "Shore Tank Cleaning",
        seoTitle: "Shore Tank Cleaning | Terminal Storage Tanks",
        metaDescription:
          "Storage and terminal tank cleaning for oil and chemical facilities. Sludge removal, gas-freeing.",
        tagline: "Terminal tanks turned around for inspection and service",
        summary:
          "Storage tank cleaning at terminals and depots, prepared for internal inspection, repair or product change.",
        keywords: [
          "shore tank cleaning",
          "storage tank cleaning",
          "terminal tank cleaning UAE",
          "API 653 inspection preparation",
        ],
        intro: [
          "Shore tanks come out of service for a reason — a statutory internal inspection, a product change, a repair, or a decommissioning. Whichever it is, the tank has to go from full of product to safe, clean and open for entry, and every day of that transition is a day of lost storage revenue.",
          "We work to a written, client-approved procedure covering product removal, sludge recovery, washing, gas-freeing and waste disposal, so the tank is handed to the inspector or contractor in a condition that lets them start immediately rather than waiting on rework.",
        ],
        highlights: [
          "Crude, product, chemical and vegetable oil storage tanks",
          "Sludge recovery with volume reduction and oil recovery options",
          "Gas-freeing to safe-for-entry and hot-work conditions",
          "Confined space entry teams with standby rescue",
          "Prepared for API 653 internal inspection and statutory survey",
        ],
        scope: [
          {
            title: "Product and residue removal",
            body: "Remaining product is stripped and transferred, and pumpable sludge is recovered to nominated tankage or road tankers.",
          },
          {
            title: "Sludge treatment and oil recovery",
            body: "Where volumes justify it, sludge is treated to recover saleable hydrocarbon and reduce the mass sent to disposal.",
          },
          {
            title: "Washing and degreasing",
            body: "Shell, floor, roof structure and internal fittings are washed and degreased to the standard required by the next activity.",
          },
          {
            title: "Gas-freeing and monitoring",
            body: "Forced ventilation to safe-for-entry or gas-free-for-hot-work condition, with continuous atmospheric monitoring throughout occupancy.",
          },
          {
            title: "Inspection preparation",
            body: "Floor plates, annular rings, weld seams and roof supports are cleaned to a condition that allows meaningful thickness measurement and visual inspection.",
          },
        ],
        process: [
          {
            title: "Procedure and permits",
            body: "A site-specific method statement, risk assessment and permit package is agreed with the terminal's HSE function before mobilisation.",
          },
          {
            title: "Isolation and de-inventory",
            body: "The tank is isolated, blinded and de-inventoried under the terminal's lock-out procedures.",
          },
          {
            title: "Cleaning and gas-freeing",
            body: "Sludge recovery, washing and ventilation proceed to plan under continuous monitoring and confined-space control.",
          },
          {
            title: "Handover for inspection",
            body: "The tank is presented clean, dry and certified for entry, with waste manifests and a completion report issued.",
          },
        ],
        appliesTo: [
          "Crude and product storage tanks",
          "Chemical and vegetable oil tanks",
          "Bunker and lube oil depots",
          "Free zone and terminal facilities",
        ],
        faqs: [
          {
            q: "Do you work to the terminal's permit system or your own?",
            a: "Always the terminal's. Our procedures are written to integrate with the site's permit-to-work, isolation and emergency response arrangements, not to run alongside them.",
          },
          {
            q: "Can cleaning be done without man entry?",
            a: "For some tanks, non-man-entry techniques using automated equipment and recirculation are viable and reduce risk considerably. Whether that applies depends on tank geometry, sludge character and what the next activity requires, and we will assess it at survey.",
          },
        ],
      },
      {
        slug: "offshore-vessel-tank-cleaning",
        name: "Offshore Vessel Tank Cleaning",
        seoTitle: "Offshore Vessel Tank Cleaning | OSV & PSV",
        metaDescription:
          "Tank cleaning for offshore support vessels, platform supply vessels and barges. Mud, brine, base oil and drill water tanks cleaned for cargo change.",
        tagline: "Mud, brine and base oil tanks turned around fast",
        summary:
          "Cleaning of mud, brine, base oil and drill water tanks on OSVs, PSVs and offshore barges.",
        keywords: [
          "offshore vessel tank cleaning",
          "OSV tank cleaning",
          "PSV mud tank cleaning",
          "brine tank cleaning",
        ],
        intro: [
          "Offshore support vessels carry a product mix that no conventional tanker deals with — drilling mud, brine, base oil, drill water, cement and completion fluids, often in the same voyage cycle. Cross-contamination between them is expensive, and the turnaround windows between charters are short.",
          "We clean OSV and PSV tankage for cargo change, class survey, layup or reactivation, working to the vessel's and the charterer's cleanliness criteria and handling the recovered fluid streams with the documentation the operator's HSE regime requires.",
        ],
        highlights: [
          "Mud, brine, base oil, drill water and cement tanks",
          "Cargo-change cleaning between incompatible fluids",
          "Preparation for class survey and coating inspection",
          "Layup preparation and reactivation cleaning",
          "Recovered fluids handled with full disposal documentation",
        ],
        scope: [
          {
            title: "Fluid recovery and stripping",
            body: "Residual mud, brine and base oil are recovered and transferred to nominated tanks, road tankers or shore reception.",
          },
          {
            title: "Tank washing",
            body: "Machine and manual washing appropriate to the fluid type, with particular attention to settled solids in mud and cement tanks.",
          },
          {
            title: "Line and pump flushing",
            body: "Associated pipework, pumps and manifolds are flushed so cross-contamination does not reappear from the system after the tank is clean.",
          },
          {
            title: "Survey preparation",
            body: "Tanks are cleaned and dried to a condition suitable for coating inspection and class survey attendance.",
          },
          {
            title: "Waste management",
            body: "Recovered fluids and solids are consolidated and landed to licensed facilities with manifests issued.",
          },
        ],
        process: [
          {
            title: "Scope and fluid assessment",
            body: "Previous and next cargo, tank arrangement and system layout are reviewed to set the cleaning standard and method.",
          },
          {
            title: "Mobilisation",
            body: "Teams, pumps, vacuum units and consumables are mobilised to the quay or offshore base within the vessel's window.",
          },
          {
            title: "Cleaning and flushing",
            body: "Tanks and associated systems are cleaned under enclosed-space entry control with continuous monitoring.",
          },
          {
            title: "Acceptance",
            body: "Tanks are presented to the vessel, charterer or surveyor, with completion and disposal documentation issued.",
          },
        ],
        appliesTo: [
          "Platform supply vessels (PSV)",
          "Offshore support vessels (OSV)",
          "Anchor handling tugs (AHTS)",
          "Offshore and accommodation barges",
        ],
        faqs: [
          {
            q: "Can you work at an offshore base rather than a commercial quay?",
            a: "Yes. We regularly mobilise to offshore supply bases and work within the base operator's HSE and permit regime.",
          },
          {
            q: "How is cross-contamination between charters prevented?",
            a: "By cleaning the system, not just the tank. Pipework, pumps and manifolds retain residue that will re-contaminate a clean tank on the first transfer, so line flushing is part of the standard scope rather than an extra.",
          },
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* 4. OFFSHORE                                                         */
  /* ------------------------------------------------------------------ */
  {
    slug: "offshore",
    name: "Offshore Services",
    icon: "offshore",
    seoTitle: "Offshore Support Services | Rigs & Platforms",
    metaDescription:
      "Offshore cleaning and support services for rigs, platforms, FPSOs and support vessels. Industrial cleaning, void and cofferdam entry.",
    tagline: "Certified crews, offshore-ready",
    summary:
      "Industrial cleaning, confined space work and maintenance squads mobilised to rigs, platforms, FPSOs and support vessels.",
    keywords: [
      "offshore cleaning services",
      "rig cleaning",
      "FPSO tank cleaning",
      "offshore maintenance crew",
    ],
    intro: [
      "Offshore assets are unforgiving of poor planning. Every person mobilised needs valid offshore survival and medical certification, every scope has to fit a fixed POB allocation and a narrow weather window, and the operator's permit regime governs everything from first bolt to demobilisation.",
      "Cleanship mobilises certified teams to rigs, platforms, FPSOs and support vessels for industrial cleaning, confined space entry, surface preparation and general maintenance support — with the documentation, certification and HSE discipline the offshore environment demands.",
    ],
    faqs: [
      {
        q: "What certification do your offshore personnel hold?",
        a: "Offshore-mobilised personnel hold BOSIET or equivalent offshore survival training, offshore medicals, and the trade certification appropriate to their scope. Full certification packages are submitted for operator approval before mobilisation.",
      },
      {
        q: "Can you work under the operator's permit-to-work system?",
        a: "Yes, and we expect to. Our procedures are written to integrate with the asset's permit, isolation and emergency response systems rather than to run in parallel with them.",
      },
    ],
    services: [
      {
        slug: "offshore-support-vessel-services",
        name: "Offshore Support Vessel Services",
        seoTitle: "Offshore Support Vessel Cleaning | OSV & PSV",
        metaDescription:
          "Cleaning and maintenance services for offshore support vessels, PSVs and anchor handlers. Deck, tank and accommodation cleaning.",
        tagline: "Charter-ready turnarounds between contracts",
        summary:
          "Deck, tank, void and accommodation work that turns a support vessel around between charters.",
        keywords: [
          "offshore support vessel cleaning",
          "OSV maintenance",
          "PSV charter turnaround",
        ],
        intro: [
          "The window between one charter ending and the next beginning is where support vessels earn or lose their next contract. Deck areas need degreasing, cargo tanks need cleaning to the incoming charterer's specification, voids need inspection, and accommodation needs a standard of presentation that survives an operator's audit.",
          "We put a single team on all of it, so the vessel goes from off-charter to inspection-ready without coordinating four separate contractors across a two-day window.",
        ],
        highlights: [
          "Cargo deck degreasing and non-slip surface restoration",
          "Cargo, mud, brine and base oil tank cleaning",
          "Void space and cofferdam entry and cleaning",
          "Accommodation deep cleaning to audit standard",
          "Surface preparation and touch-up coating",
        ],
        scope: [
          {
            title: "Cargo deck cleaning",
            body: "Degreasing, hydroblasting and residue removal across working deck areas, cargo rails and pipe stacks.",
          },
          {
            title: "Tank and void cleaning",
            body: "Cargo, mud, brine and drill water tanks cleaned, plus void spaces and cofferdams entered and cleaned for survey.",
          },
          {
            title: "Accommodation and galley",
            body: "Deep cleaning of accommodation, galley and messing areas to the standard operator audits require.",
          },
          {
            title: "Surface preparation and coating",
            body: "Rust spotting, mechanical preparation and touch-up coating on deck areas, structures and handrails.",
          },
          {
            title: "Charter handover support",
            body: "Attendance at on-hire and off-hire inspections with rectification carried out on the spot.",
          },
        ],
        process: [
          {
            title: "Scope agreement",
            body: "Work list agreed against the charter turnaround window and the incoming charterer's acceptance criteria.",
          },
          {
            title: "Mobilisation",
            body: "Team and equipment mobilised to the quay or supply base within the vessel's window.",
          },
          {
            title: "Execution",
            body: "Work runs in parallel across deck, tanks and accommodation to compress the total duration.",
          },
          {
            title: "Inspection",
            body: "Vessel presented for on-hire inspection with any observations rectified immediately.",
          },
        ],
        appliesTo: [
          "Platform supply vessels",
          "Anchor handling tug supply vessels",
          "Standby and ERRV vessels",
          "Construction support vessels",
        ],
        faqs: [
          {
            q: "How fast can a turnaround be completed?",
            a: "It depends entirely on the work list, but running deck, tank and accommodation scopes in parallel with one contractor typically compresses a turnaround substantially against coordinating separate trades. We will give you a realistic duration against your actual scope.",
          },
        ],
      },
      {
        slug: "rig-and-platform-cleaning",
        name: "Rig & Platform Cleaning",
        seoTitle: "Rig & Platform Cleaning | Offshore Industrial",
        metaDescription:
          "Industrial cleaning for drilling rigs, fixed platforms and FPSOs. Mud pit and tank cleaning, deck degreasing.",
        tagline: "Industrial cleaning where the asset sits",
        summary:
          "Mud pits, tanks, decks and structures cleaned in situ on rigs, platforms and FPSOs.",
        keywords: [
          "rig cleaning",
          "platform cleaning offshore",
          "mud pit cleaning",
          "FPSO tank cleaning",
        ],
        intro: [
          "Drilling rigs, fixed platforms and floating production units accumulate exactly the deposits that stop inspections and start incidents — mud in pits and sand traps, hydrocarbon residue in tanks and slop systems, grease and oil across working decks, and scale in process vessels.",
          "We mobilise certified offshore crews with the equipment and the permit discipline to clean these systems in situ, under the operator's HSE regime, without the asset coming off station.",
        ],
        highlights: [
          "Mud pits, sand traps and shaker areas",
          "Process vessels, slop and produced water tanks",
          "Deck degreasing and hydroblasting",
          "Confined space entry with standby rescue",
          "Waste consolidated and backloaded with full manifests",
        ],
        scope: [
          {
            title: "Mud system cleaning",
            body: "Mud pits, sand traps, shaker areas and associated pipework cleaned of settled solids and residual fluid.",
          },
          {
            title: "Tank and vessel cleaning",
            body: "Slop tanks, produced water tanks, drain caissons and process vessels cleaned and prepared for entry or inspection.",
          },
          {
            title: "Deck and structure cleaning",
            body: "Degreasing and hydroblasting of working decks, drip trays, structural steel and equipment skids.",
          },
          {
            title: "Confined space entry",
            body: "Entry work under the operator's permit system with gas monitoring, forced ventilation and manned standby rescue.",
          },
          {
            title: "Waste handling",
            body: "Recovered solids and fluids consolidated, containerised and backloaded to shore with full documentation.",
          },
        ],
        process: [
          {
            title: "Certification and approval",
            body: "Personnel certification, medicals and method statements are submitted for operator approval well ahead of the mobilisation window.",
          },
          {
            title: "Mobilisation",
            body: "Crew and equipment are backloaded to the asset by supply vessel or helicopter within the POB allocation.",
          },
          {
            title: "Permitted execution",
            body: "Work proceeds under the asset's permit-to-work system with daily toolbox talks and progress reporting.",
          },
          {
            title: "Demobilisation",
            body: "Equipment and waste are backloaded, and a completion report with disposal documentation is issued.",
          },
        ],
        appliesTo: [
          "Jack-up and semi-submersible drilling rigs",
          "Fixed production platforms",
          "FPSOs and FSOs",
          "Accommodation and work barges",
        ],
        faqs: [
          {
            q: "How is POB managed?",
            a: "Team size is planned against your available POB from the start, and we would rather extend the duration with a smaller crew than promise a headcount the asset cannot accommodate.",
          },
        ],
      },
      {
        slug: "void-space-and-cofferdam-cleaning",
        name: "Void Space & Cofferdam Cleaning",
        seoTitle: "Void Space & Cofferdam Cleaning | Confined Space",
        metaDescription:
          "Void space, cofferdam and ballast tank cleaning by certified confined space entry teams. Sediment removal.",
        tagline: "The spaces nobody wants to enter, entered safely",
        summary:
          "Certified confined space teams cleaning voids, cofferdams and ballast tanks for survey and coating inspection.",
        keywords: [
          "void space cleaning",
          "cofferdam cleaning",
          "ballast tank cleaning",
          "confined space entry marine",
        ],
        intro: [
          "Voids, cofferdams, duct keels, pipe tunnels and ballast tanks are the spaces that fail surveys, because they are the spaces nobody has opened since the last one. Sediment, scale, standing water and oxygen-depleted atmosphere are the normal condition, and entering them without the right regime is one of the most reliable ways to kill people in this industry.",
          "Our teams clean these spaces under a full confined-space entry regime — continuous atmospheric monitoring, forced ventilation, an attendant at the entry point and manned rescue standby — and present them clean, dry and ready for the surveyor or the coating inspector.",
        ],
        highlights: [
          "Voids, cofferdams, duct keels, pipe tunnels and ballast tanks",
          "Continuous gas monitoring with forced ventilation",
          "Manned rescue standby at every entry point",
          "Sediment, scale and standing water removal",
          "Prepared for class survey and coating inspection",
        ],
        scope: [
          {
            title: "Atmosphere control",
            body: "Forced ventilation established and the atmosphere tested and continuously monitored throughout occupancy.",
          },
          {
            title: "Sediment and water removal",
            body: "Mud, sediment, scale and standing water removed from tank bottoms, framing and structural pockets.",
          },
          {
            title: "Washing and drying",
            body: "Structure washed down and dried so coating condition and steel wastage can actually be assessed.",
          },
          {
            title: "Survey preparation",
            body: "Structural members, welds and coating cleaned to a standard that allows meaningful close-up inspection and thickness measurement.",
          },
          {
            title: "Rescue provision",
            body: "Rescue equipment rigged and a trained standby team present at the entry point for the full duration of every entry.",
          },
        ],
        process: [
          {
            title: "Risk assessment",
            body: "Each space is assessed individually for atmosphere, access, geometry and rescue feasibility before entry is planned.",
          },
          {
            title: "Ventilation and testing",
            body: "The space is ventilated and tested, and entry is authorised only when readings are within limits and stable.",
          },
          {
            title: "Cleaning under supervision",
            body: "Teams work in controlled rotations with an attendant logging entry and exit and monitoring continuously.",
          },
          {
            title: "Presentation",
            body: "Space is presented for survey with a photographic completion report.",
          },
        ],
        appliesTo: [
          "Ballast tanks and double bottoms",
          "Cofferdams and void spaces",
          "Duct keels and pipe tunnels",
          "Pre-survey and pre-drydock preparation",
        ],
        faqs: [
          {
            q: "What if the atmosphere cannot be brought within limits?",
            a: "Then nobody enters. We extend ventilation, investigate the source, and if it still cannot be made safe we report that rather than working around it. No commercial pressure changes this.",
          },
        ],
      },
      {
        slug: "offshore-riding-squad",
        name: "Offshore Riding Squad",
        seoTitle: "Offshore Riding Squad | Maintenance Crews",
        metaDescription:
          "Offshore riding squads for maintenance, surface preparation, painting and fabrication support. Certified multi-skilled crews mobilised to vessels.",
        tagline: "Multi-skilled crews that clear the backlog",
        summary:
          "Multi-skilled maintenance squads mobilised to vessels and offshore units to work down the deferred-maintenance list.",
        keywords: [
          "offshore riding squad",
          "riding gang offshore",
          "vessel maintenance crew",
        ],
        intro: [
          "Deferred maintenance compounds. Every voyage the ship's crew cannot get to the deck backlog, the list gets longer and the steel gets worse, until what was a painting job becomes a steel renewal job.",
          "A riding squad breaks that cycle. We put a multi-skilled team on board for a defined period to work solely on the maintenance backlog — descaling, surface preparation, painting, minor fabrication and general upkeep — while the ship's crew continues to run the ship.",
        ],
        highlights: [
          "Multi-skilled: blasters, painters, fitters and welders",
          "Squads from 4 to 20, deployed for weeks or months",
          "Full certification, medicals and travel documentation handled",
          "Works under the vessel's or asset's safety management system",
          "Documented progress reporting to your technical department",
        ],
        scope: [
          {
            title: "Surface preparation",
            body: "Descaling, needle gunning, grinding and hydroblasting across decks, structures, tanks and superstructure.",
          },
          {
            title: "Coating application",
            body: "Priming and topcoat application to the paint maker's specification, with conditions recorded during application.",
          },
          {
            title: "Minor fabrication and repair",
            body: "Steel renewal, bracket and foundation work, pipe repairs and structural reinstatement by certified welders.",
          },
          {
            title: "General maintenance",
            body: "Hatch cover maintenance, valve and pipework upkeep, and other deferred items on the vessel's work list.",
          },
          {
            title: "Progress reporting",
            body: "Daily and weekly reporting with photographs so your superintendent can track the backlog burning down in real time.",
          },
        ],
        process: [
          {
            title: "Work list and scoping",
            body: "The maintenance backlog is reviewed and prioritised into a realistic programme for the squad size and duration.",
          },
          {
            title: "Crew documentation",
            body: "Certification, medicals, visas and flag-state approvals are prepared ahead of the join port or mobilisation window.",
          },
          {
            title: "Deployment",
            body: "Squad joins, completes familiarisation, and works under the vessel's or asset's permit-to-work system.",
          },
          {
            title: "Handover",
            body: "Completed work is inspected and signed off with a photographic close-out report.",
          },
        ],
        appliesTo: [
          "Merchant vessels on long voyages",
          "Offshore support vessels",
          "Rigs and production platforms",
          "Vessels preparing for inspection or sale",
        ],
        faqs: [
          {
            q: "How long can a riding squad stay on board?",
            a: "Anything from a two-week campaign to a rotation running several months. Duration is set by the work list and by crew rotation and rest-hour rules, which we plan for rather than discover halfway through.",
          },
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* 5. NDT & REPAIR                                                     */
  /* ------------------------------------------------------------------ */
  {
    slug: "ndt-and-repair",
    name: "NDT & Repair",
    icon: "ndt",
    seoTitle: "Marine NDT & Repair | Inspection & Painting",
    metaDescription:
      "Marine NDT inspection, remote inspection techniques, riding fabricators, hydroblasting and painting.",
    tagline: "Find it, prove it, fix it, protect it",
    summary:
      "Certified NDT inspection, remote inspection technology, fabrication, hydroblasting and marine coating application.",
    keywords: [
      "marine NDT services",
      "ship thickness measurement",
      "hydroblasting marine",
      "ship painting services",
    ],
    intro: [
      "Inspection and repair belong together. Finding a defect is only useful if there is a team on hand able to prepare, repair and re-protect the structure before the vessel sails, and splitting those scopes across contractors is how a two-day job becomes a two-week one.",
      "Cleanship covers the full sequence — certified NDT to find and quantify the defect, remote inspection technology to reach what people cannot, riding fabricators to carry out the repair, and hydroblasting and painting to restore the protective system.",
    ],
    faqs: [
      {
        q: "Are your NDT technicians certified?",
        a: "Yes. Technicians hold certification to ISO 9712 or ASNT Level II as appropriate to the method, and certificates are provided with every report.",
      },
      {
        q: "Can you carry out inspection and repair in one mobilisation?",
        a: "That is exactly how we prefer to work. Inspecting, repairing and recoating under one mobilisation removes the handover delays that dominate the timeline when the scopes are split between contractors.",
      },
    ],
    services: [
      {
        slug: "ndt-inspection",
        name: "NDT Inspection",
        seoTitle: "Marine NDT Inspection | UT, MPI & Thickness",
        metaDescription:
          "Certified marine NDT inspection \u2014 ultrasonic thickness measurement, magnetic particle, dye penetrant and radiographic testing for ships.",
        tagline: "Certified inspection, class-acceptable reporting",
        summary:
          "Ultrasonic, magnetic particle, dye penetrant and radiographic testing by ISO 9712 certified technicians.",
        keywords: [
          "marine NDT inspection",
          "ultrasonic thickness measurement ship",
          "MPI DPI marine",
          "class approved NDT",
        ],
        intro: [
          "Steel wastage and weld defects are the two findings that most often turn a routine survey into a repair specification. Both are invisible until they are measured, which is why credible NDT is the foundation of any structural decision on a vessel.",
          "Our ISO 9712 certified technicians carry out ultrasonic thickness measurement, magnetic particle, dye penetrant and radiographic testing on hull structure, tanks, piping, welds and machinery components, and report in a format your classification society will accept without argument.",
        ],
        highlights: [
          "Ultrasonic thickness measurement (UTM) for hull and tank structure",
          "Magnetic particle (MPI) and dye penetrant (DPI) weld inspection",
          "Radiographic testing for pipework and structural welds",
          "ISO 9712 / ASNT Level II certified technicians",
          "Class-acceptable reporting with full measurement records",
        ],
        scope: [
          {
            title: "Thickness measurement",
            body: "Systematic UTM gauging of shell plating, deck, bulkheads, tank structure and pipework, reported against original scantlings and wastage allowances.",
          },
          {
            title: "Weld inspection",
            body: "MPI and DPI examination of structural welds, repair welds and highly stressed areas for surface and near-surface defects.",
          },
          {
            title: "Radiographic testing",
            body: "RT of pipe and structural welds where volumetric examination is required by the specification or the surveyor.",
          },
          {
            title: "Defect assessment",
            body: "Findings assessed against acceptance criteria with clear identification of what must be repaired and what may be monitored.",
          },
          {
            title: "Reporting",
            body: "Full reports with measurement grids, sketches, photographs and technician certificates, formatted for submission to class.",
          },
        ],
        process: [
          {
            title: "Scope definition",
            body: "The measurement or inspection scope is agreed with the vessel, the surveyor or the classification society.",
          },
          {
            title: "Access and preparation",
            body: "Surfaces are prepared and access arranged, including rope access or staging where required.",
          },
          {
            title: "Inspection",
            body: "Certified technicians carry out the testing to the applicable standard with calibrated equipment.",
          },
          {
            title: "Reporting and follow-up",
            body: "Reports are issued promptly, and where repair is needed our fabrication team can mobilise on the same job.",
          },
        ],
        appliesTo: [
          "Hull and tank structure",
          "Pipework and pressure systems",
          "Structural and repair welds",
          "Offshore structures and cranes",
        ],
        faqs: [
          {
            q: "Do you provide class-approved thickness measurement?",
            a: "Yes. We work to the classification society's requirements for gauging scope, reporting format and technician certification, and we confirm the specific society's requirements before the job rather than after.",
          },
        ],
      },
      {
        slug: "remote-inspection-technology",
        name: "Remote Inspection Technology",
        seoTitle: "Remote Inspection | Drone & ROV Marine Survey",
        metaDescription:
          "Remote inspection techniques (RIT) using drones, crawlers and ROVs for tank, hold and structure inspection.",
        tagline: "Inspection without staging, without entry, without risk",
        summary:
          "Drones, crawlers and ROVs inspecting tanks, holds and structures without staging or man entry.",
        keywords: [
          "remote inspection technique",
          "drone tank inspection",
          "ROV survey vessel",
          "RIT class survey",
        ],
        intro: [
          "The most dangerous part of a traditional close-up survey is not the inspection — it is getting a person to the inspection point. Staging in a ballast tank, entry into an oxygen-depleted void, or working at height in a cargo hold carries risk that the inspection itself does not.",
          "Remote inspection technology removes that exposure. Confined-space drones, magnetic crawlers and ROVs deliver high-resolution imagery and thickness readings from structure nobody has to reach, and classification societies increasingly accept RIT in place of conventional close-up survey for defined scopes.",
        ],
        highlights: [
          "Confined-space drones for tanks, holds and voids",
          "Magnetic crawlers with ultrasonic thickness capability",
          "ROV inspection for underwater and flooded spaces",
          "Eliminates staging cost and confined-space exposure",
          "High-resolution imagery with defect location mapping",
        ],
        scope: [
          {
            title: "Drone internal survey",
            body: "Collision-tolerant drones survey ballast tanks, cargo holds, voids and chain lockers, producing high-resolution imagery of structure at height.",
          },
          {
            title: "Crawler thickness measurement",
            body: "Magnetic crawlers take ultrasonic thickness readings on shell plating and structure without staging or rope access.",
          },
          {
            title: "ROV inspection",
            body: "Remotely operated vehicles inspect flooded spaces, sea chests and underwater structure where diver access is impractical.",
          },
          {
            title: "Data processing and mapping",
            body: "Imagery and readings are processed into a located, indexed record so findings can be tied to specific structural members.",
          },
          {
            title: "Survey support",
            body: "Live feed to the attending surveyor, with the ability to revisit any area on request during the inspection.",
          },
        ],
        process: [
          {
            title: "Feasibility and class liaison",
            body: "We confirm with the society that RIT is acceptable for the intended survey scope before it is relied upon.",
          },
          {
            title: "Space preparation",
            body: "Spaces are ventilated, lit and confirmed suitable for equipment deployment.",
          },
          {
            title: "Remote inspection",
            body: "Equipment is flown or driven through the planned inspection programme with live monitoring.",
          },
          {
            title: "Reporting",
            body: "A located, indexed report with imagery, readings and findings is issued for the class file.",
          },
        ],
        appliesTo: [
          "Ballast tanks and cargo holds",
          "Void spaces and chain lockers",
          "Class close-up survey scopes",
          "Post-damage assessment",
        ],
        faqs: [
          {
            q: "Will class accept drone inspection instead of close-up survey?",
            a: "For many scopes yes, but acceptance is scope-specific and remains the society's decision. We establish it in writing before the survey rather than presenting a report and hoping.",
          },
          {
            q: "Can drones take thickness readings?",
            a: "Some platforms carry UT probes, but for reliable gauging on structure we generally prefer crawlers or conventional technicians, using drones for visual assessment and to target where gauging is actually needed.",
          },
        ],
      },
      {
        slug: "riding-fabricator",
        name: "Riding Fabricator",
        seoTitle: "Riding Fabricators | Welders & Steel Repair",
        metaDescription:
          "Certified riding fabricators and welders for shipboard steel repair, structural renewal and pipe work.",
        tagline: "Class-approved welders, mobilised to the vessel",
        summary:
          "Certified welders and fabricators carrying out steel renewal, structural repair and pipework on board.",
        keywords: [
          "riding fabricator",
          "ship welder riding crew",
          "steel renewal on board",
          "class approved welder",
        ],
        intro: [
          "Not every steel repair can wait for dry dock, and not every repair needs to. Wasted plating, cracked brackets, corroded pipework and damaged foundations can be renewed on board by certified welders working under class supervision, in port or on passage.",
          "Our riding fabricators hold class-approved welder qualifications and mobilise with their own equipment and consumables. Where the classification society requires attendance and approval of the repair, we coordinate it as part of the scope.",
        ],
        highlights: [
          "Class-approved welder qualifications (ABS, DNV, LR, BV and others)",
          "Steel renewal, doubler plates and crack repair",
          "Pipework fabrication, renewal and pressure testing",
          "Hatch cover, coaming and structural repair",
          "Class attendance and approval coordinated as part of the job",
        ],
        scope: [
          {
            title: "Steel renewal",
            body: "Cropping and renewal of wasted plating in tanks, holds, decks and superstructure to class-approved procedures.",
          },
          {
            title: "Structural repair",
            body: "Crack repair, bracket and stiffener renewal, foundation repair and reinstatement of damaged structure.",
          },
          {
            title: "Pipework",
            body: "Fabrication, renewal and repair of ballast, bilge, fuel and hydraulic pipework, with pressure testing on completion.",
          },
          {
            title: "Hatch covers and closing appliances",
            body: "Repair of hatch covers, coamings, compression bars and cleats to restore weathertight integrity.",
          },
          {
            title: "Class coordination",
            body: "Repair procedures, welder qualifications and attendance arranged with the classification society so the repair is credited properly.",
          },
        ],
        process: [
          {
            title: "Survey and specification",
            body: "The defect is inspected, measured and specified into a repair scope with the vessel and the surveyor.",
          },
          {
            title: "Procedure approval",
            body: "Repair procedures and welder qualifications are submitted for class approval before work begins.",
          },
          {
            title: "Execution",
            body: "Repair is carried out under hot-work permit with gas-free certification and fire watch in place.",
          },
          {
            title: "Testing and sign-off",
            body: "Repairs are NDT tested and pressure tested as required, then presented to the surveyor for acceptance.",
          },
        ],
        appliesTo: [
          "Steel renewal in tanks and holds",
          "Structural crack and damage repair",
          "Pipework renewal",
          "Class condition-of-class rectification",
        ],
        faqs: [
          {
            q: "Can steel repairs be done while the vessel is loaded?",
            a: "Sometimes, depending on the location, the adjacent cargo and whether a gas-free-for-hot-work certificate can be obtained. It is assessed case by case and safety decides, not the schedule.",
          },
        ],
      },
      {
        slug: "hydroblasting",
        name: "Hydroblasting",
        seoTitle: "Marine Hydroblasting | UHP Water Jetting",
        metaDescription:
          "Marine hydroblasting and ultra high pressure water jetting for coating removal, surface preparation and scale removal on ships, tanks.",
        tagline: "Surface preparation without a grain of grit",
        summary:
          "High and ultra-high pressure water jetting for coating removal, descaling and surface preparation.",
        keywords: [
          "marine hydroblasting",
          "UHP water jetting ship",
          "hydroblasting services UAE",
          "coating removal water jetting",
        ],
        intro: [
          "Hydroblasting achieves what abrasive blasting achieves, without the abrasive. No grit to buy, contain, sweep up and dispose of — which in a cargo hold, a tank or a working deck is not a minor advantage but the entire reason the job is possible while the vessel is in service.",
          "We operate high pressure and ultra-high pressure units for coating removal, scale and marine growth removal, degreasing and surface preparation, achieving the WJ-standard cleanliness your coating specification calls for.",
        ],
        highlights: [
          "High pressure and ultra-high pressure units up to 40,000 psi",
          "No abrasive residue to contain, collect or dispose of",
          "Prepares to WJ-2 / WJ-3 surface cleanliness standards",
          "Removes chlorides and soluble salts that abrasive blasting leaves behind",
          "Suitable for tanks, holds, decks and offshore structures",
        ],
        scope: [
          {
            title: "Coating removal",
            body: "Removal of failed, degraded or unwanted coating systems from steel structure, down to the specified cleanliness standard.",
          },
          {
            title: "Scale and corrosion removal",
            body: "Removal of rust scale, mill scale and corrosion products from tanks, holds, decks and structural steel.",
          },
          {
            title: "Salt and contaminant removal",
            body: "Removal of chlorides and soluble salts that cause premature coating failure — the key advantage over dry abrasive methods.",
          },
          {
            title: "Degreasing",
            body: "Removal of oil, grease and hydrocarbon contamination from decks, machinery spaces and working areas.",
          },
          {
            title: "Surface preparation",
            body: "Preparation to the WJ standard specified by the coating manufacturer, with cleanliness verified before coating.",
          },
        ],
        process: [
          {
            title: "Specification review",
            body: "The coating specification and required surface standard are confirmed with the paint manufacturer or the vessel.",
          },
          {
            title: "Containment and safety",
            body: "Work area is controlled with exclusion zones, and operators work with full UHP PPE under a written safe system of work.",
          },
          {
            title: "Blasting",
            body: "Surfaces are prepared to the specified standard with water and residue managed and collected.",
          },
          {
            title: "Inspection",
            body: "Prepared surface is inspected and, where required, salt-tested before coating begins.",
          },
        ],
        appliesTo: [
          "Cargo holds and tanks",
          "Decks and superstructure",
          "Offshore structures and platforms",
          "Shore tanks and industrial plant",
        ],
        faqs: [
          {
            q: "Does hydroblasting produce a surface profile like grit blasting?",
            a: "It does not create a new profile — it exposes and cleans the existing one. For previously blasted steel that is usually exactly what the specification needs. For new steel with no profile, abrasive blasting is the correct choice and we will say so.",
          },
          {
            q: "How is flash rusting handled?",
            a: "By controlling the interval between preparation and coating, and by using an approved flash rust inhibitor where the specification permits it.",
          },
        ],
      },
      {
        slug: "marine-painting",
        name: "Marine Painting",
        seoTitle: "Marine Painting | Ship Coating & Deck Painting",
        metaDescription:
          "Marine painting and coating application for ships and offshore structures. Tank coating, deck and superstructure painting.",
        tagline: "Coatings applied to specification, and documented",
        summary:
          "Coating application for tanks, holds, decks and superstructure, applied and documented to specification.",
        keywords: [
          "marine painting services",
          "ship painting company",
          "tank coating application",
          "deck painting vessel",
        ],
        intro: [
          "A coating system fails for one of two reasons: the surface was not properly prepared, or the application conditions were outside the manufacturer's window. Both are entirely within the applicator's control, and both are why we record conditions rather than simply painting and hoping.",
          "We apply protective coatings to tanks, holds, decks, superstructure and offshore structures to the paint manufacturer's specification, with surface preparation, ambient conditions, dew point, film thickness and overcoating intervals documented throughout.",
        ],
        highlights: [
          "Airless spray, roller and brush application",
          "Tank, hold, deck, superstructure and offshore structure coating",
          "Full compatibility with major marine coating manufacturers",
          "Conditions, dew point and DFT recorded during application",
          "Spot repair through to full recoating scopes",
        ],
        scope: [
          {
            title: "Surface preparation",
            body: "Hydroblasting, mechanical preparation or hand tool cleaning to the standard the coating specification requires.",
          },
          {
            title: "Coating application",
            body: "Primer, intermediate and topcoat applied by airless spray, roller or brush to the specified dry film thickness.",
          },
          {
            title: "Tank and hold coating",
            body: "Application of tank and hold coating systems including stripe coating of edges, welds and structural details.",
          },
          {
            title: "Condition monitoring",
            body: "Temperature, humidity, dew point and steel temperature recorded before and during application to confirm the window.",
          },
          {
            title: "Quality documentation",
            body: "DFT readings, holiday detection where specified, and a full application record issued on completion.",
          },
        ],
        process: [
          {
            title: "Specification and planning",
            body: "The coating system, preparation standard and application conditions are confirmed against the manufacturer's data sheets.",
          },
          {
            title: "Preparation",
            body: "Surfaces are prepared and inspected, and the substrate is accepted before any coating is opened.",
          },
          {
            title: "Application",
            body: "Coats are applied within the specified conditions and overcoating intervals, with stripe coating where required.",
          },
          {
            title: "Inspection and handover",
            body: "Dry film thickness is measured, defects are rectified, and the application record is issued.",
          },
        ],
        appliesTo: [
          "Cargo holds and tanks",
          "Decks, hatch covers and superstructure",
          "Ballast tanks and void spaces",
          "Offshore structures and equipment",
        ],
        faqs: [
          {
            q: "Can painting be done on board rather than in dry dock?",
            a: "Yes, for most internal and above-waterline scopes, provided the ambient conditions can be kept within the coating's window. Humidity and dew point are the practical limits, not the location.",
          },
          {
            q: "Do you supply the paint?",
            a: "We can supply it, or apply owner-supplied material. Many operators prefer to supply their own under an existing manufacturer agreement, and that works perfectly well for us.",
          },
        ],
      },
    ],
  },
];

/* -------------------------------------------------------------------- */
/* Lookup helpers                                                       */
/* -------------------------------------------------------------------- */

export function getCategory(slug: string): ServiceCategory | undefined {
  return serviceCategories.find((c) => c.slug === slug);
}

export function getService(
  categorySlug: string,
  serviceSlug: string,
): { category: ServiceCategory; service: Service } | undefined {
  const category = getCategory(categorySlug);
  const service = category?.services.find((s) => s.slug === serviceSlug);
  if (!category || !service) return undefined;
  return { category, service };
}

/** Flat list of every service with its parent — used by the sitemap. */
export function allServicePaths(): { category: string; service: string }[] {
  return serviceCategories.flatMap((category) =>
    category.services.map((service) => ({
      category: category.slug,
      service: service.slug,
    })),
  );
}

/** Sibling services within a category, excluding the current one. */
export function relatedServices(categorySlug: string, serviceSlug: string) {
  const category = getCategory(categorySlug);
  if (!category) return [];
  return category.services.filter((s) => s.slug !== serviceSlug);
}

export const totalServiceCount = serviceCategories.reduce(
  (n, c) => n + c.services.length,
  0,
);
