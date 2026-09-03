import { WhatsAppIcon } from "./icons";
import { siteConfig } from "@/lib/site";

/**
 * WhatsApp deep link, pre-filled with an enquiry message.
 *
 * WhatsApp is the default channel for ship agents and superintendents in the
 * Gulf, so this is a primary conversion path rather than a social link. It
 * opens in a new tab because it hands off to the WhatsApp app or web client.
 */

const VARIANTS = {
  /** WhatsApp brand green — the one place a non-palette colour is warranted,
      because the button is recognised by its colour, not its wording. */
  brand:
    "bg-[#25D366] text-[#04361a] hover:bg-[#1fbb57] border border-transparent",
  /** On navy surfaces where green would fight the brand palette. */
  onNavy:
    "border border-white/40 text-white hover:border-aqua-500 hover:bg-white/10",
  /** On light surfaces, sitting beside a primary blue button. */
  outline:
    "border border-line-200 text-ink-900 hover:border-blue-400 hover:bg-blue-50",
} as const;

export function WhatsAppCta({
  label = "WhatsApp us",
  variant = "brand",
  className = "",
}: {
  label?: string;
  variant?: keyof typeof VARIANTS;
  className?: string;
}) {
  return (
    <a
      href={siteConfig.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`label-caps inline-flex h-11 items-center justify-center gap-2.5 px-6 transition-colors duration-[140ms] ${VARIANTS[variant]} ${className}`}
    >
      <WhatsAppIcon className="size-[18px]" />
      {label}
    </a>
  );
}

/**
 * Persistent floating WhatsApp button.
 *
 * Sits above the fold on every page at the bottom-right, clear of the mobile
 * safe area. Deliberately not a chat widget — no script, no iframe, no
 * third-party JS. It is one anchor tag, so it costs nothing on any Core Web
 * Vital.
 */
export function WhatsAppFloat() {
  return (
    <a
      href={siteConfig.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Message Cleanship on WhatsApp"
      /* Marks the element so globals.css can hide it on CleanTrack screens,
         where it sits on top of the status grid. */
      data-site-chrome=""
      className="fixed bottom-5 right-5 z-50 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-[#04361a] shadow-[0_6px_20px_rgba(6,32,58,.28)] transition-transform duration-[140ms] hover:scale-105 focus-visible:scale-105 sm:bottom-7 sm:right-7"
      style={{
        marginBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <WhatsAppIcon className="size-7" />
    </a>
  );
}
