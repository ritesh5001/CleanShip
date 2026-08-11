import { PinIcon } from "./icons";
import { StaggerGroup } from "./motion/scroll-reveal";
import { offices, type Office } from "@/lib/site";

const REGIONS = ["Middle East", "South Asia", "West Africa"] as const;

/**
 * Offices grid, grouped by region.
 *
 * Grouped rather than listed flat because eight addresses read as noise in a
 * single column — a superintendent scanning for "do they have anyone near my
 * vessel" is looking for a region first, a city second. The head office is
 * marked so the registered entity is still identifiable.
 */
export function LocationsGrid({ onNavy = false }: { onNavy?: boolean }) {
  const grouped = REGIONS.map((region) => ({
    region,
    items: offices.filter((o) => o.region === region),
  })).filter((g) => g.items.length > 0);

  return (
    <StaggerGroup className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {grouped.map(({ region, items }) => (
        <div key={region} data-stagger>
          <h3
            className={`label-caps flex items-center gap-2.5 border-b pb-3 text-[12px] ${
              onNavy
                ? "border-white/16 text-aqua-200"
                : "border-line-200 text-blue-600"
            }`}
          >
            <PinIcon className="size-4" />
            {region}
          </h3>

          <ul className="mt-5 space-y-5">
            {items.map((office) => (
              <li key={`${office.city}-${office.country}`}>
                <OfficeEntry office={office} onNavy={onNavy} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </StaggerGroup>
  );
}

function OfficeEntry({
  office,
  onNavy,
}: {
  office: Office;
  onNavy: boolean;
}) {
  return (
    <div>
      <p
        className={`font-display text-[18px] font-semibold uppercase leading-tight ${
          onNavy ? "text-white" : "text-ink-900"
        }`}
      >
        {office.city}
        {office.head && (
          <span
            className={`label-caps ml-2.5 align-middle px-2 py-0.5 text-[10px] ${
              onNavy
                ? "bg-aqua-500 text-abyss-950"
                : "bg-blue-600 text-white"
            }`}
          >
            Head office
          </span>
        )}
      </p>
      {office.street && (
        <p
          className={`mt-1 text-[14px] leading-[1.55] ${
            onNavy ? "text-white/70" : "text-slate-500"
          }`}
        >
          {office.street}
        </p>
      )}
      <p
        className={`mt-0.5 text-[14px] ${
          onNavy ? "text-white/60" : "text-slate-500"
        }`}
      >
        {office.country}
      </p>
    </div>
  );
}

/**
 * Coverage note for a single service or service line.
 *
 * Coverage genuinely differs per scope — hull cleaning runs the West Africa
 * range while riding crews go anywhere — so stating it on the service page is
 * more useful than one company-wide claim, and it stops a West Africa
 * operator assuming hull cleaning is a UAE-only service.
 */
export function CoverageNote({
  areas,
  worldwide = false,
  onNavy = false,
  className = "",
}: {
  areas: readonly string[];
  worldwide?: boolean;
  onNavy?: boolean;
  className?: string;
}) {
  if (!worldwide && areas.length === 0) return null;

  return (
    <div
      className={`rule-accent-left border-y border-r p-5 ${
        onNavy
          ? "border-white/16 bg-white/[0.06]"
          : "border-line-200 bg-blue-50"
      } ${className}`}
    >
      <h3
        className={`label-caps text-[11px] ${
          onNavy ? "text-aqua-200" : "text-blue-600"
        }`}
      >
        Where we deliver this
      </h3>

      {worldwide ? (
        <p
          className={`mt-2.5 text-[15px] leading-[1.6] ${
            onNavy ? "text-white/80" : "text-ink-700"
          }`}
        >
          <strong className={onNavy ? "text-white" : "text-ink-900"}>
            Worldwide.
          </strong>{" "}
          Crews join the vessel wherever the fixture takes it.
        </p>
      ) : (
        <ul className="mt-3 flex flex-wrap gap-2">
          {areas.map((area) => (
            <li
              key={area}
              className={`border px-2.5 py-1 text-[13px] ${
                onNavy
                  ? "border-white/20 text-white/80"
                  : "border-blue-200 bg-white text-ink-700"
              }`}
            >
              {area}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
