/**
 * Numbered service tile — the core content unit of the CleanShip site (services 01–08).
 * @startingPoint section="Marine" subtitle="Numbered service tile with photo" viewport="700x400"
 */
export interface ServiceCardProps {
  /** Two-digit index string, e.g. "01". */
  index: string;
  title: string;
  /** One or two sentences, sentence case, no trailing period drama. */
  description: string;
  /** Lucide icon name for the corner badge. */
  icon?: string;
  /** Real photo URL; omit for a droppable slot. */
  image?: string;
  slotId?: string;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}
export declare function ServiceCard(props: ServiceCardProps): JSX.Element;
