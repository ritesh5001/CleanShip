/**
 * The team, as shown on /team.
 *
 * TO FINISH A PROFILE
 *   photo    drop a square JPG/WebP (at least 600×600) in public/images/team/
 *            and set e.g. photo: "/images/team/neeraj-bharti.jpg". Until then
 *            the card shows the person's initials.
 *   socials  paste the full profile URLs. A network with no URL is simply not
 *            shown — there are no dead icons.
 *   bio      one or two sentences of real trade history. Optional; left empty
 *            rather than invented, because an unverifiable bio on a page that
 *            exists to show who stands behind the work does more harm than none.
 *
 * Profiles with links also go into the page's structured data (schema.org
 * Person, sameAs), which is how Google connects the people to the company.
 */

export type TeamSocials = {
  linkedin?: string;
  instagram?: string;
  facebook?: string;
  x?: string;
  email?: string;
};

export type TeamMember = {
  slug: string;
  /** Honorific shown before the name: "Capt", "Mr.", "Ms." */
  title: string;
  name: string;
  position: string;
  photo?: string;
  bio?: string;
  socials: TeamSocials;
};

export const team: TeamMember[] = [
  {
    slug: "neeraj-bharti",
    title: "Capt",
    name: "Neeraj Bharti",
    position: "Founder",
    socials: {},
  },
  {
    slug: "himanshu-pathak",
    title: "Mr.",
    name: "Himanshu Pathak",
    position: "Operation Manager",
    socials: {},
  },
  {
    slug: "vivek-rao",
    title: "Mr.",
    name: "Vivek Rao",
    position: "Crew Management & Marketing Head",
    socials: {},
  },
  {
    slug: "anshika-singh",
    title: "Ms.",
    name: "Anshika Singh",
    position: "Sales Manager",
    socials: {},
  },
  {
    slug: "sweta-singh",
    title: "Ms.",
    name: "Sweta Singh",
    position: "Digital Marketing",
    socials: {},
  },
  {
    slug: "ritesh-giri",
    title: "Mr.",
    name: "Ritesh Giri",
    position: "Full Stack Developer",
    socials: {},
  },
];

export function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0]!.toUpperCase())
    .slice(0, 2)
    .join("");
}

export function socialLinks(s: TeamSocials): string[] {
  return [s.linkedin, s.instagram, s.facebook, s.x].filter((u): u is string => Boolean(u));
}
