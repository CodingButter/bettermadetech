/**
 * ExtensionSpinnerClient
 * 
 * Implements the SpinnerBase abstract class for the Chrome extension.
 * This client handles all spinner-related functionality including:
 * - Authentication with Directus
 * - Loading/saving spinner settings
 * - Managing active spinner selection
 * - Integration with Chrome storage API
 */

import { SpinnerBase, SpinnerSettings, LoadSpinnerResult, AuthInfo } from '@repo/spinner';
import { getUserSettings, getStorageItems, setStorageItems } from './storage';
import { 
  loginToDirectus as directusLogin, 
  fetchUserSpinners, 
  createSpinner,
  updateSpinner,
  deleteSpinner
} from './directus';

/**
 * ExtensionSpinnerClient class that implements SpinnerBase
 * for the Chrome extension environment.
 */
export class ExtensionSpinnerClient extends SpinnerBase {
  /**
   * Get the current authentication status
   * 
   * @returns {Promise<AuthInfo>} Authentication information
   */
  async getAuthInfo(): Promise<AuthInfo> {
    try {
      const { userData } = await getStorageItems(['userData']);
      
      const userEmail = userData?.email ? String(userData.email) : undefined;
      const userToken = userData?.token ? String(userData.token) : undefined;
      const userId = userData?.userId ? String(userData.userId) : undefined;
      
      return {
        isAuthenticated: !!userData?.loggedIn,
        email: userEmail,
        token: userToken,
        userId: userId,
      };
    } catch (error) {
      console.error('Failed to get auth info:', error);
      return { isAuthenticated: false };
    }
  }

  /**
   * Authenticate with Directus
   * 
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @returns {Promise<AuthInfo>} Authentication result
   */
  async authenticate(email: string, password: string): Promise<AuthInfo> {
    try {
      const token = await directusLogin(email, password);
      
      if (!token) {
        return { isAuthenticated: false };
      }
      
      // Save auth data to storage
      await setStorageItems({
        userData: {
          email,
          loggedIn: true,
          token,
        },
      });
      
      return {
        isAuthenticated: true,
        email,
        token,
      };
    } catch (error) {
      console.error('Authentication failed:', error);
      return { isAuthenticated: false };
    }
  }

  /**
   * Log out the current user
   * 
   * @returns {Promise<void>}
   */
  async logout(): Promise<void> {
    await setStorageItems({
      userData: {
        loggedIn: false,
        token: '',
        email: '',
      },
    });
  }

  /**
   * Load all spinner settings for the current user
   * 
   * @returns {Promise<LoadSpinnerResult>} The loaded spinner settings
   */
  async loadSpinnerSettings(): Promise<LoadSpinnerResult> {
    try {
      const authInfo = await this.getAuthInfo();
      
      if (!authInfo.isAuthenticated || !authInfo.token) {
        return { 
          success: false, 
          error: 'Not authenticated' 
        };
      }
      
      const spinnerData = await fetchUserSpinners(authInfo.token);
      
      // Convert Directus spinner format to our SpinnerSettings format
      const settings = spinnerData.map(spinner => ({
        id: spinner.id,
        name: spinner.name,
        segments: spinner.segments || [],
        duration: 5, // Default duration
        primaryColor: '#4f46e5', // Default primary color
        secondaryColor: '#f97316', // Default secondary color
        showConfetti: false, // Default confetti setting
        userId: authInfo.userId,
      }));
      
      return {
        success: true,
        settings,
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
   * Load a specific spinner setting by ID
   * 
   * @param {string} id - The spinner settings ID
   * @returns {Promise<SpinnerSettings | null>} The spinner settings or null if not found
   */
  async loadSpinnerSettingById(id: string): Promise<SpinnerSettings | null> {
    try {
      const result = await this.loadSpinnerSettings();
      
      if (!result.success || !result.settings) {
        return null;
      }
      
      return result.settings.find(setting => setting.id === id) || null;
    } catch (error) {
      console.error('Failed to load spinner setting by ID:', error);
      return null;
    }
  }

  /**
   * Save spinner settings to storage
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
      
      if (!authInfo.isAuthenticated || !authInfo.token) {
        return { 
          success: false, 
          error: 'Not authenticated' 
        };
      }
      
      if (settings.id) {
        // Update existing spinner
        const success = await updateSpinner(authInfo.token, settings.id, {
          name: settings.name,
          segments: settings.segments,
        });
        
        return {
          success,
          id: settings.id,
          error: success ? undefined : 'Failed to update spinner',
        };
      } else {
        // Create new spinner
        const result = await createSpinner(
          authInfo.token,
          settings.name,
          settings.segments
        );
        
        if (result) {
          return {
            success: true,
            id: result.id,
          };
        } else {
          return {
            success: false,
            error: 'Failed to create spinner',
          };
        }
      }
    } catch (error) {
      console.error('Failed to save spinner settings:', error);
      return {
        success: false,
        error: 'Failed to save settings: ' + (error instanceof Error ? error.message : String(error)),
      };
    }
  }

  /**
   * Delete spinner settings
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
      
      if (!authInfo.isAuthenticated || !authInfo.token) {
        return { 
          success: false, 
          error: 'Not authenticated' 
        };
      }
      
      const success = await deleteSpinner(authInfo.token, id);
      
      // If this was the active spinner, unset it
      const activeId = await this.getActiveSpinnerId();
      if (activeId === id) {
        await setStorageItems({
          activeSpinnerId: null,
        });
      }
      
      return {
        success,
        error: success ? undefined : 'Failed to delete spinner',
      };
    } catch (error) {
      console.error('Failed to delete spinner settings:', error);
      return {
        success: false,
        error: 'Failed to delete settings: ' + (error instanceof Error ? error.message : String(error)),
      };
    }
  }

  /**
   * Update the current active spinner
   * 
   * @param {string} id - ID of the spinner to set as active
   * @returns {Promise<{ success: boolean, error?: string }>} Result of the operation
   */
  async setActiveSpinner(id: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      await setStorageItems({
        activeSpinnerId: id,
      });
      
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
   * Get the ID of the currently active spinner
   * 
   * @returns {Promise<string | null>} ID of the active spinner or null if none
   */
  async getActiveSpinnerId(): Promise<string | null> {
    try {
      const { activeSpinnerId } = await getStorageItems(['activeSpinnerId']);
      if (typeof activeSpinnerId === 'string') {
        return activeSpinnerId;
      }
      return null;
    } catch (error) {
      console.error('Failed to get active spinner ID:', error);
      return null;
    }
  }

  /**
   * Get application-specific configuration
   * 
   * @returns {Promise<Record<string, unknown>>} Application configuration
   */
  async getConfig(): Promise<Record<string, unknown>> {
    const settings = await getUserSettings();
    
    return {
      directusUrl: settings.directusUrl,
      defaultDuration: settings.spinner.spinDuration,
      defaultPrimaryColor: settings.spinner.primaryColor,
      defaultSecondaryColor: settings.spinner.secondaryColor,
      defaultShowConfetti: settings.spinner.showConfetti,
    };
  }
}