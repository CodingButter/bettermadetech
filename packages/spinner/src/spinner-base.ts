/**
 * SpinnerBase Abstract Class
 * 
 * This abstract class defines the interface that all spinner clients must implement.
 * It provides a consistent API for spinner components regardless of the application
 * environment they are running in (web, docs, extension).
 */

import { SpinnerSettings, SpinnerSegment, AuthInfo, LoadSpinnerResult } from './types';

// Re-export the types needed for implementations
export type { SpinnerSettings, SpinnerSegment, AuthInfo, LoadSpinnerResult };

/**
 * Abstract base class for spinner implementations.
 * Each application must provide its own implementation of this class.
 */
export abstract class SpinnerBase {
  /**
   * Get the current authentication status
   * 
   * @returns {Promise<AuthInfo>} Authentication information
   */
  abstract getAuthInfo(): Promise<AuthInfo>;

  /**
   * Authenticate with the backend service
   * 
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @returns {Promise<AuthInfo>} Authentication result
   */
  abstract authenticate(email: string, password: string): Promise<AuthInfo>;

  /**
   * Log out the current user
   * 
   * @returns {Promise<void>}
   */
  abstract logout(): Promise<void>;

  /**
   * Load all spinner settings for the current user
   * 
   * @returns {Promise<LoadSpinnerResult>} The loaded spinner settings
   */
  abstract loadSpinnerSettings(): Promise<LoadSpinnerResult>;

  /**
   * Load a specific spinner setting by ID
   * 
   * @param {string} id - The spinner settings ID
   * @returns {Promise<SpinnerSettings | null>} The spinner settings or null if not found
   */
  abstract loadSpinnerSettingById(id: string): Promise<SpinnerSettings | null>;

  /**
   * Save spinner settings to storage
   * 
   * @param {SpinnerSettings} settings - The settings to save
   * @returns {Promise<{ success: boolean, error?: string, id?: string }>} Result with new ID if created
   */
  abstract saveSpinnerSettings(settings: SpinnerSettings): Promise<{ 
    success: boolean;
    error?: string;
    id?: string;
  }>;

  /**
   * Delete spinner settings
   * 
   * @param {string} id - The ID of the settings to delete
   * @returns {Promise<{ success: boolean, error?: string }>} Result of the operation
   */
  abstract deleteSpinnerSettings(id: string): Promise<{ 
    success: boolean;
    error?: string;
  }>;

  /**
   * Update the current active spinner
   * 
   * @param {string} id - ID of the spinner to set as active
   * @returns {Promise<{ success: boolean, error?: string }>} Result of the operation
   */
  abstract setActiveSpinner(id: string): Promise<{
    success: boolean;
    error?: string;
  }>;

  /**
   * Get the ID of the currently active spinner
   * 
   * @returns {Promise<string | null>} ID of the active spinner or null if none
   */
  abstract getActiveSpinnerId(): Promise<string | null>;

  /**
   * Get application-specific configuration
   * 
   * @returns {Promise<any>} Application configuration
   */
  abstract getConfig(): Promise<any>;
}