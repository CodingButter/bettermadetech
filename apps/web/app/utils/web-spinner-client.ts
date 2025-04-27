/**
 * WebSpinnerClient
 * 
 * Implements the SpinnerBase abstract class for the web application.
 * This client handles all spinner-related functionality including:
 * - Authentication with Directus
 * - Loading/saving spinner settings
 * - Managing active spinner selection
 * - Integration with browser localStorage
 */

import { SpinnerBase, SpinnerSettings, LoadSpinnerResult, AuthInfo } from '@repo/spinner';

/**
 * WebSpinnerClient class that implements SpinnerBase
 * for the web application environment.
 */
export class WebSpinnerClient extends SpinnerBase {
  // Base URL for the Directus API
  private apiBaseUrl: string;
  // Storage key constants
  private readonly AUTH_STORAGE_KEY = 'spinner_auth';
  private readonly SETTINGS_STORAGE_KEY = 'spinner_settings';
  private readonly ACTIVE_SPINNER_KEY = 'active_spinner_id';

  /**
   * Constructor for WebSpinnerClient
   * 
   * @param apiBaseUrl - Base URL for the Directus API
   */
  constructor(apiBaseUrl = 'https://admin.bettermade.tech') {
    super();
    this.apiBaseUrl = apiBaseUrl;
  }

