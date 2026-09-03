# CleanShip Design System

Design system for **Cleanship Marine Services FZE** — a UAE-based marine cleaning contractor (hold, tank and underwater hull cleaning, hydroblasting, painting, offshore vessel support) operating out of Ajman Free Zone with a second contact line in India.

Tagline in use: **"Marine Cleaning You Can Trust."** Signature stock line: **"We always ready to serve you."**

---

## Sources given to me

| Source | What it contained | How I used it |
| --- | --- | --- |
| `uploads/1830bdb47c009033da4445723eb88974.jpg` | A scanned/marketing spread of a **printed marine-industry brochure belonging to a different company — Qingdao Jerryborg Marine Machinery Co., Ltd** (found via a social post, watermark "小红书号: SHILIU1952"). | Art direction **reference only**: navy/white split pages, full-bleed vessel photography, condensed uppercase display type, numbered contents index, dense photo grids, thin rules. No copy, marks, imagery or layouts of that company are reproduced. |
| Pasted site copy (in the brief) | Full public-site text for cleanship.co: nav, eight services with blurbs, About prose, counters, contact details, footer. | Verbatim content source for the UI kit and component defaults. |

**Not provided:** codebase, Figma file, logo files, font binaries, photography, icon set, brand guidelines. Everything visual below is a reconstruction from the site copy plus the brochure art direction — see **Open questions** at the end.

---

## Index

| Path | What it is |
| --- | --- |
| `styles.css` | Global entry — `@import` list only. Consumers link this one file. |
| `tokens/` | `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `radii.css`, `elevation.css`, `motion.css`, `base.css`. |
| `components/core/` | Button, IconButton, Badge, Tag, Card, SectionHeading, Icon. |
| `components/forms/` | Field, Input, Textarea, Select, Checkbox. |
| `components/marine/` | PhotoFrame, ServiceCard, StatCounter, CheckList, ContactDetail, CtaBanner. |
| `components/navigation/` | UtilityBar, SiteHeader, PageHero, SiteFooter. |
| `guidelines/` | Foundation specimen cards (colors, type, spacing, brand). |
| `ui_kits/website/` | Click-through recreation of the marketing site — see its README. |
| `slides/` | Five 1280×720 brochure-derived slide layouts. |
| `assets/image-slot.js` | Droppable image placeholder used by every photo frame. |
| `SKILL.md` | Agent-skill front door. |

### Component list
Badge · Button · Card · Checkbox · CheckList · ContactDetail · CtaBanner · Field · Icon · IconButton · Input · PageHero · PhotoFrame · SectionHeading · Select · ServiceCard · SiteFooter · SiteHeader · StatCounter · Tag · Textarea · UtilityBar

### Intentional additions
No component library was supplied, so the inventory above was authored from the site's own content structure. Two entries are deliberate infrastructure rather than observed components:
- **Icon** — a Lucide wrapper, because CleanShip has no icon set of its own (see Iconography).
- **PhotoFrame** — centralises the navy photo scrims and gives every empty image a droppable slot, since no photography was supplied.

---

## Content fundamentals

**Voice.** Third-person about the company, second-person to the reader: *"Cleanship is a trusted Hold & Tank Cleaning Service Provider…"*, *"Feel free to contact with us for any kind of query."* "We" appears in rallying lines only — *"We are Cleanship!"*, *"We always ready to serve you."*

**Register.** Plainspoken operator English, lightly non-idiomatic — the real copy says *"We always ready to serve you"* and *"Feel free to contact with us"*. **Keep existing strings verbatim**; do not "correct" them into polished marketing English, and do not imitate the grammar quirk in new copy — write new copy correctly and simply.

**Sentence shape.** One sentence per claim, comma-chained benefit lists ending in an outcome:
> "Professional underwater hull cleaning removes marine growth, improves fuel efficiency, enhances vessel performance, and reduces operational costs safely."

Every service blurb follows the same template: *Professional/High-pressure [service] by CleanShip ensuring [safety], [compliance], [efficiency].* Teaser versions are truncated with an ellipsis at ~60 characters — that truncation is part of the card design.

**Casing.** Service names and nav items are Title Case (*Hold Cleaning*, *About Us*). Section titles are sentence case (*"Why will you choose our services?"*). Eyebrows are written in the source as `_ Our Services _` and `_ About Cleanship _` — render them as letterspaced uppercase between two short aqua rules. Buttons and micro-labels are UPPERCASE with `--ls-label`.

**Vocabulary that must stay exact.** Brand is *Cleanship* in running copy and *CleanShip* in service blurbs — both appear in the source; keep whichever the surrounding string uses. Compliance words: IMO, port-compliant, MARPOL, enclosed-space entry, gas-free. Vessel types: bulk carriers, tankers, container ships. Never say "boat".

**Numbers.** Services are always two-digit — 01…08. Counters are round figures with a plus: 5+ Years Experiences, 300+ Clients, 100+ Project Done, 400+ Happy Clients, 3+ Award Winner, 10+ Team Member (labels are singular in the source — keep them). Phones are formatted with spaced hyphens: `+971 - 554029954`.

**CTAs.** "Read more" on cards, "Contact us", "View more Services", "Get a quote". No urgency language, no discounts, no exclamation marks except the two fixed brand lines.

**Emoji: never.** No emoji anywhere — this is a B2B marine contractor talking to superintendents and port agents.

**Vibe.** Competent, unglamorous, available. Proof over persuasion: certifications, procedures, counters, hours (Mon – Sun: 24 Hours).

---

## Visual foundations

**Palette.** Two blues and one accent. Deep hull **navy** (`--navy-900 #06203a` → `--navy-600`) for dark sections, footer, photo scrims and slide plates. **Working blue** (`--blue-600 #1461a0`) for buttons, links, eyebrows and index numbers, with `--blue-50/100/200` as tints for panels and check marks. **Aqua** (`--aqua-500 #00b0b9`) is the clean-water accent and is rationed: 3px edge rules, active nav underline, the `+` on counters, hover state of a service number. Neutrals are strictly cool (`--slate-*`, `--line-*`, `--paper #f6f8fa`) — never warm grey, never beige. Max two background colours per page: white/paper and navy. Semantic colours are confined to form validation.

