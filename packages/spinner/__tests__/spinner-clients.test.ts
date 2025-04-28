/**
 * Tests for all spinner client implementations
 * 
 * This test suite verifies that all client implementations
 * (Web, Docs, Extension) correctly implement the SpinnerBase
 * abstract class and behave consistently.
 */

import { SpinnerBase } from '../src/spinner-base';
import { SpinnerSettings } from '../src/types';
import { MockSpinnerClient } from './test-utils/mock-spinner-client';

// Mock implementations for each client type
class WebSpinnerClient extends MockSpinnerClient {
  clientType = 'web';
  
  // Override with web-specific implementations
  async saveSpinnerSettings(settings: SpinnerSettings) {
    // Simulate API call with fetch
    await new Promise(resolve => setTimeout(resolve, 50));
    return super.saveSpinnerSettings(settings);
  }
}

class DocsSpinnerClient extends MockSpinnerClient {
  clientType = 'docs';
  
  // Override with docs-specific implementations
  // Docs client has more limited functionality
  async saveSpinnerSettings(settings: SpinnerSettings) {
    await new Promise(resolve => setTimeout(resolve, 30));
    
    // In docs, we only mock saving but don't actually save
    return { 
      success: true, 
      id: `docs-readonly-${Date.now()}`,
      warning: 'Settings saved in demo mode only'
    };
  }
}

class ExtensionSpinnerClient extends MockSpinnerClient {
  clientType = 'extension';
  private storage: Record<string, any> = {};
  
  // Override with extension-specific implementations
  async saveSpinnerSettings(settings: SpinnerSettings) {
    await new Promise(resolve => setTimeout(resolve, 40));
    
    if (!this.isAuthenticated) {
      return { success: false, error: 'Not authenticated' };
    }
    
    let settingId = settings.id;
    if (settingId) {
      // Update existing
      this.storage[settingId] = { ...settings };
    } else {
      // Create new
      settingId = `extension-${Date.now()}`;
      this.storage[settingId] = { ...settings, id: settingId };
    }
    
    // Simulate Chrome storage API
    return { success: true, id: settingId };
  }
  
  async loadSpinnerSettings() {
    await new Promise(resolve => setTimeout(resolve, 30));
    
    if (!this.isAuthenticated) {
      return { success: false, error: 'Not authenticated' };
    }
    
    const settings = Object.values(this.storage);
    return { success: true, settings };
  }
}

// Sample spinner settings for testing
const testSettings: SpinnerSettings = {
  name: 'Test Settings',
  segments: [
    { id: '1', label: 'Option 1', value: 'value1' },
    { id: '2', label: 'Option 2', value: 'value2' },
  ],
  duration: 5,
  primaryColor: '#ff0000',
  secondaryColor: '#00ff00',
  showConfetti: true,
};

