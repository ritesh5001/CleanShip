/**
 * Insights — the editorial section.
 *
 * The previous WordPress site ran location-angled posts. They were deleted in
 * the rebuild and nothing replaced them, which cost the site the only content
 * type that earns links and the only reason a first-time visitor comes back.
 * Templated port pages do not do either job.
 *
 * ⚠️ WHAT THESE TWO POSTS DELIBERATELY DO NOT DO
 *
 * They name no class society, no certification, no client, no cost figure and
 * no person. That is not caution for its own sake — every one of those would
 * be a claim I cannot verify from the repo, and an unverifiable claim on a
 * page about compliance is worse than no page. They are process explainers,
 * which is the part that can be written honestly from what the site already
 * demonstrates it knows.
 *
 * THE POSTS THAT ACTUALLY EARN LINKS ARE THE ONES YOU CAN WRITE AND I CANNOT:
 *
 *   - What a PSC hold-cleanliness detention actually costs, with a real case
 *   - Which class societies Cleanship holds in-water survey approval with
 *   - What fouling looks like after 40 days at the Kandla outer anchorage,
 *     with the photographs
 *   - The cost of a failed wall wash at a Gulf terminal, from a real job
 *
 * Two a month is enough. Attribute them to a named operations manager or
 * diving supervisor — see F15 in the audit; an author with a name and a trade
 * history is worth more than the article.
 */

export type Insight = {
  slug: string;
  title: string;
  /** ≤60 chars including the " | Cleanship" suffix budget of 12. */
  seoTitle: string;
  description: string;
  /** ISO date. */
  date: string;
  /** Reading time in minutes, rounded. */
  minutes: number;
  category: "Hold cleaning" | "Hull cleaning" | "Tank cleaning" | "Compliance";
  /**
   * ⚠️ Company attribution is a placeholder. Google's quality systems weight
   * demonstrated experience, and "Cleanship Marine Services" is an entity,
   * not an author. Replace with a named person and a one-line trade history.
   */
  author: string;
  lead: string;
  body: { heading: string; paragraphs: string[] }[];
  /** Pulled into the FAQPage schema on the post. */
  faqs: { q: string; a: string }[];
  /** Category slug in lib/services.ts, for the related-service block. */
  serviceCategory: string;
  serviceSlug: string;
};

