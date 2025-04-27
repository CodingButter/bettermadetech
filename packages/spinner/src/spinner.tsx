/**
 * Spinner component that allows for random selection from a set of options.
 * 
 * This component renders a wheel with customizable segments that can be spun
 * to randomly select a winner. The spinning animation is controlled via props
 * and provides callbacks when the selection is complete.
 * 
 * @component
 */
import { useState, useRef, useEffect, memo, useCallback, useMemo } from 'react';
import { SpinnerProps, SpinnerSegment } from './types';
import { useSpinner } from './spinner-context';
import { cubicBezier, getHardwareAccelerationStyles, measurePerformance } from './utils';

/**
 * Spinner wheel component with configurable segments and animation.
 * Uses memoization for optimized performance.
 * 
 * @param {SpinnerProps} props - Component props
 * @returns {JSX.Element} - Rendered spinner component
 */
export const Spinner = memo(function Spinner({
  segments,
  duration = 5,
  primaryColor = '#4f46e5',
  secondaryColor = '#f97316',
  isSpinning = false,
  onSpinEnd,
  className,
  showWinner = false,
}: SpinnerProps) {
  const wheelRef = useRef<HTMLDivElement>(null);
  // Use React.useState for better performance
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState<SpinnerSegment | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Use a ref for values that don't need to trigger re-renders
  const animationRef = useRef({
    animationFrameId: 0,
    timeoutId: 0,
    isActive: false
  });

  // Calculate the rotation angle for each segment - memoize this calculation
  const segmentAngle = useCallback(() => 360 / segments.length, [segments.length])();
  
  // Handle cleanup on unmount
  useEffect(() => {
    return () => {
      // Cancel any pending animations when component unmounts
      if (animationRef.current.timeoutId) {
        clearTimeout(animationRef.current.timeoutId);
      }
      if (animationRef.current.animationFrameId) {
        cancelAnimationFrame(animationRef.current.animationFrameId);
      }
    };
  }, []);
  
  // Reset animation state when isSpinning becomes false
  useEffect(() => {
    if (!isSpinning) {
      setIsAnimating(false);
    }
  }, [isSpinning]);

  // Start spinning animation when isSpinning becomes true
  useEffect(() => {
    if (isSpinning && !isAnimating) {
      const cleanupFn = spin();
      return () => {
        if (cleanupFn) cleanupFn();
      };
    }
  }, [isSpinning, isAnimating, spin]);

  /**
   * Initiates the spinning animation and selects a random winner.
   * The spinning effect is created by applying a CSS rotation transform
   * with appropriate timing functions.
   * Optimized with requestAnimationFrame and useCallback.
   */
  const spin = useCallback(() => {
    if (isAnimating || animationRef.current.isActive) return;
    
    // Mark as active in the ref to prevent multiple calls
    animationRef.current.isActive = true;
    setIsAnimating(true);
    setWinner(null);
    
    // Calculate random rotations:
    // 1. Select a random segment as winner
    // 2. Calculate angle to that segment
    // 3. Add 3-10 full rotations for dramatic effect
    const randomSegment = Math.floor(Math.random() * segments.length);
    const segmentRotation = 360 - (randomSegment * segmentAngle);
    const fullRotations = 3 + Math.floor(Math.random() * 7) * 360;
    const targetRotation = rotation + fullRotations + segmentRotation;
    
    // Set start time for animation
    const startTime = performance.now();
    const endTime = startTime + (duration * 1000);
    
    // Use requestAnimationFrame for smoother animation
    const animateWheelSpin = (timestamp: number) => {
      // Animation complete
      if (timestamp >= endTime) {
        // Set final position
        setRotation(targetRotation);
        
        // Announce winner with requestAnimationFrame for smoother UI update
        animationRef.current.animationFrameId = requestAnimationFrame(() => {
          const winningSegment = segments[randomSegment];
          if (winningSegment) {
            setWinner(winningSegment);
            setIsAnimating(false);
            animationRef.current.isActive = false;
            if (onSpinEnd) {
              onSpinEnd(winningSegment);
            }
          }
        });
        return;
      }
      
      // Calculate current progress (0 to 1)
      const progress = (timestamp - startTime) / (duration * 1000);
      // Apply easing function for more realistic wheel spin (cubic bezier approximation)
      const easedProgress = cubicBezier(0.1, 0.7, 0.1, 1, progress);
      // Calculate current rotation
      const currentRotation = rotation + (targetRotation - rotation) * easedProgress;
      
      // Update rotation state
      setRotation(currentRotation);
      
      // Continue animation
      animationRef.current.animationFrameId = requestAnimationFrame(animateWheelSpin);
    };
    
    // Start animation with initial frame
    animationRef.current.animationFrameId = requestAnimationFrame(animateWheelSpin);
    
    // Clean up function to handle component unmounting during animation
    return () => {
      if (animationRef.current.animationFrameId) {
        cancelAnimationFrame(animationRef.current.animationFrameId);
      }
      animationRef.current.isActive = false;
    };
  }, [segments, segmentAngle, rotation, duration, isAnimating, onSpinEnd]);
  
  // Use the imported cubicBezier function from utils

  // Memoize segments list for better performance
  const renderedSegments = useCallback(() => {
    return segments.map((segment, index) => {
      const startAngle = index * segmentAngle;
      const isEvenSegment = index % 2 === 0;
      
      return (
        <SpinnerSegmentComponent
          key={segment.id}
          segment={segment}
          startAngle={startAngle}
          segmentAngle={segmentAngle}
          isEvenSegment={isEvenSegment}
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
        />
      );
    });
  }, [segments, segmentAngle, primaryColor, secondaryColor]);
  
  // Memoize winner overlay to prevent unnecessary re-renders
  const winnerOverlay = useMemo(() => {
    const isWinnerVisible = showWinner && winner && !isAnimating;
    
    return (
      <div 
        className={`absolute inset-0 flex items-center justify-center bg-black rounded-full transition-opacity duration-300 ${
          isWinnerVisible ? 'opacity-70' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!isWinnerVisible}
      >
        <div className={`text-center p-4 transition-transform duration-300 ${
          isWinnerVisible ? 'scale-100' : 'scale-0'
        }`}>
          <div className="text-xl font-bold text-white mb-1">Winner!</div>
          {winner && (
            <>
              <div className="text-2xl font-bold text-primary">{winner.label}</div>
              <div className="text-sm text-white mt-1">{winner.value}</div>
            </>
          )}
        </div>
      </div>
    );
  }, [winner, showWinner, isAnimating]);

  // Determine current state for accessibility
  const spinnerStatus = isAnimating ? 'spinning' : (winner ? 'complete' : 'ready');
  const spinnerStatusText = isAnimating 
    ? 'Spinner is currently spinning' 
    : (winner ? `Winner selected: ${winner.label}` : 'Spinner ready to spin');

  return (
    <div 
      className={className ? `relative ${className}` : 'relative'}
      role="region"
      aria-label="Spinner wheel"
      aria-live={isAnimating ? 'assertive' : 'polite'}
    >
      {/* The main wheel container with hardware acceleration */}
      <div
        ref={wheelRef}
        className="relative w-full aspect-square rounded-full overflow-hidden border-4 will-change-transform"
        style={{
          transform: `rotate(${rotation}deg) translateZ(0)`,
          transition: isAnimating ? `transform ${duration}s cubic-bezier(0.1, 0.7, 0.1, 1)` : 'none',
          backgroundColor: primaryColor,
          borderColor: secondaryColor,
          backfaceVisibility: 'hidden', // Additional GPU acceleration
          perspective: 1000, // Helps with GPU acceleration
        }}
        role="img"
        aria-label={`Spinner wheel with ${segments.length} options`}
        aria-hidden={isAnimating} // Hide from screen readers during animation
      >
        {/* Render pre-computed segments */}
        {renderedSegments()}
      </div>
      
      {/* The center point/indicator arrow */}
      <div 
        className="absolute top-1/2 left-1/2 w-4 h-4 transform -translate-x-1/2 -translate-y-1/2 rotate-45 z-10"
        style={{ backgroundColor: secondaryColor }}
        aria-hidden="true" // Hide from screen readers
      />
      
      {/* Visually hidden text for screen readers */}
      <div className="sr-only" aria-live="assertive">
        {spinnerStatusText}
      </div>
      
      {/* Pre-computed winner overlay */}
      {winnerOverlay}
    </div>
  );
});

/**
 * Spinner component that uses the SpinnerContext.
 * This is a convenience wrapper that doesn't require passing props directly.
 * Optimized with memoization and useMemo for better performance.
 */
export const ContextSpinner = memo(function ContextSpinner() {
  // Get spinner data from context
  const { spinnerSettings, activeSpinnerId } = useSpinner();
  
  // Find the active spinner settings with useMemo for better performance
  const activeSetting = useMemo(() => {
    if (!spinnerSettings || !activeSpinnerId) return null;
    return spinnerSettings.find(s => s.id === activeSpinnerId) || null;
  }, [spinnerSettings, activeSpinnerId]);
  
  // Early return for missing configuration
  if (!activeSetting) {
    const message = !spinnerSettings || !activeSpinnerId 
      ? 'No active spinner configured' 
      : 'Selected spinner not found';
    
    return (
      <div className="p-4 text-center text-gray-700 border rounded">
        {message}
      </div>
    );
  }
  
  // Memoize spinner properties for better performance
  const spinnerProps = useMemo(() => ({
    segments: activeSetting.segments,
    duration: activeSetting.duration,
    primaryColor: activeSetting.primaryColor,
    secondaryColor: activeSetting.secondaryColor,
    showWinner: true
  }), [
    activeSetting.segments,
    activeSetting.duration,
    activeSetting.primaryColor,
    activeSetting.secondaryColor
  ]);
  
  // Render the optimized spinner
  return <Spinner {...spinnerProps} />;
});

/**
 * Memoized spinner segment component for better performance
 */
interface SpinnerSegmentProps {
  segment: SpinnerSegment;
  startAngle: number;
  segmentAngle: number;
  isEvenSegment: boolean;
  primaryColor: string;
  secondaryColor: string;
}

const SpinnerSegmentComponent = memo(function SpinnerSegmentComponent({
  segment,
  startAngle,
  segmentAngle,
  isEvenSegment,
  primaryColor,
  secondaryColor
}: SpinnerSegmentProps) {
  // Pre-compute segment styles for better performance
  const segmentStyle = useMemo(() => ({
    transform: `rotate(${startAngle}deg)`,
    backgroundColor: segment.color || (isEvenSegment ? primaryColor : secondaryColor),
    clipPath: `polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)`,
    willChange: 'transform',
    // Additional hardware acceleration
    backfaceVisibility: 'hidden' as const,
    transformZ: 0,  
  }), [startAngle, segment.color, isEvenSegment, primaryColor, secondaryColor]);

  // Pre-compute label styles
  const labelStyle = useMemo(() => ({
    left: '75%',
    top: '50%',
    transform: `translateY(-50%) rotate(${90 + segmentAngle / 2}deg)`,
    maxWidth: '60px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  }), [segmentAngle]);

  return (
    <div
      className="absolute top-0 left-0 w-full h-full text-white flex justify-center"
      style={segmentStyle}
    >
      {/* Segment label positioned in the middle of each segment */}
      <div 
        className="absolute transform -translate-x-1/2 text-sm font-medium"
        style={labelStyle}
      >
        {segment.label}
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function to optimize re-renders
  // Only re-render if something important changes
  return (
    prevProps.segment.id === nextProps.segment.id &&
    prevProps.segment.label === nextProps.segment.label &&
    prevProps.startAngle === nextProps.startAngle &&
    prevProps.segmentAngle === nextProps.segmentAngle &&
    prevProps.isEvenSegment === nextProps.isEvenSegment &&
    prevProps.primaryColor === nextProps.primaryColor &&
    prevProps.secondaryColor === nextProps.secondaryColor
  );
});