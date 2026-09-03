/**
 * Site masthead: type-set CleanShip wordmark, uppercase nav, quote CTA.
 * @startingPoint section="Navigation" subtitle="Masthead with nav and quote CTA" viewport="1280x140"
 */
export interface SiteHeaderProps {
  /** Defaults to the real site nav: Home, Services, Project, About Us, Contact Us. */
  items?: string[];
  active?: string;
  onNavigate?: (item: string) => void;
  ctaLabel?: string;
  /** "dark" places it over navy or a photo hero. */
  tone?: "light" | "dark";
  style?: React.CSSProperties;
}
export declare function SiteHeader(props: SiteHeaderProps): JSX.Element;
