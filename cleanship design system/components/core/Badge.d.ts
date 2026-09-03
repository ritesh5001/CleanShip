/** Small uppercase status/label chip. */
export interface BadgeProps {
  children?: React.ReactNode;
  tone?: "brand" | "accent" | "neutral" | "success" | "warning" | "danger" | "onDark";
  shape?: "square" | "pill";
  style?: React.CSSProperties;
}
export declare function Badge(props: BadgeProps): JSX.Element;
