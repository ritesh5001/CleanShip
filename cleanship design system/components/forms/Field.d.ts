/** Label + hint/error wrapper used by Input, Textarea and Select. */
export interface FieldProps {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  htmlFor?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Field(props: FieldProps): JSX.Element;
