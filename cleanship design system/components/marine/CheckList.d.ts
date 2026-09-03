/** Capability / compliance list with square check marks. */
export interface CheckListProps {
  items: React.ReactNode[];
  tone?: "light" | "dark";
  columns?: number;
  style?: React.CSSProperties;
}
export declare function CheckList(props: CheckListProps): JSX.Element;
