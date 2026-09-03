/** Filter / category chip; selectable. */
export interface TagProps {
  children?: React.ReactNode;
  active?: boolean;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}
export declare function Tag(props: TagProps): JSX.Element;
