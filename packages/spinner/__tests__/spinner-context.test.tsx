import React, { useEffect } from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { SpinnerProvider, useSpinner } from '../src/spinner-context';
import { SpinnerBase, SpinnerSettings, LoadSpinnerResult, AuthInfo } from '../src/spinner-base';

/**
 * Mock Spinner Client implementation for testing
 */
class MockSpinnerClient extends SpinnerBase {
  private authInfo: AuthInfo = { isAuthenticated: false };
  private activeSpinnerId: string | null = null;
  private spinnerSettings: SpinnerSettings[] = [
    {
      id: 'test-spinner-1',
      name: 'Test Spinner 1',
      segments: [
        { id: '1', label: 'Option 1', value: '1' },
        { id: '2', label: 'Option 2', value: '2' },
      ],
      duration: 5,
      primaryColor: '#ff0000',
      secondaryColor: '#00ff00',
      showConfetti: true,
    }
  ];

  async getAuthInfo(): Promise<AuthInfo> {
    return this.authInfo;
  }

  async authenticate(email: string, password: string): Promise<AuthInfo> {
    this.authInfo = { 
      isAuthenticated: true, 
      email, 
      token: 'mock-token',
      userId: 'mock-user',
    };
    return this.authInfo;
  }

  async logout(): Promise<void> {
    this.authInfo = { isAuthenticated: false };
    this.activeSpinnerId = null;
  }

  async loadSpinnerSettings(): Promise<LoadSpinnerResult> {
    if (!this.authInfo.isAuthenticated) {
      return { success: false, error: 'Not authenticated' };
    }
    return { success: true, settings: this.spinnerSettings };
  }

  async loadSpinnerSettingById(id: string): Promise<SpinnerSettings | null> {
    if (!this.authInfo.isAuthenticated) {
      return null;
    }
    return this.spinnerSettings.find(s => s.id === id) || null;
  }

  async saveSpinnerSettings(settings: SpinnerSettings): Promise<{ 
    success: boolean;
    error?: string;
    id?: string;
  }> {
    if (!this.authInfo.isAuthenticated) {
      return { success: false, error: 'Not authenticated' };
    }

    if (settings.id) {
      const index = this.spinnerSettings.findIndex(s => s.id === settings.id);
      if (index >= 0) {
        this.spinnerSettings[index] = { ...settings };
      }
      return { success: true, id: settings.id };
    } else {
      const id = `test-spinner-${Date.now()}`;
      this.spinnerSettings.push({ ...settings, id });
      return { success: true, id };
    }
  }

  async deleteSpinnerSettings(id: string): Promise<{ 
    success: boolean;
    error?: string;
  }> {
    if (!this.authInfo.isAuthenticated) {
      return { success: false, error: 'Not authenticated' };
    }

    const index = this.spinnerSettings.findIndex(s => s.id === id);
    if (index >= 0) {
      this.spinnerSettings.splice(index, 1);
      if (this.activeSpinnerId === id) {
        this.activeSpinnerId = null;
      }
      return { success: true };
    }
    
    return { success: false, error: 'Setting not found' };
  }

  async setActiveSpinner(id: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    this.activeSpinnerId = id;
    return { success: true };
  }

  async getActiveSpinnerId(): Promise<string | null> {
    return this.activeSpinnerId;
  }

  async getConfig(): Promise<any> {
    return {
      defaultDuration: 5,
      defaultPrimaryColor: '#000000',
      defaultSecondaryColor: '#ffffff',
    };
  }
}

/**
 * Test component that consumes the SpinnerContext
 */
const TestComponent = () => {
  const { 
    auth, 
    client, 
    spinnerSettings, 
    activeSpinnerId, 
    isAuthLoading, 
    isLoadingSettings,
    refreshSettings,
    setActiveSpinner,
  } = useSpinner();

  // Authenticate on mount for testing
  useEffect(() => {
    const runAuth = async () => {
      if (!auth?.isAuthenticated && client) {
        await client.authenticate('test@example.com', 'password');
        await refreshSettings();
      }
    };
    runAuth();
  }, [auth, client, refreshSettings]);

  // Set active spinner after settings are loaded
  useEffect(() => {
    const setActive = async () => {
      const firstSpinner = spinnerSettings && spinnerSettings.length > 0 ? spinnerSettings[0] : null;
      if (firstSpinner && !activeSpinnerId && firstSpinner.id) {
        await setActiveSpinner(firstSpinner.id);
      }
    };
    setActive();
  }, [spinnerSettings, activeSpinnerId, setActiveSpinner]);

  if (isAuthLoading || isLoadingSettings) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div data-testid="auth-status">
        {auth?.isAuthenticated ? 'Authenticated' : 'Not authenticated'}
      </div>
      
      {spinnerSettings && (
        <div data-testid="settings-count">
          {spinnerSettings.length} spinner(s)
        </div>
      )}
      
      {activeSpinnerId && (
        <div data-testid="active-spinner">
          Active: {activeSpinnerId}
        </div>
      )}
    </div>
  );
};

describe('SpinnerContext', () => {
  let mockClient: MockSpinnerClient;

  beforeEach(() => {
    mockClient = new MockSpinnerClient();
  });

  test('provides spinner client via context', async () => {
    render(
      <SpinnerProvider client={mockClient}>
        <TestComponent />
      </SpinnerProvider>
    );
    
    // Initial loading state
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    
    // Wait for auth and loading to complete
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
    });
    
    // Check that settings are loaded
    await waitFor(() => {
      expect(screen.getByTestId('settings-count')).toHaveTextContent('1 spinner(s)');
    });
    
    // Check that active spinner is set
    await waitFor(() => {
      expect(screen.getByTestId('active-spinner')).toHaveTextContent('Active: test-spinner-1');
    });
  });

  test('throws error when useSpinner is used outside provider', () => {
    // Suppress error logging for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useSpinner must be used within a SpinnerProvider');
    
    consoleSpy.mockRestore();
  });
});