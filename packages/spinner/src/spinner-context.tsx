/**
 * Spinner Context
 * 
 * Provides a React context for passing the spinner client implementation
 * to components throughout the application.
 */

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { SpinnerBase } from './spinner-base';
import { SpinnerSettings, AuthInfo } from './types';

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
}

/**
 * Provider component for spinner context
 */
export function SpinnerProvider({ client, children }: SpinnerProviderProps) {
  const [auth, setAuth] = useState<AuthInfo | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [spinnerSettings, setSpinnerSettings] = useState<SpinnerSettings[] | null>(null);
  const [isLoadingSettings, setIsLoadingSettings] = useState(false);
  const [activeSpinnerId, setActiveSpinnerId] = useState<string | null>(null);
  const [isSettingActive, setIsSettingActive] = useState(false);

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