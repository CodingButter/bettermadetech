/**
 * Performance and accessibility utility functions for the spinner component
 */
import { isDevelopment } from './environment';

/**
 * Checks if the user prefers reduced motion based on the media query
 * @returns boolean indicating whether reduced motion is preferred
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Gets contrast-friendly colors based on WCAG guidelines
 * @param baseColor The base color to adjust for contrast
 * @param isHighContrast Whether to apply high contrast mode
 * @returns An object with foreground and background colors with sufficient contrast
 */
export function getAccessibleColors(baseColor: string, isHighContrast: boolean = false): {
  foreground: string;
  background: string;
  border?: string;
  accent?: string;
} {
  // Default colors with good contrast
  const defaults = {
    foreground: '#ffffff', // White
    background: '#000000', // Black
    border: '#ffffff',     // White border
    accent: '#ffff00'      // Yellow accent (highly visible)
  };
  
  if (!baseColor || typeof baseColor !== 'string') {
    return defaults;
  }
  
  try {
    // For high contrast mode, use optimal color combinations that meet WCAG AAA standards
    if (isHighContrast) {
      // Choose from several high-contrast schemes
      const highContrastSchemes = [
        {
          // Black background, white text, yellow accents - highest contrast
          foreground: '#ffffff', // White
          background: '#000000', // Black
          border: '#ffffff',     // White
          accent: '#ffff00'      // Yellow
        },
        {
          // White background, black text, blue accents
          foreground: '#000000', // Black
          background: '#ffffff', // White
          border: '#000000',     // Black
          accent: '#0000ff'      // Blue
        },
        {
          // Dark blue background, yellow text - high contrast for color blindness
          foreground: '#ffff00', // Yellow
          background: '#00008b', // Dark blue
          border: '#ffffff',     // White
          accent: '#ff6600'      // Orange
        }
      ];
      
      // Select scheme based on baseColor characteristics
      // For simplicity, use the first scheme for dark colors, second for light
      const isLight = isLightColor(baseColor);
      return highContrastSchemes[isLight ? 1 : 0];
    }
    
    // Simple algorithm to determine if a color is light or dark
    // and return contrasting colors
    const isLight = isLightColor(baseColor);
    
    return {
      foreground: isLight ? '#000000' : '#ffffff',
      background: baseColor,
      border: isLight ? '#000000' : '#ffffff',
      accent: isLight ? '#0000ff' : '#ffff00'
    };
  } catch (error) {
    console.error('Error calculating accessible colors:', error);
    return defaults;
  }
}

/**
 * Determines if a color is light or dark (simple RGB calculation)
 * @param color The color to check
 * @returns boolean indicating whether the color is light
 */
function isLightColor(color: string): boolean {
  // Convert hex to RGB
  let r = 0, g = 0, b = 0;
  
  if (color.startsWith('#')) {
    const hex = color.substring(1);
    
    if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16);
      g = parseInt(hex[1] + hex[1], 16);
      b = parseInt(hex[2] + hex[2], 16);
    } else if (hex.length === 6) {
      r = parseInt(hex.substring(0, 2), 16);
      g = parseInt(hex.substring(2, 4), 16);
      b = parseInt(hex.substring(4, 6), 16);
    }
  }
  
  // Calculate perceived brightness
  // Using YIQ formula (perceived brightness)
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  
  return yiq >= 128; // 128 is the threshold for "light" colors
}

/**
 * Measures the performance of a function
 * 
 * @param label The label to use for the performance measurement
 * @param fn The function to measure
 * @returns The result of the function
 */
export function measurePerformance<T>(label: string, fn: () => T): T {
  if (typeof performance !== 'undefined') {
    performance.mark(`${label}-start`);
    const result = fn();
    performance.mark(`${label}-end`);
    performance.measure(label, `${label}-start`, `${label}-end`);
    
    // Log performance in development only
    if (isDevelopment()) {
      const measurements = performance.getEntriesByName(label);
      if (measurements && measurements.length > 0 && measurements[0]) {
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
export function throttle<T extends (...args: unknown[]) => unknown>(fn: T, delay: number): (...args: Parameters<T>) => void {
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
export function debounce<T extends (...args: unknown[]) => unknown>(fn: T, delay: number): (...args: Parameters<T>) => void {
  let timeoutId: number;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay) as unknown as number;
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
  // const mt3 = mt2 * mt;
  
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
    if (testEl.style[propName as keyof CSSStyleDeclaration] !== undefined) {
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
        WebkitOverflowScrolling: 'touch',
        WebkitTransformStyle: 'preserve-3d',
        WebkitBackfaceVisibility: 'hidden',
      }
    : {};
}

/**
 * Optimized requestAnimationFrame with fallback
 * 
 * @param callback The animation callback
 * @returns The animation frame ID
 */
export function safeRequestAnimationFrame(callback: FrameRequestCallback): number {
  if (typeof window !== 'undefined' && window.requestAnimationFrame) {
    return window.requestAnimationFrame(callback);
  } else {
    // Fallback for environments without requestAnimationFrame
    const timestamp = Date.now();
    return setTimeout(() => callback(timestamp), 16) as unknown as number;
  }
}

/**
 * Optimized cancelAnimationFrame with fallback
 * 
 * @param id The animation frame ID to cancel
 */
export function safeCancelAnimationFrame(id: number): void {
  if (typeof window !== 'undefined') {
    if (window.cancelAnimationFrame) {
      window.cancelAnimationFrame(id);
    } else {
      clearTimeout(id);
    }
  }
}

/**
 * Creates a memoized version of a function that only recalculates
 * when dependencies change. More efficient than useMemo for non-component code.
 * 
 * @param fn The function to memoize
 * @param getDependencies Array of dependencies that trigger recalculation
 * @returns Memoized function result
 */
export function memoize<T, D extends unknown[]>(
  fn: (...args: D) => T,
  getDependencies: () => unknown[]
): () => T {
  let cache: T;
  let lastDeps: unknown[] = [];
  let initialized = false;
  
  return () => {
    const dependencies = getDependencies();
    const depsChanged = !initialized || 
      dependencies.length !== lastDeps.length ||
      dependencies.some((dep, i) => !Object.is(dep, lastDeps[i]));
      
    if (depsChanged) {
      cache = fn(...dependencies as unknown as D);
      lastDeps = dependencies;
      initialized = true;
    }
    
    return cache;
  };
}