/* @ds-bundle: {"format":4,"namespace":"CleanShipDesignSystem_64da38","components":[{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"SectionHeading","sourcePath":"components/core/SectionHeading.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Field","sourcePath":"components/forms/Field.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Textarea","sourcePath":"components/forms/Textarea.jsx"},{"name":"CheckList","sourcePath":"components/marine/CheckList.jsx"},{"name":"ContactDetail","sourcePath":"components/marine/ContactDetail.jsx"},{"name":"CtaBanner","sourcePath":"components/marine/CtaBanner.jsx"},{"name":"PhotoFrame","sourcePath":"components/marine/PhotoFrame.jsx"},{"name":"ServiceCard","sourcePath":"components/marine/ServiceCard.jsx"},{"name":"StatCounter","sourcePath":"components/marine/StatCounter.jsx"},{"name":"PageHero","sourcePath":"components/navigation/PageHero.jsx"},{"name":"SiteFooter","sourcePath":"components/navigation/SiteFooter.jsx"},{"name":"SiteHeader","sourcePath":"components/navigation/SiteHeader.jsx"},{"name":"UtilityBar","sourcePath":"components/navigation/UtilityBar.jsx"}],"sourceHashes":{"assets/image-slot.js":"fff26d081c8d","components/core/Badge.jsx":"4149dc5ea92a","components/core/Button.jsx":"8212cf0e066a","components/core/Card.jsx":"a08a326c33bd","components/core/Icon.jsx":"c1af0ae63174","components/core/IconButton.jsx":"68fcc029f2bd","components/core/SectionHeading.jsx":"ab71eee11d94","components/core/Tag.jsx":"09a6dd9371ff","components/forms/Checkbox.jsx":"972c29f35242","components/forms/Field.jsx":"eb3b84aa6476","components/forms/Input.jsx":"8408dcc1cef9","components/forms/Select.jsx":"1d1059c80286","components/forms/Textarea.jsx":"5f0f356c234d","components/marine/CheckList.jsx":"ecb180c82d05","components/marine/ContactDetail.jsx":"a38ec5ae916c","components/marine/CtaBanner.jsx":"b6b7e2faf03d","components/marine/PhotoFrame.jsx":"d106c80513fb","components/marine/ServiceCard.jsx":"a9839033156d","components/marine/StatCounter.jsx":"c4d0ea77a579","components/navigation/PageHero.jsx":"2c273bc4ff98","components/navigation/SiteFooter.jsx":"562ed513b2a8","components/navigation/SiteHeader.jsx":"8d8f5d52ae9c","components/navigation/UtilityBar.jsx":"b30c0bf9da1e","slides/Slides.jsx":"7cfff0ba4940","ui_kits/website/About.jsx":"76d1f755a6ff","ui_kits/website/App.jsx":"17aeee974a00","ui_kits/website/Contact.jsx":"070214817f30","ui_kits/website/Home.jsx":"5a054ce525e9","ui_kits/website/Services.jsx":"c7b522038dd5","ui_kits/website/data.js":"a7fff0cf91a4"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.CleanShipDesignSystem_64da38 = window.CleanShipDesignSystem_64da38 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// assets/image-slot.js
try { (() => {
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)
// Copied omelette starter. Re-running copy_starter_component with this kind overwrites this file with the latest version (page content is unaffected).
/* BEGIN USAGE */
/**
 * <image-slot> — user-fillable image placeholder.
 *
 * Drop this into a deck, mockup, or page wherever a design needs an image.
 * You control the slot's shape; it sizes to its container by default. When the search_stock_photos tool
 * is available, prefill the slot by default — write the photo's URL into
 * src (with credit/credit-href); the user can still fill or replace it
 * by dragging an image file onto it (or clicking to browse). The dropped
 * image persists across reloads via a .image-slots.state.json sidecar —
 * same read-via-fetch / write-via-window.omelette pattern as
 * design_canvas.jsx, so the filled slot shows on share links, downloaded
 * zips, and PPTX export. Outside the omelette runtime the slot is read-only.
 *
 * The sidecar is a SIBLING of the HTML file that uses this component: the
 * read is a document-relative fetch, and the host resolves the bridge's
 * sidecar writes into the previewed file's directory to match (same
 * contract as design_canvas.jsx). Pages in the same directory share one
 * sidecar; keep slot ids distinct across them.
 *
 * Attributes:
 *   id           Persistence key. REQUIRED for the drop to survive reload —
 *                every slot on the page needs a distinct id.
 *   shape        'rect' | 'rounded' | 'circle' | 'pill'   (default 'rounded')
 *                'circle' applies 50% border-radius; on a non-square slot
 *                that's an ellipse — set equal width and height for a true
 *                circle.
 *   radius       Corner radius in px for 'rounded'.       (default 12)
 *   mask         Any CSS clip-path value. Overrides `shape` — use this for
 *                hexagons, blobs, arbitrary polygons.
 *   fit          Initial framing baseline: cover | contain.   (default 'cover')
 *                cover starts the image filling the frame (overflow cropped);
 *                contain starts it fully visible (letterboxed). Either way the
 *                user can always pan/scale from there — double-click, or the
 *                Edit control, enters reframe mode (drag to move, scroll or
 *                corner-handles to scale; Escape / click-out commits). The
 *                crop persists alongside the image in the sidecar.
 *   placeholder  Empty-state caption.                      (default 'Drop an image')
 *   src          Optional initial/fallback image URL. Prefill it with a real
 *                photo via search_stock_photos when that tool is available
 *                (set credit/credit-href from the result). A user drop
 *                overrides it; clearing the drop reveals src again.
 *   credit       Attribution text shown as a small overlay at the
 *                bottom-left of the filled slot. REQUIRED whenever src
 *                points at any Unsplash host (images.unsplash.com,
 *                plus.unsplash.com, …): an Unsplash src with no credit
 *                renders an error tile INSTEAD of the photo (Unsplash
 *                terms forbid showing their photos unattributed). Use the
 *                exact form 'Photo by {photographer name} on Unsplash' —
 *                the overlay then links the name to credit-href and
 *                'Unsplash' to the Unsplash homepage, and links back to
 *                unsplash.com automatically get the required utm referral
 *                params appended at render time. The credit belongs to
 *                the src image, so it only shows while src is what's
 *                displayed — a user-dropped image hides it.
 *   credit-href  Link for the photographer's name in the credit overlay
 *                (their Unsplash profile URL from the stock-photo search
 *                results). http(s) URLs only — anything else renders the
 *                name as plain text.
 *
 * Sizing: the slot fills its container by default (width/height 100%).
 * Put it in a sized wrapper — absolutely positioned, a grid cell, a fixed
 * frame — and it takes exactly that box. When the parent's height is
 * indefinite (ordinary flow), it falls back to full width at a 3:2 aspect
 * ratio instead of collapsing. In a shrink-to-fit parent (a float,
 * width:max-content, an unsized absolute wrapper), percentages have
 * nothing to resolve against — size the slot or its wrapper explicitly
 * there. For a fixed-size slot, set
 * width/height on the element itself (inline style), which overrides the
 * default. When
 * layering content above a slot (full-bleed layouts), make the overlay
 * click-through — pointer-events: none on scrims/text plates, re-enabled
 * on interactive children — so the slot's hover controls stay reachable.
 * Keep the slot's bottom-left corner visually clear as well: the credit
 * overlay renders there, and a dark fade or text plate covering it hides
 * the attribution Unsplash's terms require — end the fade above that
 * corner, or keep it nearly transparent where the credit sits.
 *
 * Usage:
 *   <div style="position:relative;width:100%;height:100%">      <!-- full-bleed: -->
 *     <image-slot id="bg" shape="rect"></image-slot>            <!-- fills the wrapper -->
 *   </div>
 *   <image-slot id="hero"   style="width:800px;height:450px" shape="rounded" radius="20"
 *               placeholder="Drop a hero image"></image-slot>
 *   <image-slot id="avatar" style="width:120px;height:120px" shape="circle"></image-slot>
 *   <image-slot id="kite"   style="width:300px;height:300px"
 *               mask="polygon(50% 0, 100% 50%, 50% 100%, 0 50%)"></image-slot>
 */
/* END USAGE */

