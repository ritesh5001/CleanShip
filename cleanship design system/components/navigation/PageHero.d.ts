/** Inner-page banner: full-bleed vessel photo, left navy scrim, uppercase title + breadcrumb. */
export interface PageHeroProps {
  title: string;
  /** e.g. ["Home","Services","Hold Cleaning"] */
  breadcrumb?: string[];
  eyebrow?: string;
  image?: string;
  slotId?: string;
  /** Banner height in px — 320 default, 240 for dense pages. */
  height?: number;
  style?: React.CSSProperties;
}
export declare function PageHero(props: PageHeroProps): JSX.Element;
