import type { SVGProps } from "react";
import type { IconKey } from "@/lib/services";

type IconProps = SVGProps<SVGSVGElement>;

/* DS iconography: Lucide-style geometry, stroke 1.75, round caps and joins,
   never filled, never multicolour. */
const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
};

/** Anchor — the wordmark glyph. */
export function AnchorIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="5" r="2.5" />
      <path d="M12 7.5V21" />
      <path d="M7.5 11h9" />
      <path d="M20 16.5A8 8 0 0 1 12 21a8 8 0 0 1-8-4.5" />
    </svg>
  );
}

/** Cargo hold — an open hatch with a hold beneath. */
export function HoldIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 8.5 12 4l9 4.5" />
      <path d="M5 10.5v7.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7.5" />
      <path d="M9 19v-5h6v5" />
      <path d="M12 4v3" />
    </svg>
  );
}

/** Tank — a cylindrical vessel with a fluid level. */
export function TankIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <ellipse cx="12" cy="6" rx="7" ry="2.5" />
      <path d="M5 6v12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5V6" />
      <path d="M5 13c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5" />
    </svg>
  );
}

/** Hull — a ship's hull above a waterline. */
export function HullIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 13h18l-2.2 4.2a2 2 0 0 1-1.8 1.1H7a2 2 0 0 1-1.8-1.1Z" />
      <path d="M6 13V7h9l3 6" />
      <path d="M2 21c1.5 0 1.5-1.2 3-1.2S6.5 21 8 21s1.5-1.2 3-1.2S12.5 21 14 21s1.5-1.2 3-1.2S18.5 21 20 21" />
    </svg>
  );
}

/** Offshore — a platform on legs above the sea. */
export function OffshoreIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 11h16" />
      <path d="M6 11v7M18 11v7M9 11l-2 7M15 11l2 7" />
      <path d="M12 11V4M9.5 7 12 4l2.5 3" />
      <path d="M2 21c1.6 0 1.6-1.2 3.2-1.2S6.8 21 8.4 21s1.6-1.2 3.2-1.2S13.2 21 14.8 21s1.6-1.2 3.2-1.2S19.6 21 21.2 21" />
    </svg>
  );
}

/** NDT — a magnifier over a weld seam. */
export function NdtIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="m15 15 5 5" />
      <path d="M7.5 10.5h6" />
      <path d="m9 8.5 1.5 2 1.5-2" />
    </svg>
  );
}

const iconMap: Record<IconKey, (p: IconProps) => React.ReactElement> = {
  hold: HoldIcon,
  tank: TankIcon,
  hull: HullIcon,
  offshore: OffshoreIcon,
  ndt: NdtIcon,
};

export function CategoryIcon({
  name,
  ...props
}: IconProps & { name: IconKey }) {
  const Component = iconMap[name];
  return <Component {...props} />;
}

/* ------------------------------------------------------------------ */
/* UI icons                                                            */
/* ------------------------------------------------------------------ */

export function ArrowIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...base} strokeWidth={2} {...props}>
      <path d="m4.5 12.5 5 5 10-11" />
    </svg>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6.6 3h-2A1.6 1.6 0 0 0 3 4.7C3 13.1 10.9 21 19.3 21a1.6 1.6 0 0 0 1.7-1.6v-2a1.2 1.2 0 0 0-1-1.2l-3-.6a1.2 1.2 0 0 0-1.2.5l-.9 1.2a13 13 0 0 1-5.2-5.2l1.2-.9a1.2 1.2 0 0 0 .5-1.2l-.6-3a1.2 1.2 0 0 0-1.2-1Z" />
    </svg>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="2.5" y="5" width="19" height="14" rx="2" />
      <path d="m3 7 8.2 5.6a1.5 1.5 0 0 0 1.6 0L21 7" />
    </svg>
  );
}

export function PinIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 21c4-4.4 7-7.6 7-11a7 7 0 1 0-14 0c0 3.4 3 6.6 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.2l3.2 2" />
    </svg>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3 5 6v6c0 4.2 2.9 7.6 7 9 4.1-1.4 7-4.8 7-9V6Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function GlobeIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z" />
    </svg>
  );
}