(() => {
  const STATE_FILE = '.image-slots.state.json';

  // Unsplash terms require visible attribution wherever their photos
  // display, and every link back to unsplash.com must carry utm referral
  // params. Two render-time rules enforce that here:
  //  - an Unsplash-src slot with NO credit attribute renders an error
  //    tile INSTEAD of the photo (an uncredited Unsplash photo on screen
  //    is itself the terms violation, so it never renders bare);
  //  - rendered credit links pointing at unsplash.com get the referral
  //    params appended when absent (credit-href values live in page
  //    content that can't be edited after the fact).
  // Keep the utm_source value in sync with UTM_SOURCE in
  // platform/web-agent/unsplash.ts — this file is a project-local
  // artifact and cannot import it (equality is pinned by tests).
  const UNSPLASH_HOMEPAGE_HREF = 'https://unsplash.com/?utm_source=claude_design&utm_medium=referral';
  // Host rule mirrors the hotlink validator that admits Unsplash srcs into
  // pages in the first place (cdn$ in unsplash.ts: apex or any subdomain)
  // — Unsplash+ results serve from plus.unsplash.com, not just images.*,
  // and an admitted-but-uncredited photo must error whatever unsplash
  // host it rides on.
  // Trailing-dot FQDNs (images.unsplash.com.) are the same host to the
  // browser but would miss the regex — strip one dot so the check fails
  // CLOSED (unrecognized-but-real Unsplash srcs must error, not render).
  const isUnsplashHost = u => {
    try {
      return /(^|\.)unsplash\.com$/.test(new URL(u, document.baseURI).hostname.replace(/\.$/, ''));
    } catch {
      return false;
    }
  };
  // Render-time referral normalization for links back to Unsplash:
  // appends utm_source/utm_medium when absent, preserves every existing
  // query param, never overwrites an existing utm_source, and passes
  // non-Unsplash URLs through untouched. Input is an ABSOLUTE validated
  // http(s) URL (the credit render funnel resolves + validates first).
  const withReferral = href => {
    try {
      const u = new URL(href);
      if (!/(^|\.)unsplash\.com$/.test(u.hostname.replace(/\.$/, ''))) {
        return href;
      }
      if (!u.searchParams.has('utm_source')) {
        u.searchParams.set('utm_source', 'claude_design');
      }
      if (!u.searchParams.has('utm_medium')) {
        u.searchParams.set('utm_medium', 'referral');
      }
      return u.toString();
    } catch (e) {
      return href;
    }
  };
  // 2× a ~600px slot in a 1920-wide deck — retina-sharp without making the
  // sidecar enormous. A 1200px WebP at q=0.85 is ~150-300KB.
  const MAX_DIM = 1200;
  // Raster formats only. SVG is excluded (can carry script; createImageBitmap
  // on SVG blobs is inconsistent). GIF is excluded because the canvas
  // re-encode keeps only the first frame, so an animated GIF would silently
  // go still — better to reject than surprise.
  const ACCEPT = ['image/png', 'image/jpeg', 'image/webp', 'image/avif'];

  // ── Shared sidecar store ────────────────────────────────────────────────
  // One fetch + immediate write-on-change for every <image-slot> on the
  // page. Reads via fetch() so viewing works anywhere the HTML and sidecar
  // are served together; writes go through window.omelette.writeFile, which
  // the host allowlists to *.state.json basenames only.
  const subs = new Set();
  let slots = {};
  // ids explicitly cleared before the sidecar fetch resolved — otherwise
  // the merge below can't tell "never set" from "just deleted" and would
  // resurrect the sidecar's stale value.
  const tombstones = new Set();
  let loaded = false;
  let loadP = null;
  function load() {
    if (loadP) return loadP;
    loadP = fetch(STATE_FILE).then(r => r.ok ? r.json() : null).then(j => {
      // Merge: sidecar loses to any in-memory change that raced ahead of
      // the fetch (drop or clear) so neither is clobbered by hydration.
      if (j && typeof j === 'object') {
        const merged = Object.assign({}, j, slots);
        // A framing-only write that raced ahead of hydration must not
        // drop a user image that's only on disk — inherit u from the
        // sidecar for any in-memory entry that lacks one.
        for (const k in slots) {
          if (merged[k] && !merged[k].u && j[k]) {
            merged[k].u = typeof j[k] === 'string' ? j[k] : j[k].u;
          }
        }
        for (const id of tombstones) delete merged[id];
        slots = merged;
      }
      tombstones.clear();
    }).catch(() => {}).then(() => {
      loaded = true;
      subs.forEach(fn => fn());
    });
    return loadP;
  }

  // Serialize writes so two near-simultaneous drops on different slots
  // can't reorder at the backend and leave the sidecar with only the
  // first. A save requested mid-flight just marks dirty and re-fires on
  // completion with the then-current slots.
  let saving = false;
  let saveDirty = false;
  // Unload-time flush: save()'s serialization defers a mid-RTT re-fire to a
  // .then that never runs in an unloading document, silently dropping a
  // pagehide commit. Post the current slots immediately instead — content
  // is a superset snapshot of any in-flight save's, the write is a
  // whole-file last-writer-wins replace, and postMessage FIFO delivers it
  // to the host after the in-flight one, so a backend-side reorder at
  // worst reproduces the dropped-commit outcome this flush improves on.
  // Guarded on the initial sidecar read: pre-hydration slots can miss
  // other slots' persisted entries, and flushing it would clobber them —
  // that narrow case stays best-effort (the in-memory merge in load()
  // cannot happen in an unloading document anyway).
  function flushNow() {
    if (!loaded) return;
    const w = window.omelette && window.omelette.writeFile;
    if (!w) return;
    try {
      Promise.resolve(w(STATE_FILE, JSON.stringify(slots))).catch(() => {});
    } catch (e) {}
  }
  function save() {
    if (saving) {
      saveDirty = true;
      return;
    }
    const w = window.omelette && window.omelette.writeFile;
    if (!w) return;
    saving = true;
    Promise.resolve(w(STATE_FILE, JSON.stringify(slots))).catch(() => {}).then(() => {
      saving = false;
      if (saveDirty) {
        saveDirty = false;
        save();
      }
    });
  }
  const S_MAX = 5;
  const clampS = s => Math.max(1, Math.min(S_MAX, s));

  // Normalize a stored slot value. Pre-reframe sidecars stored a bare
  // data-URL string; newer ones store {u, s, x, y}. Either shape is valid.
  function getSlot(id) {
    const v = slots[id];
    if (!v) return null;
    return typeof v === 'string' ? {
      u: v,
      s: 1,
      x: 0,
      y: 0
    } : v;
  }
  function setSlot(id, val) {
    if (!id) return;
    if (val) {
      slots[id] = val;
      tombstones.delete(id);
    } else {
      delete slots[id];
      if (!loaded) tombstones.add(id);
    }
    subs.forEach(fn => fn());
    // A drop is rare + high-value — write immediately so nav-away can't lose
    // it. Gate on the initial read so we don't overwrite a sidecar we haven't
    // merged yet; the merge in load() keeps this change once the read lands.
    if (loaded) save();else load().then(save);
  }

  // ── Image downscale ─────────────────────────────────────────────────────
  // Encode through a canvas so the sidecar carries resized bytes, not the
  // raw upload. Longest side is capped at 2× the slot's rendered width
  // (retina) and at MAX_DIM. WebP keeps alpha and is ~10× smaller than PNG
  // for photos, so there's no need for per-image format picking.
  async function toDataUrl(file, targetW) {
    const bitmap = await createImageBitmap(file);
    try {
      const cap = Math.min(MAX_DIM, Math.max(1, Math.round(targetW * 2)) || MAX_DIM);
      const scale = Math.min(1, cap / Math.max(bitmap.width, bitmap.height));
      const w = Math.max(1, Math.round(bitmap.width * scale));
      const h = Math.max(1, Math.round(bitmap.height * scale));
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      canvas.getContext('2d').drawImage(bitmap, 0, 0, w, h);
      return canvas.toDataURL('image/webp', 0.85);
    } finally {
      bitmap.close && bitmap.close();
    }
  }

  // ── Custom element ──────────────────────────────────────────────────────
  const stylesheet =
  // Fill the container by default: slots are usually placed inside a
  // sized wrapper (a hero frame, a grid cell, an inset:0 layer) and are
  // expected to take that box — a fixed intrinsic size would render as
  // a small tile in the corner of a full-bleed wrapper instead.
  // aspect-ratio is the companion fallback that keeps a bare slot
  // visible when the parent's height is indefinite: height:100%
  // resolves to auto there, and the ratio then derives height from
  // width instead of letting the slot collapse to zero height.
  // Explicit width/height on the element override all of this.
  // color:inherit (not a fixed near-black): the placeholder chrome —
  // empty-state icon/caption (currentColor) and the dashed ring — must
  // read on dark decks too, and the slide's own text color is the one
  // color guaranteed to contrast with the slide background. The soft
  // look comes from opacity on those parts, not from a baked-in alpha.
  ':host{display:block;position:relative;' + '  font:13px/1.3 system-ui,-apple-system,sans-serif;' + '  width:100%;height:100%;aspect-ratio:3/2}' + '.empty .cap,.empty .sub{opacity:.75}' + '.frame{position:absolute;inset:0;overflow:hidden;background:rgba(127,127,127,.08)}' +
  // .frame img (clipped) and .spill (unclipped ghost + handles) share the
  // same left/top/width/height in frame-%, computed by _applyView(), so the
  // inside-mask crop and the outside-mask spill stay pixel-aligned.
  '.frame img{position:absolute;max-width:none;transform:translate(-50%,-50%);' + '  -webkit-user-drag:none;user-select:none;touch-action:none}' +
  // Reframe mode (double-click): the full image spills past the mask. The
  // spill layer is sized to the IMAGE bounds so its corners are where the
  // resize handles belong. The ghost <img> inside is translucent; the real
  // clipped <img> underneath shows the opaque in-mask crop.
  // popover=manual promotes the spill to the top layer on reframe, so it is
  // not clipped by any overflow:hidden / clip-path / scroll-container
  // ancestor (a plain z-index can't escape overflow clipping). UA popover
  // defaults (inset:0;margin:auto) are reset; _applyView sets viewport px.
  '.spill{position:fixed;margin:0;inset:auto;border:0;padding:0;background:transparent;' + '  overflow:visible;transform:translate(-50%,-50%);z-index:1;cursor:grab;touch-action:none}' + ':host([data-panning]) .spill{cursor:grabbing}' + '.spill .ghost{position:absolute;inset:0;width:100%;height:100%;opacity:.35;' + '  pointer-events:none;-webkit-user-drag:none;user-select:none;' + '  box-shadow:0 0 0 1px rgba(0,0,0,.2),0 12px 32px rgba(0,0,0,.2)}' + '.spill .handle{position:absolute;width:12px;height:12px;border-radius:50%;' + '  background:#fff;box-shadow:0 0 0 1.5px #c96442,0 1px 3px rgba(0,0,0,.3);' + '  transform:translate(-50%,-50%)}' + '.spill .handle[data-c=nw]{left:0;top:0;cursor:nwse-resize}' + '.spill .handle[data-c=ne]{left:100%;top:0;cursor:nesw-resize}' + '.spill .handle[data-c=sw]{left:0;top:100%;cursor:nesw-resize}' + '.spill .handle[data-c=se]{left:100%;top:100%;cursor:nwse-resize}' + ':host([data-reframe]){z-index:10}' + ':host([data-reframe]) .frame{box-shadow:0 0 0 2px #c96442}' + '.empty{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;' + '  justify-content:center;gap:6px;text-align:center;padding:12px;box-sizing:border-box;' + '  cursor:pointer;user-select:none}' + '.empty svg{opacity:.45}' + '.empty .cap{max-width:90%;font-weight:500;letter-spacing:.01em}' + '.empty .sub{font-size:11px}' + '.empty .sub u{text-underline-offset:2px}' + '.empty:hover .sub{opacity:1}' + ':host([data-over]) .frame{outline:2px solid #c96442;outline-offset:-2px;' + '  background:rgba(201,100,66,.10)}' + '.ring{position:absolute;inset:0;pointer-events:none;border:1.5px dashed currentColor;' + '  opacity:.35;transition:border-color .12s,opacity .12s}' + ':host([data-over]) .ring{border-color:#c96442;opacity:1}' + ':host([data-filled]) .ring{display:none}' +
  // Controls overlay INSIDE the frame, pinned to the top-right corner, so
  // a full-bleed slot in an overflow:hidden container still shows them
  // (the old below-mask placement got clipped). Credit sits bottom-left,
  // so top-right avoids collision. The blurred pill background keeps them
  // legible over the image.
  // The UA [popover] base rule styles the element in EVERY state (only
  // display:none is gated on :not(:popover-open), and the display:flex
  // below overrides that) — so the UA resets live HERE, like .spill's,
  // or the ordinary hover-state strip renders as a bordered Canvas box
  // centered by margin:auto. inset:auto precedes top/right (shorthand).
  '.ctl{position:absolute;inset:auto;top:8px;right:8px;margin:0;border:0;padding:0;' + '  background:transparent;overflow:visible;' + '  display:flex;gap:6px;opacity:0;pointer-events:none;transition:opacity .12s;z-index:2;' + '  white-space:nowrap}' +
  // While reframing, the spill owns the top layer and would swallow every
  // click on the in-frame controls. Promoting .ctl into the top layer
  // ABOVE the spill (shown after it — later popovers stack higher) keeps
  // Edit-as-toggle and Replace clickable mid-reframe. _applyView pins it
  // to the frame's top-right in viewport px (translateX(-100%)
  // right-aligns against the computed left edge); inset:auto clears the
  // base rule's top/right so the inline left/top position it alone.
  '.ctl:popover-open{position:fixed;inset:auto;transform:translateX(-100%)}' + ':host([data-filled][data-editable]:hover) .ctl,:host([data-reframe]) .ctl' + '  {opacity:1;pointer-events:auto}' + '.ctl button{appearance:none;border:0;border-radius:6px;padding:5px 10px;cursor:pointer;' + '  background:rgba(0,0,0,.65);color:#fff;font:11px/1 system-ui,-apple-system,sans-serif;' + '  backdrop-filter:blur(6px)}' + '.ctl button:hover{background:rgba(0,0,0,.8)}' + '.err{position:absolute;left:8px;bottom:8px;right:8px;color:#b3261e;font-size:11px;' + '  background:rgba(255,255,255,.85);padding:4px 6px;border-radius:5px;pointer-events:none}' +
  // Replacement in flight: after a src swap the browser keeps painting
  // the PREVIOUS image until the new one decodes, so a Replace would
  // flash the old photo and then pop. Hide the stale frame (visibility,
  // not display — _applyView geometry still applies) and spin until the
  // new image reports in (load/error clears data-swapping).
  ':host([data-swapping]) .frame img{visibility:hidden}' + '.loading{position:absolute;inset:0;display:none;align-items:center;' + '  justify-content:center;pointer-events:none}' + ':host([data-swapping]) .loading{display:flex}' + '.loading::after{content:"";width:22px;height:22px;border-radius:50%;' + '  border:2px solid rgba(127,127,127,.25);border-top-color:currentColor;' + '  animation:om-slot-spin .7s linear infinite}' + '@keyframes om-slot-spin{to{transform:rotate(360deg)}}' +
  // Reduced motion: the static two-tone ring still reads as "working".
  '@media (prefers-reduced-motion:reduce){.loading::after{animation:none}}' + '.credit{position:absolute;left:6px;bottom:6px;max-width:calc(100% - 12px);display:none;' + '  padding:3px 7px;border-radius:5px;background:rgba(0,0,0,.55);color:#fff;' + '  font:10px/1.2 system-ui,-apple-system,sans-serif;text-decoration:none;' + '  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;backdrop-filter:blur(6px)}' +
  // The credit is a SPAN holding one or two <a>s (Unsplash's prescribed
  // form links the photographer AND Unsplash) — anchors style inline so
  // the overlay reads as one line of text.
  '.credit a{color:inherit;text-decoration:none}' + '.credit a:hover,.credit a:focus-visible{text-decoration:underline}' + ':host([data-filled][data-credit]) .credit{display:block}' +
  // Exports must ship JUST the image — no hover controls, no credit chip
  // (the host marks <html data-om-exporting> for the capture window; the
  // page-level hide script can't reach shadow DOM, this rule can).
  ':host-context([data-om-exporting]) .ctl,' + ':host-context([data-om-exporting]) .credit{display:none !important}' +
  // Print must ship just the image too: the hover-gated controls can be
  // mid-hover when print() fires, and the credit chip is screen chrome —
  // the same rule the capture window gets, keyed on print media instead
  // of the host's data-om-exporting mark (the print path sets no mark).
  '@media print{.ctl,.credit{display:none !important}}' +
  // No export-window mask rules here on purpose: the export capture
  // releases the replacement mask by REMOVING data-swapping (the
  // shadow-root pass in pages/export/shared.ts HIDE_EXPORT_CHROME_SCRIPT)
  // — attribute removal works in every engine (:host-context is
  // Chromium-only), is scoped by construction to slots actually
  // mid-swap, and hides the spinner through the same gate. A masked img
  // would otherwise be silently dropped from PPTX decks (the capture
  // walk skips visibility:hidden imgs).
  // Attribution error tile: REPLACES the photo when an Unsplash src has
  // no credit attribute — rendering the photo uncredited is the terms
  // violation, so the photo must not appear at all.
  // Calm and neutral on purpose (review feedback): the tile informs the
  // user; the fix instructions are machine-facing (usage docblock, tool
  // description, and the turn-end scan's bounce copy name the attributes
  // for the agent).
  '.attr-error{position:absolute;inset:0;display:none;flex-direction:column;align-items:center;' + '  justify-content:center;gap:6px;text-align:center;padding:12px;box-sizing:border-box;' + '  background:#f2f1ef;color:#6e6c66;user-select:none;' + '  font:13px/1.45 system-ui,-apple-system,sans-serif}' + '.attr-error svg{opacity:.55}' + '.attr-error .cap{max-width:92%;font-weight:500;letter-spacing:.01em}' + ':host([data-attribution-error]) .attr-error{display:flex}' + ':host([data-attribution-error]) .ring{display:none}';
  const icon = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' + 'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>' + '<path d="m21 15-5-5L5 21"/></svg>';
  const warnIcon = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' + 'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + '<path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/>' + '<path d="M12 9v4"/><path d="M12 17h.01"/></svg>';
  class ImageSlot extends HTMLElement {
    static get observedAttributes() {
      return ['shape', 'radius', 'mask', 'fit', 'placeholder', 'src', 'id', 'credit', 'credit-href'];
    }

    /** Duplicate-slide hook (called by deck-stage, see its
     *  _remintDuplicateIds): copy this id's stored image, if any, under a
     *  freshly minted key and return that key — so a duplicated slide's
     *  slot keeps its dropped photo instead of reverting to the
     *  placeholder. 'isFree' is the caller's uniqueness check (document
     *  ids); candidates must ALSO be unused in the sidecar, which can
     *  hold keys from other pages sharing the project root. (An EMPTY
     *  slot on another page leaves no sidecar entry, so its id is not
     *  detectable here — a minted key can collide with it and that slot
     *  would show this photo. Same blast radius as two pages reusing an
     *  id by hand, which the shared sidecar already permits.) Returns null
     *  when no id could be minted (caller strips the id, today's
     *  behavior). */
    static cloneSlot(fromId, isFree) {
      if (typeof fromId !== 'string' || !fromId) return null;
      // Pre-hydration the store can't veto candidates or source the copy
      // — degrade to the strip (today's behavior) rather than mint
      // against keys we can't see yet. Any rendered (= droppable) slot
      // means load() has already settled.
      if (!loaded) return null;
      const stem = fromId.replace(/-\d+$/, '') || fromId;
      for (let n = 2; n < 100; n++) {
        const toId = stem + '-' + n;
        if (toId === fromId) continue;
        if (slots[toId] !== undefined) {
          // Reuse a key holding this exact value (bytes AND crop) if no
          // live element here owns it — a duplicate op the host refused
          // after minting leaves such a key behind, and reusing keeps
          // refused retries from accumulating one orphaned copy per
          // attempt. Full equality (not just bytes) so a byte-identical
          // key another PAGE owns with its own crop is stepped past, not
          // adopted or rewritten. (Entries without .u never match.)
          const prev = getSlot(toId);
          const cur = getSlot(fromId);
          if (!(prev && cur && prev.u && prev.u === cur.u && prev.s === cur.s && prev.x === cur.x && prev.y === cur.y && (typeof isFree !== 'function' || isFree(toId)))) continue;
          return toId;
        }
        if (typeof isFree === 'function' && !isFree(toId)) continue;
        const v = getSlot(fromId);
        if (v) setSlot(toId, Object.assign({}, v));
        return toId;
      }
      return null;
    }
    constructor() {
      super();
      // clonable: rail thumbnails deep-clone slides and carry this shadow
      // along; reuse an already-cloned root so upgrade-after-clone works.
      // (Deliberately NOT serializable — a getHTML consumer would embed
      // multi-MB sidecar data-URLs into serialized page HTML.)
      const root = this.shadowRoot || this.attachShadow({
        mode: 'open',
        clonable: true
      });
      // .spill and .ctl sit OUTSIDE .frame so overflow:hidden + border-radius
      // on the frame (circle, pill, rounded) can't clip them.
      root.innerHTML = '<style>' + stylesheet + '</style>' + '<div class="frame" part="frame">' + '  <img part="image" alt="" draggable="false" style="display:none">' + '  <div class="empty" part="empty">' + icon + '    <div class="cap"></div>' + '    <div class="sub">or <u>browse files</u></div></div>' + '  <div class="attr-error" part="attribution-error">' + warnIcon + '    <div class="cap">This photo needs attribution</div></div>' + '  <div class="loading" part="loading"></div>' + '  <div class="ring" part="ring"></div>' + '</div>' +
      // Outside .frame, like .spill/.ctl — the frame's overflow:hidden +
      // border-radius/clip-path would cut the credit off on circle/pill/mask.
      // A SPAN, not an <a>: the prescribed Unsplash credit holds two links
      // (photographer + Unsplash), built per-render in _render().
      '<span class="credit" part="credit"></span>' + '<div class="spill" popover="manual" data-dc-edit-transparent>' + '  <img class="ghost" alt="" draggable="false">' + '  <div class="handle" data-c="nw"></div><div class="handle" data-c="ne"></div>' + '  <div class="handle" data-c="sw"></div><div class="handle" data-c="se"></div>' + '</div>' +
      // data-dc-edit-transparent: the DC editor's edit-mode picker lets
      // clicks through for chrome marked with it (EDIT_TRANSPARENT_SEL)
      // — without it, Replace/Edit clicks in Edit mode are swallowed by
      // element selection and the controls look dead.
      '<div class="ctl" popover="manual" data-dc-edit-transparent><button data-act="replace" title="Replace image">Replace</button>' + '  <button data-act="edit" title="Reframe image">Edit</button></div>' + '<input type="file" accept="' + ACCEPT.join(',') + '" hidden>';
      this._frame = root.querySelector('.frame');
      this._ring = root.querySelector('.ring');
      this._img = root.querySelector('.frame img');
      this._empty = root.querySelector('.empty');
      this._cap = root.querySelector('.cap');
      this._sub = root.querySelector('.sub');
      this._spill = root.querySelector('.spill');
      this._ctl = root.querySelector('.ctl');
      this._credit = root.querySelector('.credit');
      this._attrError = root.querySelector('.attr-error');
      // Credit clicks open the link, not browse/reframe.
      this._credit.addEventListener('click', e => e.stopPropagation());
      this._credit.addEventListener('dblclick', e => e.stopPropagation());
      this._ghost = root.querySelector('.ghost');
      this._err = null;
      this._input = root.querySelector('input');
      this._depth = 0;
      this._gen = 0;
      // Encode-in-flight marker (the owning _ingest generation): while set,
      // the same-src "nothing in flight" clear in _render must not fire —
      // the stored value still points at the OLD image until the encode
      // lands, so that clear would unmask the stale image mid-replace.
      this._swapGen = 0;
      // Render-owned swap in flight: set when _render assigns a new src,
      // cleared only by the img's own load/error (or the empty branch).
      // img.complete CANNOT stand in for this — setting src only QUEUES
      // the current-request swap (a microtask), so synchronously after an
      // assignment, complete still reports the OLD settled request. The
      // pick path does exactly that: the host sets src, credit, and
      // credit-href back-to-back in one task, and renders #2/#3 would
      // read the stale complete === true and drop the mask one render
      // after it was set.
      this._loadPending = false;
      // See _render's empty branch: a transient attribution-error wipe of a
      // showing image must make the follow-up render a replacement (spinner),
      // not a first fill (blank frame).
      this._hidShowing = false;
      this._view = {
        s: 1,
        x: 0,
        y: 0
      };
      this._subFn = () => this._render();
      // Shadow-DOM listeners live with the shadow DOM — bound once here so
      // disconnect/reconnect (e.g. React remount) doesn't stack handlers.
      this._empty.addEventListener('click', () => this._input.click());
      root.addEventListener('click', e => {
        const act = e.target && e.target.getAttribute && e.target.getAttribute('data-act');
        if (!act) return;
        // The hidden controls are opacity-0 but still tabbable — without
        // this gate a keyboard user could drive them on a read-only share
        // link (mirrors the dblclick handler's editable gate).
        if (!this.hasAttribute('data-editable')) return;
        if (act === 'replace') {
          this._exitReframe(true);
          // Host-owned picker (Unsplash modal; it also offers local import).
          this.dispatchEvent(new CustomEvent('image-slot:pick', {
            bubbles: true,
            composed: true,
            detail: {
              id: this.id || null
            }
          }));
        }
        if (act === 'edit') {
          if (!this._reframes()) return;
          if (this.hasAttribute('data-reframe')) this._exitReframe(true);else this._enterReframe();
        }
      });
      this._input.addEventListener('change', () => {
        const f = this._input.files && this._input.files[0];
        if (f) this._ingest(f);
        this._input.value = '';
      });
      // naturalWidth/Height aren't known until load — re-apply so the cover
      // baseline is computed from real dimensions, not the 100%×100% fallback.
      // load/error also release the replacement-in-flight mask (via the
      // single discipline in _releaseMask): the swap is only revealed once
      // the new image can actually paint (on error the frame shows its
      // background, same as a fresh slot with a broken src).
      this._img.addEventListener('load', () => {
        this._loadPending = false;
        this._releaseMask(true);
        this._applyView();
      });
      this._img.addEventListener('error', () => {
        this._loadPending = false;
        this._releaseMask(true);
      });
      // Gated only on editable — any filled slot can be repositioned/scaled,
      // regardless of fit. Share links (no writeFile) stay static.
      this.addEventListener('dblclick', e => {
        if (!this.hasAttribute('data-editable') || !this._reframes()) return;
        e.preventDefault();
        if (this.hasAttribute('data-reframe')) this._exitReframe(true);else this._enterReframe();
      });
      // Pan + resize both originate on the spill layer. A handle pointerdown
      // drives an aspect-locked resize anchored at the opposite corner; any
      // other pointerdown on the spill pans. Offsets are frame-% so a
      // reframed slot survives responsive resize / PPTX export.
      this._spill.addEventListener('pointerdown', e => {
        if (e.button !== 0 || !this.hasAttribute('data-reframe')) return;
        e.preventDefault();
        e.stopPropagation();
        this._spill.setPointerCapture(e.pointerId);
        const rect = this.getBoundingClientRect();
        const fw = rect.width || 1,
          fh = rect.height || 1;
        const corner = e.target.getAttribute && e.target.getAttribute('data-c');
        let move;
        if (corner) {
          // Resize about the OPPOSITE corner. Viewport-px throughout (rect
          // fw/fh, not clientWidth) so the math survives a transform:scale()
          // ancestor — deck_stage renders slides scaled-to-fit.
          const iw = this._img.naturalWidth || 1,
            ih = this._img.naturalHeight || 1;
          const contain = (this.getAttribute('fit') || 'cover').toLowerCase() === 'contain';
          const base = contain ? Math.min(fw / iw, fh / ih) : Math.max(fw / iw, fh / ih);
          const sx = corner.includes('e') ? 1 : -1;
          const sy = corner.includes('s') ? 1 : -1;
          const s0 = this._view.s;
          const w0 = iw * base * s0,
            h0 = ih * base * s0;
          const cx0 = (50 + this._view.x) / 100 * fw;
          const cy0 = (50 + this._view.y) / 100 * fh;
          const ox = cx0 - sx * w0 / 2,
            oy = cy0 - sy * h0 / 2;
          const diag0 = Math.hypot(w0, h0);
          const ux = sx * w0 / diag0,
            uy = sy * h0 / diag0;
          move = ev => {
            const proj = (ev.clientX - rect.left - ox) * ux + (ev.clientY - rect.top - oy) * uy;
            const s = clampS(s0 * proj / diag0);
            const d = diag0 * s / s0;
            this._view.s = s;
            this._view.x = (ox + ux * d / 2) / fw * 100 - 50;
            this._view.y = (oy + uy * d / 2) / fh * 100 - 50;
            this._clampView();
            this._applyView();
          };
        } else {
          this.setAttribute('data-panning', '');
          const start = {
            px: e.clientX,
            py: e.clientY,
            x: this._view.x,
            y: this._view.y
          };
          move = ev => {
            this._view.x = start.x + (ev.clientX - start.px) / fw * 100;
            this._view.y = start.y + (ev.clientY - start.py) / fh * 100;
            this._clampView();
            this._applyView();
          };
        }
        const up = () => {
          try {
            this._spill.releasePointerCapture(e.pointerId);
          } catch {}
          this._spill.removeEventListener('pointermove', move);
          this._spill.removeEventListener('pointerup', up);
          this._spill.removeEventListener('pointercancel', up);
          this.removeAttribute('data-panning');
          this._dragUp = null;
        };
        // Stashed so _exitReframe (Escape / outside-click mid-drag) can
        // tear the capture + listeners down synchronously.
        this._dragUp = up;
        this._spill.addEventListener('pointermove', move);
        this._spill.addEventListener('pointerup', up);
        this._spill.addEventListener('pointercancel', up);
      });
      // Wheel zoom stays available inside reframe mode as a trackpad nicety —
      // zooms toward the cursor (offset' = cursor·(1-k) + offset·k).
      this.addEventListener('wheel', e => {
        if (!this.hasAttribute('data-reframe')) return;
        e.preventDefault();
        const r = this.getBoundingClientRect();
        const cx = (e.clientX - r.left) / r.width * 100 - 50;
        const cy = (e.clientY - r.top) / r.height * 100 - 50;
        const prev = this._view.s;
        const next = clampS(prev * Math.pow(1.0015, -e.deltaY));
        if (next === prev) return;
        const k = next / prev;
        this._view.s = next;
        this._view.x = cx * (1 - k) + this._view.x * k;
        this._view.y = cy * (1 - k) + this._view.y * k;
        this._clampView();
        this._applyView();
      }, {
        passive: false
      });
    }
    connectedCallback() {
      // Warn once per page — an id-less slot works for the session but
      // cannot persist, and two id-less slots would share nothing.
      if (!this.id && !ImageSlot._warned) {
        ImageSlot._warned = true;
        console.warn('<image-slot> without an id will not persist its dropped image.');
      }
      this.addEventListener('dragenter', this);
      this.addEventListener('dragover', this);
      this.addEventListener('dragleave', this);
      this.addEventListener('drop', this);
      subs.add(this._subFn);
      // The host may inject window.omelette.writeFile AFTER the first render;
      // re-render on hover so the editable-gated controls reliably appear.
      this.addEventListener('pointerenter', this._subFn);
      // width%/height% in _applyView encode the frame aspect at call time —
      // a host resize (responsive grid, pane divider) would stretch the
      // image until the next _render. Re-render on size change: _render()
      // re-seeds _view from stored before clamp/apply, so a shrink→grow
      // cycle round-trips instead of ratcheting x/y toward the narrower
      // frame's clamp range.
      this._ro = new ResizeObserver(() => this._render());
      this._ro.observe(this);
      load();
      this._render();
    }
    disconnectedCallback() {
      subs.delete(this._subFn);
      this.removeEventListener('pointerenter', this._subFn);
      this.removeEventListener('dragenter', this);
      this.removeEventListener('dragover', this);
      this.removeEventListener('dragleave', this);
      this.removeEventListener('drop', this);
      if (this._ro) {
        this._ro.disconnect();
        this._ro = null;
      }
      // commit=false: a disconnect is not a user intent — committing here
      // would persist whatever half-finished drag a React remount or DOM
      // splice happened to interrupt. Deliberate exits commit on their own
      // paths (Escape/click-out/toggle), and unloads commit via pagehide.
      this._exitReframe(false);
    }
    _enterReframe() {
      if (this.hasAttribute('data-reframe')) return;
      this.setAttribute('data-reframe', '');
      this._signalReframe(true);
      // Best-effort commit when the document unloads mid-reframe (a host
      // navigation racing the enter signal, a manual reload, tab close):
      // the sidecar write rides the host bridge, which outlives this
      // document, so the crop survives even though the mode dies with the
      // DOM. Held on the instance so _exitReframe detaches exactly what
      // was attached.
      this._pagehide = () => {
        this._exitReframe(true);
        flushNow();
      };
      window.addEventListener('pagehide', this._pagehide);
      // Promote spill to the top layer, then keep it pinned over the frame:
      // scroll/resize cover the common cases, and a per-frame rect check
      // catches layout shifts that fire neither (an image above finishing
      // load, streamed DOM pushing the slot down, an ancestor transform
      // change) so the overlay can't detach from the frame.
      try {
        this._spill.showPopover();
      } catch {}
      // After the spill, so the controls stack above it in the top layer.
      try {
        this._ctl.showPopover();
      } catch {}
      this._reposition = () => {
        if (this.hasAttribute('data-reframe')) this._applyView();
      };
      window.addEventListener('scroll', this._reposition, true);
      window.addEventListener('resize', this._reposition);
      this._lastRect = '';
      this._watch = () => {
        if (!this.hasAttribute('data-reframe')) return;
        const r = this.getBoundingClientRect();
        const key = r.left + ',' + r.top + ',' + r.width + ',' + r.height;
        if (key !== this._lastRect) {
          this._lastRect = key;
          this._applyView();
        }
        this._watchId = requestAnimationFrame(this._watch);
      };
      this._watchId = requestAnimationFrame(this._watch);
      this._applyView();
      // Close on click outside (the spill handler stopPropagation()s so
      // in-image drags don't reach this) and on Escape. Listeners are held
      // on the instance so _exitReframe / disconnectedCallback can detach
      // exactly what was attached.
      this._outside = e => {
        if (e.composedPath && e.composedPath().includes(this)) return;
        this._exitReframe(true);
      };
      this._esc = e => {
        if (e.key === 'Escape') this._exitReframe(true);
      };
      document.addEventListener('pointerdown', this._outside, true);
      document.addEventListener('keydown', this._esc, true);
    }
    _exitReframe(commit) {
      if (!this.hasAttribute('data-reframe')) return;
      if (this._dragUp) this._dragUp();
      this.removeAttribute('data-reframe');
      this.removeAttribute('data-panning');
      if (this._outside) document.removeEventListener('pointerdown', this._outside, true);
      if (this._esc) document.removeEventListener('keydown', this._esc, true);
      this._outside = this._esc = null;
      if (this._reposition) {
        window.removeEventListener('scroll', this._reposition, true);
        window.removeEventListener('resize', this._reposition);
        this._reposition = null;
      }
      if (this._watchId) {
        cancelAnimationFrame(this._watchId);
        this._watchId = 0;
      }
      if (this._pagehide) {
        window.removeEventListener('pagehide', this._pagehide);
        this._pagehide = null;
      }
      try {
        this._spill.hidePopover();
      } catch {}
      try {
        this._ctl.hidePopover();
      } catch {}
      this._ctl.style.left = '';
      this._ctl.style.top = '';
      if (commit) this._commitView();
      this._signalReframe(false);
    }

    // Reframe state lives only in this DOM until commit, invisible to the
    // host's dirty signals — announce enter/exit so the host can hold
    // auto-reloads for exactly the gesture (the guest bundle forwards
    // image-slot:reframe to the host as imageSlotReframe). Dispatched on
    // the element (composed, so it escapes shadow roots) while connected;
    // a disconnected exit (disconnectedCallback) falls back to document so
    // the host still hears it.
    _signalReframe(active) {
      const target = this.isConnected ? this : document;
      target.dispatchEvent(new CustomEvent('image-slot:reframe', {
        bubbles: true,
        composed: true,
        detail: {
          active: active,
          id: this.id || null
        }
      }));
    }

    // Public: host's "Import from computer" calls this to run local browse.
    openFilePicker() {
      this._exitReframe(true);
      this._input.click();
    }

    // A src write is a newer intent for this slot's content — the host
    // pick path (setImageSlotImage) or an agent edit — so it must win
    // over any encode still in flight from an earlier drop: left live,
    // that encode lands later, passes _ingest's gen guard, and its
    // setSlot silently overwrites the pick (the stored value shadows
    // src in _render). Bumping _gen kills the encode before its own
    // _swapGen clear runs, so clear the dead claim here too — otherwise
    // _releaseMask (gated on !_swapGen) never fires and the pick's
    // spinner is stranded. src ONLY: the pick sets credit/credit-href
    // in the same task, and clearing _swapGen on those would let the
    // same-src branch unmask the old image mid-encode.
    attributeChangedCallback(name, oldVal, newVal) {
      if (name === 'src' && oldVal !== newVal) {
        this._gen++;
        this._swapGen = 0;
      }
      if (this.shadowRoot) this._render();
    }

    // handleEvent — one listener object for all four drag events keeps the
    // add/remove symmetric and the depth counter correct.
    handleEvent(e) {
      if (e.type === 'dragenter' || e.type === 'dragover') {
        // Without preventDefault the browser never fires 'drop'.
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
        if (e.type === 'dragenter') this._depth++;
        this.setAttribute('data-over', '');
      } else if (e.type === 'dragleave') {
        // dragenter/leave fire for every descendant crossing — count depth
        // so hovering the icon inside the empty state doesn't flicker.
        if (--this._depth <= 0) {
          this._depth = 0;
          this.removeAttribute('data-over');
        }
      } else if (e.type === 'drop') {
        e.preventDefault();
        e.stopPropagation();
        this._depth = 0;
        this.removeAttribute('data-over');
        const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
        if (f) this._ingest(f);
      }
    }
    async _ingest(file) {
      this._setError(null);
      if (!file || ACCEPT.indexOf(file.type) < 0) {
        this._setError('Drop a PNG, JPEG, WebP, or AVIF image.');
        return;
      }
      // toDataUrl can take hundreds of ms on a large photo. A Clear or a
      // newer drop during that window would be clobbered when this await
      // resumes — bump + capture a generation so stale encodes bail.
      const gen = ++this._gen;
      // Replacing a shown image: surface the swap through the encode too,
      // not just the decode — otherwise the old photo sits there with no
      // feedback while the canvas re-encode runs. An empty slot keeps its
      // placeholder (no spinner) until the encode lands, as before.
      // _swapGen guards the mask against re-renders DURING the encode
      // (pointerenter, ResizeObserver, another slot's store write): the
      // stored value still resolves to the old image there, so _render's
      // same-src clear would otherwise unmask it mid-replace.
      if (this.hasAttribute('data-filled')) {
        this.setAttribute('data-swapping', '');
        this._swapGen = gen;
      }
      try {
        const w = this.clientWidth || this.offsetWidth || MAX_DIM;
        const url = await toDataUrl(file, w);
        if (gen !== this._gen) return;
        // Only exit reframe once the new image is in hand — a rejected type
        // or decode failure leaves the in-progress crop untouched.
        this._exitReframe(false);
        // Clear BEFORE setSlot: its synchronous re-render must see no
        // pending encode, so a byte-identical re-upload (same data URL, no
        // load event coming) still clears the mask via the complete branch.
        this._swapGen = 0;
        const val = {
          u: url,
          s: 1,
          x: 0,
          y: 0
        };
        setSlot(this.id || '', val);
        // Keep a session-local copy for id-less slots so the drop still
        // shows, even though it cannot persist.
        if (!this.id) {
          this._local = val;
          this._render();
        }
      } catch (err) {
        if (gen !== this._gen) return;
        this._swapGen = 0;
        // Reveal the kept old image — unless another replacement (a
        // remote pick's src swap) is still in flight, in which case the
        // mask stays until THAT image settles (its load/error releases).
        this._releaseMask();
        this._setError('Could not read that image.');
        console.warn('<image-slot> ingest failed:', err);
      }
    }
    _setError(msg) {
      if (this._err) {
        this._err.remove();
        this._err = null;
      }
      if (!msg) return;
      const d = document.createElement('div');
      d.className = 'err';
      d.textContent = msg;
      this.shadowRoot.appendChild(d);
      this._err = d;
      setTimeout(() => {
        if (this._err === d) {
          d.remove();
          this._err = null;
        }
      }, 3000);
    }

    // Reframing (pan/resize) is available on any filled slot — the user can
    // always reposition/scale. `fit` only sets the initial baseline (see
    // _geom): contain starts fully-visible, cover starts frame-filling.
    _reframes() {
      return this.hasAttribute('data-filled');
    }

    // The single release discipline for the replacement-in-flight mask
    // (data-swapping). The mask comes off only when BOTH hold:
    //  - no encode is pending (_swapGen) — mid-encode the stored value
    //    still resolves to the old image, so any reveal paints it;
    //  - the frame img has settled on its current src — an unsettled src
    //    means some replacement is still in flight (e.g. a remote pick),
    //    whoever started it, and revealing would paint the previous
    //    frame. The load/error listeners pass settled=true (the event IS
    //    the settlement signal, per spec complete is true by then);
    //    other callers rely on the complete flag (covers loaded AND
    //    failed).
    // Every release path funnels through here EXCEPT _render's empty
    // branch (the img is being cleared — nothing will ever settle).
    _releaseMask(settled) {
      if (!this._swapGen && !this._loadPending && (settled || this._img.complete)) {
        this.removeAttribute('data-swapping');
      }
    }

    // Baseline geometry, shared by clamp/apply/resize. `base` is the scale at
    // view-scale s=1: cover = fill the frame (overflow on the looser axis),
    // contain = fit fully inside (letterboxed). Zooming a contain image past
    // s where it overflows naturally becomes a crop. Null until the img has
    // loaded (naturalWidth is 0 before that) or when the slot has no layout
    // box — ResizeObserver fires with a 0×0 rect under display:none, and
    // clamping against a degenerate 1×1 frame would silently pull the stored
    // pan toward zero.
    _geom() {
      const iw = this._img.naturalWidth,
        ih = this._img.naturalHeight;
      const fw = this.clientWidth,
        fh = this.clientHeight;
      if (!iw || !ih || !fw || !fh) return null;
      const contain = (this.getAttribute('fit') || 'cover').toLowerCase() === 'contain';
      const base = contain ? Math.min(fw / iw, fh / ih) : Math.max(fw / iw, fh / ih);
      return {
        iw,
        ih,
        fw,
        fh,
        base
      };
    }
    _clampView() {
      // Pan range on each axis is half the overflow past the frame edge.
      const g = this._geom();
      if (!g) return;
      const mx = Math.max(0, (g.iw * g.base * this._view.s / g.fw - 1) * 50);
      const my = Math.max(0, (g.ih * g.base * this._view.s / g.fh - 1) * 50);
      this._view.x = Math.max(-mx, Math.min(mx, this._view.x));
      this._view.y = Math.max(-my, Math.min(my, this._view.y));
    }
    _applyView() {
      const g = this._geom();
      // Top-layer controls: pin to the frame's top-right in viewport px
      // (the same 8px inset as the in-frame layout; unscaled — top-layer UI
      // reads as chrome, not page content). BEFORE the geometry branch:
      // placement needs only the frame rect, and a not-yet-loaded or broken
      // src must not leave the promoted strip floating unpositioned. Gated
      // on the popover actually being open: without the Popover API,
      // showPopover() threw (swallowed in _enterReframe), .ctl stays in
      // its in-frame absolute layout, and viewport-px coordinates would
      // shove it off-frame — and matches(':popover-open') itself throws
      // there (unknown pseudo-class), hence the try/catch.
      if (this.hasAttribute('data-reframe')) {
        let onTop = false;
        try {
          onTop = this._ctl.matches(':popover-open');
        } catch {}
        if (onTop) {
          const r = this.getBoundingClientRect();
          this._ctl.style.left = r.right - 8 + 'px';
          this._ctl.style.top = r.top + 8 + 'px';
        }
      }
      if (!g) {
        // Dimensions not known yet (before img load) — centered fit so there
        // is no flash of an unpositioned image before the geometry lands.
        const contain = (this.getAttribute('fit') || 'cover').toLowerCase() === 'contain';
        this._img.style.width = '100%';
        this._img.style.height = '100%';
        this._img.style.left = '50%';
        this._img.style.top = '50%';
        this._img.style.objectFit = contain ? 'contain' : 'cover';
        return;
      }
      // Baseline (cover-fill or contain-fit) × view scale. Width/height and
      // left/top are all frame-% — depends only on the frame aspect ratio, so
      // a responsive resize keeps the same crop. The spill layer mirrors the
      // same box so its corners = image corners.
      const k = g.base * this._view.s;
      const w = g.iw * k / g.fw * 100 + '%';
      const h = g.ih * k / g.fh * 100 + '%';
      const l = 50 + this._view.x + '%';
      const t = 50 + this._view.y + '%';
      this._img.style.width = w;
      this._img.style.height = h;
      this._img.style.left = l;
      this._img.style.top = t;
      this._img.style.objectFit = '';
      if (this.hasAttribute('data-reframe')) {
        // Top-layer spill: position in viewport px over the frame. The top
        // layer escapes ancestor transforms entirely, so EVERY term must be
        // in viewport units: getBoundingClientRect gives the frame's scaled
        // origin AND size, and the rect/layout ratio rescales the ghost —
        // sizing from layout px alone renders it 1/scale too large under a
        // scaled deck slide. Inner ghost + handles stay box-relative.
        const r = this.getBoundingClientRect();
        const sx = g.fw ? r.width / g.fw : 1;
        const sy = g.fh ? r.height / g.fh : 1;
        this._spill.style.width = g.iw * k * sx + 'px';
        this._spill.style.height = g.ih * k * sy + 'px';
        this._spill.style.left = r.left + (50 + this._view.x) / 100 * r.width + 'px';
        this._spill.style.top = r.top + (50 + this._view.y) / 100 * r.height + 'px';
      }
    }
    _commitView() {
      const v = {
        s: this._view.s,
        x: this._view.x,
        y: this._view.y
      };
      if (this._userUrl) v.u = this._userUrl;
      // Framing-only (no u) persists too so an author-src slot remembers its
      // crop; clearing the sidecar still falls through to src=.
      if (this.id) setSlot(this.id, v);else {
        this._local = v;
      }
    }
    _render() {
      // Shape / mask. Presets use border-radius so the dashed ring can
      // follow the rounded outline; clip-path is only applied for an
      // explicit `mask` (the ring is hidden there since a rectangle
      // dashed border chopped by an arbitrary polygon looks broken).
      const mask = this.getAttribute('mask');
      const shape = (this.getAttribute('shape') || 'rounded').toLowerCase();
      let radius = '';
      if (shape === 'circle') radius = '50%';else if (shape === 'pill') radius = '9999px';else if (shape === 'rounded') {
        const n = parseFloat(this.getAttribute('radius'));
        radius = (Number.isFinite(n) ? n : 12) + 'px';
      }
      this._frame.style.borderRadius = mask ? '' : radius;
      this._frame.style.clipPath = mask || '';
      this._ring.style.borderRadius = mask ? '' : radius;
      this._ring.style.display = mask ? 'none' : '';

      // Controls and reframe entry gate on this so share links stay read-only.
      const editable = !!(window.omelette && window.omelette.writeFile);
      this.toggleAttribute('data-editable', editable);
      this._sub.style.display = editable ? '' : 'none';

      // Content. The sidecar is also writable by the agent's write_file
      // tool, so its value isn't guaranteed canvas-originated — only accept
      // data:image/ URLs from it. The `src` attribute is author-controlled
      // (Claude wrote it into the HTML) so it passes through unchanged.
      let stored = this.id ? getSlot(this.id) : this._local;
      if (stored && stored.u && !/^data:image\//i.test(stored.u)) stored = null;
      const srcAttr = this.getAttribute('src') || '';
      this._userUrl = stored && stored.u || null;
      const url = this._userUrl || srcAttr;
      // Don't clobber an in-flight reframe with a store-triggered re-render.
      if (!this.hasAttribute('data-reframe')) {
        this._view = {
          s: stored && Number.isFinite(stored.s) ? clampS(stored.s) : 1,
          x: stored && Number.isFinite(stored.x) ? stored.x : 0,
          y: stored && Number.isFinite(stored.y) ? stored.y : 0
        };
      }
      this._cap.textContent = this.getAttribute('placeholder') || 'Drop an image';
      // Toggle via style.display — the [hidden] attribute alone loses to
      // the display:flex / display:block rules in the stylesheet above.
      // An Unsplash src with no credit attribute must NOT render — showing
      // the photo uncredited is the Unsplash-terms violation itself. The
      // error tile replaces the photo until the credit is written. A
      // user-dropped image is the user's own content and always renders.
      // Trimmed: credit is agent/user-editable content, and a whitespace-
      // only value must count as missing — otherwise it would suppress the
      // error tile AND render an empty credit box (no text, no links),
      // exactly the unattributed state this gate exists to prevent.
      const credit = (this.getAttribute('credit') || '').trim();
      const attrError = !!(!credit && !this._userUrl && srcAttr && isUnsplashHost(srcAttr));
      this.toggleAttribute('data-attribution-error', attrError);
      if (url && !attrError) {
        const prev = this._img.getAttribute('src');
        if (prev !== url) {
          // Replacing an already-shown image: mark the swap BEFORE setting
          // src so the stale frame is never revealed (see the data-swapping
          // stylesheet rules). First fill (prev empty) keeps the existing
          // placeholder-until-load behavior — no spinner. _hidShowing
          // covers the pick path's transient attribution-error wipe: prev
          // is gone, but an image WAS showing, so this is a replacement.
          if (prev || this._hidShowing) this.setAttribute('data-swapping', '');
          // Mark the swap BEFORE assigning src: complete keeps reporting
          // the old settled request until the browser's
          // update-the-image-data microtask runs, so same-task re-renders
          // (the pick path's credit/credit-href setAttributes) need this
          // flag, not complete, to know a load is in flight.
          this._loadPending = true;
          this._img.src = url;
          this._ghost.src = url;
        } else {
          // Same-src re-render — release if settled, so an ingest-set
          // spinner can't stick after a byte-identical re-upload (same
          // data URL, no further load event ever fires).
          this._releaseMask();
        }
        this._hidShowing = false;
        this._img.style.display = 'block';
        this._empty.style.display = 'none';
        this.setAttribute('data-filled', '');
        this._clampView();
        this._applyView();
      } else {
        this.removeAttribute('data-swapping');
        // The src is being removed — no load/error will ever fire for it.
        this._loadPending = false;
        // A transient attribution-error wipe of a showing image happens on
        // the pick path: the host sets src one setAttribute before credit,
        // so render N hides the old image (attrError) and render N+1
        // restores a URL. Remember the wipe so that restore renders as a
        // replacement (spinner), not a first fill (blank frame).
        this._hidShowing = attrError && !!this._img.getAttribute('src');
        this._img.style.display = 'none';
        this._img.removeAttribute('src');
        this._ghost.removeAttribute('src');
        // The error tile owns the blocked-photo state; .empty stays for
        // the genuinely-empty slot.
        this._empty.style.display = attrError ? 'none' : 'flex';
        this.removeAttribute('data-filled');
      }

      // Credit belongs to the author src, so a user drop hides it.
      // textContent + the http(s)-only funnel keep external strings inert.
      const showCredit = !!(url && credit && !this._userUrl && !attrError);
      this._credit.textContent = '';
      if (showCredit) {
        // Validate once (resolved against the document, http(s) only),
        // then append the terms-required utm referral params to links
        // that point back at unsplash.com.
        let href = '';
        const rawHref = this.getAttribute('credit-href') || '';
        if (rawHref) {
          try {
            const u = new URL(rawHref, document.baseURI);
            if (u.protocol === 'http:' || u.protocol === 'https:') {
              href = withReferral(u.href);
            }
          } catch {}
        }
        const mkLink = (text, linkHref) => {
          const a = document.createElement('a');
          a.setAttribute('target', '_blank');
          a.setAttribute('rel', 'noopener noreferrer');
          a.setAttribute('href', linkHref);
          a.textContent = text;
          return a;
        };
        // Unsplash's prescribed credit is TWO links — the photographer's
        // name to their profile (credit-href) and 'Unsplash' to the
        // homepage. Render that split whenever the text has the canonical
        // shape; other text keeps the legacy single-link rendering.
        const m = /^Photo by (.+) on Unsplash$/.exec(credit);
        if (m) {
          this._credit.appendChild(document.createTextNode('Photo by '));
          this._credit.appendChild(href ? mkLink(m[1], href) : document.createTextNode(m[1]));
          this._credit.appendChild(document.createTextNode(' on '));
          this._credit.appendChild(mkLink('Unsplash', UNSPLASH_HOMEPAGE_HREF));
        } else if (href) {
          this._credit.appendChild(mkLink(credit, href));
        } else {
          this._credit.textContent = credit;
        }
      }
      this.toggleAttribute('data-credit', showCredit);
    }
  }
  if (!customElements.get('image-slot')) {
    customElements.define('image-slot', ImageSlot);
  }
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "assets/image-slot.js", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const TONES = {
  brand: {
    background: "var(--blue-100)",
    color: "var(--navy-800)"
  },
  accent: {
    background: "var(--aqua-200)",
    color: "var(--navy-900)"
  },
  neutral: {
    background: "var(--line-100)",
    color: "var(--slate-600)"
  },
  success: {
    background: "var(--success-100)",
    color: "var(--success-600)"
  },
  warning: {
    background: "var(--warning-100)",
    color: "var(--warning-600)"
  },
  danger: {
    background: "var(--danger-100)",
    color: "var(--danger-600)"
  },
  onDark: {
    background: "rgba(255,255,255,.12)",
    color: "#fff"
  }
};
function Badge({
  children,
  tone = "brand",
  shape = "square",
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      height: "24px",
      padding: "0 10px",
      font: "var(--fw-semibold) var(--fs-micro)/1 var(--font-body)",
      letterSpacing: "var(--ls-label)",
      textTransform: "uppercase",
      borderRadius: shape === "pill" ? "var(--radius-pill)" : "var(--radius-xs)",
      ...TONES[tone],
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SIZES = {
  sm: {
    height: "var(--control-h-sm)",
    padding: "0 16px",
    fontSize: "13px"
  },
  md: {
    height: "var(--control-h)",
    padding: "0 22px",
    fontSize: "14px"
  },
  lg: {
    height: "var(--control-h-lg)",
    padding: "0 30px",
    fontSize: "15px"
  }
};
const VARIANTS = {
  primary: {
    background: "var(--blue-600)",
    color: "#fff",
    border: "1px solid var(--blue-600)"
  },
  navy: {
    background: "var(--navy-800)",
    color: "#fff",
    border: "1px solid var(--navy-800)"
  },
  secondary: {
    background: "transparent",
    color: "var(--blue-600)",
    border: "1px solid var(--blue-200)"
  },
  ghost: {
    background: "transparent",
    color: "var(--text-body)",
    border: "1px solid transparent"
  },
  onDark: {
    background: "#fff",
    color: "var(--navy-800)",
    border: "1px solid #fff"
  },
  onDarkOutline: {
    background: "transparent",
    color: "#fff",
    border: "1px solid var(--border-on-dark)"
  }
};
const HOVER = {
  primary: {
    background: "var(--navy-700)",
    borderColor: "var(--navy-700)"
  },
  navy: {
    background: "var(--navy-900)",
    borderColor: "var(--navy-900)"
  },
  secondary: {
    background: "var(--blue-50)",
    borderColor: "var(--blue-400)"
  },
  ghost: {
    background: "var(--line-100)"
  },
  onDark: {
    background: "var(--aqua-200)",
    borderColor: "var(--aqua-200)"
  },
  onDarkOutline: {
    background: "rgba(255,255,255,.10)",
    borderColor: "rgba(255,255,255,.4)"
  }
};
function Button({
  children,
  variant = "primary",
  size = "md",
  iconRight,
  iconLeft,
  disabled,
  fullWidth,
  as = "button",
  href,
  onClick,
  style,
  ...rest
}) {
  const [h, setH] = React.useState(false);
  const [p, setP] = React.useState(false);
  const Tag = href ? "a" : as;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    href: href,
    onClick: disabled ? undefined : onClick,
    disabled: Tag === "button" ? disabled : undefined,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => {
      setH(false);
      setP(false);
    },
    onMouseDown: () => setP(true),
    onMouseUp: () => setP(false),
    style: {
      display: fullWidth ? "flex" : "inline-flex",
      width: fullWidth ? "100%" : undefined,
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
      font: "var(--fw-semibold) 14px/1 var(--font-body)",
      letterSpacing: "var(--ls-label)",
      textTransform: "uppercase",
      textDecoration: "none",
      cursor: disabled ? "not-allowed" : "pointer",
      borderRadius: "var(--radius-xs)",
      whiteSpace: "nowrap",
      transition: "background var(--dur-fast) var(--ease-standard),border-color var(--dur-fast) var(--ease-standard),transform var(--dur-instant) var(--ease-standard)",
      ...SIZES[size],
      ...VARIANTS[variant],
      ...(h && !disabled ? HOVER[variant] : null),
      transform: p && !disabled ? "scale(var(--press-scale))" : "none",
      opacity: disabled ? 0.45 : 1,
      ...style
    }
  }, rest), iconLeft, children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Card({
  children,
  tone = "light",
  interactive = false,
  pad = "var(--card-pad)",
  accentRule = false,
  style,
  ...rest
}) {
  const [h, setH] = React.useState(false);
  const tones = {
    light: {
      background: "var(--surface-card)",
      border: "1px solid var(--border-default)",
      color: "var(--text-body)"
    },
    tint: {
      background: "var(--surface-tint)",
      border: "1px solid var(--blue-100)",
      color: "var(--text-body)"
    },
    dark: {
      background: "var(--surface-dark)",
      border: "1px solid var(--border-on-dark)",
      color: "var(--text-on-dark)"
    }
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      position: "relative",
      padding: pad,
      borderRadius: "var(--radius-xs)",
      borderTop: accentRule ? "var(--rule-accent-w) solid var(--aqua-500)" : undefined,
      transition: "box-shadow var(--dur-base) var(--ease-standard),transform var(--dur-base) var(--ease-standard),border-color var(--dur-base) var(--ease-standard)",
      ...tones[tone],
      ...(interactive && h ? {
        boxShadow: "var(--shadow-md)",
        transform: "translateY(var(--lift-hover))",
        borderColor: tone === "dark" ? "rgba(255,255,255,.3)" : "var(--blue-200)"
      } : null),
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Lucide-backed icon. Requires the Lucide UMD script on the page:
 *  <script src="https://unpkg.com/lucide@0.470.0/dist/umd/lucide.js"></script> */
function Icon({
  name,
  size = 20,
  strokeWidth = 1.75,
  color = "currentColor",
  style,
  ...rest
}) {
  const [inner, setInner] = React.useState("");
  React.useEffect(() => {
    let stop = false;
    const build = () => {
      const L = window.lucide;
      if (!L || !L.icons) return false;
      const key = String(name).split(/[-_ ]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join("");
      const node = L.icons[key] || L.icons[name];
      if (!node) return false;
      const kids = Array.isArray(node) ? node[2] : node;
      const html = (kids || []).map(([tag, attrs]) => "<" + tag + " " + Object.entries(attrs || {}).map(([k, v]) => k + '="' + v + '"').join(" ") + " />").join("");
      if (!stop) setInner(html);
      return true;
    };
    if (!build()) {
      const t = setInterval(() => {
        if (build()) clearInterval(t);
      }, 120);
      setTimeout(() => clearInterval(t), 4000);
      return () => {
        stop = true;
        clearInterval(t);
      };
    }
    return () => {
      stop = true;
    };
  }, [name]);
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
    style: {
      display: "block",
      flex: "0 0 auto",
      ...style
    },
    dangerouslySetInnerHTML: {
      __html: inner
    }
  }, rest));
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function IconButton({
  icon,
  label,
  variant = "solid",
  size = 40,
  onClick,
  href,
  style,
  ...rest
}) {
  const [h, setH] = React.useState(false);
  const skins = {
    solid: {
      background: "var(--blue-600)",
      color: "#fff",
      border: "1px solid var(--blue-600)"
    },
    outline: {
      background: "transparent",
      color: "var(--blue-600)",
      border: "1px solid var(--border-default)"
    },
    onDark: {
      background: "rgba(255,255,255,.10)",
      color: "#fff",
      border: "1px solid var(--border-on-dark)"
    }
  };
  const hovers = {
    solid: {
      background: "var(--navy-800)",
      borderColor: "var(--navy-800)"
    },
    outline: {
      background: "var(--blue-50)",
      borderColor: "var(--blue-400)"
    },
    onDark: {
      background: "var(--aqua-500)",
      borderColor: "var(--aqua-500)"
    }
  };
  const Tag = href ? "a" : "button";
  return /*#__PURE__*/React.createElement(Tag, _extends({
    href: href,
    onClick: onClick,
    "aria-label": label,
    title: label,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      width: size,
      height: size,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "var(--radius-xs)",
      cursor: "pointer",
      padding: 0,
      transition: "background var(--dur-fast) var(--ease-standard),border-color var(--dur-fast) var(--ease-standard)",
      ...skins[variant],
      ...(h ? hovers[variant] : null),
      ...style
    }
  }, rest), typeof icon === "string" ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: Math.round(size * 0.45)
  }) : icon);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/core/SectionHeading.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  tone = "light",
  maxWidth = 720,
  style,
  ...rest
}) {
  const dark = tone === "dark";
  return /*#__PURE__*/React.createElement("header", _extends({
    style: {
      textAlign: align,
      maxWidth,
      margin: align === "center" ? "0 auto" : undefined,
      ...style
    }
  }, rest), eyebrow && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "12px",
      marginBottom: "14px",
      font: "var(--type-eyebrow)",
      letterSpacing: "var(--ls-eyebrow)",
      textTransform: "uppercase",
      color: dark ? "var(--aqua-200)" : "var(--blue-600)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 22,
      height: 1,
      background: "var(--aqua-500)"
    }
  }), eyebrow, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 22,
      height: 1,
      background: "var(--aqua-500)"
    }
  })), title && /*#__PURE__*/React.createElement("h2", {
    style: {
      font: "var(--type-h2)",
      letterSpacing: "var(--ls-display)",
      color: dark ? "#fff" : "var(--text-strong)",
      margin: 0
    }
  }, title), intro && /*#__PURE__*/React.createElement("p", {
    style: {
      font: "var(--type-body-lg)",
      color: dark ? "var(--text-on-dark-muted)" : "var(--text-muted)",
      margin: "14px 0 0"
    }
  }, intro));
}
Object.assign(__ds_scope, { SectionHeading });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/SectionHeading.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Tag({
  children,
  active = false,
  href,
  onClick,
  style,
  ...rest
}) {
  const [h, setH] = React.useState(false);
  const Tag_ = href ? "a" : "button";
  const on = active || h;
  return /*#__PURE__*/React.createElement(Tag_, _extends({
    href: href,
    onClick: onClick,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      display: "inline-flex",
      alignItems: "center",
      height: "34px",
      padding: "0 14px",
      cursor: "pointer",
      font: "var(--fw-medium) var(--fs-body-sm)/1 var(--font-body)",
      textDecoration: "none",
      border: "1px solid " + (on ? "var(--blue-600)" : "var(--border-default)"),
      background: active ? "var(--blue-600)" : h ? "var(--blue-50)" : "transparent",
      color: active ? "#fff" : "var(--text-body)",
      borderRadius: "var(--radius-xs)",
      transition: "all var(--dur-fast) var(--ease-standard)",
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Checkbox({
  label,
  checked,
  onChange,
  disabled,
  style,
  ...rest
}) {
  const [h, setH] = React.useState(false);
  return /*#__PURE__*/React.createElement("label", {
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      display: "inline-flex",
      alignItems: "flex-start",
      gap: "10px",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? .5 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "checkbox",
    checked: checked,
    onChange: onChange,
    disabled: disabled,
    style: {
      position: "absolute",
      opacity: 0,
      width: 0,
      height: 0
    }
  }, rest)), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 18,
      height: 18,
      marginTop: 2,
      flex: "0 0 auto",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "var(--radius-xs)",
      background: checked ? "var(--blue-600)" : "var(--white)",
      border: "1px solid " + (checked ? "var(--blue-600)" : h ? "var(--blue-400)" : "var(--border-strong)"),
      transition: "all var(--dur-fast) var(--ease-standard)"
    }
  }, checked && /*#__PURE__*/React.createElement("svg", {
    width: "11",
    height: "11",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "3.5"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 12l5 5L19 7",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-body-sm)",
      color: "var(--text-body)"
    }
  }, label));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Field.jsx
