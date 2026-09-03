/** Lucide icon glyph at CleanShip's 1.75 stroke weight. */
export interface IconProps {
  /** Lucide icon name, kebab-case (e.g. "anchor", "phone-call", "ship"). */
  name: string;
  /** Pixel box. 16 inline, 20 default, 24 in cards, 32+ in feature blocks. */
  size?: number;
  strokeWidth?: number;
  /** Stroke color; defaults to currentColor. */
  color?: string;
  style?: React.CSSProperties;
}
export declare function Icon(props: IconProps): JSX.Element;
