/**
 * 3D Spinner component that provides a more visually appealing spin experience.
 * This is a placeholder for the actual 3D implementation.
 * 
 * @component
 */
import { useState, useRef, useEffect, memo, useCallback, useMemo } from 'react';
import { SpinnerProps, SpinnerSegment } from './types';
import { useSpinner } from './spinner-context';
import { 
  measurePerformance, 
  getHardwareAccelerationStyles, 
  safeRequestAnimationFrame, 
  safeCancelAnimationFrame 
} from './utils';
import { isDevelopment } from './environment';

/**
 * 3D Spinner implementation with enhanced visual effects.
 * Optimized with memoization for better performance.
 * 
 * @param {SpinnerProps} props - Component props
 * @returns {JSX.Element} - Rendered 3D spinner component
 */
export const Spinner3D = memo(function Spinner3D({
  segments,
  duration = 5,
  primaryColor = '#4f46e5',
  secondaryColor = '#f97316',
  isSpinning = false,
  onSpinEnd,
  className,
  showWinner = false,
}: SpinnerProps) {
  const [winner, setWinner] = useState<SpinnerSegment | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Use a ref for values that don't need to trigger re-renders
  const animationRef = useRef({
    timeoutId: 0,
    isActive: false,
    animationFrameId: 0
  });

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

  // Reset animation state when isSpinning becomes false
  useEffect(() => {
    if (!isSpinning) {
      setIsAnimating(false);
    }
  }, [isSpinning]);

  /**
   * Initiates the spinning animation and selects a random winner.
   * Optimized with useCallback and requestAnimationFrame.
   */
  const spin = useCallback(() => {
    if (isAnimating || animationRef.current.isActive) return;
    
    // Mark as active in the ref to prevent multiple calls
    animationRef.current.isActive = true;
    setIsAnimating(true);
    setWinner(null);
    
    // Calculate random segment as winner
    const randomSegment = Math.floor(Math.random() * segments.length);
    const winningSegment = segments[randomSegment];
    
    // Use performance measurement in development
    const spinnerAnimation = () => {
      // Use requestAnimationFrame for smoother animation updates
      const startTime = performance.now();
      const endTime = startTime + (duration * 1000);
      
      const animateSpinner = (timestamp: number) => {
        if (timestamp >= endTime) {
          // Animation complete, announce winner
          safeRequestAnimationFrame(() => {
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
        
        // Continue animation with optimized frame rate control
        // Calculate progress for smooth animation
        const progress = (timestamp - startTime) / (duration * 1000);
        
        // Continue animation
        animationRef.current.animationFrameId = safeRequestAnimationFrame(animateSpinner);
      };
      
      // Start animation
      animationRef.current.animationFrameId = safeRequestAnimationFrame(animateSpinner);
    };
    
    // Wrap with performance measurement in development
    if (isDevelopment()) {
      measurePerformance('3DSpinner-Animation', spinnerAnimation);
    } else {
      spinnerAnimation();
    }
    
    // Clean up function
    return () => {
      if (animationRef.current.animationFrameId) {
        safeCancelAnimationFrame(animationRef.current.animationFrameId);
      }
      animationRef.current.isActive = false;
    };
  }, [segments, duration, isAnimating, onSpinEnd]);

  // Start spinning animation when isSpinning becomes true
  useEffect(() => {
    if (isSpinning && !isAnimating) {
      const cleanupFn = spin();
      return () => {
        if (cleanupFn) cleanupFn();
      };
    }
  }, [isSpinning, isAnimating, spin]);

  // Memoize the spinner content to prevent unnecessary re-renders
  const spinnerContent = useMemo(() => {
    if (isAnimating) {
      return (
        <div className="text-white text-center">
          <div 
            className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white mb-4"
            style={{ 
              ...getHardwareAccelerationStyles(),
              transformStyle: 'preserve-3d'
            }}
          ></div>
          <p className="font-bold">Spinning...</p>
        </div>
      );
    }
    
    return (
      <div className="text-white text-center p-4">
        <p className="font-medium mb-2">3D Spinner</p>
        <p className="text-sm mb-4">{segments.length} options available</p>
        
        {winner && showWinner && (
          <div className="bg-black bg-opacity-50 p-4 rounded-md">
            <p className="font-bold text-xl mb-1">Winner!</p>
            <p className="text-lg">{winner.label}</p>
            <p className="text-sm opacity-75">{winner.value}</p>
          </div>
        )}
      </div>
    );
  }, [isAnimating, segments.length, winner, showWinner]);

  // This is a placeholder for the actual 3D implementation
  // In a real implementation, this would use WebGL or Three.js
  
  // Determine current state for accessibility
  // const spinnerStatus = isAnimating ? 'spinning' : (winner ? 'complete' : 'ready');
  const spinnerStatusText = isAnimating 
    ? 'Spinner is currently spinning' 
    : (winner ? `Winner selected: ${winner.label}` : 'Spinner ready to spin');
  
  return (
    <div 
      className={className ? `relative ${className}` : 'relative'}
      role="region"
      aria-label="3D Spinner wheel"
      aria-live={isAnimating ? 'assertive' : 'polite'}
    >
      <div 
        className="w-full aspect-square rounded-full overflow-hidden border-4 flex items-center justify-center"
        style={{
          backgroundColor: primaryColor,
          borderColor: secondaryColor,
          transformStyle: 'preserve-3d',
          ...getHardwareAccelerationStyles()
        }}
        role="img"
        aria-label={`3D Spinner wheel with ${segments.length} options`}
        aria-hidden={isAnimating} // Hide from screen readers during animation
      >
        {spinnerContent}
      </div>
      
      {/* Visually hidden text for screen readers */}
      <div className="sr-only" aria-live="assertive">
        {spinnerStatusText}
      </div>
      
      <div className="mt-4 text-sm text-center text-muted-foreground">
        Note: This is a placeholder for the actual 3D spinner implementation
      </div>
    </div>
  );
});

/**
 * 3D Spinner component that uses the SpinnerContext.
 * This is a convenience wrapper that doesn't require passing props directly.
 * Optimized with memoization for better performance.
 */
export const Context3DSpinner = memo(function Context3DSpinner() {
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
  
  // Render the optimized 3D spinner
  return <Spinner3D {...spinnerProps} />;
});