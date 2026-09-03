/** Thin navy strip above the header: welcome line + phone + email. */
export interface UtilityBarProps {
  welcome?: string;
  phone?: string;
  email?: string;
  style?: React.CSSProperties;
}
export declare function UtilityBar(props: UtilityBarProps): JSX.Element;
