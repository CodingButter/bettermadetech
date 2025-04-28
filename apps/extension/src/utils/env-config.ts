/**
 * Browser-compatible environment configuration.
 * 
 * This module provides a browser-compatible version of the @repo/env-config package
 * specifically designed for the Chrome extension environment. Since browser extensions
 * cannot access .env files at runtime, this module provides hardcoded defaults that
 * are injected during the build process.
 * 
 * @module env-config
 */

/**
 * Environment variables interface matching the structure of .env files.
 * These values are typically injected during the build process via Vite.
 */
interface EnvVariables {
  /** Directus API URL for connecting to the backend */
  VITE_DIRECTUS_API_URL?: string;
  /** Directus admin token for API authentication */
  VITE_DIRECTUS_ADMIN_TOKEN?: string;
  /** Default spinner animation duration in seconds */
  VITE_DEFAULT_SPIN_DURATION?: string;
  /** Default primary color for spinner segments */
  VITE_DEFAULT_PRIMARY_COLOR?: string;
  /** Default secondary color for spinner segments */
  VITE_DEFAULT_SECONDARY_COLOR?: string;
  /** Whether to show confetti by default */
  VITE_DEFAULT_SHOW_CONFETTI?: string;
  /** Catch-all for any additional environment variables */
  [key: string]: string | undefined;
}

/**
 * Hardcoded environment variable values for browser environments.
 * 
 * Since browser extensions cannot access .env files at runtime, we use
 * hardcoded defaults that are replaced during the build process.
 */
const environmentVariables: EnvVariables = {
  VITE_DIRECTUS_API_URL: 'https://example.directus.instance',
  VITE_DIRECTUS_ADMIN_TOKEN: '',
  VITE_DEFAULT_SPIN_DURATION: '5',
  VITE_DEFAULT_PRIMARY_COLOR: '#4f46e5',
  VITE_DEFAULT_SECONDARY_COLOR: '#f97316',
  VITE_DEFAULT_SHOW_CONFETTI: 'false',
};

/**
 * Directus API configuration settings.
 * Contains connection details for the Directus backend.
 */
export const DIRECTUS_CONFIG = {
  /** Directus API URL for connecting to the backend */
  API_URL: environmentVariables.VITE_DIRECTUS_API_URL || 'https://example.directus.instance',
  /** Directus admin token for API authentication */
  ADMIN_TOKEN: environmentVariables.VITE_DIRECTUS_ADMIN_TOKEN || '',
};

/**
 * Application-wide configuration settings.
 * Contains default values for various features.
 */
export const APP_CONFIG = {
  /** Default spinner configuration */
  DEFAULT_SPINNER: {
    /** Default spin animation duration in seconds */
    SPIN_DURATION: parseInt(environmentVariables.VITE_DEFAULT_SPIN_DURATION || '5', 10),
    /** Default primary color for spinner segments (hex format) */
    PRIMARY_COLOR: environmentVariables.VITE_DEFAULT_PRIMARY_COLOR || '#4f46e5',
    /** Default secondary color for spinner segments (hex format) */
    SECONDARY_COLOR: environmentVariables.VITE_DEFAULT_SECONDARY_COLOR || '#f97316',
    /** Whether to show confetti effect by default */
    SHOW_CONFETTI: environmentVariables.VITE_DEFAULT_SHOW_CONFETTI === 'true',
  },
};

// Additional configuration objects can be added here as needed