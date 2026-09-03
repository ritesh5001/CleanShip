/** Square icon-only control: social links, carousel arrows, utility-bar actions. */
export interface IconButtonProps {
  /** Lucide icon name or a ReactNode. */
  icon: string | React.ReactNode;
  /** Accessible label (also the tooltip) — required. */
  label: string;
  variant?: "solid" | "outline" | "onDark";
  /** Square edge in px. Keep >= 44 for touch targets. */
  size?: number;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}
export declare function IconButton(props: IconButtonProps): JSX.Element;
