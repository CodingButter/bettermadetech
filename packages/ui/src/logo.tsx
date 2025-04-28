import React from 'react';
import { cn } from './lib/utils';

// Define available sizes
export type LogoSize = 'sm' | 'md' | 'lg' | 'xl';

// Define the sizes in pixels
const sizes: Record<LogoSize, { width: number; height: number }> = {
  sm: { width: 24, height: 24 },
  md: { width: 32, height: 32 },
  lg: { width: 48, height: 48 },
  xl: { width: 64, height: 64 },
};

export interface LogoProps {
  size?: LogoSize;
  className?: string;
  variant?: 'default' | 'light' | 'dark';
  alt?: string;
}

export function Logo({
  size = 'md',
  className,
  variant = 'default',
  alt = 'Winner Spinner Logo',
}: LogoProps) {
  // Instead of using dynamic paths, let's use the built-in icon for now
  // This is a temporary solution until proper assets are set up
  const getLogoPath = () => {
    // Check if running in a browser extension context safely
    const isChromeExtension = typeof window !== 'undefined' && 
                              'chrome' in window && 
                              typeof (window as Window & typeof globalThis & { chrome?: { runtime?: { getURL?: (path: string) => string } } }).chrome?.runtime?.getURL === 'function';
    
    // Use the extension icon as the logo if in extension context
    if (isChromeExtension) {
      return (window as Window & typeof globalThis & { chrome: { runtime: { getURL: (path: string) => string } } }).chrome.runtime.getURL('icons/icon128.png');
    }
    
    // Fallback to variant handling for non-extension environments
    switch (variant) {
      case 'light':
        return '/assets/icons/logo-light.png';
      case 'dark':
        return '/assets/icons/logo-dark.png';
      default:
        return '/assets/icons/logo.png';
    }
  };
  
  // Get the final logo path
  const logoPath = getLogoPath();

  const { width, height } = sizes[size];

  return (
    <img
      src={logoPath}
      alt={alt}
      width={width}
      height={height}
      className={cn(
        'object-contain',
        className
      )}
    />
  );
}

export function LogoWithText({
  size = 'md',
  className,
  variant = 'default',
  // alt is used in Logo component
}: LogoProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Logo size={size} variant={variant} alt="" />
      <span className={cn(
        'font-bold',
        size === 'sm' && 'text-sm',
        size === 'md' && 'text-base',
        size === 'lg' && 'text-lg',
        size === 'xl' && 'text-xl',
      )}>
        Winner Spinner
      </span>
    </div>
  );
}