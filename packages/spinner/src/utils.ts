/**
 * Performance utility functions for the spinner component
 */

/**
 * Measures the performance of a function
 * 
 * @param label The label to use for the performance measurement
 * @param fn The function to measure
 * @returns The result of the function
 */
export function measurePerformance<T>(label: string, fn: () => T): T {
  if (typeof performance !== 'undefined' && process.env.NODE_ENV !== 'production') {
    performance.mark(`${label}-start`);
    const result = fn();
    performance.mark(`${label}-end`);
    performance.measure(label, `${label}-start`, `${label}-end`);
    
    // Log performance in development only
    if (process.env.NODE_ENV === 'development') {
      const measurements = performance.getEntriesByName(label);
      if (measurements.length > 0) {
        console.log(`${label}: ${measurements[0].duration.toFixed(2)}ms`);
      }
    }
    
    return result;
  }
  
  return fn();
}

/**
 * Throttle function to limit the number of times a function can be called
 * 
 * @param fn The function to throttle
 * @param delay The delay in milliseconds
 * @returns The throttled function
 */
export function throttle<T extends (...args: any[]) => any>(fn: T, delay: number): (...args: Parameters<T>) => void {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      return fn(...args);
    }
  };
}

/**
 * Debounce function to delay the execution of a function until after a specified delay
 * 
 * @param fn The function to debounce
 * @param delay The delay in milliseconds
 * @returns The debounced function
 */
export function debounce<T extends (...args: any[]) => any>(fn: T, delay: number): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Optimized cubic bezier function for animation
 * Smoother than the CSS transition for complex animations
 * 
 * @param x1 First control point x coordinate
 * @param y1 First control point y coordinate
 * @param x2 Second control point x coordinate
 * @param y2 Second control point y coordinate
 * @param t Animation progress (0 to 1)
 * @returns Calculated point on the bezier curve
 */
export function cubicBezier(x1: number, y1: number, x2: number, y2: number, t: number): number {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  
  // Precalculate powers of t
  const t2 = t * t;
  const t3 = t2 * t;
  const mt = 1 - t;
  const mt2 = mt * mt;
  const mt3 = mt2 * mt;
  
  // Bezier formula
  return 3 * mt2 * t * y1 + 3 * mt * t2 * y2 + t3;
}

/**
 * Check if the current browser supports hardware acceleration
 * 
 * @returns True if hardware acceleration is supported
 */
export function supportsHardwareAcceleration(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Feature detection for hardware acceleration
  const testEl = document.createElement('div');
  const prefixes = ['', 'webkit', 'moz', 'ms', 'o'];
  
  // Test for transform and other hardware acceleration properties
  for (const prefix of prefixes) {
    const propName = prefix ? `${prefix}Transform` : 'transform';
    if (testEl.style[propName as any] !== undefined) {
      return true;
    }
  }
  
  return false;
}

/**
 * Get hardware acceleration style properties based on browser support
 * 
 * @returns CSS style properties to enable hardware acceleration
 */
export function getHardwareAccelerationStyles(): Record<string, string> {
  const supported = typeof window !== 'undefined' && supportsHardwareAcceleration();
  
  return supported
    ? {
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        perspective: '1000px',
        willChange: 'transform',
      }
    : {};
}