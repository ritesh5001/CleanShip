/** Icon + label + one or more value lines (phone, address, mail, opening hours). */
export interface ContactDetailProps {
  /** Lucide icon name: phone-call, map-pin, mail, clock. */
  icon: string;
  /** e.g. "Phone Number:" */
  label: string;
  lines: React.ReactNode[];
  tone?: "light" | "dark";
  style?: React.CSSProperties;
}
export declare function ContactDetail(props: ContactDetailProps): JSX.Element;
