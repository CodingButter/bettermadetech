/**
 * Spinner Context
 * 
 * Provides a React context for passing the spinner client implementation
 * to components throughout the application.
 */

import React, { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react';
import { SpinnerBase } from './spinner-base';
import { SpinnerSettings, AuthInfo } from './types';

// Local storage key for high contrast mode preference
const HIGH_CONTRAST_MODE_KEY = 'spinner_high_contrast_mode';

/**
 * Spinner context state interface
 */
interface SpinnerContextType {
  /** The spinner client implementation */
  client: SpinnerBase | null;
  /** Current authentication status */
  auth: AuthInfo | null;
  /** Whether authentication is being checked */
  isAuthLoading: boolean;
  /** Currently loaded spinner settings */
  spinnerSettings: SpinnerSettings[] | null;
  /** Whether spinner settings are being loaded */
  isLoadingSettings: boolean;
  /** Currently active spinner ID */
  activeSpinnerId: string | null;
  /** Whether the active spinner is being set */
  isSettingActive: boolean;
  /** Whether high contrast mode is enabled */
  highContrastMode: boolean;
  /** Toggle high contrast mode */
  toggleHighContrastMode: () => void;  
  /** Refresh spinner settings */
  refreshSettings: () => Promise<void>;
  /** Set active spinner */
  setActiveSpinner: (id: string) => Promise<void>;
}

// Create the context with a default value
const SpinnerContext = createContext<SpinnerContextType>({
  client: null,
  auth: null,
  isAuthLoading: false,
  spinnerSettings: null,
  isLoadingSettings: false,
  activeSpinnerId: null,
  isSettingActive: false,
  highContrastMode: false,
  toggleHighContrastMode: () => {},
  refreshSettings: async () => {},
  setActiveSpinner: async () => {},
});

/**
 * Props for the SpinnerProvider component
 */
interface SpinnerProviderProps {
  /** The spinner client implementation */
  client: SpinnerBase;
  /** Child components */
  children: ReactNode;
  /** Optional initial high contrast mode state */
  initialHighContrast?: boolean;
}

/**
 * Provider component for spinner context
 */
export function SpinnerProvider({ 
  client, 
  children, 
  initialHighContrast 
}: SpinnerProviderProps) {
  const [auth, setAuth] = useState<AuthInfo | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [spinnerSettings, setSpinnerSettings] = useState<SpinnerSettings[] | null>(null);
  const [isLoadingSettings, setIsLoadingSettings] = useState(false);
  const [activeSpinnerId, setActiveSpinnerId] = useState<string | null>(null);
  const [isSettingActive, setIsSettingActive] = useState(false);
  const [highContrastMode, setHighContrastMode] = useState<boolean>(() => {
    // Use initialHighContrast if provided, otherwise check localStorage or system preference
    if (initialHighContrast !== undefined) return initialHighContrast;
    
    // Check local storage first
    if (typeof window !== 'undefined') {
      const storedPreference = localStorage.getItem(HIGH_CONTRAST_MODE_KEY);
      if (storedPreference !== null) {
        return storedPreference === 'true';
      }
      
      // If not in local storage, check system preference for high contrast
      return window.matchMedia('(prefers-contrast: more)').matches;
    }
    
    return false;
  });

  // Toggle high contrast mode
  const toggleHighContrastMode = useCallback(() => {
    setHighContrastMode(prevMode => {
      const newMode = !prevMode;
      
      // Save preference to local storage
      if (typeof window !== 'undefined') {
        localStorage.setItem(HIGH_CONTRAST_MODE_KEY, String(newMode));
      }
      
      return newMode;
    });
  }, []);

  // Listen for system high contrast mode changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: more)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if user hasn't explicitly set a preference
      if (localStorage.getItem(HIGH_CONTRAST_MODE_KEY) === null) {
        setHighContrastMode(e.matches);
      }
    };
    
    // Some older browsers use addListener/removeListener
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else if ('addListener' in mediaQuery) {
      // TypeScript doesn't recognize these deprecated methods, using type assertion
      (mediaQuery as any).addListener(handleChange);
      return () => (mediaQuery as any).removeListener(handleChange);
    }
  }, []);

  // Load authentication status on mount
  useEffect(() => {
    const loadAuth = async () => {
      try {
        setIsAuthLoading(true);
        const authInfo = await client.getAuthInfo();
        setAuth(authInfo);
        
        if (authInfo.isAuthenticated) {
          refreshSettings();
        }
      } catch (error) {
        console.error('Failed to load auth info:', error);
      } finally {
        setIsAuthLoading(false);
      }
    };

    loadAuth();
  }, [client]);

  // Load active spinner ID
  useEffect(() => {
    const loadActiveSpinner = async () => {
      try {
        const id = await client.getActiveSpinnerId();
        setActiveSpinnerId(id);
      } catch (error) {
        console.error('Failed to load active spinner:', error);
      }
    };

    loadActiveSpinner();
  }, [client]);

  /**
   * Refresh spinner settings
   */
  const refreshSettings = async () => {
    try {
      setIsLoadingSettings(true);
      const result = await client.loadSpinnerSettings();
      
      if (result.success && result.settings) {
        setSpinnerSettings(result.settings);
      } else {
        console.error('Failed to load spinner settings:', result.error);
      }
    } catch (error) {
      console.error('Error loading spinner settings:', error);
    } finally {
      setIsLoadingSettings(false);
    }
  };

  /**
   * Set the active spinner
   */
  const handleSetActiveSpinner = async (id: string) => {
    try {
      setIsSettingActive(true);
      const result = await client.setActiveSpinner(id);
      
      if (result.success) {
        setActiveSpinnerId(id);
      } else {
        console.error('Failed to set active spinner:', result.error);
      }
    } catch (error) {
      console.error('Error setting active spinner:', error);
    } finally {
      setIsSettingActive(false);
    }
  };

  const value = {
    client,
    auth,
    isAuthLoading,
    spinnerSettings,
    isLoadingSettings,
    activeSpinnerId,
    isSettingActive,
    highContrastMode,
    toggleHighContrastMode,
    refreshSettings,
    setActiveSpinner: handleSetActiveSpinner,
  };

  return (
    <SpinnerContext.Provider value={value}>
      {children}
    </SpinnerContext.Provider>
  );
}

/**
 * Hook to use the spinner context
 * 
 * @returns {SpinnerContextType} The spinner context
 */
export function useSpinner(): SpinnerContextType {
  const context = useContext(SpinnerContext);
  
  if (!context.client) {
    throw new Error('useSpinner must be used within a SpinnerProvider');
  }
  
  return context;
}