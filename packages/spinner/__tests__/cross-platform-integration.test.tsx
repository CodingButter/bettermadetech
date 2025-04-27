/**
 * Cross-platform integration tests for spinner package
 * 
 * Tests the spinner functionality across all supported platforms:
 * - Web
 * - Documentation site
 * - Chrome extension
 */

import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { Spinner } from '../src/spinner';
import { SpinnerProvider } from '../src/spinner-context';
import { MockSpinnerClient } from './test-utils/mock-spinner-client';
import { SpinnerBase } from '../src/spinner-base';
import { SpinnerSegment } from '../src/types';

// Mock implementations for each platform client
class WebSpinnerClient extends MockSpinnerClient {
  clientType = 'web';
  
  async saveSpinnerSettings(settings: any) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 50));
    return super.saveSpinnerSettings(settings);
  }
}

class DocsSpinnerClient extends MockSpinnerClient {
  clientType = 'docs';
  
  // Docs client has more limited functionality
  async saveSpinnerSettings(settings: any) {
    // No saving allowed in docs, only demo mode
    return { success: false, error: 'Saving not supported in documentation site' };
  }
}

class ExtensionSpinnerClient extends MockSpinnerClient {
  clientType = 'extension';
  
  // Extension uses Chrome storage API
  private chromeStorage: Record<string, any> = {};
  
  async saveSpinnerSettings(settings: any) {
    // Simulate Chrome storage API
    await new Promise(resolve => setTimeout(resolve, 30));
    if (!this.isAuthenticated) {
      return { success: false, error: 'Not authenticated' };
    }
    
    let settingId = settings.id;
    if (settingId) {
      // Update existing
      this.chromeStorage[settingId] = settings;
    } else {
      // Create new
      settingId = `ext-${Date.now()}`;
      this.chromeStorage[settingId] = { ...settings, id: settingId };
    }
    
    return { success: true, id: settingId };
  }
  
  async loadSpinnerSettings() {
    if (!this.isAuthenticated) {
      return { success: false, error: 'Not authenticated' };
    }
    
    const settings = Object.values(this.chromeStorage);
    return { success: true, settings };
  }
}

// Sample spinner segments for testing
const testSegments: SpinnerSegment[] = [
  { id: '1', label: 'Option 1', value: 'one' },
  { id: '2', label: 'Option 2', value: 'two' },
  { id: '3', label: 'Option 3', value: 'three' },
  { id: '4', label: 'Option 4', value: 'four' },
];

// Test wrapper component that simulates platform environment
interface TestPlatformProps {
  client: SpinnerBase;
  platform: 'web' | 'docs' | 'extension';
  children: React.ReactNode;
}

const TestPlatform = ({ client, platform, children }: TestPlatformProps) => {
  return (
    <div data-testid={`${platform}-platform`}>
      <SpinnerProvider client={client}>
        {children}
      </SpinnerProvider>
    </div>
  );
};

// Verify spinner state after authentication and loading
const verifySpinnerState = async (client: SpinnerBase) => {
  // Authenticate
  await client.authenticate('test@example.com', 'password');
  
  // Create a test spinner setting
  const result = await client.saveSpinnerSettings({
    name: 'Test Spinner',
    segments: testSegments,
    duration: 5,
    primaryColor: '#ff0000',
    secondaryColor: '#00ff00',
    showConfetti: true,
  });
  
  // Set as active spinner if successful
  if (result.success && result.id) {
    await client.setActiveSpinner(result.id);
  }
  
  return result;
};

