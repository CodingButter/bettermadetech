/**
 * Spinner types and interfaces
 * 
 * This file defines the types and interfaces used throughout the spinner package.
 */

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
  /** The spinner client implementation */
  spinnerClient?: Record<string, unknown>; // This will be replaced with the actual type
  /** High contrast mode for better accessibility */
  highContrast?: boolean;
  /** Accessibility features enabled - set to false only for specific use cases */
  accessibilityEnabled?: boolean;
  /** Custom ARIA label for the spinner */
  ariaLabel?: string;
  /** Animation speed control - 1 is normal, lower value is slower */
  animationSpeed?: number;
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

/**
 * Settings configuration for spinner instances
 */
export interface SpinnerSettings {
  /** Unique identifier for these settings */
  id?: string;
  /** Name of this spinner configuration */
  name: string;
  /** Segments to display on the spinner */
  segments: SpinnerSegment[];
  /** Animation duration in seconds */
  duration: number;
  /** Primary color for odd-indexed segments */
  primaryColor: string;
  /** Secondary color for even-indexed segments */
  secondaryColor: string;
  /** Whether to show confetti on winner reveal */
  showConfetti: boolean;
  /** User ID who owns these settings */
  userId?: string;
}

/**
 * Authentication information used by spinner client implementations
 */
export interface AuthInfo {
  /** Whether the user is authenticated */
  isAuthenticated: boolean;
  /** User's email address */
  email?: string;
  /** Authentication token */
  token?: string;
  /** User ID */
  userId?: string;
}

/**
 * Result returned when loading spinner settings
 */
export interface LoadSpinnerResult {
  /** Success status */
  success: boolean;
  /** Error message if any */
  error?: string;
  /** The loaded settings */
  settings?: SpinnerSettings[];
}