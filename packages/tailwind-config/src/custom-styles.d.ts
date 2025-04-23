// This file provides TypeScript type definitions for custom CSS classes
// that are defined in our shared Tailwind CSS configuration

declare module 'react' {
  interface CSSProperties {
    '--color-primary-50'?: string;
    '--color-primary-100'?: string;
    '--color-primary-200'?: string;
    '--color-primary-300'?: string;
    '--color-primary-400'?: string;
    '--color-primary-500'?: string;
    '--color-primary-600'?: string;
    '--color-primary-700'?: string;
    '--color-primary-800'?: string;
    '--color-primary-900'?: string;
    '--color-primary-950'?: string;
    
    '--color-secondary-50'?: string;
    '--color-secondary-100'?: string;
    '--color-secondary-200'?: string;
    '--color-secondary-300'?: string;
    '--color-secondary-400'?: string;
    '--color-secondary-500'?: string;
    '--color-secondary-600'?: string;
    '--color-secondary-700'?: string;
    '--color-secondary-800'?: string;
    '--color-secondary-900'?: string;
    '--color-secondary-950'?: string;
    
    '--background'?: string;
    '--foreground'?: string;
  }
}