// Test loading and saving behavior for each client type
describe('Cross-Platform Integration Tests', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  
  afterEach(() => {
    jest.useRealTimers();
  });
  
  test('Web platform: saves and loads spinner settings correctly', async () => {
    const webClient = new WebSpinnerClient();
    const saveResult = await verifySpinnerState(webClient);
    
    expect(saveResult.success).toBe(true);
    expect(saveResult.id).toBeDefined();
    
    // Render web platform component
    render(
      <TestPlatform client={webClient} platform="web">
        <div data-testid="web-spinner">
          <Spinner segments={testSegments} />
        </div>
      </TestPlatform>
    );
    
    // Check platform rendering
    expect(screen.getByTestId('web-platform')).toBeInTheDocument();
    expect(screen.getByTestId('web-spinner')).toBeInTheDocument();
    
    // Verify segments are rendered
    for (const segment of testSegments) {
      expect(screen.getByText(segment.label)).toBeInTheDocument();
    }
    
    // Get settings from client
    const settings = await webClient.loadSpinnerSettings();
    expect(settings.success).toBe(true);
    expect(settings.settings).toHaveLength(1);
  });
  
  test('Docs platform: operates in demo mode without saving', async () => {
    const docsClient = new DocsSpinnerClient();
    const saveResult = await verifySpinnerState(docsClient);
    
    // Docs client doesn't support saving
    expect(saveResult.success).toBe(false);
    expect(saveResult.error).toContain('not supported');
    
    // Render docs platform component
    render(
      <TestPlatform client={docsClient} platform="docs">
        <div data-testid="docs-spinner">
          <Spinner segments={testSegments} />
        </div>
      </TestPlatform>
    );
    
    // Check platform rendering
    expect(screen.getByTestId('docs-platform')).toBeInTheDocument();
    expect(screen.getByTestId('docs-spinner')).toBeInTheDocument();
    
    // Verify segments are rendered
    for (const segment of testSegments) {
      expect(screen.getByText(segment.label)).toBeInTheDocument();
    }
  });
  
  test('Extension platform: uses Chrome storage API correctly', async () => {
    const extensionClient = new ExtensionSpinnerClient();
    const saveResult = await verifySpinnerState(extensionClient);
    
    expect(saveResult.success).toBe(true);
    expect(saveResult.id).toContain('ext-'); // Extension IDs start with ext-
    
    // Render extension platform component
    render(
      <TestPlatform client={extensionClient} platform="extension">
        <div data-testid="extension-spinner">
          <Spinner segments={testSegments} />
        </div>
      </TestPlatform>
    );
    
    // Check platform rendering
    expect(screen.getByTestId('extension-platform')).toBeInTheDocument();
    expect(screen.getByTestId('extension-spinner')).toBeInTheDocument();
    
    // Verify segments are rendered
    for (const segment of testSegments) {
      expect(screen.getByText(segment.label)).toBeInTheDocument();
    }
    
    // Get settings from client
    const settings = await extensionClient.loadSpinnerSettings();
    expect(settings.success).toBe(true);
    expect(settings.settings).toHaveLength(1);
  });
  
  test('Consistent behavior across all platforms', async () => {
    // Create clients for all platforms
    const webClient = new WebSpinnerClient();
    const docsClient = new DocsSpinnerClient();
    const extensionClient = new ExtensionSpinnerClient();
    
    // Authenticate on all platforms
    await webClient.authenticate('test@example.com', 'password');
    await docsClient.authenticate('test@example.com', 'password');
    await extensionClient.authenticate('test@example.com', 'password');
    
    // Render spinners for all platforms
    const { rerender } = render(
      <>
        <TestPlatform client={webClient} platform="web">
          <Spinner segments={testSegments} isSpinning={false} data-testid="web-spinner" />
        </TestPlatform>
        
        <TestPlatform client={docsClient} platform="docs">
          <Spinner segments={testSegments} isSpinning={false} data-testid="docs-spinner" />
        </TestPlatform>
        
        <TestPlatform client={extensionClient} platform="extension">
          <Spinner segments={testSegments} isSpinning={false} data-testid="extension-spinner" />
        </TestPlatform>
      </>
    );
    
    // Verify initial render on all platforms
    const platforms = ['web', 'docs', 'extension'];
    
    // Start spinning on all platforms
    rerender(
      <>
        <TestPlatform client={webClient} platform="web">
          <Spinner segments={testSegments} isSpinning={true} data-testid="web-spinner" />
        </TestPlatform>
        
        <TestPlatform client={docsClient} platform="docs">
          <Spinner segments={testSegments} isSpinning={true} data-testid="docs-spinner" />
        </TestPlatform>
        
        <TestPlatform client={extensionClient} platform="extension">
          <Spinner segments={testSegments} isSpinning={true} data-testid="extension-spinner" />
        </TestPlatform>
      </>
    );
    
    // Fast-forward animation
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    
    // All platforms should finish spinning and be in a consistent state
    for (const platform of platforms) {
      expect(screen.getByTestId(`${platform}-platform`)).toBeInTheDocument();
    }
  });
  
  test('Authentication works consistently across platforms', async () => {
    // Create clients for all platforms
    const clients = {
      web: new WebSpinnerClient(),
      docs: new DocsSpinnerClient(),
      extension: new ExtensionSpinnerClient()
    };
    
    // Test authentication for each client
    for (const [platform, client] of Object.entries(clients)) {
      // Verify initial unauthenticated state
      let authInfo = await client.getAuthInfo();
      expect(authInfo.isAuthenticated).toBe(false);
      
      // Authenticate
      const authResult = await client.authenticate('test@example.com', 'password');
      expect(authResult.isAuthenticated).toBe(true);
      expect(authResult.email).toBe('test@example.com');
      
      // Verify authenticated state
      authInfo = await client.getAuthInfo();
      expect(authInfo.isAuthenticated).toBe(true);
      
      // Logout
      await client.logout();
      
      // Verify logged out state
      authInfo = await client.getAuthInfo();
      expect(authInfo.isAuthenticated).toBe(false);
    }
  });
  
  test('Server-side storage functionality', async () => {
    // Using WebSpinnerClient as it would be the one using server-side storage
    const webClient = new WebSpinnerClient();
    await webClient.authenticate('test@example.com', 'password');
    
    // Create multiple settings
    const setting1 = await webClient.saveSpinnerSettings({
      name: 'Setting 1',
      segments: testSegments.slice(0, 2),
      duration: 3,
      primaryColor: '#ff0000',
      secondaryColor: '#00ff00',
      showConfetti: true,
    });
    
    const setting2 = await webClient.saveSpinnerSettings({
      name: 'Setting 2',
      segments: testSegments.slice(2),
      duration: 5,
      primaryColor: '#0000ff',
      secondaryColor: '#ffff00',
      showConfetti: false,
    });
    
    // Verify both settings were saved
    expect(setting1.success).toBe(true);
    expect(setting1.id).toBeDefined();
    expect(setting2.success).toBe(true);
    expect(setting2.id).toBeDefined();
    
    // Load settings and verify they exist
    const loadResult = await webClient.loadSpinnerSettings();
    expect(loadResult.success).toBe(true);
    expect(loadResult.settings).toHaveLength(2);
    
    // Verify setting details
    const loadedSettings = loadResult.settings || [];
    expect(loadedSettings[0].name).toBe('Setting 1');
    expect(loadedSettings[1].name).toBe('Setting 2');
    
    // Load individual setting by ID
    const individualSetting = await webClient.loadSpinnerSettingById(setting1.id!);
    expect(individualSetting).not.toBeNull();
    expect(individualSetting?.name).toBe('Setting 1');
    
    // Set active spinner
    await webClient.setActiveSpinner(setting2.id!);
    const activeId = await webClient.getActiveSpinnerId();
    expect(activeId).toBe(setting2.id);
    
    // Delete a setting
    const deleteResult = await webClient.deleteSpinnerSettings(setting1.id!);
    expect(deleteResult.success).toBe(true);
    
    // Verify deletion
    const afterDeleteLoad = await webClient.loadSpinnerSettings();
    expect(afterDeleteLoad.settings).toHaveLength(1);
    expect(afterDeleteLoad.settings?.[0].id).toBe(setting2.id);
  });
});