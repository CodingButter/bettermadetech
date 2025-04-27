/**
 * DocsSpinnerClient
 * 
 * Implements the SpinnerBase abstract class for the documentation site.
 * This is a demo implementation that provides static sample data
 * for demonstration purposes.
 */

import { SpinnerBase, SpinnerSettings, LoadSpinnerResult, AuthInfo } from '@repo/spinner';

// Sample spinner settings for documentation and demo purposes
const SAMPLE_SPINNERS: SpinnerSettings[] = [
  {
    id: 'sample-1',
    name: 'Decision Maker',
    segments: [
      { id: 'yes', label: 'Yes', value: 'yes', color: '#22c55e' },
      { id: 'no', label: 'No', value: 'no', color: '#ef4444' },
      { id: 'maybe', label: 'Maybe', value: 'maybe', color: '#f59e0b' },
    ],
    duration: 5,
    primaryColor: '#4f46e5',
    secondaryColor: '#f97316',
    showConfetti: true,
  },
  {
    id: 'sample-2',
    name: 'Lunch Picker',
    segments: [
      { id: 'pizza', label: 'Pizza', value: 'pizza' },
      { id: 'sushi', label: 'Sushi', value: 'sushi' },
      { id: 'burger', label: 'Burger', value: 'burger' },
      { id: 'salad', label: 'Salad', value: 'salad' },
      { id: 'pasta', label: 'Pasta', value: 'pasta' },
      { id: 'tacos', label: 'Tacos', value: 'tacos' },
    ],
    duration: 8,
    primaryColor: '#0ea5e9',
    secondaryColor: '#8b5cf6',
    showConfetti: true,
  },
  {
    id: 'sample-3',
    name: 'Team Member Selector',
    segments: [
      { id: 'alice', label: 'Alice', value: 'alice@example.com' },
      { id: 'bob', label: 'Bob', value: 'bob@example.com' },
      { id: 'charlie', label: 'Charlie', value: 'charlie@example.com' },
      { id: 'diana', label: 'Diana', value: 'diana@example.com' },
    ],
    duration: 4,
    primaryColor: '#84cc16',
    secondaryColor: '#ec4899',
    showConfetti: false,
  },
];

/**
 * DocsSpinnerClient class that implements SpinnerBase
 * for the documentation site with demo data.
 */
export class DocsSpinnerClient extends SpinnerBase {
  // Storage key constants for localStorage in the browser
  private readonly AUTH_STORAGE_KEY = 'docs_spinner_auth';
  private readonly ACTIVE_SPINNER_KEY = 'docs_active_spinner_id';
  
  // In-memory storage for settings (demo purposes only)
  private spinnerSettings: SpinnerSettings[] = [...SAMPLE_SPINNERS];

  /**
   * Get the current authentication status.
   * For documentation purposes, we simulate authentication.
   * 
   * @returns {Promise<AuthInfo>} Authentication information
   */
  async getAuthInfo(): Promise<AuthInfo> {
    try {
      // In browser environments, try to get auth from localStorage
      if (typeof localStorage !== 'undefined') {
        const authJson = localStorage.getItem(this.AUTH_STORAGE_KEY);
        
        if (authJson) {
          return JSON.parse(authJson) as AuthInfo;
        }
      }
      
      // Default state - unauthenticated
      return { isAuthenticated: false };
    } catch (error) {
      console.error('Failed to get auth info:', error);
      return { isAuthenticated: false };
    }
  }

  /**
   * Simulate authentication for documentation/demo purposes.
   * Any username/password with an @example.com email will work.
   * 
   * @param {string} email - User's email address
   * @param {string} password - User's password (not validated)
   * @returns {Promise<AuthInfo>} Authentication result
   */
  async authenticate(email: string, password: string): Promise<AuthInfo> {
    try {
      // Simple validation - just check for email format
      if (!email || !email.includes('@')) {
        return { isAuthenticated: false };
      }
      
      // Demo mode: authenticate any example.com email with any password
      // or any non-empty email if we're in demo mode
      const authInfo: AuthInfo = {
        isAuthenticated: true,
        email,
        token: 'demo-token-' + Date.now(),
        userId: 'demo-user',
      };
      
      // Store auth info in localStorage if available
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.AUTH_STORAGE_KEY, JSON.stringify(authInfo));
      }
      
