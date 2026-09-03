/** Image frame with the brand's navy photo scrims; falls back to a droppable <image-slot>. */
export interface PhotoFrameProps {
  /** Real image URL. Omit to render a fillable placeholder. */
  src?: string;
  alt?: string;
  /** Unique id for the placeholder slot (persists a dropped image). */
  slotId?: string;
  placeholder?: string;
  /** CSS aspect-ratio, e.g. "3 / 2", "16 / 9", "1 / 1". */
  ratio?: string;
  /** Navy overlay: bottom fade, left fade (hero text), flat wash, or none. */
  scrim?: "none" | "bottom" | "left" | "flat";
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function PhotoFrame(props: PhotoFrameProps): JSX.Element;
