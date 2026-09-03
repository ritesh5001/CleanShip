/**
 * Full-width navy call-to-action band with an aqua edge rule.
 * @startingPoint section="Marine" subtitle="Navy CTA band with aqua edge rule" viewport="700x200"
 */
export interface CtaBannerProps {
  eyebrow?: string;
  title: string;
  body?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  style?: React.CSSProperties;
}
export declare function CtaBanner(props: CtaBannerProps): JSX.Element;