try { (() => {
/** Shared label / hint / error wrapper for form controls. */
function Field({
  label,
  hint,
  error,
  required,
  htmlFor,
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "7px",
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: htmlFor,
    style: {
      font: "var(--type-label)",
      letterSpacing: "var(--ls-label)",
      textTransform: "uppercase",
      color: "var(--slate-600)"
    }
  }, label, required && /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--danger-600)"
    }
  }, " *")), children, (error || hint) && /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-body-sm)",
      fontSize: "var(--fs-caption)",
      color: error ? "var(--danger-600)" : "var(--text-faint)"
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Field });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Field.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Input({
  label,
  hint,
  error,
  required,
  id,
  iconLeft,
  style,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  return /*#__PURE__*/React.createElement(__ds_scope.Field, {
    label: label,
    hint: hint,
    error: error,
    required: required,
    htmlFor: id
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      alignItems: "center"
    }
  }, iconLeft && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: 13,
      color: "var(--slate-400)",
      display: "flex"
    }
  }, iconLeft), /*#__PURE__*/React.createElement("input", _extends({
    id: id,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      width: "100%",
      height: "var(--control-h)",
      padding: iconLeft ? "0 14px 0 40px" : "0 14px",
      background: "var(--white)",
      border: "1px solid " + (error ? "var(--danger-600)" : focus ? "var(--blue-500)" : "var(--border-default)"),
      borderRadius: "var(--radius-xs)",
      font: "var(--type-body-sm)",
      color: "var(--text-strong)",
      boxShadow: focus ? "var(--focus-ring)" : "none",
      outline: "none",
      transition: "border-color var(--dur-fast) var(--ease-standard),box-shadow var(--dur-fast) var(--ease-standard)",
      ...style
    }
  }, rest))));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Select({
  label,
  hint,
  error,
  required,
  id,
  options = [],
  placeholder,
  style,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  return /*#__PURE__*/React.createElement(__ds_scope.Field, {
    label: label,
    hint: hint,
    error: error,
    required: required,
    htmlFor: id
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("select", _extends({
    id: id,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    defaultValue: "",
    style: {
      width: "100%",
      height: "var(--control-h)",
      padding: "0 38px 0 14px",
      appearance: "none",
      background: "var(--white)",
      border: "1px solid " + (error ? "var(--danger-600)" : focus ? "var(--blue-500)" : "var(--border-default)"),
      borderRadius: "var(--radius-xs)",
      font: "var(--type-body-sm)",
      color: "var(--text-strong)",
      boxShadow: focus ? "var(--focus-ring)" : "none",
      outline: "none",
      cursor: "pointer",
      ...style
    }
  }, rest), placeholder && /*#__PURE__*/React.createElement("option", {
    value: "",
    disabled: true
  }, placeholder), options.map(o => {
    const v = typeof o === "string" ? o : o.value;
    const l = typeof o === "string" ? o : o.label;
    return /*#__PURE__*/React.createElement("option", {
      key: v,
      value: v
    }, l);
  })), /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--slate-500)",
    strokeWidth: "2.5",
    style: {
      position: "absolute",
      right: 14,
      top: "50%",
      transform: "translateY(-50%)",
      pointerEvents: "none"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 9l6 6 6-6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Textarea.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Textarea({
  label,
  hint,
  error,
  required,
  id,
  rows = 5,
  style,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  return /*#__PURE__*/React.createElement(__ds_scope.Field, {
    label: label,
    hint: hint,
    error: error,
    required: required,
    htmlFor: id
  }, /*#__PURE__*/React.createElement("textarea", _extends({
    id: id,
    rows: rows,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      width: "100%",
      padding: "12px 14px",
      background: "var(--white)",
      resize: "vertical",
      border: "1px solid " + (error ? "var(--danger-600)" : focus ? "var(--blue-500)" : "var(--border-default)"),
      borderRadius: "var(--radius-xs)",
      font: "var(--type-body-sm)",
      color: "var(--text-strong)",
      boxShadow: focus ? "var(--focus-ring)" : "none",
      outline: "none",
      transition: "border-color var(--dur-fast) var(--ease-standard),box-shadow var(--dur-fast) var(--ease-standard)",
      ...style
    }
  }, rest)));
}
Object.assign(__ds_scope, { Textarea });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Textarea.jsx", error: String((e && e.message) || e) }); }

// components/marine/CheckList.jsx
try { (() => {
function CheckList({
  items = [],
  tone = "light",
  columns = 1,
  style
}) {
  const dark = tone === "dark";
  return /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: "none",
      margin: 0,
      padding: 0,
      display: "grid",
      gridTemplateColumns: `repeat(${columns},minmax(0,1fr))`,
      gap: "12px 28px",
      ...style
    }
  }, items.map((it, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    style: {
      display: "flex",
      alignItems: "flex-start",
      gap: 12,
      font: "var(--type-body)",
      color: dark ? "var(--text-on-dark-muted)" : "var(--text-body)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "0 0 auto",
      width: 22,
      height: 22,
      marginTop: 3,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: dark ? "var(--aqua-500)" : "var(--blue-100)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check",
    size: 14,
    color: dark ? "var(--navy-900)" : "var(--blue-600)",
    strokeWidth: 3
  })), /*#__PURE__*/React.createElement("span", null, it))));
}
Object.assign(__ds_scope, { CheckList });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marine/CheckList.jsx", error: String((e && e.message) || e) }); }

// components/marine/ContactDetail.jsx
try { (() => {
function ContactDetail({
  icon,
  label,
  lines = [],
  tone = "light",
  style
}) {
  const dark = tone === "dark";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 16,
      alignItems: "flex-start",
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "0 0 auto",
      width: 46,
      height: 46,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: dark ? "rgba(255,255,255,.10)" : "var(--blue-50)",
      border: "1px solid " + (dark ? "var(--border-on-dark)" : "var(--blue-100)")
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 20,
    color: dark ? "var(--aqua-200)" : "var(--blue-600)"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-label)",
      letterSpacing: "var(--ls-label)",
      textTransform: "uppercase",
      color: dark ? "var(--aqua-200)" : "var(--text-faint)",
      marginBottom: 6
    }
  }, label), lines.map((l, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      font: "var(--fw-medium) var(--fs-body)/1.5 var(--font-body)",
      color: dark ? "#fff" : "var(--text-strong)"
    }
  }, l))));
}
Object.assign(__ds_scope, { ContactDetail });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marine/ContactDetail.jsx", error: String((e && e.message) || e) }); }