export const insights: Insight[] = [
  {
    slug: "in-water-survey-vs-uwild",
    title: "In-water survey and UWILD: what the difference actually is",
    seoTitle: "In-Water Survey vs UWILD",
    description:
      "The two are used interchangeably and they are not the same thing. What each is for, what makes a vessel eligible, and what must be true before the surveyor arrives.",
    date: "2026-08-25",
    minutes: 6,
    category: "Compliance",
    author: "Cleanship Marine Services",
    serviceCategory: "hull-cleaning",
    serviceSlug: "uwild",
    lead: "Ask three superintendents what UWILD stands for and you will get three answers, at least one of which will be an in-water survey by another name. The distinction matters commercially, because one of them can defer a dry docking and the other cannot.",
    body: [
      {
        heading: "An in-water survey is an inspection method",
        paragraphs: [
          "An in-water survey is exactly what it sounds like: divers inspect the underwater hull, rudder, propeller, stern gear and sea chests while the vessel is afloat, with the findings recorded and reported. It can be commissioned for any reason at all — a suspected grounding, a vibration complaint, a pre-purchase check, a fouling assessment before fixing a voyage. Nobody has to approve it and nothing depends on it.",
          "That is the version most vessels use most of the time, and it is genuinely useful. A documented condition record costs a fraction of a dry docking and answers most of the questions a technical department actually has.",
        ],
      },
      {
        heading: "UWILD is a survey credit",
        paragraphs: [
          "UWILD — Underwater Inspection In Lieu of Drydocking — is a formal substitution. The classification society accepts the in-water inspection *in place of* an intermediate docking survey that would otherwise require the vessel to come out of the water. That is where the money is: a deferred docking is off-hire that never happens.",
          "Because it substitutes for a statutory requirement, the conditions are exacting in a way an ordinary in-water survey's are not. The vessel has to be eligible. The contractor has to hold approval. The surveyor has to attend and has to be able to see the structure in real time. The hull markings have to let them locate any feature precisely. And the whole thing has to be documented to a standard that survives review.",
        ],
      },
      {
        heading: "What determines eligibility",
        paragraphs: [
          "Eligibility is not a judgement call made on the day; it is a set of conditions checked in advance. Vessel age is the first — older tonnage is progressively restricted, and past a certain point the substitution is simply not available. Vessel type matters, class notation matters, and the survey history matters: a vessel with outstanding conditions of class is a different conversation from one with a clean record.",
          "This is the step that goes wrong most often, and it goes wrong expensively. A dive team mobilised, a surveyor booked and a berth window held, then the discovery that the substitution was never available for that hull. Eligibility gets confirmed before cost is committed, not after.",
        ],
      },
      {
        heading: "What has to be true before the surveyor arrives",
        paragraphs: [
          "The surveyor needs to see the structure, which means the structure has to be visible. In a port with genuinely clear water that is a low bar. In a river port with near-zero visibility it may not be achievable at all for the scope requested, and the honest answer at quoting stage is that the attendance should be booked somewhere else.",
          "The hull markings are the other precondition and the one most often overlooked. The surveyor has to be able to say precisely where a finding is — frame number, strake, distance from a reference — and that only works if the reference marks exist and are legible. A hull whose markings have been painted over is a hull where every finding is approximate.",
          "Where the condition warrants it, the survey areas are cleaned before the attendance rather than during it. Cleaning while a surveyor watches is time nobody is paying for.",
        ],
      },
      {
        heading: "The practical answer",
        paragraphs: [
          "If the question is *what condition is my hull in*, an in-water survey answers it, and it can be done at almost any port with almost any notice. If the question is *can I defer the docking*, that is a UWILD, and it starts with an eligibility check and a conversation with class — not with a dive team.",
          "The two run on the same equipment and often the same attendance. What separates them is the paperwork, and the paperwork is the part that is worth money.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is UWILD the same as an in-water survey?",
        a: "No. An in-water survey is an inspection method that anyone can commission for any reason. UWILD is a formal substitution accepted by the classification society in place of a docking survey — it requires vessel eligibility, an approved contractor, surveyor attendance and a documented programme. Every UWILD involves an in-water survey; most in-water surveys are not UWILD.",
      },
      {
        q: "What makes a vessel eligible for UWILD?",
        a: "Age, type, class notation and survey history, checked against the classification society's rules before anything is booked. Older tonnage is progressively restricted and past a certain point the substitution is not available at all. Outstanding conditions of class change the answer. This is confirmed before cost is committed, not discovered after mobilisation.",
      },
      {
        q: "Can UWILD be done in poor visibility?",
        a: "Sometimes, but not for every scope, and it has to be agreed in advance on a close-quarters, high-intensity lighting basis. In a river port with near-zero visibility some scopes will simply not be accepted. The honest answer at quoting stage is that the attendance should be planned for a port where the water will support it.",
      },
      {
        q: "Does the vessel go off hire for a UWILD?",
        a: "No — that is the entire commercial argument for it. The inspection is carried out with the vessel afloat, at the berth or the anchorage, and in many cases alongside cargo operations. The deferred dry docking is the off-hire that never happens.",
      },
    ],
  },
  {
    slug: "why-a-clean-looking-hold-still-fails",
    title: "Why a hold that looks clean still fails inspection",
    seoTitle: "Why Clean-Looking Holds Fail",
    description:
      "Grain-clean is not a visual standard. The four things a surveyor checks that a swept hold will not pass — and why drying is the stage that catches people out.",
    date: "2026-08-25",
    minutes: 5,
    category: "Hold cleaning",
    author: "Cleanship Marine Services",
    serviceCategory: "hold-cleaning",
    serviceSlug: "shore-gang",
    lead: "The most expensive hold cleaning conversation is the one that happens after the surveyor has already said no. Almost always, the vessel had done work — sweeping, hosing, sometimes a full wash — and almost always, the work stopped at the point where the hold started to look acceptable.",
    body: [
      {
        heading: "Looking clean and being clean are different tests",
        paragraphs: [
          "A hold presented for a food-grade cargo is not being judged on appearance. It is being judged on whether any trace of the previous cargo remains, whether the structure is dry, whether there is any infestation, and whether there is any odour. Three of those four are invisible from the tank top.",
          "That is why a hold can be swept to a genuinely high visual standard and still fail on the first check. The surveyor is not looking at the same thing the crew was cleaning.",
        ],
      },
      {
        heading: "Residue hides where nobody sweeps",
        paragraphs: [
          "Cargo residue does not distribute evenly. It concentrates in the frames, behind brackets, in the tank-top margins, under the hold ladders and in the bilge wells — the places a broom cannot reach and a hose pushes material into rather than out of. A hold cleaned from the middle outwards looks immaculate and holds the entire failure in its edges.",
          "Different cargoes fail differently. Mineral fines stain and need chemical treatment. Cement and clinker set hard if the wash is late and then need mechanical removal. Fertiliser is hygroscopic and corrosive and it will not tolerate being left damp. Coal films every surface and settles again after each sweep, which is why cleaning between grabs is usually wasted effort.",
        ],
      },
      {
        heading: "Drying is the stage that gets skipped",
        paragraphs: [
          "This is the one that catches people out more than any other. A hold that has been washed properly and closed while still damp will fail — not on residue, but on moisture, and on whatever moisture then encourages. In a humid port, or during the rains, a hold will not dry on its own inside the time available.",
          "Drying is not a passive stage. It needs ventilation, it needs time, and it needs the sequence planned so the holds finished first get the longest to dry. Working forward-to-aft rather than all-at-once is the difference between a hold that dries and a hold that is merely no longer wet.",
        ],
      },
      {
        heading: "The standard is set by the next cargo, not the last one",
        paragraphs: [
          "This is the framing that makes the rest of it obvious. What the hold carried last determines how much work there is. What it carries next determines when the work stops.",
          "A hold going from coal into coal needs very little. The same hold going from coal into grain needs the full sequence — sweep, wash, chemical treatment matched to the residue, rinse, dry, and a bilge system that has been cleaned and tested rather than assumed. Planning backwards from the inspection is the only version of this that reliably passes.",
        ],
      },
      {
        heading: "Where the time comes from",
        paragraphs: [
          "The honest constraint is almost never the cleaning; it is the window. A berth that will not be held open, a discharge that finishes hold by hold, a surveyor booked for a fixed morning.",
          "Which is why the answer at a fast-turnaround port is usually not a bigger gang. It is a gang that starts as each hold empties and a riding crew that finishes the rest on the passage out — a passage the vessel was making anyway, on which the cleaning costs no port time at all.",
        ],
      },
    ],
    faqs: [
      {
        q: "What is a grain-clean standard?",
        a: "A hold condition acceptable for loading grain: free of any previous cargo residue, dry, free of infestation and free of odour, with the bilge system clean and tested. It is inspected by a surveyor before loading and it is not a visual standard — three of the four checks cannot be judged by looking at the tank top.",
      },
      {
        q: "Why does a washed hold still fail?",
        a: "Most often on moisture or on residue in places a broom and hose do not reach — the frames, behind brackets, the tank-top margins, under the ladders and in the bilge wells. A hold washed properly and closed while damp will fail on the drying, not the washing.",
      },
      {
        q: "How long does hold cleaning take?",
        a: "It depends on the number of holds, the residue from the last cargo, the standard the next fixture demands and how much of the vessel's stay is actually available. The cleaning is rarely the constraint; the window is. Where the window is short, the work starts alongside as each hold empties and a riding crew finishes it on the passage.",
      },
      {
        q: "Can the crew do it instead?",
        a: "For a light change of cargo, often yes. For a full grain-clean after a dirty bulk cargo, it takes people, chemicals and time that a working crew does not have spare — and a failed inspection costs more than the gang would have. The trade-off is worth making deliberately rather than by default.",
      },
    ],
  },
];

const bySlug = new Map(insights.map((i) => [i.slug, i]));

export function getInsight(slug: string): Insight | undefined {
  return bySlug.get(slug);
}
