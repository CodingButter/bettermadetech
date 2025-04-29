/**
 * Spinner component that allows for random selection from a set of options.
 * 
 * This component renders a wheel with customizable segments that can be spun
 * to randomly select a winner. The spinning animation is controlled via props
 * and provides callbacks when the selection is complete.
 * 
 * @component
 */
import { useState, useRef, useEffect, memo, useCallback, useMemo, KeyboardEvent } from 'react';
import { SpinnerProps, SpinnerSegment, AriaAnnouncements } from './types';
import { useSpinner } from './spinner-context';
import { 
  cubicBezier, 
  getHardwareAccelerationStyles, 
  safeRequestAnimationFrame, 
  safeCancelAnimationFrame,
  prefersReducedMotion,
  getAccessibleColors
} from './utils';

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
  id,
  highContrast = false,
  accessibilityEnabled = true,
  ariaLabel,
  animationSpeed = 1,
  ariaAnnouncements,
  respectReducedMotion = true,
  allowSkipAnimation = false,
  colorScheme,
  enableKeyboardControl = false,
  onSkipAnimation,
}: SpinnerProps) {
  const wheelRef = useRef<HTMLDivElement>(null);
  const skipButtonRef = useRef<HTMLButtonElement>(null);
  
  // Use React.useState for better performance
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState<SpinnerSegment | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [skipRequested, setSkipRequested] = useState(false);
  
  // Use a ref for values that don't need to trigger re-renders
  const animationRef = useRef({
    animationFrameId: 0,
    timeoutId: 0,
    isActive: false
  });
  
  // Check if reduced motion is preferred
  const shouldReduceMotion = useMemo(() => 
    respectReducedMotion && prefersReducedMotion(), 
    [respectReducedMotion]
  );
  
  // Calculate effective duration based on animation speed and reduced motion settings
  const effectiveDuration = useMemo(() => {
    let finalDuration = duration / (animationSpeed || 1);
    if (shouldReduceMotion) {
      // Reduce duration by 75% if reduced motion is preferred
      finalDuration = Math.min(finalDuration * 0.25, 1);
    }
    return finalDuration;
  }, [duration, animationSpeed, shouldReduceMotion]);
  
  // Get accessible colors for high contrast mode
  const accessibleColors = useMemo(() => {
    const primaryAccessible = getAccessibleColors(primaryColor, highContrast);
    const secondaryAccessible = getAccessibleColors(secondaryColor, highContrast);
    
    return {
      primary: highContrast ? '#000000' : primaryColor,
      secondary: highContrast ? '#ffffff' : secondaryColor,
      primaryText: primaryAccessible.foreground,
      secondaryText: secondaryAccessible.foreground,
      textColor: colorScheme?.text || (highContrast ? '#ffffff' : undefined),
      background: colorScheme?.background || undefined,
    };
  }, [primaryColor, secondaryColor, highContrast, colorScheme]);
  
  // Set up default ARIA announcements
  const defaultAriaAnnouncements: AriaAnnouncements = useMemo(() => ({
    spinStart: 'Spinner is now spinning',
    spinComplete: (winner) => `Winner selected: ${winner.label}`,
    spinReady: 'Spinner ready to spin',
  }), []);

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
        safeCancelAnimationFrame(animationRef.current.animationFrameId);
      }
    };
  }, []);
  
  // Define the spin function before using it in useEffect
  /**
   * Initiates the spinning animation and selects a random winner.
   * The spinning effect is created by applying a CSS rotation transform
   * with appropriate timing functions.
   * Optimized with requestAnimationFrame and useCallback.
   */
  // Handle skip animation request
  const handleSkipAnimation = useCallback(() => {
    if (!isAnimating || !animationRef.current.isActive) return;
    
    // Mark that skip was requested
    setSkipRequested(true);
    
    // Notify parent component if callback provided
    if (onSkipAnimation) {
      onSkipAnimation();
    }
  }, [isAnimating, onSkipAnimation]);

  // Handle keyboard events for accessibility
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    if (!enableKeyboardControl) return;
    
    if (e.key === 'Enter' || e.key === ' ') {
      // Start spin on Enter or Space when focused
      if (!isAnimating && !animationRef.current.isActive) {
        e.preventDefault();
        spin();
      }
    } else if (e.key === 'Escape') {
      // Skip animation on Escape
      if (isAnimating && allowSkipAnimation) {
        e.preventDefault();
        handleSkipAnimation();
      }
    }
  }, [enableKeyboardControl, isAnimating, allowSkipAnimation, handleSkipAnimation]);
  
  const spin = useCallback(() => {
    if (isAnimating || animationRef.current.isActive) return;
    
    // Reset skip request state
    setSkipRequested(false);
    
    // Mark as active in the ref to prevent multiple calls
    animationRef.current.isActive = true;
    setIsAnimating(true);
    setWinner(null);
    
    // Calculate random rotations:
    // 1. Select a random segment as winner
    // 2. Calculate angle to that segment
    // 3. Add 3-10 full rotations for dramatic effect (fewer for reduced motion)
    const randomSegment = Math.floor(Math.random() * segments.length);
    const segmentRotation = 360 - (randomSegment * segmentAngle);
    
    // Reduce rotations for reduced motion preference
    const minRotations = shouldReduceMotion ? 1 : 3;
    const maxRandomRotations = shouldReduceMotion ? 1 : 7;
    const fullRotations = minRotations + Math.floor(Math.random() * maxRandomRotations) * 360;
    const targetRotation = rotation + fullRotations + segmentRotation;
    
    // Set start time for animation
    const startTime = performance.now();
    const endTime = startTime + (effectiveDuration * 1000);
    
    // Use safeRequestAnimationFrame for smoother animation with fallback
    const animateWheelSpin = (timestamp: number) => {
      // Animation complete or skip requested
      if (timestamp >= endTime || skipRequested) {
        // Set final position
        setRotation(targetRotation);
        
        // Announce winner with safeRequestAnimationFrame for smoother UI update
        animationRef.current.animationFrameId = safeRequestAnimationFrame(() => {
          const winningSegment = segments[randomSegment];
          if (winningSegment) {
            setWinner(winningSegment);
            setIsAnimating(false);
            animationRef.current.isActive = false;
            
            // Focus the skip button when animation completes for better screen reader access
            if (skipButtonRef.current && accessibilityEnabled) {
              skipButtonRef.current.focus();
            }
            
            if (onSpinEnd) {
              onSpinEnd(winningSegment);
            }
          }
        });
        return;
      }
      
      // Calculate current progress (0 to 1)
      const progress = (timestamp - startTime) / (effectiveDuration * 1000);
      // Apply easing function for more realistic wheel spin (cubic bezier approximation)
      const easedProgress = cubicBezier(0.1, 0.7, 0.1, 1, progress);
      // Calculate current rotation
      const currentRotation = rotation + (targetRotation - rotation) * easedProgress;
      
      // Use a batched state update for better performance
      if (Math.abs(currentRotation - rotation) > 0.5) {
        // Only update when the change is significant enough to be visible
        setRotation(currentRotation);
      }
      
      // Continue animation
      animationRef.current.animationFrameId = safeRequestAnimationFrame(animateWheelSpin);
    };
    
    // For reduced motion preference, we might want to skip animation entirely
    if (shouldReduceMotion && effectiveDuration < 0.5) {
      // Skip animation entirely, just set the final position and announce winner
      setRotation(targetRotation);
      
      // Brief timeout to ensure state updates properly
      animationRef.current.timeoutId = setTimeout(() => {
        const winningSegment = segments[randomSegment];
        if (winningSegment) {
          setWinner(winningSegment);
          setIsAnimating(false);
          animationRef.current.isActive = false;
          
          if (onSpinEnd) {
            onSpinEnd(winningSegment);
          }
        }
      }, 50) as unknown as number;
    } else {
      // Start animation with initial frame
      animationRef.current.animationFrameId = safeRequestAnimationFrame(animateWheelSpin);
    }
    
    // Clean up function to handle component unmounting during animation
    return () => {
      if (animationRef.current.animationFrameId) {
        safeCancelAnimationFrame(animationRef.current.animationFrameId);
      }
      if (animationRef.current.timeoutId) {
        clearTimeout(animationRef.current.timeoutId);
      }
      animationRef.current.isActive = false;
    };
  }, [
    segments, 
    segmentAngle, 
    rotation, 
    effectiveDuration, 
    isAnimating, 
    onSpinEnd, 
    shouldReduceMotion, 
    skipRequested, 
    accessibilityEnabled
  ]);

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

  // Get appropriate ARIA announcements (custom or default)
  const announcements = useMemo(() => ({
    ...defaultAriaAnnouncements,
    ...ariaAnnouncements
  }), [defaultAriaAnnouncements, ariaAnnouncements]);
  
  // Determine current state for accessibility
  const spinnerStatusText = useMemo(() => {
    if (isAnimating) {
      return announcements.spinStart || 'Spinner is currently spinning';
    } else if (winner) {
      return announcements.spinComplete ? 
        announcements.spinComplete(winner) : 
        `Winner selected: ${winner.label}`;
    } else {
      return announcements.spinReady || 'Spinner ready to spin';
    }
  }, [isAnimating, winner, announcements]);

  // Render the spinner segments with high contrast if needed
  const renderedSegmentsWithAccessibility = useMemo(() => {
    return segments.map((segment, index) => {
      const startAngle = index * segmentAngle;
      const isEvenSegment = index % 2 === 0;
      const textColor = highContrast ? 
        (isEvenSegment ? accessibleColors.primaryText : accessibleColors.secondaryText) :
        accessibleColors.textColor;
      
      return (
        <SpinnerSegmentComponent
          key={segment.id}
          segment={segment}
          startAngle={startAngle}
          segmentAngle={segmentAngle}
          isEvenSegment={isEvenSegment}
          primaryColor={accessibleColors.primary}
          secondaryColor={accessibleColors.secondary}
          textColor={textColor}
        />
      );
    });
  }, [segments, segmentAngle, highContrast, accessibleColors]);

  return (
    <div 
      id={id}
      className={className ? `relative ${className}` : 'relative'}
      role="region"
      aria-label={ariaLabel || "Spinner wheel"}
      aria-live={isAnimating ? 'assertive' : 'polite'}
      onKeyDown={handleKeyDown}
      tabIndex={enableKeyboardControl ? 0 : undefined}
    >
      {/* The main wheel container with hardware acceleration */}
      <div
        ref={wheelRef}
        className="relative w-full aspect-square rounded-full overflow-hidden border-4 will-change-transform"
        style={{
          transform: `rotate(${rotation}deg) translateZ(0)`,
          transition: isAnimating ? `transform ${effectiveDuration}s cubic-bezier(0.1, 0.7, 0.1, 1)` : 'none',
          backgroundColor: accessibleColors.primary,
          borderColor: accessibleColors.secondary,
          ...getHardwareAccelerationStyles(), // Comprehensive GPU acceleration
        }}
        role="img"
        aria-label={`Spinner wheel with ${segments.length} options`}
        aria-hidden={isAnimating || !accessibilityEnabled} // Hide from screen readers during animation
      >
        {/* Render pre-computed segments with accessibility enhancements */}
        {highContrast || colorScheme ? renderedSegmentsWithAccessibility : renderedSegments()}
      </div>
      
      {/* The center point/indicator arrow */}
      <div 
        className="absolute top-1/2 left-1/2 w-4 h-4 transform -translate-x-1/2 -translate-y-1/2 rotate-45 z-10"
        style={{ backgroundColor: accessibleColors.secondary }}
        aria-hidden="true" // Hide from screen readers
      />
      
      {/* Visually hidden text for screen readers */}
      {accessibilityEnabled && (
        <div className="sr-only" aria-live="assertive">
          {spinnerStatusText}
        </div>
      )}
      
      {/* Skip animation button for accessibility */}
      {allowSkipAnimation && isAnimating && accessibilityEnabled && (
        <button
          ref={skipButtonRef}
          onClick={handleSkipAnimation}
          className="sr-only focus:not-sr-only focus:absolute focus:p-2 focus:bg-white focus:text-black focus:border focus:border-black focus:z-50"
          aria-label="Skip animation"
        >
          Skip animation
        </button>
      )}
      
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
  textColor?: string;
}

const SpinnerSegmentComponent = memo(function SpinnerSegmentComponent({
  segment,
  startAngle,
  segmentAngle,
  isEvenSegment,
  primaryColor,
  secondaryColor,
  textColor
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
    color: textColor || 'white', // Default to white if no textColor provided
  }), [segmentAngle, textColor]);

  return (
    <div
      className="absolute top-0 left-0 w-full h-full flex justify-center"
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
    prevProps.secondaryColor === nextProps.secondaryColor &&
    prevProps.textColor === nextProps.textColor
  );
});