// components/marine/CtaBanner.jsx
try { (() => {
function CtaBanner({
  eyebrow,
  title,
  body,
  primaryLabel = "Contact us",
  primaryHref = "#contact",
  secondaryLabel,
  secondaryHref,
  style
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--surface-dark)",
      color: "#fff",
      padding: "48px",
      position: "relative",
      overflow: "hidden",
      display: "flex",
      gap: 40,
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      width: "var(--rule-accent-w)",
      background: "var(--aqua-500)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 640
    }
  }, eyebrow && /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-eyebrow)",
      letterSpacing: "var(--ls-eyebrow)",
      textTransform: "uppercase",
      color: "var(--aqua-200)",
      marginBottom: 10
    }
  }, eyebrow), /*#__PURE__*/React.createElement("h2", {
    style: {
      font: "var(--type-h2)",
      color: "#fff",
      margin: 0
    }
  }, title), body && /*#__PURE__*/React.createElement("p", {
    style: {
      font: "var(--type-body)",
      color: "var(--text-on-dark-muted)",
      margin: "12px 0 0"
    }
  }, body)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "onDark",
    size: "lg",
    href: primaryHref
  }, primaryLabel), secondaryLabel && /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "onDarkOutline",
    size: "lg",
    href: secondaryHref
  }, secondaryLabel)));
}
Object.assign(__ds_scope, { CtaBanner });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marine/CtaBanner.jsx", error: String((e && e.message) || e) }); }

