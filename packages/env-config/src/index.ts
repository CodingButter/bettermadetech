/**
 * Environment configuration for Better Made Tech
 */
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Find the .env file in the package directory
const envPath = path.resolve(__dirname, '../.env');

// Load environment variables from .env file if it exists
// Otherwise, fall back to .env.example
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config({ path: path.resolve(__dirname, '../.env.example') });
}

/**
 * Directus API configuration
 */
export const DIRECTUS_CONFIG = {
  /**
   * Directus API URL
   */
  API_URL: process.env.DIRECTUS_API_URL || 'https://example.directus.instance',
  
  /**
   * Directus admin authentication token
   */
  ADMIN_TOKEN: process.env.DIRECTUS_ADMIN_TOKEN || '',
};

/**
 * General application configuration
 */
export const APP_CONFIG = {
  /**
   * Application name
   */
  APP_NAME: process.env.APP_NAME || 'Better Made Tech',
  
  /**
   * Default application theme
   */
  DEFAULT_THEME: process.env.DEFAULT_THEME || 'system',
  
  /**
   * Default spinner configuration
   */
  DEFAULT_SPINNER: {
    /**
     * Default spin duration in seconds
     */
    SPIN_DURATION: parseInt(process.env.DEFAULT_SPIN_DURATION || '5', 10),
    
    /**
     * Default primary color
     */
    PRIMARY_COLOR: process.env.DEFAULT_PRIMARY_COLOR || '#4f46e5',
    
    /**
     * Default secondary color
     */
    SECONDARY_COLOR: process.env.DEFAULT_SECONDARY_COLOR || '#f97316',
    
    /**
     * Default confetti setting
     */
    SHOW_CONFETTI: process.env.DEFAULT_SHOW_CONFETTI === 'true',
  },
};

/**
 * Check if running in development mode
 */
export const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Check if running in production mode
 */
export const isProduction = process.env.NODE_ENV === 'production';