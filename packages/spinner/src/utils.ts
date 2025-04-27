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