// components/marine/PhotoFrame.jsx
try { (() => {
/** Photography frame. Pass `src` for a real image; otherwise renders a fillable
 *  <image-slot> (load assets/image-slot.js on the page) so a real marine photo can be dropped in. */
function PhotoFrame({
  src,
  alt = "",
  slotId,
  placeholder = "Drop a marine photo",
  ratio = "3 / 2",
  scrim = "none",
  children,
  style
}) {
  const scrims = {
    none: null,
    bottom: "var(--scrim-navy)",
    left: "var(--scrim-navy-left)",
    flat: "var(--scrim-flat)"
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      aspectRatio: ratio,
      overflow: "hidden",
      background: "var(--navy-800)",
      borderRadius: "var(--radius-xs)",
      ...style
    }
  }, src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: alt,
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }
  }) : React.createElement("image-slot", {
    id: slotId,
    shape: "rect",
    placeholder,
    style: {
      position: "absolute",
      inset: 0
    }
  }), scrims[scrim] && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: scrims[scrim],
      pointerEvents: "none"
    }
  }), children && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none"
    }
  }, children));
}
Object.assign(__ds_scope, { PhotoFrame });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marine/PhotoFrame.jsx", error: String((e && e.message) || e) }); }

// components/marine/ServiceCard.jsx
try { (() => {
/** The homepage service tile: big index number, photo, title, blurb, "Read more". */
function ServiceCard({
  index,
  title,
  description,
  icon,
  image,
  slotId,
  href = "#",
  onClick,
  style
}) {
  const [h, setH] = React.useState(false);
  return /*#__PURE__*/React.createElement("a", {
    href: href,
    onClick: onClick,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      display: "block",
      position: "relative",
      textDecoration: "none",
      background: "var(--surface-card)",
      border: "1px solid " + (h ? "var(--blue-200)" : "var(--border-default)"),
      borderRadius: "var(--radius-xs)",
      overflow: "hidden",
      transform: h ? "translateY(var(--lift-hover))" : "none",
      boxShadow: h ? "var(--shadow-md)" : "none",
      transition: "all var(--dur-base) var(--ease-standard)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.PhotoFrame, {
    src: image,
    slotId: slotId,
    ratio: "4 / 3",
    scrim: "bottom",
    placeholder: title,
    style: {
      borderRadius: 0,
      transform: h ? "scale(1.04)" : "scale(1)",
      transition: "transform var(--dur-photo) var(--ease-out)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: 0,
      left: 0,
      minWidth: 52,
      height: 40,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: h ? "var(--aqua-500)" : "var(--navy-800)",
      color: "#fff",
      font: "var(--fw-bold) 18px/1 var(--font-display)",
      letterSpacing: "var(--ls-label)",
      transition: "background var(--dur-base) var(--ease-standard)"
    }
  }, index), icon && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      right: 16,
      bottom: -20,
      width: 44,
      height: 44,
      background: "var(--white)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "1px solid var(--border-default)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 22,
    color: "var(--blue-600)"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "24px 24px 22px"
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      font: "var(--type-h3)",
      color: h ? "var(--blue-600)" : "var(--text-strong)",
      margin: "0 0 8px",
      transition: "color var(--dur-fast) var(--ease-standard)"
    }
  }, title), /*#__PURE__*/React.createElement("p", {
    style: {
      font: "var(--type-body-sm)",
      color: "var(--text-muted)",
      margin: "0 0 16px"
    }
  }, description), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      font: "var(--fw-semibold) var(--fs-caption)/1 var(--font-body)",
      letterSpacing: "var(--ls-label)",
      textTransform: "uppercase",
      color: "var(--blue-600)"
    }
  }, "Read more ", /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "arrow-right",
    size: 15
  }))));
}
Object.assign(__ds_scope, { ServiceCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marine/ServiceCard.jsx", error: String((e && e.message) || e) }); }

// components/marine/StatCounter.jsx
try { (() => {
function StatCounter({
  value,
  suffix = "+",
  label,
  icon,
  tone = "light",
  align = "left",
  style
}) {
  const dark = tone === "dark";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: align === "center" ? "center" : "flex-start",
      gap: 6,
      textAlign: align,
      ...style
    }
  }, icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 30,
    color: dark ? "var(--aqua-200)" : "var(--blue-600)",
    style: {
      marginBottom: 6
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-start",
      font: "var(--fw-bold) 46px/1 var(--font-display)",
      color: dark ? "#fff" : "var(--navy-800)"
    }
  }, value, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 24,
      color: "var(--aqua-500)",
      marginLeft: 2
    }
  }, suffix)), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-label)",
      letterSpacing: "var(--ls-label)",
      textTransform: "uppercase",
      color: dark ? "var(--text-on-dark-muted)" : "var(--text-muted)"
    }
  }, label));
}
Object.assign(__ds_scope, { StatCounter });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marine/StatCounter.jsx", error: String((e && e.message) || e) }); }

