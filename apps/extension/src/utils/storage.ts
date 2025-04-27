// Utility functions for Chrome storage
import { DIRECTUS_CONFIG, APP_CONFIG } from './env-config';

// Define user settings interface
export interface UserSettings {
  directusUrl: string;
  directusToken: string;
  spinner: {
    spinDuration: number;
    primaryColor: string;
    secondaryColor: string;
    showConfetti: boolean;
  };
  // Additional settings can be added here
}

// Define the storage schema
export interface StorageItems {
  options?: {
    theme?: 'light' | 'dark';
    notifications?: boolean;
    showIconInToolbar?: boolean;
    openSidePanelAutomatically?: boolean;
    shareAnonymousData?: boolean;
    clearDataOnClose?: boolean;
    [key: string]: any;
  };
  userData?: {
    lastVisited?: string;
    email?: string;
    loggedIn?: boolean;
    token?: string;
    [key: string]: any;
  };
  spinnerConfig?: {
    spinDuration: number;
    primaryColor: string;
    secondaryColor: string;
    showConfetti: boolean;
  };
  directus?: {
    url: string;
    token: string;
    authToken?: string;  // User-specific auth token when logged in
  };
  [key: string]: any;
}

// Get items from chrome.storage.local
export const getStorageItems = async <T extends keyof StorageItems>(keys: T | T[] | null): Promise<Pick<StorageItems, T>> => {
  return new Promise((resolve) => {
    chrome.storage.local.get(keys, (items) => {
      resolve(items as Pick<StorageItems, T>);
    });
  });
};

// Set items in chrome.storage.local
export const setStorageItems = async (items: Partial<StorageItems>): Promise<void> => {
  return new Promise((resolve) => {
    chrome.storage.local.set(items, () => {
      resolve();
    });
  });
};

// Remove items from chrome.storage.local
export const removeStorageItems = async (keys: keyof StorageItems | (keyof StorageItems)[]): Promise<void> => {
  return new Promise((resolve) => {
    chrome.storage.local.remove(keys as string | string[], () => {
      resolve();
    });
  });
};

// Clear all storage
export const clearStorage = async (): Promise<void> => {
  return new Promise((resolve) => {
    chrome.storage.local.clear(() => {
      resolve();
    });
  });
};

// Get user settings with defaults
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

// Update user settings
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

// Initialize default settings if not already set
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