// Browser-compatible version of env-config
// This replaces the @repo/env-config package for the extension

interface EnvVariables {
  VITE_DIRECTUS_API_URL?: string;
  VITE_DIRECTUS_ADMIN_TOKEN?: string;
  VITE_DEFAULT_SPIN_DURATION?: string;
  VITE_DEFAULT_PRIMARY_COLOR?: string;
  VITE_DEFAULT_SECONDARY_COLOR?: string;
  VITE_DEFAULT_SHOW_CONFETTI?: string;
  [key: string]: string | undefined;
}

// For browser environments, we use hardcoded defaults since we can't
// access .env files at runtime in a browser extension
const environmentVariables: EnvVariables = {
  VITE_DIRECTUS_API_URL: 'https://example.directus.instance',
  VITE_DIRECTUS_ADMIN_TOKEN: '',
  VITE_DEFAULT_SPIN_DURATION: '5',
  VITE_DEFAULT_PRIMARY_COLOR: '#4f46e5',
  VITE_DEFAULT_SECONDARY_COLOR: '#f97316',
  VITE_DEFAULT_SHOW_CONFETTI: 'false',
};

export const DIRECTUS_CONFIG = {
  API_URL: environmentVariables.VITE_DIRECTUS_API_URL || 'https://example.directus.instance',
  ADMIN_TOKEN: environmentVariables.VITE_DIRECTUS_ADMIN_TOKEN || '',
};

export const APP_CONFIG = {
  DEFAULT_SPINNER: {
    SPIN_DURATION: parseInt(environmentVariables.VITE_DEFAULT_SPIN_DURATION || '5', 10),
    PRIMARY_COLOR: environmentVariables.VITE_DEFAULT_PRIMARY_COLOR || '#4f46e5',
    SECONDARY_COLOR: environmentVariables.VITE_DEFAULT_SECONDARY_COLOR || '#f97316',
    SHOW_CONFETTI: environmentVariables.VITE_DEFAULT_SHOW_CONFETTI === 'true',
  },
};

// If needed, you can add other config objects here