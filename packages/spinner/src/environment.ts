/**
 * Environment utilities for handling differences between Node.js and browser environments
 */

/**
 * Checks if the current environment is a development environment
 */
export const isDevelopment = (): boolean => {
  // In browser environments, check for localhost or development hostnames
  if (typeof window !== 'undefined') {
    const { hostname } = window.location;
    return hostname === 'localhost' || 
           hostname === '127.0.0.1' || 
           hostname.includes('dev.') || 
           hostname.includes('.local');
  }
  // In other environments, default to production
  return false;
};

/**
 * Checks if the current environment is a production environment
 */
export const isProduction = (): boolean => {
  return !isDevelopment();
};

/**
 * Timeout interface matching NodeJS.Timeout for cross-environment compatibility
 */
export interface Timeout {
  hasRef(): boolean;
  ref(): Timeout;
  refresh(): Timeout;
  unref(): Timeout;
}

/**
 * Process environment object that safely provides environment variables
 */
export const processEnv = {
  NODE_ENV: isDevelopment() ? 'development' : 'production'
};