**Type.** Barlow Condensed (bold, uppercase, `--ls-display`) for display and headings — narrow, industrial, close-leaded at 1.02–1.18. Barlow regular 16/1.62 for body, dropping to 14px for card blurbs. IBM Plex Mono for spec figures, IMO numbers, slide footlines. Eyebrows: 13px semibold uppercase, `letter-spacing: .18em`. Never mix a third family; never set body copy in the condensed face.

**Layout.** 1240px page max, 32px page padding, 24px gutters, 12-column mental grid. Section rhythm is 96px vertical (64px for bands). Content likes hard splits — 50/50 or 1fr/1.05fr — meeting at a full-height edge with no gap, exactly as the brochure spreads do. Nothing is fixed/sticky except (optionally) the header. Cards sit in 3- or 4-up grids; the service grid is 4-up.

**Backgrounds.** White or `--paper` for content; solid navy for bands, footer, CTA and slide plates. **No gradients as decoration** — the only gradients in the system are navy photo scrims (`--scrim-navy` bottom fade for captions, `--scrim-navy-left` for hero copy, `--scrim-flat` wash for dense grids). No patterns, no textures, no hand-drawn illustration, no blurred blobs.

**Imagery.** Full-bleed documentary photography of vessels, holds, tanks and crews — cool daylight, blue-green water, high-key sky, no filters and no grain. Photos go through `PhotoFrame`, which owns the ratio (3:2, 4:3, 16:9, 21:9) and the scrim. Photos are square-cornered and never drop-shadowed. On hover inside a card, the photo scales to 1.04 over 700ms; the frame clips it.

**Corners and borders.** Near-square: `--radius-xs 2px` is the default, 0 for full-bleed media, `--radius-pill` only for badges when a list needs it. Borders are 1px `--line-200` on white; on navy, `rgba(255,255,255,.16)`. The recurring brand device is a **3px aqua rule** on a top or left edge (`--rule-accent-w`).

**Cards.** White, 1px cool border, 2px radius, 24px padding, **no resting shadow**. Interactive cards lift `-2px` and take `--shadow-md` with the border warming to `--blue-200`. Service cards additionally carry the navy index tab in the top-left corner of the photo and a white icon square straddling the photo/body seam.

**Elevation.** Navy-tinted, four steps: `xs` resting chips, `sm` sticky header, `md` card hover, `lg` dialogs. Shadow signals interaction, not hierarchy — hierarchy comes from borders and fills.