// components/navigation/PageHero.jsx
try { (() => {
function PageHero({
  title,
  breadcrumb = [],
  eyebrow,
  image,
  slotId,
  height = 320,
  style
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: "relative",
      height,
      overflow: "hidden",
      background: "var(--navy-800)",
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.PhotoFrame, {
    src: image,
    slotId: slotId,
    scrim: "left",
    ratio: "auto",
    placeholder: "Drop a vessel photo",
    style: {
      position: "absolute",
      inset: 0,
      aspectRatio: "auto",
      borderRadius: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: "100%",
      maxWidth: "var(--page-max)",
      margin: "0 auto",
      padding: "0 var(--page-pad)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      gap: 12
    }
  }, eyebrow && /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-eyebrow)",
      letterSpacing: "var(--ls-eyebrow)",
      textTransform: "uppercase",
      color: "var(--aqua-200)"
    }
  }, eyebrow), /*#__PURE__*/React.createElement("h1", {
    style: {
      font: "var(--fw-bold) var(--fs-display-2)/var(--lh-display) var(--font-display)",
      textTransform: "uppercase",
      color: "#fff",
      margin: 0,
      letterSpacing: "var(--ls-display)"
    }
  }, title), breadcrumb.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      font: "var(--type-body-sm)",
      color: "var(--text-on-dark-muted)"
    }
  }, breadcrumb.map((b, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, i > 0 && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-right",
    size: 14,
    color: "var(--aqua-500)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      color: i === breadcrumb.length - 1 ? "#fff" : "var(--text-on-dark-muted)"
    }
  }, b))))));
}
Object.assign(__ds_scope, { PageHero });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/PageHero.jsx", error: String((e && e.message) || e) }); }

// components/navigation/SiteFooter.jsx
try { (() => {
const SERVICES = ["Hold Cleaning", "Tank Cleaning", "Underwater Hull Cleaning", "Hydroblasting", "Painting"];
function SiteFooter({
  services = SERVICES,
  style
}) {
  const col = {
    display: "flex",
    flexDirection: "column",
    gap: 12
  };
  const head = {
    font: "var(--fw-semibold) var(--fs-body)/1 var(--font-body)",
    letterSpacing: "var(--ls-label)",
    textTransform: "uppercase",
    color: "#fff",
    marginBottom: 8
  };
  const link = {
    color: "var(--text-on-dark-muted)",
    textDecoration: "none",
    font: "var(--type-body-sm)"
  };
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: "var(--surface-darker)",
      color: "var(--text-on-dark-muted)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--page-max)",
      margin: "0 auto",
      padding: "64px var(--page-pad) 40px",
      display: "grid",
      gridTemplateColumns: "1.4fr 1fr 1.2fr 1fr",
      gap: 48
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: col
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "anchor",
    size: 24,
    color: "var(--aqua-500)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--fw-bold) 26px/1 var(--font-display)",
      textTransform: "uppercase",
      letterSpacing: "0.04em",
      color: "#fff"
    }
  }, "Cleanship")), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--fw-semibold) var(--fs-h4)/1.3 var(--font-display)",
      color: "#fff",
      textTransform: "uppercase"
    }
  }, "We are Cleanship!"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: "var(--type-body-sm)",
      margin: 0
    }
  }, "Marine Cleaning You Can Trust"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-label)",
      letterSpacing: "var(--ls-label)",
      textTransform: "uppercase",
      color: "var(--aqua-200)",
      marginBottom: 10
    }
  }, "Follow us:"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10
    }
  }, ["linkedin", "facebook", "instagram", "youtube"].map(s => /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    key: s,
    icon: s,
    label: s,
    variant: "onDark",
    size: 38
  }))))), /*#__PURE__*/React.createElement("div", {
    style: col
  }, /*#__PURE__*/React.createElement("div", {
    style: head
  }, "Services"), services.map(s => /*#__PURE__*/React.createElement("a", {
    key: s,
    href: "#services",
    style: link
  }, s))), /*#__PURE__*/React.createElement("div", {
    style: col
  }, /*#__PURE__*/React.createElement("div", {
    style: head
  }, "Official info:"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-body-sm)"
    }
  }, "B.C. 1302955, Ajman Free Zone C1 Building, UAE"), /*#__PURE__*/React.createElement("a", {
    href: "tel:+971554029954",
    style: link
  }, "+971 - 554029954"), /*#__PURE__*/React.createElement("a", {
    href: "tel:+919236520609",
    style: link
  }, "+91 - 9236520609"), /*#__PURE__*/React.createElement("a", {
    href: "mailto:ops@cleanship.co",
    style: link
  }, "ops@cleanship.co")), /*#__PURE__*/React.createElement("div", {
    style: col
  }, /*#__PURE__*/React.createElement("div", {
    style: head
  }, "Open hours:"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-body-sm)"
    }
  }, "Mon \u2013 Sun: 24 Hours"))), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: "1px solid var(--border-on-dark)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--page-max)",
      margin: "0 auto",
      padding: "20px var(--page-pad)",
      font: "var(--type-body-sm)",
      fontSize: "var(--fs-caption)",
      textAlign: "center"
    }
  }, "\xA9 All rights reserved by Cleanship Marine Services FZE")));
}
Object.assign(__ds_scope, { SiteFooter });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/SiteFooter.jsx", error: String((e && e.message) || e) }); }

// components/navigation/SiteHeader.jsx
try { (() => {
const NAV = ["Home", "Services", "Project", "About Us", "Contact Us"];

/** CleanShip has no supplied logo mark — the wordmark is set in type (see readme). */
function SiteHeader({
  items = NAV,
  active = "Home",
  onNavigate,
  ctaLabel = "Get a quote",
  tone = "light",
  style
}) {
  const dark = tone === "dark";
  return /*#__PURE__*/React.createElement("header", {
    style: {
      background: dark ? "var(--navy-800)" : "var(--white)",
      borderBottom: "1px solid " + (dark ? "var(--border-on-dark)" : "var(--border-default)"),
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--page-max)",
      margin: "0 auto",
      padding: "0 var(--page-pad)",
      height: 78,
      display: "flex",
      alignItems: "center",
      gap: 40
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      onNavigate && onNavigate("Home");
    },
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      textDecoration: "none"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "anchor",
    size: 26,
    color: "var(--aqua-500)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--fw-bold) 28px/1 var(--font-display)",
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      color: dark ? "#fff" : "var(--navy-800)"
    }
  }, "Clean", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--blue-500)"
    }
  }, "ship"))), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: "flex",
      gap: 30,
      marginLeft: "auto"
    }
  }, items.map(it => {
    const on = it === active;
    return /*#__PURE__*/React.createElement("a", {
      key: it,
      href: "#" + it.toLowerCase().replace(/\s+/g, "-"),
      onClick: e => {
        e.preventDefault();
        onNavigate && onNavigate(it);
      },
      style: {
        position: "relative",
        padding: "8px 0",
        textDecoration: "none",
        font: "var(--fw-semibold) var(--fs-body-sm)/1 var(--font-body)",
        letterSpacing: "var(--ls-label)",
        textTransform: "uppercase",
        color: on ? dark ? "var(--aqua-200)" : "var(--blue-600)" : dark ? "rgba(255,255,255,.8)" : "var(--text-body)"
      }
    }, it, /*#__PURE__*/React.createElement("span", {
      style: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 2,
        background: on ? "var(--aqua-500)" : "transparent"
      }
    }));
  })), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: dark ? "onDark" : "primary",
    size: "md",
    iconRight: /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: "arrow-right",
      size: 15
    })
  }, ctaLabel)));
}
Object.assign(__ds_scope, { SiteHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/SiteHeader.jsx", error: String((e && e.message) || e) }); }

// components/navigation/UtilityBar.jsx
try { (() => {
function UtilityBar({
  welcome = "Welcome to our Cleanship Marine Services!",
  phone = "+971 - 554029954",
  email = "ops@cleanship.co",
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--navy-900)",
      color: "var(--text-on-dark-muted)",
      font: "var(--type-body-sm)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--page-max)",
      margin: "0 auto",
      padding: "0 var(--page-pad)",
      height: 44,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "waves",
    size: 15,
    color: "var(--aqua-500)"
  }), welcome), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 26
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "tel:" + phone.replace(/[^+\d]/g, ""),
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      color: "#fff",
      textDecoration: "none"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "phone-call",
    size: 14,
    color: "var(--aqua-500)"
  }), "Call for help: ", phone), /*#__PURE__*/React.createElement("a", {
    href: "mailto:" + email,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      color: "#fff",
      textDecoration: "none"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "mail",
    size: 14,
    color: "var(--aqua-500)"
  }), "Mail to us: ", email))));
}
Object.assign(__ds_scope, { UtilityBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/UtilityBar.jsx", error: String((e && e.message) || e) }); }

// slides/Slides.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  Icon,
  StatCounter,
  CheckList,
  PhotoFrame,
  Badge
} = window.CS_DS;
const wordmark = light => /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    alignItems: "center",
    gap: 10
  }
}, /*#__PURE__*/React.createElement(Icon, {
  name: "anchor",
  size: 26,
  color: "var(--aqua-500)"
}), /*#__PURE__*/React.createElement("span", {
  style: {
    font: "var(--fw-bold) 26px/1 var(--font-display)",
    textTransform: "uppercase",
    letterSpacing: ".04em",
    color: light ? "#fff" : "var(--navy-800)"
  }
}, "Clean", /*#__PURE__*/React.createElement("span", {
  style: {
    color: light ? "var(--aqua-500)" : "var(--blue-500)"
  }
}, "ship")));
function Stage({
  children,
  bg = "var(--white)"
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1280,
      height: 720,
      background: bg,
      position: "relative",
      overflow: "hidden",
      fontFamily: "var(--font-body)"
    }
  }, children);
}
function Footline({
  label,
  page,
  light
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 56,
      right: 56,
      bottom: 30,
      display: "flex",
      justifyContent: "space-between",
      font: "var(--type-mono)",
      color: light ? "rgba(255,255,255,.6)" : "var(--text-faint)",
      textTransform: "uppercase",
      letterSpacing: "var(--ls-label)"
    }
  }, /*#__PURE__*/React.createElement("span", null, label), /*#__PURE__*/React.createElement("span", null, page));
}

/* 1 — Cover: navy left plate, full-bleed vessel photo right */
function CoverSlide() {
  return /*#__PURE__*/React.createElement(Stage, {
    bg: "var(--navy-800)"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      display: "grid",
      gridTemplateColumns: "1fr 1fr"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "56px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between"
    }
  }, wordmark(true), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 60,
      height: 3,
      background: "var(--aqua-500)",
      marginBottom: 26
    }
  }), /*#__PURE__*/React.createElement("h1", {
    style: {
      font: "var(--fw-bold) 76px/1.02 var(--font-display)",
      textTransform: "uppercase",
      color: "#fff",
      margin: 0,
      letterSpacing: ".01em"
    }
  }, "Company", /*#__PURE__*/React.createElement("br", null), "Introduction"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: "var(--type-body-lg)",
      color: "var(--text-on-dark-muted)",
      marginTop: 22,
      maxWidth: 420
    }
  }, "Cleanship Marine Services & Solutions \u2014 hold, tank and hull cleaning you can trust.")), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-body-sm)",
      color: "var(--text-on-dark-muted)",
      lineHeight: 1.8
    }
  }, "B.C. 1302955, Ajman Free Zone C1 Building, UAE", /*#__PURE__*/React.createElement("br", null), "+971 - 554029954 \xB7 ops@cleanship.co")), /*#__PURE__*/React.createElement(PhotoFrame, {
    slotId: "slide-cover",
    scrim: "none",
    placeholder: "Drop a vessel photo",
    style: {
      aspectRatio: "auto",
      height: "100%",
      borderRadius: 0
    }
  })));
}

