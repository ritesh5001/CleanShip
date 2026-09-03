/** Neutral surface container: 1px cool border, near-square corners, shadow only on hover. */
export interface CardProps {
  children?: React.ReactNode;
  tone?: "light" | "tint" | "dark";
  /** Adds the hover lift + shadow (use for linked cards only). */
  interactive?: boolean;
  /** CSS padding value. */
  pad?: string;
  /** 3px aqua rule across the top edge. */
  accentRule?: boolean;
  style?: React.CSSProperties;
}
export declare function Card(props: CardProps): JSX.Element;
