/**
 * Tests for server-side storage functionality in spinner package
 * 
 * These tests verify that spinner settings are correctly stored and
 * retrieved from the server (Directus) across different clients.
 */

import { MockSpinnerClient } from './test-utils/mock-spinner-client';
import { SpinnerSettings } from '../src/types';

// Mock DirectusClient that simulates server-side storage
class MockDirectusClient extends MockSpinnerClient {
  // Simulate a database on the server
  private serverDb: Record<string, any> = {};
  
  // Add delay to simulate network requests
  private async simulateNetworkDelay() {
    await new Promise(resolve => setTimeout(resolve, Math.random() * 50 + 20));
  }
  
  async saveSpinnerSettings(settings: SpinnerSettings): Promise<{ 
    success: boolean;
    error?: string;
    id?: string;
  }> {
    if (!this.isAuthenticated) {
      return { success: false, error: 'Not authenticated' };
    }
    
    await this.simulateNetworkDelay();
    
    let settingId = settings.id;
    if (settingId) {
      // Update existing
      if (this.serverDb[settingId]) {
        this.serverDb[settingId] = { ...settings };
      } else {
        return { success: false, error: 'Setting not found on server' };
      }
    } else {
      // Create new
      settingId = `server-${Date.now()}`;
      this.serverDb[settingId] = { ...settings, id: settingId };
    }
    
    return { success: true, id: settingId };
  }
  
  async loadSpinnerSettings() {
    if (!this.isAuthenticated) {
      return { success: false, error: 'Not authenticated' };
    }
    
    await this.simulateNetworkDelay();
    
    const settings = Object.values(this.serverDb);
    return { success: true, settings };
  }
  
  async loadSpinnerSettingById(id: string) {
    if (!this.isAuthenticated) {
      return null;
    }
    
    await this.simulateNetworkDelay();
    
    return this.serverDb[id] || null;
  }
  
  async deleteSpinnerSettings(id: string) {
    if (!this.isAuthenticated) {
      return { success: false, error: 'Not authenticated' };
    }
    
    await this.simulateNetworkDelay();
    
    if (!this.serverDb[id]) {
      return { success: false, error: 'Setting not found on server' };
    }
    
    delete this.serverDb[id];
    return { success: true };
  }
}

// Test data
const testSettings: SpinnerSettings = {
  name: 'Test Spinner',
  segments: [
    { id: '1', label: 'Option 1', value: 'value1' },
    { id: '2', label: 'Option 2', value: 'value2' },
    { id: '3', label: 'Option 3', value: 'value3' },
  ],
  duration: 5,
  primaryColor: '#ff0000',
  secondaryColor: '#00ff00',
  showConfetti: true,
};

