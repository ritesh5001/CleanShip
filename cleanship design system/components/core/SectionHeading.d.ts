/**
 * The signature CleanShip section opener: aqua-ruled eyebrow, condensed title, optional intro.
 * @startingPoint section="Core" subtitle="Eyebrow + title + intro section opener" viewport="700x260"
 */
export interface SectionHeadingProps {
  /** Short uppercase kicker, e.g. "Our Services" (rendered between two aqua rules). */
  eyebrow?: string;
  title?: string;
  intro?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
  maxWidth?: number | string;
  style?: React.CSSProperties;
}
export declare function SectionHeading(props: SectionHeadingProps): JSX.Element;
