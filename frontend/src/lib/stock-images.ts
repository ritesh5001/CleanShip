/**
 * Placeholder photography.
 *
 * ⚠️ ALL OF THIS IS TEMPORARY STOCK — replace with Cleanship's own photographs.
 *
 * Source: Unsplash (https://unsplash.com/license) — free for commercial use,
 * no attribution required. Every file was downloaded and is served from
 * `public/images`, never hot-linked, so the site has no runtime dependency on
 * an external CDN. Originals are 1600x900, q72, ~65-335KB each.
 *
 * TWO THINGS TO KNOW BEFORE LAUNCH
 *
 * 1. These show real, named third-party vessels — that is unavoidable with
 *    marine stock, since almost every photograph of a ship shows a ship
 *    somebody owns. They are used only as scrimmed hero backdrops, where the
 *    names are not legible. Do NOT move them into a context that reads as
 *    "our work" or "our clients" — that would imply a commercial relationship
 *    that does not exist.
 *
 * 2. They are illustrative of the *operation*, not records of Cleanship jobs.
 *
 * Regenerate or extend via the URLs recorded in `sourceUrl`.
 */

export type StockImage = {
  /** Path under public/. */
  src: string;
  /** Describes the operation, since these are decorative backdrops. */
  alt: string;
  /** Unsplash photo page, for licence verification and replacement. */
  sourceUrl: string;
};

const img = (slug: string, alt: string, id: string): StockImage => ({
  src: `/images/${slug}.jpg`,
  alt,
  sourceUrl: `https://unsplash.com/photos/${id}`,
});

export const stockImages = {
  bulkCarrier: img(
    "bulk-carrier-berth",
    "General cargo vessel at anchorage",
    "1552207802-77bcb0d13122",
  ),
  cargoAerial: img(
    "cargo-holds-open",
    "Aerial view of a cargo vessel at sea",
    "1613690399151-65ea69478674",
  ),
  vesselOnPassage: img(
    "vessel-on-passage",
    "Cargo vessel under way on passage",
    "1604506522146-316c8bedd874",
  ),
  crewAtWork: img(
    "crew-at-work",
    "Crew working on the deck of a cargo vessel",
    "1573014089159-8ee711dc5a8e",
  ),
  oilTanker: img(
    "oil-tanker-aerial",
    "Aerial view of a loaded oil tanker",
    "1518527989017-5baca7a58d3c",
  ),
  productTanker: img(
    "product-tanker",
    "Product tanker under way in open water",
    "1598408745613-178751e2ccde",
  ),
  shoreTerminal: img(
    "shore-terminal",
    "Shore terminal and storage tank farm",
    "1582517378602-f109b395ce40",
  ),
  offshoreVessel: img(
    "offshore-support-vessel",
    "Offshore support vessel working at sea",
    "1609337231803-2adad48ea1d1",
  ),
  offshorePlatform: img(
    "offshore-platform",
    "Offshore production platform at sea",
    "1690508313456-bf8c851e8319",
  ),
  portTerminal: img(
    "port-terminal",
    "Vessels alongside at a container terminal",
    "1578575437130-527eed3abbec",
  ),
  ndtTechnician: img(
    "ndt-technician",
    "Technician carrying out hot work on ship structure",
    "1504328345606-18bbc8c9d7d1",
  ),
  weldDetail: img(
    "weld-detail",
    "Close-up of a structural weld being made",
    "1526634140919-468dc3ae3870",
  ),
} as const;

/**
 * Hero backdrops for the services and lines that have no footage.
 * Keyed by service slug first, then category slug — same precedence as video.
 */
export const heroImageByService: Record<string, StockImage> = {
  // Hold cleaning — no footage supplied for any scope.
  "shore-gang": stockImages.crewAtWork,
  "riding-crew": stockImages.vesselOnPassage,
  "rope-access": stockImages.cargoAerial,
  // Tank cleaning — likewise.
  "oil-tanker-dpp-cpp": stockImages.oilTanker,
  demucking: stockImages.productTanker,
  "shore-tank-cleaning": stockImages.shoreTerminal,
  "offshore-vessel-tank-cleaning": stockImages.offshoreVessel,
};

export const heroImageByCategory: Record<string, StockImage> = {
  "hold-cleaning": stockImages.bulkCarrier,
  "tank-cleaning": stockImages.oilTanker,
};

export function heroImageFor(
  categorySlug: string,
  serviceSlug?: string,
): StockImage | null {
  if (serviceSlug && heroImageByService[serviceSlug]) {
    return heroImageByService[serviceSlug];
  }
  return heroImageByCategory[categorySlug] ?? null;
}
