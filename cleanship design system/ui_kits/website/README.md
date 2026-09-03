# UI kit — Cleanship marketing website

Click-through recreation of the public site (cleanship.co) rebuilt from the supplied site copy. No source code or Figma file was provided, so **layout is reconstructed from the site's content structure plus the printed marine-brochure art direction** in `uploads/1830bdb47c009033da4445723eb88974.jpg`. Treat structure as faithful, pixel geometry as interpretation.

## Files
| File | What it is |
| --- | --- |
| `index.html` | Entry point — mounts the whole click-through app. |
| `App.jsx` | Page switcher (Home / Services / Project / About Us / Contact Us). |
| `Home.jsx` | Hero, service grid (01–08), about band, stats band, blog teaser, contact strip, CTA. |
| `Services.jsx` | Page hero, filter chips, full 8-service grid, three assurance cards, CTA. |
| `About.jsx` | About prose + checklist, dark stats band, four-step process. |
| `Contact.jsx` | Contact detail blocks + working enquiry form with success state. |
| `data.js` | Canonical services, counters and contact details (verbatim site copy). |

## Interactions that work
- Header nav and all in-page CTAs switch pages.
- Service filter chips on the Services page.
- Enquiry form validates nothing but submits to a success state ("Enquiry received") and back.
- Service card hover: number turns aqua, photo scales, card lifts 2px.
- Every photo is a droppable `<image-slot>` — drag real vessel photography in and it persists.

## Known gaps
- "Project" nav item reuses the Services page — no project content was supplied.
- Blog teaser headlines are written to match tone; the real posts were not supplied.
- No shopping-cart / chat-widget surfaces (present on the live site) — no design source for them.