      return authInfo;
    } catch (error) {
      console.error('Authentication failed:', error);
      return { isAuthenticated: false };
    }
  }

  /**
   * Log out the current user.
   * 
   * @returns {Promise<void>}
   */
  async logout(): Promise<void> {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.AUTH_STORAGE_KEY);
    }
  }

  /**
   * Load spinner settings from the demo data.
   * 
   * @returns {Promise<LoadSpinnerResult>} The loaded spinner settings
   */
  async loadSpinnerSettings(): Promise<LoadSpinnerResult> {
    try {
      const authInfo = await this.getAuthInfo();
      
      if (!authInfo.isAuthenticated) {
        return { 
          success: false, 
          error: 'Not authenticated' 
        };
      }
      
      // Return the sample spinner settings
      return {
        success: true,
        settings: this.spinnerSettings,
      };
    } catch (error) {
      console.error('Failed to load spinner settings:', error);
      return {
        success: false,
        error: 'Failed to load settings: ' + (error instanceof Error ? error.message : String(error)),
      };
    }
  }

  /**
   * Load a specific spinner setting by ID from the demo data.
   * 
   * @param {string} id - The spinner settings ID
   * @returns {Promise<SpinnerSettings | null>} The spinner settings or null if not found
   */
  async loadSpinnerSettingById(id: string): Promise<SpinnerSettings | null> {
    try {
      const authInfo = await this.getAuthInfo();
      
      if (!authInfo.isAuthenticated) {
        return null;
      }
      
      return this.spinnerSettings.find(s => s.id === id) || null;
    } catch (error) {
      console.error('Failed to load spinner setting by ID:', error);
      return null;
    }
  }

  /**
   * Save spinner settings to the demo data.
   * For docs demo, this adds or updates an item in the in-memory array.
   * 
   * @param {SpinnerSettings} settings - The settings to save
   * @returns {Promise<{ success: boolean, error?: string, id?: string }>} Result with new ID if created
   */
  async saveSpinnerSettings(settings: SpinnerSettings): Promise<{ 
    success: boolean;
    error?: string;
    id?: string;
  }> {
    try {
      const authInfo = await this.getAuthInfo();
      
      if (!authInfo.isAuthenticated) {
        return { 
          success: false, 
          error: 'Not authenticated' 
        };
      }
      
      let spinnerId = settings.id;
      
      if (settings.id) {
        // Update existing spinner
        const index = this.spinnerSettings.findIndex(s => s.id === settings.id);
        if (index >= 0) {
          this.spinnerSettings[index] = { ...settings };
        } else {
          return {
            success: false,
            error: 'Spinner not found',
          };
        }
      } else {
        // Create new spinner with a unique ID
        spinnerId = 'spinner-' + Date.now();
        this.spinnerSettings.push({
          ...settings,
          id: spinnerId,
          userId: authInfo.userId,
        });
      }
      
      return {
        success: true,
        id: spinnerId,
      };
    } catch (error) {
      console.error('Failed to save spinner settings:', error);
      return {
        success: false,
        error: 'Failed to save settings: ' + (error instanceof Error ? error.message : String(error)),
      };
    }
  }

  /**
   * Delete spinner settings from the demo data.
   * For docs demo, this removes an item from the in-memory array.
   * 
   * @param {string} id - The ID of the settings to delete
   * @returns {Promise<{ success: boolean, error?: string }>} Result of the operation
   */
  async deleteSpinnerSettings(id: string): Promise<{ 
    success: boolean;
    error?: string;
  }> {
    try {
      const authInfo = await this.getAuthInfo();
      
      if (!authInfo.isAuthenticated) {
        return { 
          success: false, 
          error: 'Not authenticated' 
        };
      }
      
      // Find the spinner index
      const index = this.spinnerSettings.findIndex(s => s.id === id);
      
      if (index < 0) {
        return {
          success: false,
          error: 'Spinner not found',
        };
      }
      
      // Remove the spinner
      this.spinnerSettings.splice(index, 1);
      
      // If this was the active spinner, unset it
      const activeId = await this.getActiveSpinnerId();
      if (activeId === id && typeof localStorage !== 'undefined') {
        localStorage.removeItem(this.ACTIVE_SPINNER_KEY);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Failed to delete spinner settings:', error);
      return {
        success: false,
        error: 'Failed to delete settings: ' + (error instanceof Error ? error.message : String(error)),
      };
    }
  }

  /**
   * Update the current active spinner.
   * For docs demo, this stores the active spinner ID in localStorage.
   * 
   * @param {string} id - ID of the spinner to set as active
   * @returns {Promise<{ success: boolean, error?: string }>} Result of the operation
   */
  async setActiveSpinner(id: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.ACTIVE_SPINNER_KEY, id);
      }
      return { success: true };
    } catch (error) {
      console.error('Failed to set active spinner:', error);
      return {
        success: false,
        error: 'Failed to set active spinner: ' + (error instanceof Error ? error.message : String(error)),
      };
    }
  }

  /**
   * Get the ID of the currently active spinner.
   * For docs demo, this retrieves the active spinner ID from localStorage.
   * 
   * @returns {Promise<string | null>} ID of the active spinner or null if none
   */
  async getActiveSpinnerId(): Promise<string | null> {
    try {
      if (typeof localStorage !== 'undefined') {
        return localStorage.getItem(this.ACTIVE_SPINNER_KEY);
      }
      return 'sample-1'; // Default for SSR
    } catch (error) {
      console.error('Failed to get active spinner ID:', error);
      return null;
    }
  }

  /**
   * Get application-specific configuration.
   * For docs demo, this returns default configuration values.
   * 
   * @returns {Promise<any>} Application configuration
   */
  async getConfig(): Promise<any> {
    return {
      directusUrl: 'https://demo.directus.io',
      defaultDuration: 5,
      defaultPrimaryColor: '#4f46e5',
      defaultSecondaryColor: '#f97316',
      defaultShowConfetti: true,
    };
  }
}