export function LeafIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 20c0-8 5-14 16-15 0 10-5 15-12 15H4Z" />
      <path d="M8 16c2-4 5-6.5 9-8" />
    </svg>
  );
}

export function ClipboardIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="5" y="4.5" width="14" height="16" rx="2" />
      <path d="M9 4.5V3.8A1.3 1.3 0 0 1 10.3 2.5h3.4A1.3 1.3 0 0 1 15 3.8v.7" />
      <path d="M9 11h6M9 15h4" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...base} strokeWidth={1.8} {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...base} strokeWidth={1.8} {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function ChevronIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function WhatsAppIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12.04 2A9.9 9.9 0 0 0 2.1 11.9a9.8 9.8 0 0 0 1.36 5L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01A9.9 9.9 0 0 0 22 11.94 9.9 9.9 0 0 0 12.04 2Zm0 18.1a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.2 8.2 0 1 1 6.97 3.86Zm4.5-6.14c-.25-.13-1.46-.72-1.68-.8-.23-.08-.39-.13-.56.12s-.64.8-.79.97c-.14.16-.29.18-.54.06a6.7 6.7 0 0 1-3.35-2.93c-.25-.43.25-.4.72-1.33.08-.17.04-.31-.02-.44s-.56-1.35-.77-1.84c-.2-.48-.4-.42-.56-.43h-.47a.9.9 0 0 0-.66.31 2.76 2.76 0 0 0-.86 2.05 4.8 4.8 0 0 0 1 2.54 10.9 10.9 0 0 0 4.2 3.71c1.55.67 2.16.73 2.94.61.47-.07 1.46-.6 1.66-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.29Z" />
    </svg>
  );
}

export function LinkedInIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3zM9 9h3.8v1.7h.05a4.2 4.2 0 0 1 3.78-2.07c4.04 0 4.79 2.66 4.79 6.12V21h-4v-5.5c0-1.31-.02-3-1.83-3-1.83 0-2.11 1.43-2.11 2.9V21H9Z" />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2.2c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23C2.21 15.58 2.2 15.2 2.2 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.21 8.8 2.2 12 2.2Zm0 5.1a4.7 4.7 0 1 0 0 9.4 4.7 4.7 0 0 0 0-9.4Zm0 7.75a3.05 3.05 0 1 1 0-6.1 3.05 3.05 0 0 1 0 6.1Zm5.99-7.94a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0Z" />
    </svg>
  );
}

export function YouTubeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.51A3.02 3.02 0 0 0 .5 6.2C0 8.09 0 12 0 12s0 3.91.5 5.8a3.02 3.02 0 0 0 2.12 2.14c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3.02 3.02 0 0 0 2.12-2.14c.5-1.89.5-5.8.5-5.8s0-3.91-.5-5.8ZM9.55 15.57V8.43L15.82 12l-6.27 3.57Z" />
    </svg>
  );
}

export function FacebookIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.45 2.89h-2.33v6.99A10 10 0 0 0 22 12Z" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Operational icons                                                   */
/*                                                                     */
/* Same contract as everything above: 24x24 box, stroke 1.75, round     */
/* caps and joins, never filled, never multicolour. Added for the       */
/* underwater hull cleaning landing page, but deliberately generic —    */
/* nothing here is page-specific.                                       */
/* ------------------------------------------------------------------ */

/** Gauge — speed and performance restored. */
export function GaugeIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3.5 17a8.5 8.5 0 1 1 17 0" />
      <path d="m12 17 4.2-4.6" />
      <circle cx="12" cy="17" r="1.3" />
    </svg>
  );
}

/** Fuel drop with a downward arrow — consumption coming down. */
export function FuelDropIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3.5c3.4 3.6 5.5 6.2 5.5 9a5.5 5.5 0 0 1-11 0c0-2.8 2.1-5.4 5.5-9Z" />
      <path d="M12 9.5v5" />
      <path d="m9.8 12.3 2.2 2.2 2.2-2.2" />
    </svg>
  );
}

/**
 * Propeller — one blade drawn once and rotated twice about the hub, so the
 * three are identical by construction rather than by eye.
 */
