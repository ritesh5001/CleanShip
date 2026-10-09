import { officesByCountry, officeTownLine } from "@/content/company";
import { site } from "@/content/site";
import { countryShort } from "@/content/labels";

export function OfficeGrid({ onNavy = false }: { onNavy?: boolean }) {
  return (
    <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
      {officesByCountry(site.officeOrder).map((group) => (
        <div key={group.country}>
          <h3 className={`label-caps text-[11px] ${onNavy ? "text-aqua-200" : "text-blue-600"}`}>
            {countryShort(group.country)}
          </h3>
          <ul className="mt-4 space-y-5">
            {group.items.map((o) => (
              <li key={o.slug} id={o.slug}>
                <address className="not-italic">
                  <p className={`text-[15px] font-semibold ${onNavy ? "text-white" : "text-ink-900"}`}>
                    {o.city}
                    {o.head && (
                      <span className="label-caps ml-2 bg-aqua-500 px-1.5 py-0.5 align-middle text-[9px] text-abyss-950">Κεντρικά γραφεία</span>
                    )}
                  </p>
                  <p className={`mt-1 text-[13px] leading-[1.55] ${onNavy ? "" : "text-slate-600"}`}>
                    {o.street && (
                      <>
                        {o.street}
                        <br />
                      </>
                    )}
                    {officeTownLine(o)}
                  </p>
                </address>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
