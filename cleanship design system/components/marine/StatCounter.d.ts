/** Big condensed number + aqua suffix + uppercase caption (years, clients, projects). */
export interface StatCounterProps {
  value: string | number;
  /** Usually "+" — set "" for exact figures. */
  suffix?: string;
  label: string;
  /** Lucide icon name above the figure. */
  icon?: string;
  tone?: "light" | "dark";
  align?: "left" | "center";
  style?: React.CSSProperties;
}
export declare function StatCounter(props: StatCounterProps): JSX.Element;
