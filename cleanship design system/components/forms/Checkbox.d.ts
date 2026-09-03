/** Square checkbox with consent/opt-in label. */
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "style"> {
  label?: React.ReactNode;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  style?: React.CSSProperties;
}
export declare function Checkbox(props: CheckboxProps): JSX.Element;
