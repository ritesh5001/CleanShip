# Slide templates

Five 1280×720 layouts derived from the printed marine brochure supplied in `uploads/1830bdb47c009033da4445723eb88974.jpg`. That reference is **another company's brochure** (Qingdao Jerryborg Marine Machinery) and was used only as art-direction guidance — layout grammar, navy/white split, numbered index, photo grids. No content, marks or copy from it are reproduced.

| File | Layout |
| --- | --- |
| `cover.html` | Navy copy plate (wordmark, title, contact) + full-height photo. |
| `contents.html` | Photo band with flat navy wash, then a 4-column numbered index of services 01–08. |
| `service-spread.html` | Navy title band, four aqua-ruled spec blocks, 3-photo grid on paper grey. |
| `credentials.html` | Navy page: heading, six counters, three-column check list. |
| `closing.html` | Full-bleed photo, bottom navy fade, "We always ready to serve you." + contact grid. |

All slide components live in `Slides.jsx`; each HTML mounts one. Photos are droppable `<image-slot>`s.
