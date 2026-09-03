/** Single-line text field with uppercase micro-label. */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  /** Small leading glyph (use <Icon size={16} />). */
  iconLeft?: React.ReactNode;
}
export declare function Input(props: InputProps): JSX.Element;
