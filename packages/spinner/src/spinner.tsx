/**
 * Spinner component that allows for random selection from a set of options.
 * 
 * This component renders a wheel with customizable segments that can be spun
 * to randomly select a winner. The spinning animation is controlled via props
 * and provides callbacks when the selection is complete.
 * 
 * @component
 */
import { useState, useRef, useEffect } from 'react';
import { SpinnerProps, SpinnerSegment } from './types';
import { useSpinner } from './spinner-context';

/**
 * Spinner wheel component with configurable segments and animation.
 * 
 * @param {SpinnerProps} props - Component props
 * @returns {JSX.Element} - Rendered spinner component
 */
export function Spinner({
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
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState<SpinnerSegment | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Calculate the rotation angle for each segment
  const segmentAngle = 360 / segments.length;
  
  // Reset animation state when isSpinning becomes false
  useEffect(() => {
    if (!isSpinning) {
      setIsAnimating(false);
    }
  }, [isSpinning]);

  // Start spinning animation when isSpinning becomes true
  useEffect(() => {
    if (isSpinning && !isAnimating) {
      spin();
    }
  }, [isSpinning]);

  /**
   * Initiates the spinning animation and selects a random winner.
   * The spinning effect is created by applying a CSS rotation transform
   * with appropriate timing functions.
   */
  const spin = () => {
    if (isAnimating) return;
    
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
    
    setRotation(targetRotation);
    
    // Set the winner and trigger callback after spinning animation completes
    setTimeout(() => {
      const winningSegment = segments[randomSegment];
      setWinner(winningSegment);
      setIsAnimating(false);
      if (onSpinEnd && winningSegment) {
        onSpinEnd(winningSegment);
      }
    }, duration * 1000);
  };

  return (
    <div className={className ? `relative ${className}` : 'relative'}>
      {/* The main wheel container */}
      <div
        ref={wheelRef}
        className="relative w-full aspect-square rounded-full overflow-hidden transition-transform border-4"
        style={{
          transform: `rotate(${rotation}deg)`,
          transitionDuration: isAnimating ? `${duration}s` : '0s',
          transitionTimingFunction: 'cubic-bezier(0.1, 0.7, 0.1, 1)',
          backgroundColor: primaryColor,
          borderColor: secondaryColor,
        }}
      >
        {/* Render each segment as a pie slice */}
        {segments.map((segment, index) => {
          const startAngle = index * segmentAngle;
          const isEvenSegment = index % 2 === 0;
          
          return (
            <div
              key={segment.id}
              className="absolute top-0 left-0 w-full h-full text-white flex justify-center"
              style={{
                transform: `rotate(${startAngle}deg)`,
                backgroundColor: segment.color || (isEvenSegment ? primaryColor : secondaryColor),
                clipPath: `polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)`,
              }}
            >
              {/* Segment label positioned in the middle of each segment */}
              <div 
                className="absolute transform -translate-x-1/2 text-sm font-medium"
                style={{
                  left: '75%',
                  top: '50%',
                  transform: `translateY(-50%) rotate(${90 + segmentAngle / 2}deg)`,
                  maxWidth: '60px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {segment.label}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* The center point/indicator arrow */}
      <div 
        className="absolute top-1/2 left-1/2 w-4 h-4 transform -translate-x-1/2 -translate-y-1/2 rotate-45 z-10"
        style={{ backgroundColor: secondaryColor }}
      />
      
      {/* Winner display overlay */}
      {showWinner && winner && !isAnimating && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 rounded-full">
          <div className="text-center p-4">
            <div className="text-xl font-bold text-white mb-1">Winner!</div>
            <div className="text-2xl font-bold text-primary">{winner.label}</div>
            <div className="text-sm text-white mt-1">{winner.value}</div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Spinner component that uses the SpinnerContext.
 * This is a convenience wrapper that doesn't require passing props directly.
 */
export function ContextSpinner() {
  const { spinnerSettings, activeSpinnerId } = useSpinner();
  
  if (!spinnerSettings || !activeSpinnerId) {
    return <div>No active spinner configured</div>;
  }
  
  const activeSetting = spinnerSettings.find(s => s.id === activeSpinnerId);
  
  if (!activeSetting) {
    return <div>Selected spinner not found</div>;
  }
  
  return (
    <Spinner
      segments={activeSetting.segments}
      duration={activeSetting.duration}
      primaryColor={activeSetting.primaryColor}
      secondaryColor={activeSetting.secondaryColor}
      showWinner={true}
    />
  );
}