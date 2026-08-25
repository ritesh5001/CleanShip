/**
 * Project case studies.
 *
 * ⚠️ EVERY ENTRY IS CURRENTLY `real: false`.
 *
 * These describe the *shape* of a case study so the page layout, the detail
 * routes and the SEO structure are ready and tested. They are illustrative
 * scope patterns, not claims about specific completed jobs.
 *
 * WHAT `real` CONTROLS
 *
 * A `real: false` entry renders on the /projects index as a scope pattern and
 * its detail page is `noindex, follow`. Nothing invented reaches the index —
 * which is the whole point, because a page presenting an imagined job as a
 * completed contract is worse for trust than having no case studies at all.
 *
 * Flip `real: true` and the detail page becomes indexable and enters the
 * sitemap automatically.
 *
 * TO REPLACE ONE PROPERLY
 *
 * Vessel type, port, month and year, the actual scope, the actual duration
 * and the actual outcome. The client's name can be withheld — "a Handysize
 * bulk carrier at Kandla, June 2026" is credible without naming anyone — but
 * the port and the date cannot be, because those are what make it checkable.
 * Add `port` and `date` when you do; the detail template already renders them.
 */

export type Project = {
  slug: string;
  /** false = illustrative scope pattern, noindex. true = a real job. */
  real: boolean;
  vesselType: string;
  scope: string;
  /** Matches a category slug in lib/services.ts. */
  category: string;
  /** Matches a service slug in lib/services.ts. */
  service: string;
  challenge: string;
  approach: string;
  outcome: string;
  /** Port the job was done at. Add when the entry becomes real. */
  port?: string;
  /** e.g. "June 2026". Add when the entry becomes real. */
  date?: string;
};

export const projects: Project[] = [
  {
    slug: "supramax-bulk-carrier-riding-crew",
    real: false,
    vesselType: "Supramax bulk carrier",
    scope: "Hold cleaning — riding crew",
    category: "hold-cleaning",
    service: "riding-crew",
    challenge:
      "Five holds carrying petcoke residue, with a grain-clean requirement at the next load port and only a six-day ballast passage available.",
    approach:
      "An eight-person riding crew joined at the discharge port and worked the holds in sequence across the passage, sweeping and washing forward-to-aft so completed holds had maximum drying time.",
    outcome:
      "All five holds presented and passed at the load port with no commercial time lost to cleaning.",
  },
  {
    slug: "mr-product-tanker-cpp-grade-change",
    real: false,
    vesselType: "MR product tanker",
    scope: "Tank cleaning — CPP grade change",
    category: "tank-cleaning",
    service: "oil-tanker-dpp-cpp",
    challenge:
      "Grade change from gasoil into jet fuel, with a wall wash requirement and a coating system approaching the end of its service life.",
    approach:
      "Cycle programme planned against the cargo pair, machine washing followed by manual finishing of bellmouths, coils and structural shadows, then drying and testing before presentation.",
    outcome:
      "Tanks presented to the inspector with the coating limitation identified and communicated in advance rather than discovered at test.",
  },
  {
    slug: "panamax-container-ship-hull-cleaning-propeller-polishing",
    real: false,
    vesselType: "Panamax container ship",
    scope: "Hull cleaning & propeller polishing",
    category: "hull-cleaning",
    service: "propeller-super-polishing",
    challenge:
      "Extended period at anchorage in warm water had produced heavy fouling on the flat bottom and calcareous growth on the propeller.",
    approach:
      "Brush cart cleaning of the full underwater hull with hand work on niche areas, followed by staged propeller polishing to a Class A mirror finish. Carried out at anchorage over two working days.",
    outcome:
      "Hull and propeller returned to a smooth condition without off-hire, with before-and-after video issued for the technical file.",
  },
  {
    slug: "platform-supply-vessel-charter-turnaround",
    real: false,
    vesselType: "Platform supply vessel",
    scope: "Offshore — charter turnaround",
    category: "offshore",
    service: "offshore-support-vessel-services",
    challenge:
      "Off-charter to on-charter window of under three days, covering mud and brine tanks, cargo deck degreasing and accommodation presentation.",
    approach:
      "Deck, tank and accommodation scopes run in parallel by a single team, with line and pump flushing included so cross-contamination did not reappear from the system.",
    outcome:
      "Vessel presented for on-hire inspection inside the window with observations rectified on the spot.",
  },
  {
    slug: "handysize-bulk-carrier-ndt-inspection-riding-fabricator",
    real: false,
    vesselType: "Handysize bulk carrier",
    scope: "NDT inspection & riding fabricator",
    category: "ndt-and-repair",
    service: "riding-fabricator",
    challenge:
      "Thickness gauging in ballast tanks identified wasted plating and cracked brackets requiring rectification ahead of a class survey.",
    approach:
      "Certified NDT technicians quantified the wastage, then riding fabricators cropped and renewed the affected plating under class-approved procedures and hot-work permit.",
    outcome:
      "Repairs NDT tested and presented to the attending surveyor within the same mobilisation, avoiding a second contractor call-out.",
  },
  {
    slug: "crude-oil-tanker-demucking-gas-freeing",
    real: false,
    vesselType: "Crude oil tanker",
    scope: "Demucking & gas-freeing",
    category: "tank-cleaning",
    service: "demucking",
    challenge:
      "Heavy compacted sludge around bellmouths and heating coils requiring removal before a gas-free-for-hot-work certificate could be pursued.",
    approach:
      "Rotating teams worked under full enclosed-space entry regime with continuous monitoring and manned rescue standby, with residues quantified and landed to an approved facility.",
    outcome:
      "Tanks cleared and washed down, with independent certification arranged separately as the correct next step.",
  },
];

const bySlug = new Map(projects.map((p) => [p.slug, p]));

export function getProject(slug: string): Project | undefined {
  return bySlug.get(slug);
}

/** Only entries describing real, completed work are allowed into the index. */
export const realProjects = projects.filter((p) => p.real);
