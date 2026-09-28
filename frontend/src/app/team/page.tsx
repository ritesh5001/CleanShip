import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { CtaBand } from "@/components/cta-band";
import { Reveal } from "@/components/reveal";
import { JsonLd } from "@/components/json-ld";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  MailIcon,
} from "@/components/icons";
import { BASE_URL, breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { initialsOf, socialLinks, team, type TeamMember } from "@/lib/team";

export const metadata: Metadata = buildMetadata({
  title: "Our Team — The People Behind Cleanship",
  description:
    "Meet the Cleanship Marine Services team — founder Capt Neeraj Bharti and the operations, crew management, sales, marketing and technology leads.",
  path: "/team",
  keywords: ["Cleanship team", "Capt Neeraj Bharti", "Cleanship Marine Services founder", "marine services team UAE"],
});

const trail = [
  { name: "Home", path: "/" },
  { name: "About Us", path: "/about" },
  { name: "Our Team", path: "/team" },
];

function Social({ member }: { member: TeamMember }) {
  const s = member.socials;
  const items = [
    s.linkedin && { href: s.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
    s.instagram && { href: s.instagram, label: "Instagram", Icon: InstagramIcon },
    s.facebook && { href: s.facebook, label: "Facebook", Icon: FacebookIcon },
    s.email && { href: `mailto:${s.email}`, label: "Email", Icon: MailIcon },
  ].filter(Boolean) as { href: string; label: string; Icon: typeof LinkedInIcon }[];

  if (items.length === 0) return null;
  return (
    <ul className="mt-4 flex gap-2">
      {items.map(({ href, label, Icon }) => (
        <li key={label}>
          <a
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noopener noreferrer me" : undefined}
            aria-label={`${member.name} on ${label}`}
            className="flex size-9 items-center justify-center border border-line-200 text-slate-600 transition-colors duration-[140ms] hover:border-blue-600 hover:text-blue-600"
          >
            <Icon className="size-4" />
          </a>
        </li>
      ))}
    </ul>
  );
}

function Card({ member, featured = false }: { member: TeamMember; featured?: boolean }) {
  return (
    <article
      id={member.slug}
      className={`flex h-full scroll-mt-[140px] flex-col border border-line-200 bg-white ${
        featured ? "sm:flex-row" : ""
      }`}
    >
      <div
        className={`relative shrink-0 overflow-hidden bg-navy-800 ${
          featured ? "aspect-square sm:w-[300px]" : "aspect-[4/3]"
        }`}
      >
        {member.photo ? (
          // eslint-disable-next-line @next/next/no-img-element -- local portrait, sized by CSS
          <img
            src={member.photo}
            alt={`${member.title} ${member.name}, ${member.position}`}
            className="size-full object-cover"
            loading={featured ? "eager" : "lazy"}
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-gradient-to-br from-navy-800 to-[#0e3d6b]">
            <span
              aria-hidden="true"
              className="font-display text-[64px] font-bold tracking-wide text-white/90"
            >
              {initialsOf(member.name)}
            </span>
          </div>
        )}
      </div>
      <div className={`flex flex-1 flex-col ${featured ? "p-7 sm:p-9" : "p-6"}`}>
        <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-blue-600">
          {member.position}
        </p>
        <h2
          className={`mt-2 font-display font-bold leading-tight text-ink-900 ${
            featured ? "text-[32px]" : "text-[24px]"
          }`}
        >
          {member.title} {member.name}
        </h2>
        {member.bio && (
          <p className="mt-3 text-[15px] leading-[1.62] text-slate-600">{member.bio}</p>
        )}
        <div className="mt-auto">
          <Social member={member} />
        </div>
      </div>
    </article>
  );
}

export default function TeamPage() {
  const [founder, ...rest] = team;

  return (
    <>
      <JsonLd
        schema={[
          breadcrumbSchema(trail),
          {
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "@id": `${BASE_URL}/team#page`,
            url: `${BASE_URL}/team`,
            name: "Our Team",
            about: { "@id": `${BASE_URL}/#organization` },
            mainEntity: team.map((m) => ({
              "@type": "Person",
              "@id": `${BASE_URL}/team#${m.slug}`,
              name: m.name,
              honorificPrefix: m.title.replace(/\.$/, ""),
              jobTitle: m.position,
              worksFor: { "@id": `${BASE_URL}/#organization` },
              ...(m.photo ? { image: `${BASE_URL}${m.photo}` } : {}),
              ...(socialLinks(m.socials).length ? { sameAs: socialLinks(m.socials) } : {}),
            })),
          },
        ]}
      />

      <PageHero
        eyebrow="Our Team"
        title="The people behind Cleanship"
        description="A small team that runs every job from the first enquiry to the completion report — operations, crew, sales and the systems that tie them together."
        trail={trail}
      />

      <section className="bg-[#f6f8fa]">
        <div className="container-page py-16 lg:py-20">
          <Reveal>
            <Card member={founder} featured />
          </Reveal>

          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((member, i) => (
              <Reveal as="li" key={member.slug} delay={i * 50}>
                <Card member={member} />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand
        title="Talk to the team."
        description="Tell us the vessel, the port and the window. The operations desk is manned 24 hours, Monday to Sunday."
      />
    </>
  );
}