export function PropellerIcon(props: IconProps) {
  const blade = "M10.6 10.9C9.8 8 10.2 5.6 12 3.8c1.8 1.8 2.2 4.2 1.4 7.1";
  return (
    <svg {...base} {...props}>
      <path d={blade} />
      <path d={blade} transform="rotate(120 12 12)" />
      <path d={blade} transform="rotate(240 12 12)" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

/** Scrubbing brush — the brush-cart and hand-cleaning scopes. */
export function BrushIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="9" width="17" height="4.5" rx="1.5" />
      <path d="M7 13.5V17M12 13.5V18M17 13.5V17" />
      <path d="M12 9V6.5A2.5 2.5 0 0 1 14.5 4H16" />
    </svg>
  );
}

/** Video camera — the underwater video record issued with every job. */
export function VideoIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="2.5" y="6" width="13" height="12" rx="2" />
      <path d="m15.5 10.5 5-2.8v8.6l-5-2.8Z" />
    </svg>
  );
}

/** Certificate — class approval and survey documentation. */
export function CertificateIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M19 12.5V5a1.5 1.5 0 0 0-1.5-1.5h-11A1.5 1.5 0 0 0 5 5v14a1.5 1.5 0 0 0 1.5 1.5H11" />
      <path d="M8.5 8h7M8.5 11.5h4.5" />
      <circle cx="16.5" cy="16" r="3" />
      <path d="M14.6 18.4 14 21.5l2.5-1.3 2.5 1.3-.6-3.1" />
    </svg>
  );
}

export function CalendarIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M3.5 9.5h17M8 3.5v3M16 3.5v3" />
    </svg>
  );
}

/** Vessel — a laden hull, distinct from the `hull` category glyph. */
export function VesselIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M2.5 14.5h19l-2 5a1.5 1.5 0 0 1-1.4.9H5.9a1.5 1.5 0 0 1-1.4-.9Z" />
      <path d="M5 14.5V10h11l2 4.5" />
      <path d="M8 10V6.5h5V10" />
    </svg>
  );
}

/** Dive helmet — the commercial dive team. */
export function DiverIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 11.5a6 6 0 0 1 12 0c0 3.2-2.7 5.8-6 5.8s-6-2.6-6-5.8Z" />
      <circle cx="12" cy="11.5" r="2.4" />
      <rect x="6.5" y="18.8" width="11" height="2.7" rx="1" />
    </svg>
  );
}

/** Waves — the waterline, used for in-water / afloat working. */
export function WavesIcon(props: IconProps) {
  const wave =
    "M2 7c1.7 0 1.7-1.5 3.3-1.5S7 7 8.7 7s1.7-1.5 3.3-1.5S13.7 7 15.3 7s1.7-1.5 3.3-1.5S20.3 7 22 7";
  return (
    <svg {...base} {...props}>
      <path d={wave} />
      <path d={wave} transform="translate(0 5.5)" />
      <path d={wave} transform="translate(0 11)" />
    </svg>
  );
}

/** Falling line — cost and consumption trending down. */
export function TrendDownIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m3 7 5.5 5.5L12 9l9 9" />
      <path d="M21 12v6h-6" />
    </svg>
  );
}

/** Crew. */
export function UsersIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3 19.5a6 6 0 0 1 12 0" />
      <path d="M16 5.2a3.2 3.2 0 0 1 0 5.6" />
      <path d="M17.5 14.2a6 6 0 0 1 3.5 5.3" />
    </svg>
  );
}

/** Wrench — equipment and method. */
export function WrenchIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94Z" />
    </svg>
  );
}

/**
 * Thruster tunnel — the bore in section with thrust running through it.
 *
 * Drawn side-on rather than end-on: the end-on view needs a hub, three blades
 * and a tunnel wall inside a 24px box, and at the 22px these render at it
 * collapses into a smudge.
 */
export function ThrusterIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="2.5" y="8" width="19" height="8" rx="4" />
      <path d="M6 12h8" />
      <path d="m11.5 9.5 3 2.5-3 2.5" />
      <path d="M18 9.5v5" />
    </svg>
  );
}