/* 2 — Contents: photo band above, numbered index below */
function ContentsSlide() {
  const items = window.CS_DATA.services;
  return /*#__PURE__*/React.createElement(Stage, null, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 330,
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement(PhotoFrame, {
    slotId: "slide-contents",
    scrim: "flat",
    placeholder: "Drop an aerial vessel photo",
    style: {
      aspectRatio: "auto",
      height: "100%",
      borderRadius: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 56,
      top: 40
    }
  }, wordmark(true)), /*#__PURE__*/React.createElement("h2", {
    style: {
      position: "absolute",
      left: 56,
      bottom: 40,
      font: "var(--fw-bold) 54px/1.04 var(--font-display)",
      textTransform: "uppercase",
      color: "#fff",
      margin: 0
    }
  }, "Cleanship", /*#__PURE__*/React.createElement("br", null), "Marine Services")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "44px 56px 0",
      display: "flex",
      gap: 40,
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "0 0 auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--fw-bold) 34px/1 var(--font-display)",
      textTransform: "uppercase",
      color: "var(--navy-800)"
    }
  }, "Contents"), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 46,
      height: 3,
      background: "var(--aqua-500)",
      marginTop: 12
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4,1fr)",
      gap: "26px 32px",
      flex: 1
    }
  }, items.map(s => /*#__PURE__*/React.createElement("div", {
    key: s.index,
    style: {
      borderTop: "1px solid var(--border-default)",
      paddingTop: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--fw-bold) 22px/1 var(--font-display)",
      color: "var(--blue-500)"
    }
  }, s.index), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--fw-semibold) 17px/1.3 var(--font-body)",
      color: "var(--text-strong)",
      marginTop: 8
    }
  }, s.title))))), /*#__PURE__*/React.createElement(Footline, {
    label: "Cleanship Marine Services FZE",
    page: "02"
  }));
}

/* 3 — Service spread: navy title band, copy column, photo grid */
function ServiceSpreadSlide() {
  return /*#__PURE__*/React.createElement(Stage, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      height: "100%"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--navy-800)",
      padding: "40px 56px 34px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-eyebrow)",
      letterSpacing: "var(--ls-eyebrow)",
      textTransform: "uppercase",
      color: "var(--aqua-200)",
      marginBottom: 12
    }
  }, "Service 01"), /*#__PURE__*/React.createElement("h2", {
    style: {
      font: "var(--fw-bold) 46px/1.04 var(--font-display)",
      textTransform: "uppercase",
      color: "#fff",
      margin: 0
    }
  }, "Hold Cleaning")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "34px 56px",
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      font: "var(--type-body)",
      color: "var(--text-muted)"
    }
  }, "Professional cargo hold cleaning service ensures residue-free holds, cargo readiness, safety compliance, and efficient vessel turnaround."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "20px 28px",
      marginTop: 26
    }
  }, [["Scope", "Sweeping, washing, lime-washing and hold drying on bulk carriers, tankers and container ships."], ["Compliance", "IMO and MARPOL procedures; enclosed-space entry permits and gas-free certification."], ["Method", "Eco-friendly chemicals with advanced high-pressure equipment."], ["Turnaround", "Riding crews work in transit — cargo-ready on arrival."]].map(([t, b]) => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      borderTop: "var(--rule-accent-w) solid var(--aqua-500)",
      paddingTop: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--fw-semibold) var(--fs-caption)/1 var(--font-body)",
      letterSpacing: "var(--ls-label)",
      textTransform: "uppercase",
      color: "var(--blue-600)",
      marginBottom: 8
    }
  }, t), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-body-sm)",
      color: "var(--text-muted)"
    }
  }, b))))), /*#__PURE__*/React.createElement(Footline, {
    label: "Hold Cleaning",
    page: "03"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--paper)",
      padding: 28,
      display: "grid",
      gridTemplateRows: "1.4fr 1fr",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(PhotoFrame, {
    slotId: "slide-svc-a",
    placeholder: "Hold before cleaning",
    style: {
      aspectRatio: "auto",
      borderRadius: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(PhotoFrame, {
    slotId: "slide-svc-b",
    placeholder: "Crew at work",
    style: {
      aspectRatio: "auto",
      borderRadius: 0
    }
  }), /*#__PURE__*/React.createElement(PhotoFrame, {
    slotId: "slide-svc-c",
    placeholder: "Hold after cleaning",
    style: {
      aspectRatio: "auto",
      borderRadius: 0
    }
  })))));
}

/* 4 — Stats / credentials on navy */
function StatsSlide() {
  return /*#__PURE__*/React.createElement(Stage, {
    bg: "var(--navy-900)"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "56px",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between"
    }
  }, wordmark(true), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-eyebrow)",
      letterSpacing: "var(--ls-eyebrow)",
      textTransform: "uppercase",
      color: "var(--aqua-200)",
      marginBottom: 14
    }
  }, "About Cleanship"), /*#__PURE__*/React.createElement("h2", {
    style: {
      font: "var(--fw-bold) 52px/1.05 var(--font-display)",
      textTransform: "uppercase",
      color: "#fff",
      margin: "0 0 40px",
      maxWidth: 760
    }
  }, "Why will you choose our services?"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(6,1fr)",
      gap: 24,
      borderTop: "1px solid var(--border-on-dark)",
      paddingTop: 34
    }
  }, window.CS_DATA.stats.map(s => /*#__PURE__*/React.createElement(StatCounter, _extends({
    key: s.label
  }, s, {
    tone: "dark"
  }))))), /*#__PURE__*/React.createElement(CheckList, {
    tone: "dark",
    columns: 3,
    items: ["Experienced marine cleaning professionals", "IMO & port-compliant procedures", "Eco-friendly cleaning solutions"]
  }), /*#__PURE__*/React.createElement(Footline, {
    label: "Credentials",
    page: "04",
    light: true
  })));
}

