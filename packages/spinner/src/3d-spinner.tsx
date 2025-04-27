/**
 * 3D Spinner component that provides a more visually appealing spin experience.
 * This is a placeholder for the actual 3D implementation.
 * 
 * @component
 */
import React, { useState, useEffect } from 'react';
import { SpinnerProps, SpinnerSegment } from './types';
import { useSpinner } from './spinner-context';

/**
 * 3D Spinner implementation with enhanced visual effects.
 * 
 * @param {SpinnerProps} props - Component props
 * @returns {JSX.Element} - Rendered 3D spinner component
 */
export function Spinner3D({
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

  // Start spinning animation when isSpinning becomes true
  useEffect(() => {
    if (isSpinning && !isAnimating) {
      spin();
    }
  }, [isSpinning]);

  // Reset animation state when isSpinning becomes false
  useEffect(() => {
    if (!isSpinning) {
      setIsAnimating(false);
    }
  }, [isSpinning]);

  /**
   * Initiates the spinning animation and selects a random winner.
   */
  const spin = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setWinner(null);
    
    // Simulate spinning animation
    setTimeout(() => {
      // Select a random segment as winner
      const randomSegment = Math.floor(Math.random() * segments.length);
      const winningSegment = segments[randomSegment];
      
      setWinner(winningSegment);
      setIsAnimating(false);
      
      if (onSpinEnd && winningSegment) {
        onSpinEnd(winningSegment);
      }
    }, duration * 1000);
  };

  // This is a placeholder for the actual 3D implementation
  // In a real implementation, this would use WebGL or Three.js
  return (
    <div className={className ? `relative ${className}` : 'relative'}>
      <div className="w-full aspect-square rounded-full overflow-hidden border-4 flex items-center justify-center"
        style={{
          backgroundColor: primaryColor,
          borderColor: secondaryColor,
        }}
      >
        {isAnimating ? (
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white mb-4"></div>
            <p className="font-bold">Spinning...</p>
          </div>
        ) : (
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
        )}
      </div>
      
      <div className="mt-4 text-sm text-center text-muted-foreground">
        Note: This is a placeholder for the actual 3D spinner implementation
      </div>
    </div>
  );
}

/**
 * 3D Spinner component that uses the SpinnerContext.
 * This is a convenience wrapper that doesn't require passing props directly.
 */
export function Context3DSpinner() {
  const { spinnerSettings, activeSpinnerId } = useSpinner();
  
  if (!spinnerSettings || !activeSpinnerId) {
    return <div>No active spinner configured</div>;
  }
  
  const activeSetting = spinnerSettings.find(s => s.id === activeSpinnerId);
  
  if (!activeSetting) {
    return <div>Selected spinner not found</div>;
  }
  
  return (
    <Spinner3D
      segments={activeSetting.segments}
      duration={activeSetting.duration}
      primaryColor={activeSetting.primaryColor}
      secondaryColor={activeSetting.secondaryColor}
      showWinner={true}
    />
  );
}