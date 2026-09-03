/**
 * Primary CleanShip action control — squared corners, uppercase letterspaced label.
 * @startingPoint section="Core" subtitle="Buttons, sizes and on-dark variants" viewport="700x220"
 */
export interface ButtonProps {
  children?: React.ReactNode;
  /** primary = blue fill (default CTA) · navy = dark fill on light sections · secondary = outlined · ghost = bare · onDark / onDarkOutline = for navy or photo backgrounds. */
  variant?: "primary" | "navy" | "secondary" | "ghost" | "onDark" | "onDarkOutline";
  size?: "sm" | "md" | "lg";
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  disabled?: boolean;
  fullWidth?: boolean;
  /** Renders an <a> when set. */
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}
export declare function Button(props: ButtonProps): JSX.Element;
