export interface SpinnerSegment {
  id: string;
  label: string;
  value: string;
  color?: string;
}

export interface SpinnerProps {
  segments: SpinnerSegment[];
  duration?: number;
  primaryColor?: string;
  secondaryColor?: string;
  isSpinning?: boolean;
  onSpinEnd?: (winner: SpinnerSegment) => void;
  className?: string;
  showWinner?: boolean;
}

export interface SpinnerStyles {
  wheelSize?: string;
  borderWidth?: string;
  fontSize?: string;
  primaryColor?: string;
  secondaryColor?: string;
  textColor?: string;
  backgroundColor?: string;
}