/* 5 — Closing / contact */
function ClosingSlide() {
  return /*#__PURE__*/React.createElement(Stage, {
    bg: "var(--navy-800)"
  }, /*#__PURE__*/React.createElement(PhotoFrame, {
    slotId: "slide-closing",
    scrim: "bottom",
    placeholder: "Drop a horizon photo",
    style: {
      position: "absolute",
      inset: 0,
      aspectRatio: "auto",
      borderRadius: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      padding: 56,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between"
    }
  }, wordmark(true), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      font: "var(--fw-bold) 64px/1.03 var(--font-display)",
      textTransform: "uppercase",
      color: "#fff",
      margin: 0
    }
  }, "We always ready", /*#__PURE__*/React.createElement("br", null), "to serve you."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 56,
      marginTop: 34,
      font: "var(--type-body)",
      color: "#fff"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-label)",
      letterSpacing: "var(--ls-label)",
      textTransform: "uppercase",
      color: "var(--aqua-200)",
      marginBottom: 8
    }
  }, "Phone"), "+971 - 554029954", /*#__PURE__*/React.createElement("br", null), "+91 - 9236520609"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-label)",
      letterSpacing: "var(--ls-label)",
      textTransform: "uppercase",
      color: "var(--aqua-200)",
      marginBottom: 8
    }
  }, "Mail"), "ops@cleanship.co"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-label)",
      letterSpacing: "var(--ls-label)",
      textTransform: "uppercase",
      color: "var(--aqua-200)",
      marginBottom: 8
    }
  }, "Office"), "B.C. 1302955, Ajman Free Zone", /*#__PURE__*/React.createElement("br", null), "C1 Building, UAE"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-label)",
      letterSpacing: "var(--ls-label)",
      textTransform: "uppercase",
      color: "var(--aqua-200)",
      marginBottom: 8
    }
  }, "Hours"), "Mon \u2013 Sun: 24 Hours")))));
}
Object.assign(window, {
  Stage,
  CoverSlide,
  ContentsSlide,
  ServiceSpreadSlide,
  StatsSlide,
  ClosingSlide
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "slides/Slides.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/About.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  PageHero,
  SectionHeading,
  CheckList,
  StatCounter,
  PhotoFrame,
  Card,
  Icon,
  CtaBanner
} = window.CS_DS;
function AboutPage({
  onNavigate
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(PageHero, {
    title: "About Us",
    eyebrow: "We are Cleanship!",
    breadcrumb: ["Home", "About Us"],
    slotId: "web-hero-about"
  }), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "var(--section-y) 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "cs-container",
    style: {
      display: "grid",
      gridTemplateColumns: "1.05fr 1fr",
      gap: 64,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "About Cleanship",
    title: "Why will you choose our services?"
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      font: "var(--type-body)",
      color: "var(--text-muted)",
      margin: "18px 0 0"
    }
  }, "Cleanship is a trusted Hold & Tank Cleaning Service Provider, offering professional cleaning for cargo holds on all types of ships, including bulk carriers, tankers, and container ships."), /*#__PURE__*/React.createElement("p", {
    style: {
      font: "var(--type-body)",
      color: "var(--text-muted)"
    }
  }, "Our eco-friendly methods and advanced tools thoroughly remove dirt, residues, and contaminants. We strictly follow international safety and environmental standards, ensuring your vessel remains compliant and ready for operations."), /*#__PURE__*/React.createElement(CheckList, {
    style: {
      marginTop: 22
    },
    items: ["Experienced marine cleaning professionals", "IMO & port-compliant procedures", "Eco-friendly cleaning solutions"]
  })), /*#__PURE__*/React.createElement(PhotoFrame, {
    slotId: "web-about-page",
    ratio: "4 / 3",
    placeholder: "Riding crew at work"
  }))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--surface-dark)",
      padding: "var(--section-y-tight) 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "cs-container",
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(6,1fr)",
      gap: 24
    }
  }, window.CS_DATA.stats.map(s => /*#__PURE__*/React.createElement(StatCounter, _extends({
    key: s.label
  }, s, {
    tone: "dark",
    align: "center"
  }))))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "var(--section-y) 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "cs-container"
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "How we work",
    title: "From enquiry to cargo-ready hold",
    align: "center",
    style: {
      marginBottom: 44
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4,1fr)",
      gap: "var(--gutter)"
    }
  }, [["01", "Enquiry", "Vessel, port, cargo history and dates."], ["02", "Survey & method", "Condition survey and written method statement."], ["03", "Mobilise", "Riding crew and equipment on board."], ["04", "Handover", "Inspection, photos and compliance report."]].map(([n, t, b]) => /*#__PURE__*/React.createElement(Card, {
    key: n,
    pad: "26px",
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--fw-bold) 34px/1 var(--font-display)",
      color: "var(--blue-100)",
      display: "block",
      marginBottom: 10
    }
  }, n), /*#__PURE__*/React.createElement("h3", {
    style: {
      font: "var(--type-h4)",
      margin: "0 0 8px"
    }
  }, t), /*#__PURE__*/React.createElement("p", {
    style: {
      font: "var(--type-body-sm)",
      color: "var(--text-muted)",
      margin: 0
    }
  }, b)))))), /*#__PURE__*/React.createElement("div", {
    className: "cs-container",
    style: {
      paddingBottom: "var(--section-y)"
    }
  }, /*#__PURE__*/React.createElement(CtaBanner, {
    eyebrow: "We are Cleanship!",
    title: "Marine Cleaning You Can Trust",
    body: "B.C. 1302955, Ajman Free Zone C1 Building, UAE",
    primaryLabel: "Contact us"
  })));
}
Object.assign(window, {
  AboutPage
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/About.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/App.jsx
try { (() => {
const {
  UtilityBar,
  SiteHeader,
  SiteFooter
} = window.CS_DS;
function App() {
  const [page, setPage] = React.useState("Home");
  const go = p => {
    setPage(p);
    window.scrollTo({
      top: 0
    });
  };
  const Body = {
    Home,
    Services: ServicesPage,
    "About Us": AboutPage,
    "Contact Us": ContactPage,
    Project: ServicesPage
  }[page] || Home;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(UtilityBar, null), /*#__PURE__*/React.createElement(SiteHeader, {
    active: page,
    onNavigate: go,
    ctaLabel: "Get a quote"
  }), /*#__PURE__*/React.createElement(Body, {
    onNavigate: go
  }), /*#__PURE__*/React.createElement(SiteFooter, null));
}
ReactDOM.createRoot(document.getElementById("root")).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/App.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Contact.jsx
try { (() => {
const {
  PageHero,
  SectionHeading,
  ContactDetail,
  Input,
  Select,
  Textarea,
  Checkbox,
  Button,
  Card,
  Icon,
  PhotoFrame
} = window.CS_DS;
function ContactPage() {
  const [sent, setSent] = React.useState(false);
  const [ok, setOk] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(PageHero, {
    title: "Contact Us",
    eyebrow: "Cleanship Marine Services",
    breadcrumb: ["Home", "Contact Us"],
    slotId: "web-hero-contact",
    height: 280
  }), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "var(--section-y) 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "cs-container"
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "Contact Us",
    title: "Feel free to contact with us for any kind of query.",
    intro: "Our team is ready to assist you with all your marine service needs. Reach out to us through any of the following channels.",
    align: "center",
    style: {
      marginBottom: 48
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1.15fr",
      gap: 48,
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 22
    }
  }, window.CS_DATA.contact.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.label,
    style: {
      background: "var(--surface-tint)",
      border: "1px solid var(--blue-100)",
      padding: 22
    }
  }, /*#__PURE__*/React.createElement(ContactDetail, c)))), /*#__PURE__*/React.createElement(Card, {
    pad: "32px",
    accentRule: true
  }, sent ? /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      padding: "48px 0"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 40,
    color: "var(--success-600)",
    style: {
      margin: "0 auto 16px"
    }
  }), /*#__PURE__*/React.createElement("h3", {
    style: {
      font: "var(--type-h3)",
      margin: "0 0 8px"
    }
  }, "Enquiry received"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: "var(--type-body)",
      color: "var(--text-muted)"
    }
  }, "We reply within the working day, Mon\u2013Sat."), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    onClick: () => setSent(false)
  }, "Send another")) : /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      setSent(true);
    },
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "18px 20px"
    }
  }, /*#__PURE__*/React.createElement(Input, {
    id: "c-name",
    label: "Full name",
    placeholder: "Capt. A. Rahman",
    required: true
  }), /*#__PURE__*/React.createElement(Input, {
    id: "c-company",
    label: "Company",
    placeholder: "Fleet or agency"
  }), /*#__PURE__*/React.createElement(Input, {
    id: "c-mail",
    label: "Mail address",
    placeholder: "ops@yourfleet.com",
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "mail",
      size: 16
    }),
    required: true
  }), /*#__PURE__*/React.createElement(Input, {
    id: "c-phone",
    label: "Phone",
    placeholder: "+971 \u2026",
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "phone-call",
      size: 16
    })
  }), /*#__PURE__*/React.createElement(Select, {
    id: "c-service",
    label: "Service required",
    placeholder: "Select a service",
    options: window.CS_DATA.services.map(s => s.title)
  }), /*#__PURE__*/React.createElement(Input, {
    id: "c-port",
    label: "Port / anchorage",
    placeholder: "Khor Fakkan"
  }), /*#__PURE__*/React.createElement(Textarea, {
    id: "c-msg",
    label: "Your enquiry",
    rows: 5,
    placeholder: "Vessel, cargo history, dates, scope of work\u2026",
    style: {
      gridColumn: "1 / -1"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: "1 / -1",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 20,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement(Checkbox, {
    checked: ok,
    onChange: e => setOk(e.target.checked),
    label: "Send me port compliance updates"
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    iconRight: /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-right",
      size: 16
    })
  }, "Send enquiry"))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      paddingBottom: "var(--section-y)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "cs-container"
  }, /*#__PURE__*/React.createElement(PhotoFrame, {
    slotId: "web-map",
    ratio: "21 / 9",
    placeholder: "Drop a map of Ajman Free Zone C1 Building"
  }))));
}
Object.assign(window, {
  ContactPage
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Contact.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Home.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  UtilityBar,
  SiteHeader,
  SiteFooter,
  SectionHeading,
  Button,
  Icon,
  ServiceCard,
  StatCounter,
  CheckList,
  ContactDetail,
  CtaBanner,
  PhotoFrame,
  Card,
  Badge
} = window.CS_DS;
function Hero({
  onNavigate
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: "relative",
      height: 620,
      background: "var(--navy-800)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement(PhotoFrame, {
    slotId: "web-hero",
    scrim: "left",
    placeholder: "Drop a full-bleed vessel photo",
    style: {
      position: "absolute",
      inset: 0,
      aspectRatio: "auto",
      borderRadius: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "cs-container",
    style: {
      position: "relative",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      gap: 22
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      font: "var(--type-eyebrow)",
      letterSpacing: "var(--ls-eyebrow)",
      textTransform: "uppercase",
      color: "var(--aqua-200)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 30,
      height: 1,
      background: "var(--aqua-500)"
    }
  }), "Cleanship Marine Services & Solutions"), /*#__PURE__*/React.createElement("h1", {
    style: {
      font: "var(--fw-bold) var(--fs-display-1)/var(--lh-display) var(--font-display)",
      textTransform: "uppercase",
      color: "#fff",
      margin: 0,
      maxWidth: 820,
      letterSpacing: "var(--ls-display)"
    }
  }, "Marine cleaning", /*#__PURE__*/React.createElement("br", null), "you can trust"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: "var(--type-body-lg)",
      color: "var(--text-on-dark-muted)",
      maxWidth: 560,
      margin: 0
    }
  }, "Hold, tank and underwater hull cleaning for bulk carriers, tankers and container ships \u2014 IMO and port compliant, Mon\u2013Sun, 24 hours."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 14,
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    iconRight: /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-right",
      size: 16
    }),
    onClick: () => onNavigate("Contact Us")
  }, "Request a quote"), /*#__PURE__*/React.createElement(Button, {
    variant: "onDarkOutline",
    size: "lg",
    onClick: () => onNavigate("Services")
  }, "Our services"))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      background: "rgba(6,32,58,.82)",
      borderTop: "var(--rule-accent-w) solid var(--aqua-500)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "cs-container",
    style: {
      display: "flex",
      justifyContent: "space-between",
      padding: "18px var(--page-pad)",
      flexWrap: "wrap",
      gap: 16
    }
  }, ["Experienced marine cleaning professionals", "IMO & port-compliant procedures", "Eco-friendly cleaning solutions"].map(t => /*#__PURE__*/React.createElement("span", {
    key: t,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      color: "#fff",
      font: "var(--type-body-sm)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "shield-check",
    size: 18,
    color: "var(--aqua-500)"
  }), t)))));
}
function ServicesSection({
  onNavigate,
  limit = 8
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "var(--section-y) 0",
      background: "var(--surface-page)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "cs-container"
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "Our Services",
    title: "Comprehensive Marine Solutions",
    align: "center",
    intro: "Eight core disciplines, delivered by riding crews across UAE and Indian ports.",
    style: {
      marginBottom: 48
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4,1fr)",
      gap: "var(--gutter)"
    }
  }, window.CS_DATA.services.slice(0, limit).map(s => /*#__PURE__*/React.createElement(ServiceCard, {
    key: s.index,
    index: s.index,
    title: s.title,
    icon: s.icon,
    slotId: "web-svc-" + s.index,
    description: s.teaser,
    onClick: e => {
      e.preventDefault();
      onNavigate("Services");
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 18,
      marginTop: 44
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-body-lg)",
      color: "var(--text-muted)"
    }
  }, "We always ready to serve you."), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    onClick: () => onNavigate("Services"),
    iconRight: /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-right",
      size: 15
    })
  }, "View more services"))));
}
function AboutSection({
  onNavigate
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "var(--section-y) 0",
      background: "var(--surface-subtle)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "cs-container",
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1.05fr",
      gap: 64,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(PhotoFrame, {
    slotId: "web-about-1",
    ratio: "3 / 4",
    placeholder: "Hold cleaning service"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(PhotoFrame, {
    slotId: "web-about-2",
    ratio: "4 / 3",
    placeholder: "Riding crew"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--navy-800)",
      padding: "22px 20px"
    }
  }, /*#__PURE__*/React.createElement(StatCounter, {
    value: 5,
    label: "Years Experiences",
    tone: "dark"
  })))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "About Cleanship",
    title: "Why will you choose our services?"
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      font: "var(--type-body)",
      color: "var(--text-muted)",
      margin: "18px 0 0"
    }
  }, "Cleanship is a trusted Hold & Tank Cleaning Service Provider, offering professional cleaning for cargo holds on all types of ships, including bulk carriers, tankers, and container ships."), /*#__PURE__*/React.createElement("p", {
    style: {
      font: "var(--type-body)",
      color: "var(--text-muted)"
    }
  }, "Our eco-friendly methods and advanced tools thoroughly remove dirt, residues, and contaminants. We strictly follow international safety and environmental standards, ensuring your vessel remains compliant and ready for operations."), /*#__PURE__*/React.createElement(CheckList, {
    style: {
      margin: "22px 0 30px"
    },
    items: ["Experienced marine cleaning professionals", "IMO & port-compliant procedures", "Eco-friendly cleaning solutions"]
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "navy",
    onClick: () => onNavigate("About Us"),
    iconRight: /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-right",
      size: 15
    })
  }, "More about us"))));
}
function StatsBand() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--surface-dark)",
      padding: "var(--section-y-tight) 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "cs-container",
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(6,1fr)",
      gap: 24
    }
  }, window.CS_DATA.stats.map(s => /*#__PURE__*/React.createElement(StatCounter, _extends({
    key: s.label
  }, s, {
    tone: "dark",
    align: "center"
  })))));
}
function BlogTeaser() {
  const posts = [{
    tag: "Compliance",
    title: "What port state control checks after a hold cleaning",
    date: "12 Jun 2026"
  }, {
    tag: "Hull",
    title: "Fuel savings from a clean hull: what the data shows",
    date: "28 May 2026"
  }, {
    tag: "Safety",
    title: "Enclosed space entry: our tank cleaning protocol",
    date: "09 May 2026"
  }];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "var(--section-y) 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "cs-container"
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "Latest Blog",
    title: "Cleanship Marine Services & Solutions",
    align: "center",
    style: {
      marginBottom: 44
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3,1fr)",
      gap: "var(--gutter)"
    }
  }, posts.map((p, i) => /*#__PURE__*/React.createElement(Card, {
    key: p.title,
    interactive: true,
    pad: "0",
    style: {
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement(PhotoFrame, {
    slotId: "web-blog-" + i,
    ratio: "16 / 9",
    placeholder: p.tag,
    style: {
      borderRadius: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 22
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "brand"
  }, p.tag), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-body-sm)",
      color: "var(--text-faint)"
    }
  }, p.date)), /*#__PURE__*/React.createElement("h3", {
    style: {
      font: "var(--type-h4)",
      margin: 0
    }
  }, p.title)))))));
}
function ContactStrip() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "var(--section-y-tight) 0 var(--section-y)",
      background: "var(--surface-tint)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "cs-container"
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "Contact Us",
    title: "Feel free to contact with us for any kind of query.",
    intro: "Our team is ready to assist you with all your marine service needs. Reach out to us through any of the following channels.",
    align: "center",
    style: {
      marginBottom: 44
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4,1fr)",
      gap: "var(--gutter)"
    }
  }, window.CS_DATA.contact.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.label,
    style: {
      background: "var(--white)",
      border: "1px solid var(--blue-100)",
      padding: 24
    }
  }, /*#__PURE__*/React.createElement(ContactDetail, c))))));
}
function Home({
  onNavigate
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Hero, {
    onNavigate: onNavigate
  }), /*#__PURE__*/React.createElement(ServicesSection, {
    onNavigate: onNavigate
  }), /*#__PURE__*/React.createElement(AboutSection, {
    onNavigate: onNavigate
  }), /*#__PURE__*/React.createElement(StatsBand, null), /*#__PURE__*/React.createElement(BlogTeaser, null), /*#__PURE__*/React.createElement(ContactStrip, null), /*#__PURE__*/React.createElement("div", {
    className: "cs-container",
    style: {
      paddingBottom: "var(--section-y)"
    }
  }, /*#__PURE__*/React.createElement(CtaBanner, {
    eyebrow: "We are Cleanship!",
    title: "We always ready to serve you.",
    body: "Marine cleaning you can trust \u2014 Mon \u2013 Sun, 24 hours.",
    primaryLabel: "Contact us",
    secondaryLabel: "Call +971 - 554029954"
  })));
}
Object.assign(window, {
  Home,
  Hero,
  ServicesSection,
  AboutSection,
  StatsBand,
  BlogTeaser,
  ContactStrip
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Home.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Services.jsx
try { (() => {
const {
  PageHero,
  SectionHeading,
  ServiceCard,
  Tag,
  CtaBanner,
  Card,
  Icon,
  CheckList,
  Button
} = window.CS_DS;
function ServicesPage({
  onNavigate
}) {
  const [filter, setFilter] = React.useState("All services");
  const groups = {
    "All services": null,
    "Cleaning": ["01", "02", "03", "04", "07"],
    "Surface": ["05", "06"],
    "Offshore": ["08"]
  };
  const list = window.CS_DATA.services.filter(s => !groups[filter] || groups[filter].includes(s.index));
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(PageHero, {
    title: "Our Services",
    eyebrow: "Cleanship Marine Services",
    breadcrumb: ["Home", "Services"],
    slotId: "web-hero-services"
  }), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "var(--section-y) 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "cs-container"
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "Our Services",
    title: "Comprehensive Marine Solutions",
    intro: "Select a discipline to see scope, method and compliance notes.",
    style: {
      marginBottom: 30
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      marginBottom: 36,
      flexWrap: "wrap"
    }
  }, Object.keys(groups).map(g => /*#__PURE__*/React.createElement(Tag, {
    key: g,
    active: g === filter,
    onClick: () => setFilter(g)
  }, g))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4,1fr)",
      gap: "var(--gutter)"
    }
  }, list.map(s => /*#__PURE__*/React.createElement(ServiceCard, {
    key: s.index,
    index: s.index,
    title: s.title,
    icon: s.icon,
    description: s.description,
    slotId: "web-svcpage-" + s.index,
    onClick: e => {
      e.preventDefault();
      onNavigate("Contact Us");
    }
  }))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--surface-subtle)",
      padding: "var(--section-y-tight) 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "cs-container",
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3,1fr)",
      gap: "var(--gutter)"
    }
  }, [["clipboard-check", "Scope & survey", "Pre-cleaning survey, hold condition report and a written method statement before crews mobilise."], ["shield-check", "Compliance", "IMO, MARPOL and port-authority procedures, with enclosed-space entry permits and gas-free certification."], ["ship", "Turnaround", "Riding crews work in transit so the vessel is cargo-ready on arrival — no idle days alongside."]].map(([ic, t, b]) => /*#__PURE__*/React.createElement(Card, {
    key: t,
    accentRule: true,
    pad: "28px"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: ic,
    size: 30,
    color: "var(--blue-600)",
    style: {
      marginBottom: 16
    }
  }), /*#__PURE__*/React.createElement("h3", {
    style: {
      font: "var(--type-h4)",
      margin: "0 0 10px"
    }
  }, t), /*#__PURE__*/React.createElement("p", {
    style: {
      font: "var(--type-body-sm)",
      color: "var(--text-muted)",
      margin: 0
    }
  }, b))))), /*#__PURE__*/React.createElement("div", {
    className: "cs-container",
    style: {
      padding: "var(--section-y) 0"
    }
  }, /*#__PURE__*/React.createElement(CtaBanner, {
    title: "Need a scope and price for your next port call?",
    body: "Send vessel details and we respond within the working day.",
    primaryLabel: "Contact us",
    primaryHref: "#contact"
  })));
}
Object.assign(window, {
  ServicesPage
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Services.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/data.js
try { (() => {
window.CS_DATA = {
  services: [{
    index: "01",
    title: "Hold Cleaning",
    icon: "container",
    teaser: "Professional cargo hold cleaning service ensures residue-free…",
    description: "Professional cargo hold cleaning service ensures residue-free holds, cargo readiness, safety compliance, and efficient vessel turnaround."
  }, {
    index: "02",
    title: "Tank Cleaning",
    icon: "fuel",
    teaser: "Professional tank cleaning service ensuring safety, compliance,…",
    description: "Professional tank cleaning service ensuring safety, compliance, efficiency, and residue-free cargo tanks."
  }, {
    index: "03",
    title: "Hull Cleaning",
    icon: "waves",
    teaser: "Professional underwater hull cleaning removes marine growth,…",
    description: "Professional underwater hull cleaning removes marine growth, improves fuel efficiency, enhances vessel performance, and reduces operational costs safely."
  }, {
    index: "04",
    title: "Demucking",
    icon: "shovel",
    teaser: "Professional demucking service by CleanShip ensures clean,…",
    description: "Professional demucking service by CleanShip ensures clean, safe, and efficient marine operations."
  }, {
    index: "05",
    title: "Hydroblasting",
    icon: "droplets",
    teaser: "High-pressure hydroblasting services by CleanShip for safe,…",
    description: "High-pressure hydroblasting services by CleanShip for safe, efficient marine cleaning."
  }, {
    index: "06",
    title: "Painting",
    icon: "paintbrush",
    teaser: "Professional marine painting services by CleanShip ensuring…",
    description: "Professional marine painting services by CleanShip ensuring durability, protection, and quality."
  }, {
    index: "07",
    title: "Shore Tank Cleaning",
    icon: "warehouse",
    teaser: "CleanShip provides professional shore tank cleaning ensuring…",
    description: "CleanShip provides professional shore tank cleaning ensuring safety, efficiency, and environmental compliance."
  }, {
    index: "08",
    title: "Off Shore Vessels",
    icon: "ship",
    teaser: "CleanShip provides professional offshore vessel cleaning services…",
    description: "CleanShip provides professional offshore vessel cleaning services ensuring safety, efficiency, and compliance."
  }],
  stats: [{
    value: 5,
    label: "Years Experiences",
    icon: "award"
  }, {
    value: 300,
    label: "Clients",
    icon: "users"
  }, {
    value: 100,
    label: "Project Done",
    icon: "clipboard-check"
  }, {
    value: 400,
    label: "Happy Clients",
    icon: "smile"
  }, {
    value: 3,
    label: "Award Winner",
    icon: "trophy"
  }, {
    value: 10,
    label: "Team Member",
    icon: "hard-hat"
  }],
  contact: [{
    icon: "phone-call",
    label: "Phone Number:",
    lines: ["+971 - 554029954", "+91 - 9236520609"]
  }, {
    icon: "map-pin",
    label: "Office Address:",
    lines: ["B.C. 1302955, Ajman Free Zone C1 Building UAE"]
  }, {
    icon: "mail",
    label: "Mail Address:",
    lines: ["ops@cleanship.co"]
  }, {
    icon: "clock",
    label: "Opening time:",
    lines: ["10.00 am - 06.00 pm", "(Monday-Saturday)"]
  }]
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/data.js", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.SectionHeading = __ds_scope.SectionHeading;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Field = __ds_scope.Field;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Textarea = __ds_scope.Textarea;

__ds_ns.CheckList = __ds_scope.CheckList;

__ds_ns.ContactDetail = __ds_scope.ContactDetail;

__ds_ns.CtaBanner = __ds_scope.CtaBanner;

__ds_ns.PhotoFrame = __ds_scope.PhotoFrame;

__ds_ns.ServiceCard = __ds_scope.ServiceCard;

__ds_ns.StatCounter = __ds_scope.StatCounter;

__ds_ns.PageHero = __ds_scope.PageHero;

__ds_ns.SiteFooter = __ds_scope.SiteFooter;

__ds_ns.SiteHeader = __ds_scope.SiteHeader;

__ds_ns.UtilityBar = __ds_scope.UtilityBar;

})();
