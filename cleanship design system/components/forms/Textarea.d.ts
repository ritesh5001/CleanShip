/** Multi-line message field. */
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  rows?: number;
}
export declare function Textarea(props: TextareaProps): JSX.Element;
