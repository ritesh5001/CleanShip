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
  /* HULL CLEANING — the only line CleanHull runs.                        */
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
            a: "Underwater hull cleaning is the process of removing marine growth, algae, barnacles, and biofouling from a vessel's hull while it remains afloat. CleanHull Marine uses professional divers and specialized equipment to clean hulls without dry-docking, saving time and cost.",
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
            a: "CleanHull Marine uses diver-operated brush systems, ROV-assisted inspection tools, and eco-friendly cleaning techniques designed to remove hull fouling safely without damaging antifouling coatings or the ship's hull surface.",
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
            a: "Yes. CleanHull Marine follows eco-friendly hull cleaning practices and complies with port and environmental regulations to safely capture debris and prevent invasive marine species from spreading during the cleaning process.",
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
            a: "Yes. CleanHull Marine's divers perform underwater thruster cleaning and polishing while the vessel is afloat, eliminating the need for dry-docking and keeping the vessel operational.",
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
            a: "CleanHull Marine uses diver-operated rotary polishing tools and abrasive pads calibrated for thruster blade alloys, delivering a smooth, low-friction finish similar to propeller super polishing techniques.",
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
            a: "Yes. CleanHull Marine's certified divers perform underwater propeller polishing using specialized abrasive systems calibrated for marine-grade propeller alloys, with no need for dry-docking.",
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
            a: "Contact CleanHull Marine with your vessel's propeller specifications and port of call, and our diving team will schedule an underwater propeller polishing service with full inspection reporting.",
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
            a: "CleanHull Marine coordinates in-water class surveys using classification society-approved divers and inspection equipment, ensuring the survey meets the documentation and video standards required for class certification.",
          },
          {
            q: "What does an In-Water Class Survey include?",
            a: "The survey typically covers hull plating, sea chests, propeller, rudder, bow thruster, anodes, and draft mark verification, with underwater video and photographic evidence submitted to the classifying society.",
          },
          {
            q: "Which vessels are eligible for In-Water Class Survey?",
            a: "Eligibility depends on vessel age, class notation, and classification society rules. CleanHull Marine can advise whether your vessel qualifies for an in-water survey in place of dry-dock inspection.",
          },
          {
            q: "How do I schedule an In-Water Class Survey?",
            a: "Contact CleanHull Marine with your vessel's class society, survey due date, and port of call, and our team will coordinate diver mobilization and survey documentation in line with class requirements.",
          },
          {
            q: "How long does an In-Water Class Survey take to complete?",
            a: "Most in-water class surveys are completed within one to two days depending on vessel size, hull condition, and underwater visibility, with the vessel remaining alongside or at anchor throughout.",
          },
          {
            q: "What documentation is provided after an In-Water Class Survey?",
            a: "CleanHull Marine provides a full survey report with underwater video footage, photographic evidence, and measurement data formatted to meet classification society submission requirements.",
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
            a: "CleanHull Marine's certified diving teams carry out UWILD inspections in accordance with classification society requirements, ensuring the survey is properly documented and accepted for class and statutory purposes.",
          },
          {
            q: "How long does a UWILD survey take?",
            a: "Duration depends on vessel size and underwater conditions, but most UWILD surveys can be completed within one to two days while the vessel remains alongside or at anchor.",
          },
          {
            q: "Is UWILD accepted by all classification societies?",
            a: "Most major classification societies accept UWILD for eligible vessels under specific age and class conditions. CleanHull Marine can confirm requirements with your classification society before scheduling the survey.",
          },
          {
            q: "What are the eligibility requirements for a UWILD survey?",
            a: "Eligibility generally depends on vessel age, class notation, and prior survey history, with most societies requiring the vessel to be under a certain age and free of major outstanding hull conditions.",
          },
          {
            q: "What equipment is used during a UWILD inspection?",
            a: "CleanHull Marine uses diver-operated cameras, underwater lighting, and measurement tools to capture detailed footage of the hull, sea chests, propeller, and rudder for class-compliant UWILD documentation.",
          },
          {
            q: "Can UWILD be combined with hull cleaning or propeller polishing?",
            a: "Yes. Many shipowners schedule UWILD inspections alongside underwater hull cleaning or propeller super polishing in the same mobilization, reducing costs and downtime by combining services in one dive operation.",
          },
          {
            q: "How do I arrange a UWILD survey for my vessel?",
            a: "Contact CleanHull Marine with your vessel's class society, survey due date, and port of call, and our certified dive team will coordinate the UWILD survey and prepare full class-compliant documentation.",
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

/**
 * The single service line. CleanHull runs one category, so components that
 * would otherwise iterate `serviceCategories` to build a grid read this
 * directly and lay out its five scopes instead — a one-item grid reads as a
 * mistake, five scopes read as a service list.
 */
export const hullCleaning = serviceCategories[0];