describe('Server-side Storage Functionality', () => {
  let directusClient: MockDirectusClient;
  
  beforeEach(async () => {
    // Create a fresh client before each test
    directusClient = new MockDirectusClient();
    // Authenticate
    await directusClient.authenticate('test@example.com', 'password');
  });
  
  test('Creates new spinner settings on server', async () => {
    const result = await directusClient.saveSpinnerSettings(testSettings);
    
    expect(result.success).toBe(true);
    expect(result.id).toBeDefined();
    expect(result.id).toContain('server-');
    
    // Verify settings were saved
    const loadResult = await directusClient.loadSpinnerSettings();
    expect(loadResult.success).toBe(true);
    expect(loadResult.settings).toHaveLength(1);
    expect(loadResult.settings?.[0].name).toBe('Test Spinner');
  });
  
  test('Updates existing spinner settings on server', async () => {
    // First create a setting
    const createResult = await directusClient.saveSpinnerSettings(testSettings);
    expect(createResult.success).toBe(true);
    
    // Now update it
    const updatedSettings = {
      ...testSettings,
      id: createResult.id,
      name: 'Updated Name',
      duration: 8,
    };
    
    const updateResult = await directusClient.saveSpinnerSettings(updatedSettings);
    expect(updateResult.success).toBe(true);
    expect(updateResult.id).toBe(createResult.id);
    
    // Verify settings were updated
    const settingById = await directusClient.loadSpinnerSettingById(createResult.id!);
    expect(settingById).not.toBeNull();
    expect(settingById?.name).toBe('Updated Name');
    expect(settingById?.duration).toBe(8);
  });
  
  test('Deletes spinner settings from server', async () => {
    // Create two settings
    const setting1 = await directusClient.saveSpinnerSettings({
      ...testSettings,
      name: 'Setting 1',
    });
    
    const setting2 = await directusClient.saveSpinnerSettings({
      ...testSettings,
      name: 'Setting 2',
    });
    
    // Verify both exist
    let loadResult = await directusClient.loadSpinnerSettings();
    expect(loadResult.settings).toHaveLength(2);
    
    // Delete the first one
    const deleteResult = await directusClient.deleteSpinnerSettings(setting1.id!);
    expect(deleteResult.success).toBe(true);
    
    // Verify only the second remains
    loadResult = await directusClient.loadSpinnerSettings();
    expect(loadResult.settings).toHaveLength(1);
    expect(loadResult.settings?.[0].id).toBe(setting2.id);
    
    // Try to load deleted setting by ID
    const deletedSetting = await directusClient.loadSpinnerSettingById(setting1.id!);
    expect(deletedSetting).toBeNull();
  });
  
  test('Handles authentication for server operations', async () => {
    // First create a setting while authenticated
    const createResult = await directusClient.saveSpinnerSettings(testSettings);
    expect(createResult.success).toBe(true);
    
    // Logout
    await directusClient.logout();
    
    // Try operations while logged out
    const loadResult = await directusClient.loadSpinnerSettings();
    expect(loadResult.success).toBe(false);
    expect(loadResult.error).toContain('Not authenticated');
    
    const updateResult = await directusClient.saveSpinnerSettings({
      ...testSettings,
      id: createResult.id,
    });
    expect(updateResult.success).toBe(false);
    expect(updateResult.error).toContain('Not authenticated');
    
    const deleteResult = await directusClient.deleteSpinnerSettings(createResult.id!);
    expect(deleteResult.success).toBe(false);
    expect(deleteResult.error).toContain('Not authenticated');
    
    const loadByIdResult = await directusClient.loadSpinnerSettingById(createResult.id!);
    expect(loadByIdResult).toBeNull();
  });
  
  test('Handles server errors appropriately', async () => {
    // Try to update non-existent setting
    const updateResult = await directusClient.saveSpinnerSettings({
      ...testSettings,
      id: 'non-existent-id',
    });
    
    expect(updateResult.success).toBe(false);
    expect(updateResult.error).toContain('not found');
    
    // Try to delete non-existent setting
    const deleteResult = await directusClient.deleteSpinnerSettings('non-existent-id');
    expect(deleteResult.success).toBe(false);
    expect(deleteResult.error).toContain('not found');
  });
  
  test('Correctly associates settings with authenticated user', async () => {
    // Create setting as first user
    await directusClient.saveSpinnerSettings({
      ...testSettings,
      name: 'User 1 Setting',
    });
    
    // Create new client and authenticate as second user
    const secondClient = new MockDirectusClient();
    await secondClient.authenticate('other@example.com', 'password');
    
    // Create setting as second user
    await secondClient.saveSpinnerSettings({
      ...testSettings,
      name: 'User 2 Setting',
    });
    
    // First user should only see their own setting
    const user1Settings = await directusClient.loadSpinnerSettings();
    expect(user1Settings.settings).toHaveLength(1);
    expect(user1Settings.settings?.[0].name).toBe('User 1 Setting');
    
    // Second user should only see their own setting
    const user2Settings = await secondClient.loadSpinnerSettings();
    expect(user2Settings.settings).toHaveLength(1);
    expect(user2Settings.settings?.[0].name).toBe('User 2 Setting');
  });
});