**Transparency & blur.** Transparency only over photography (scrims, the 82% navy hero strip) and for on-dark surfaces (`rgba(255,255,255,.08–.12)`). **No backdrop blur, no frosted glass** anywhere.

**Motion.** Short and flat. 140ms for UI colour changes, 220ms for surfaces and lifts, 700ms only for photo scale. `--ease-standard` (`cubic-bezier(.4,0,.2,1)`) by default, `--ease-out` for the photo. Fades and 2px translations only — **no bounce, no spring, no parallax, no scroll-triggered choreography, no animated counters**.

**Interaction states.** Hover *darkens* — blue buttons go to `--navy-700`, navy to `--navy-900`, outline buttons take a `--blue-50` fill and a `--blue-400` border, links go navy and underline at 3px offset. Press scales to `.985` (no colour change). Focus is a 3px `rgba(27,123,196,.35)` ring (`--focus-ring-on-dark` uses aqua). Disabled is 45% opacity, never a grey repaint. Active nav gets a 2px aqua underline.

**Density & targets.** Controls are 44px (36 small, 52 large) — the 44px minimum is a hard floor. Body measure caps around 620–720px.

---

## Iconography

**No CleanShip icon set was supplied** — the source material contains no SVGs, icon font or sprite. **Substitution flagged:** the system uses **[Lucide](https://lucide.dev) 0.470.0 from CDN**, chosen for its thin, geometric, open stroke — the closest free match to the hairline line-icons in the brochure reference. Load it once per page:

```html
<script src="https://unpkg.com/lucide@0.470.0/dist/umd/lucide.js"></script>
```

Rules:
- Stroke weight **1.75** (`Icon`'s default), round caps and joins. Never fill an icon.
- Sizes: 14–16 inline with text, 20 default, 22–24 in cards and contact blocks, 30 for feature blocks, 26 beside the wordmark.
- Colour: `--blue-600` on white, `--aqua-200`/`--aqua-500` on navy. Icons are never multicolour.
- Icons sit inside a 44–46px square tinted plate (`--blue-50` on white, `rgba(255,255,255,.10)` on navy) in contact blocks; bare elsewhere.
- Working vocabulary: `anchor` (wordmark), `ship`, `container`, `waves`, `droplets`, `fuel`, `warehouse`, `paintbrush`, `shovel`, `shield-check`, `clipboard-check`, `phone-call`, `mail`, `map-pin`, `clock`, `arrow-right`, `chevron-right`, `check`, `award`, `users`, `trophy`, `hard-hat`.
- **No emoji, no unicode dingbats** as icons. Bullet-style ticks use the `check` glyph inside a square plate.

## Logo

**No logo file was supplied**, and none has been drawn or approximated. Wherever a mark belongs, the system sets the name in type: Barlow Condensed 700, uppercase, `letter-spacing .04em`, "Clean" in `--navy-800` (white on dark) and "ship" in `--blue-500` (`--aqua-500` on dark), preceded by a Lucide `anchor`. See `guidelines/wordmark.card.html`. **Send the real logo (SVG preferred) and it should replace this everywhere.**

## Fonts

**Substitution flagged.** No font binaries were supplied. `tokens/fonts.css` loads **Barlow Condensed**, **Barlow** and **IBM Plex Mono** from Google Fonts as the nearest match to the brochure's condensed industrial sans. If CleanShip owns licensed faces, drop the woff2 files into `assets/fonts/` and replace that file with local `@font-face` rules.

## Photography

No imagery was supplied. Every photo position renders a droppable `<image-slot>` placeholder (`assets/image-slot.js`); dragging a real photo in persists it. Needed: vessels at sea, cargo holds before/after, tank interiors, divers on hulls, riding crews in PPE, the Ajman office.

---

## Open questions for the brand owner

1. Official **logo** files (SVG + PNG, light and dark lockups)?
2. Licensed **brand fonts**, or is a Google-Fonts stack acceptable?
3. Real **photography** library — vessels, holds, crews, before/after pairs?
4. Are the **brand blues** correct? They are inferred from the marine-brochure reference, not from any CleanShip artwork.
5. Is the *"Project"* nav item a case-study index, and what does it contain?
6. Should the live site's **shopping cart** and **chat widget** be part of the system? No design source was available for either.