  /**
   * Get the current authentication status
   * 
   * @returns {Promise<AuthInfo>} Authentication information
   */
  async getAuthInfo(): Promise<AuthInfo> {
    try {
      const authJson = localStorage.getItem(this.AUTH_STORAGE_KEY);
      
      if (!authJson) {
        return { isAuthenticated: false };
      }
      
      const auth = JSON.parse(authJson) as AuthInfo;
      return auth;
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
      const response = await fetch(`${this.apiBaseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        throw new Error(`Authentication failed with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.data?.access_token) {
        return { isAuthenticated: false };
      }
      
      const authInfo: AuthInfo = {
        isAuthenticated: true,
        email,
        token: data.data.access_token,
        userId: data.data.user?.id,
      };
      
      // Store auth info in localStorage
      localStorage.setItem(this.AUTH_STORAGE_KEY, JSON.stringify(authInfo));
      
      return authInfo;
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
    localStorage.removeItem(this.AUTH_STORAGE_KEY);
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
      
      const response = await fetch(`${this.apiBaseUrl}/items/spinners?fields=*,segments.*`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authInfo.token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to load spinners with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Convert Directus spinner format to our SpinnerSettings format
      const settings = (data.data || []).map((spinner: any) => ({
        id: spinner.id,
        name: spinner.name,
        segments: spinner.segments || [],
        duration: spinner.duration || 5,
        primaryColor: spinner.primary_color || '#4f46e5',
        secondaryColor: spinner.secondary_color || '#f97316',
        showConfetti: spinner.show_confetti || false,
        userId: spinner.user_created,
      }));
      
      // Cache settings in localStorage for offline use
      localStorage.setItem(this.SETTINGS_STORAGE_KEY, JSON.stringify(settings));
      
      return {
        success: true,
        settings,
      };
    } catch (error) {
      console.error('Failed to load spinner settings:', error);
      
      // Try to load from cache if online request failed
      try {
        const cachedSettings = localStorage.getItem(this.SETTINGS_STORAGE_KEY);
        if (cachedSettings) {
          return {
            success: true,
            settings: JSON.parse(cachedSettings),
          };
        }
      } catch (e) {
        console.error('Failed to load cached settings:', e);
      }
      
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
      const authInfo = await this.getAuthInfo();
      
      if (!authInfo.isAuthenticated || !authInfo.token) {
        return null;
      }
      
      const response = await fetch(`${this.apiBaseUrl}/items/spinners/${id}?fields=*,segments.*`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authInfo.token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to load spinner with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.data) {
        return null;
      }
      
      // Convert Directus spinner format to our SpinnerSettings format
      return {
        id: data.data.id,
        name: data.data.name,
        segments: data.data.segments || [],
        duration: data.data.duration || 5,
        primaryColor: data.data.primary_color || '#4f46e5',
        secondaryColor: data.data.secondary_color || '#f97316',
        showConfetti: data.data.show_confetti || false,
        userId: data.data.user_created,
      };
    } catch (error) {
      console.error('Failed to load spinner setting by ID:', error);
      
      // Try to load from cache if online request failed
      try {
        const cachedSettings = localStorage.getItem(this.SETTINGS_STORAGE_KEY);
        if (cachedSettings) {
          const settings = JSON.parse(cachedSettings) as SpinnerSettings[];
          return settings.find(s => s.id === id) || null;
        }
      } catch (e) {
        console.error('Failed to load cached settings:', e);
      }
      
      return null;
    }
  }

  /**
   * Save spinner settings to Directus
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
      
      // Prepare the spinner data in Directus format
      const spinnerData = {
        name: settings.name,
        duration: settings.duration,
        primary_color: settings.primaryColor,
        secondary_color: settings.secondaryColor,
        show_confetti: settings.showConfetti,
      };
      
      let spinnerId = settings.id;
      
      // Create or update spinner
      if (settings.id) {
        // Update existing spinner
        const updateResponse = await fetch(`${this.apiBaseUrl}/items/spinners/${settings.id}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${authInfo.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(spinnerData),
        });
        
        if (!updateResponse.ok) {
          throw new Error(`Failed to update spinner with status: ${updateResponse.status}`);
        }
      } else {
        // Create new spinner
        const createResponse = await fetch(`${this.apiBaseUrl}/items/spinners`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authInfo.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(spinnerData),
        });
        
        if (!createResponse.ok) {
          throw new Error(`Failed to create spinner with status: ${createResponse.status}`);
        }
        
        const createData = await createResponse.json();
        spinnerId = createData.data.id;
      }
      
      // Handle segments - this requires multiple API calls
      if (settings.segments && settings.segments.length > 0) {
        // Get existing segments if this is an update
        let existingSegments: any[] = [];
        
        if (settings.id) {
          const segmentsResponse = await fetch(`${this.apiBaseUrl}/items/segments?filter[spinner_id][_eq]=${settings.id}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${authInfo.token}`,
              'Content-Type': 'application/json',
            },
          });
          
          if (segmentsResponse.ok) {
            const segmentsData = await segmentsResponse.json();
            existingSegments = segmentsData.data || [];
          }
        }
        
        // Track existing segment IDs to delete any that aren't in the new set
        const existingSegmentIds = existingSegments.map((segment: any) => segment.id);
        const processedSegmentIds: string[] = [];
        
        // Update or create each segment
        for (const segment of settings.segments) {
          const segmentData = {
            spinner_id: spinnerId,
            label: segment.label,
            value: segment.value,
            color: segment.color,
          };
          
          if (segment.id && existingSegmentIds.includes(segment.id)) {
            // Update existing segment
            await fetch(`${this.apiBaseUrl}/items/segments/${segment.id}`, {
              method: 'PATCH',
              headers: {
                'Authorization': `Bearer ${authInfo.token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(segmentData),
            });
            
            processedSegmentIds.push(segment.id);
          } else {
            // Create new segment
            await fetch(`${this.apiBaseUrl}/items/segments`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${authInfo.token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(segmentData),
            });
          }
        }
        
        // Delete segments that aren't in the new set
        for (const segmentId of existingSegmentIds) {
          if (!processedSegmentIds.includes(segmentId)) {
            await fetch(`${this.apiBaseUrl}/items/segments/${segmentId}`, {
              method: 'DELETE',
              headers: {
                'Authorization': `Bearer ${authInfo.token}`,
                'Content-Type': 'application/json',
              },
            });
          }
        }
      }
      
      // Refresh the settings cache
      await this.loadSpinnerSettings();
      
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
      
      const response = await fetch(`${this.apiBaseUrl}/items/spinners/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authInfo.token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete spinner with status: ${response.status}`);
      }
      
      // If this was the active spinner, unset it
      const activeId = await this.getActiveSpinnerId();
      if (activeId === id) {
        localStorage.removeItem(this.ACTIVE_SPINNER_KEY);
      }
      
      // Refresh the settings cache
      await this.loadSpinnerSettings();
      
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
      localStorage.setItem(this.ACTIVE_SPINNER_KEY, id);
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
      return localStorage.getItem(this.ACTIVE_SPINNER_KEY);
    } catch (error) {
      console.error('Failed to get active spinner ID:', error);
      return null;
    }
  }

  /**
   * Get application-specific configuration
   * 
   * @returns {Promise<any>} Application configuration
   */
  async getConfig(): Promise<any> {
    return {
      directusUrl: this.apiBaseUrl,
      defaultDuration: 5,
      defaultPrimaryColor: '#4f46e5',
      defaultSecondaryColor: '#f97316',
      defaultShowConfetti: false,
    };
  }
}