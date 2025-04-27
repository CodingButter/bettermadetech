/**
 * Represents a single segment in the spinner wheel.
 * Each segment corresponds to one slice of the wheel.
 */
export interface SpinnerSegment {
  /** Unique identifier for the segment */
  id: string;
  /** Display text for the segment */
  label: string;
  /** Underlying value associated with the segment */
  value: string;
  /** Optional custom color for the segment (overrides primaryColor/secondaryColor) */
  color?: string;
}

/**
 * Props for the Spinner component.
 */
export interface SpinnerProps {
  /** Array of segments to display on the spinner */
  segments: SpinnerSegment[];
  /** Animation duration in seconds */
  duration?: number;
  /** Primary color for odd-indexed segments */
  primaryColor?: string;
  /** Secondary color for even-indexed segments */
  secondaryColor?: string;
  /** Controls if the spinner is currently spinning */
  isSpinning?: boolean;
  /** Callback triggered when spinning stops, provides the winning segment */
  onSpinEnd?: (winner: SpinnerSegment) => void;
  /** Additional CSS class names */
  className?: string;
  /** Whether to show a winner overlay when spinning stops */
  showWinner?: boolean;
}

/**
 * Additional styling options for customizing spinner appearance.
 * Used in the 3D spinner and other advanced spinner variants.
 */
export interface SpinnerStyles {
  /** Size of the spinner wheel (CSS dimension) */
  wheelSize?: string;
  /** Width of the spinner border (CSS dimension) */
  borderWidth?: string;
  /** Font size for segment labels (CSS dimension) */
  fontSize?: string;
  /** Primary color for odd-indexed segments */
  primaryColor?: string;
  /** Secondary color for even-indexed segments */
  secondaryColor?: string;
  /** Color for segment text labels */
  textColor?: string;
  /** Background color for the entire spinner */
  backgroundColor?: string;
}
