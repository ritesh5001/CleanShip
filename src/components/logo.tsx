import { AnchorIcon } from "./icons";

/**
 * Wordmark.
 *
 * The DS is explicit that no logo file was supplied and none has been drawn.
 * Wherever a mark belongs it sets the name in type: Barlow Condensed 700,
 * uppercase, letter-spacing .04em, "Clean" in navy-800 and "ship" in blue-500
 * (white / aqua-500 on dark), preceded by a Lucide anchor.
 *
 * Replace this component wholesale when the real logo SVG arrives.
 */
export function Logo({
  onNavy = false,
  className = "",
}: {
  onNavy?: boolean;
  className?: string;
}) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <AnchorIcon
        aria-hidden="true"
        className={`size-[26px] shrink-0 ${
          onNavy ? "text-aqua-500" : "text-blue-600"
        }`}
      />
      <span className="flex flex-col leading-none">
        <span
          className="font-display text-[26px] font-bold uppercase leading-none tracking-[0.04em]"
          style={{ letterSpacing: "0.04em" }}
        >
          <span className={onNavy ? "text-white" : "text-navy-800"}>Clean</span>
          <span className={onNavy ? "text-aqua-500" : "text-blue-500"}>
            ship
          </span>
        </span>
        <span
          className={`mt-1 text-[9px] font-semibold uppercase leading-none tracking-[0.18em] ${
            onNavy ? "text-white/60" : "text-slate-500"
          }`}
        >
          Marine Services
        </span>
      </span>
    </span>
  );
}
