/** Native select with brand chrome. */
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
  options?: Array<string | { value: string; label: string }>;
}
export declare function Select(props: SelectProps): JSX.Element;