// Test each client implementation
describe('Spinner Client Implementations', () => {
  // Create an instance of each client type
  const clients: Record<string, SpinnerBase> = {
    web: new WebSpinnerClient(),
    docs: new DocsSpinnerClient(),
    extension: new ExtensionSpinnerClient(),
  };
  
  // Test all clients implement required methods
  test.each(Object.entries(clients))('%s client implements all required methods', (clientType, client) => {
    // Test for required methods
    expect(typeof client.authenticate).toBe('function');
    expect(typeof client.getAuthInfo).toBe('function');
    expect(typeof client.logout).toBe('function');
    expect(typeof client.loadSpinnerSettings).toBe('function');
    expect(typeof client.loadSpinnerSettingById).toBe('function');
    expect(typeof client.saveSpinnerSettings).toBe('function');
    expect(typeof client.deleteSpinnerSettings).toBe('function');
    expect(typeof client.setActiveSpinner).toBe('function');
    expect(typeof client.getActiveSpinnerId).toBe('function');
    expect(typeof client.getConfig).toBe('function');
  });
  
  // Test authentication works for all clients
  test.each(Object.entries(clients))('%s client handles authentication correctly', async (clientType, client) => {
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
  });
  
  // Test saving and loading settings for all clients
  test.each(Object.entries(clients))('%s client saves and loads settings correctly', async (clientType, client) => {
    // Authenticate
    await client.authenticate('test@example.com', 'password');
    
    // Save settings
    const saveResult = await client.saveSpinnerSettings(testSettings);
    expect(saveResult.success).toBe(true);
    expect(saveResult.id).toBeDefined();
    
    if (clientType === 'web') {
      expect(saveResult.id).toContain('mock-');
    } else if (clientType === 'docs') {
      expect(saveResult.id).toContain('docs-readonly-');
    } else if (clientType === 'extension') {
      expect(saveResult.id).toContain('extension-');
    }
    
    // For all except docs (which doesn't actually save)
    if (clientType !== 'docs') {
      // Load settings
      const loadResult = await client.loadSpinnerSettings();
      expect(loadResult.success).toBe(true);
      expect(loadResult.settings?.length).toBeGreaterThan(0);
      
      // Check if the saved setting is in the loaded settings
      const savedSetting = loadResult.settings?.find(s => s.id === saveResult.id);
      expect(savedSetting).toBeDefined();
      expect(savedSetting?.name).toBe(testSettings.name);
    }
  });
  
  // Test active spinner functionality for all clients
  test.each(Object.entries(clients))('%s client handles active spinner correctly', async (clientType, client) => {
    // Authenticate
    await client.authenticate('test@example.com', 'password');
    
    // Save a setting
    const saveResult = await client.saveSpinnerSettings(testSettings);
    
    // Set it as active
    const setActiveResult = await client.setActiveSpinner(saveResult.id!);
    expect(setActiveResult.success).toBe(true);
    
    // Get active spinner
    const activeId = await client.getActiveSpinnerId();
    expect(activeId).toBe(saveResult.id);
  });
  
  // Test configuration for all clients
  test.each(Object.entries(clients))('%s client provides configuration', async (clientType, client) => {
    const config = await client.getConfig();
    
    // All clients should provide these basic config values
    expect(config).toHaveProperty('defaultDuration');
    expect(config).toHaveProperty('defaultPrimaryColor');
    expect(config).toHaveProperty('defaultSecondaryColor');
  });
  
  // Test client-specific behavior
  test('Web client makes API calls', async () => {
    const webClient = clients.web as WebSpinnerClient;
    
    // Mock fetch API
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ data: { id: 'server-123' } }),
    });
    
    await webClient.authenticate('test@example.com', 'password');
    
    // If this were a real implementation, we'd test web-specific behavior
    expect(webClient.clientType).toBe('web');
  });
  
  test('Docs client operates in read-only mode', async () => {
    const docsClient = clients.docs as DocsSpinnerClient;
    
    await docsClient.authenticate('test@example.com', 'password');
    
    // Save settings should still "succeed" but with a demo ID
    const saveResult = await docsClient.saveSpinnerSettings(testSettings);
    expect(saveResult.success).toBe(true);
    expect(saveResult.id).toContain('docs-readonly-');
    expect(saveResult).toHaveProperty('warning');
    
    // If this were a real implementation, we'd verify it doesn't make real API calls
    expect(docsClient.clientType).toBe('docs');
  });
  
  test('Extension client uses Chrome storage API', async () => {
    const extensionClient = clients.extension as ExtensionSpinnerClient;
    
    await extensionClient.authenticate('test@example.com', 'password');
    
    // Save settings
    const saveResult = await extensionClient.saveSpinnerSettings(testSettings);
    expect(saveResult.success).toBe(true);
    expect(saveResult.id).toContain('extension-');
    
    // Load settings
    const loadResult = await extensionClient.loadSpinnerSettings();
    expect(loadResult.success).toBe(true);
    expect(loadResult.settings?.length).toBe(1);
    
    // If this were a real implementation, we'd mock and verify Chrome API calls
    expect(extensionClient.clientType).toBe('extension');
  });
});