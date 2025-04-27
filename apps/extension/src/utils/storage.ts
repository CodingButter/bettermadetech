/**
 * Utility functions for Chrome storage with type-safe access to extension data.
 * These utilities provide a convenient interface for Chrome's storage API with
 * proper TypeScript typing and promisified access.
 * 
 * @module storage
 */
import { DIRECTUS_CONFIG, APP_CONFIG } from './env-config';

/**
 * User settings interface representing configurable options in the extension.
 * This includes connection settings for Directus and spinner configuration.
 */
export interface UserSettings {
  /** Directus API URL for backend connection */
  directusUrl: string;
  /** Directus admin token for API authentication */
  directusToken: string;
  /** Spinner visual and behavior configuration */
  spinner: {
    /** Duration of spin animation in seconds */
    spinDuration: number;
    /** Primary color for spinner segments (hex format) */
    primaryColor: string;
    /** Secondary color for spinner segments (hex format) */
    secondaryColor: string;
    /** Whether to show confetti effect when spinner stops */
    showConfetti: boolean;
  };
}

/**
 * Complete storage schema for the extension.
 * This defines all data structures stored in Chrome's local storage.
 */
export interface StorageItems {
  /** User interface options and preferences */
  options?: {
    /** Theme preference (light or dark) */
    theme?: 'light' | 'dark';
    /** Whether to show notifications */
    notifications?: boolean;
    /** Whether to show extension icon in toolbar */
    showIconInToolbar?: boolean;
    /** Whether to open side panel automatically on certain pages */
    openSidePanelAutomatically?: boolean;
    /** Whether to share anonymous usage data */
    shareAnonymousData?: boolean;
    /** Whether to clear data when extension is closed */
    clearDataOnClose?: boolean;
    /** Additional options (for future expansion) */
    [key: string]: any;
  };
  /** User account information */
  userData?: {
    /** Timestamp of last visited session */
    lastVisited?: string;
    /** User email address */
    email?: string;
    /** Whether user is currently logged in */
    loggedIn?: boolean;
    /** Authentication token */
    token?: string;
    /** Additional user data (for future expansion) */
    [key: string]: any;
  };
  /** Spinner configuration settings */
  spinnerConfig?: {
    /** Duration of spin animation in seconds */
    spinDuration: number;
    /** Primary color for spinner segments (hex format) */
    primaryColor: string;
    /** Secondary color for spinner segments (hex format) */
    secondaryColor: string;
    /** Whether to show confetti effect when spinner stops */
    showConfetti: boolean;
  };
  /** Directus API connection settings */
  directus?: {
    /** Directus API URL */
    url: string;
    /** Directus admin token */
    token: string;
    /** User-specific auth token when logged in */
    authToken?: string;
  };
  /** Additional storage items (for future expansion) */
  [key: string]: any;
}

/**
 * Gets items from Chrome's local storage.
 * 
 * @template T - Type parameter extending keyof StorageItems
 * @param {T | T[] | null} keys - Keys to retrieve from storage, or null for all
 * @returns {Promise<Pick<StorageItems, T>>} - Promise resolving to the requested items
 */
export const getStorageItems = async <T extends keyof StorageItems>(keys: T | T[] | null): Promise<Pick<StorageItems, T>> => {
  return new Promise((resolve) => {
    chrome.storage.local.get(keys, (items) => {
      resolve(items as Pick<StorageItems, T>);
    });
  });
};

/**
 * Sets items in Chrome's local storage.
 * 
 * @param {Partial<StorageItems>} items - Items to store
 * @returns {Promise<void>} - Promise that resolves when storage operation completes
 */
export const setStorageItems = async (items: Partial<StorageItems>): Promise<void> => {
  return new Promise((resolve) => {
    chrome.storage.local.set(items, () => {
      resolve();
    });
  });
};

/**
 * Removes items from Chrome's local storage.
 * 
 * @param {keyof StorageItems | (keyof StorageItems)[]} keys - Keys to remove
 * @returns {Promise<void>} - Promise that resolves when deletion completes
 */
export const removeStorageItems = async (keys: keyof StorageItems | (keyof StorageItems)[]): Promise<void> => {
  return new Promise((resolve) => {
    chrome.storage.local.remove(keys as string | string[], () => {
      resolve();
    });
  });
};

/**
 * Clears all data from Chrome's local storage.
 * 
 * @returns {Promise<void>} - Promise that resolves when storage is cleared
 */
export const clearStorage = async (): Promise<void> => {
  return new Promise((resolve) => {
    chrome.storage.local.clear(() => {
      resolve();
    });
  });
};

/**
 * Gets current user settings with fallback defaults.
 * 
 * @returns {Promise<UserSettings>} - Promise resolving to user settings
 */
export const getUserSettings = async (): Promise<UserSettings> => {
  const { directus, spinnerConfig } = await getStorageItems(['directus', 'spinnerConfig']);
  
  return {
    directusUrl: directus?.url || 'https://admin.bettermade.tech',
    directusToken: directus?.token || '',
    spinner: {
      spinDuration: spinnerConfig?.spinDuration || 5,
      primaryColor: spinnerConfig?.primaryColor || '#4f46e5',
      secondaryColor: spinnerConfig?.secondaryColor || '#f97316',
      showConfetti: spinnerConfig?.showConfetti || false,
    }
  };
};

/**
 * Updates user settings in storage.
 * 
 * @param {UserSettings} settings - New settings to save
 * @returns {Promise<void>} - Promise that resolves when settings are saved
 */
export const updateUserSettings = async (settings: UserSettings): Promise<void> => {
  await setStorageItems({
    directus: {
      url: settings.directusUrl,
      token: settings.directusToken,
    },
    spinnerConfig: {
      spinDuration: settings.spinner.spinDuration,
      primaryColor: settings.spinner.primaryColor,
      secondaryColor: settings.spinner.secondaryColor,
      showConfetti: settings.spinner.showConfetti,
    }
  });
};

/**
 * Initializes default settings if not already set in storage.
 * This should be called when the extension starts.
 * 
 * @returns {Promise<void>} - Promise that resolves when initialization is complete
 */
export const initializeDefaultSettings = async (): Promise<void> => {
  const { directus, spinnerConfig } = await getStorageItems(['directus', 'spinnerConfig']);
  
  const updatedItems: Partial<StorageItems> = {};
  
  if (!directus) {
    updatedItems.directus = {
      url: DIRECTUS_CONFIG.API_URL,
      token: DIRECTUS_CONFIG.ADMIN_TOKEN,
    };
  }
  
  if (!spinnerConfig) {
    updatedItems.spinnerConfig = {
      spinDuration: APP_CONFIG.DEFAULT_SPINNER.SPIN_DURATION,
      primaryColor: APP_CONFIG.DEFAULT_SPINNER.PRIMARY_COLOR,
      secondaryColor: APP_CONFIG.DEFAULT_SPINNER.SECONDARY_COLOR,
      showConfetti: APP_CONFIG.DEFAULT_SPINNER.SHOW_CONFETTI,
    };
  }
  
  if (Object.keys(updatedItems).length > 0) {
    await setStorageItems(updatedItems);
  }
};