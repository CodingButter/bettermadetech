import { SpinnerBase, SpinnerSettings, LoadSpinnerResult, AuthInfo } from '../src/spinner-base';

/**
 * Mock implementation of SpinnerBase for testing
 */
class MockSpinnerClient extends SpinnerBase {
  private isAuthenticated = false;
  private activeSpinnerId: string | null = null;
  private spinnerSettings: SpinnerSettings[] = [];

  async getAuthInfo(): Promise<AuthInfo> {
    return { isAuthenticated: this.isAuthenticated };
  }

  async authenticate(email: string, password: string): Promise<AuthInfo> {
    // For testing, authenticate any non-empty email/password
    if (email && password) {
      this.isAuthenticated = true;
      return { isAuthenticated: true, email, token: 'mock-token' };
    }
    return { isAuthenticated: false };
  }

  async logout(): Promise<void> {
    this.isAuthenticated = false;
  }

  async loadSpinnerSettings(): Promise<LoadSpinnerResult> {
    if (!this.isAuthenticated) {
      return { success: false, error: 'Not authenticated' };
    }
    return { success: true, settings: this.spinnerSettings };
  }

  async loadSpinnerSettingById(id: string): Promise<SpinnerSettings | null> {
    if (!this.isAuthenticated) {
      return null;
    }
    return this.spinnerSettings.find(s => s.id === id) || null;
  }

  async saveSpinnerSettings(settings: SpinnerSettings): Promise<{ 
    success: boolean;
    error?: string;
    id?: string;
  }> {
    if (!this.isAuthenticated) {
      return { success: false, error: 'Not authenticated' };
    }

    let settingId = settings.id;
    if (settingId) {
      // Update existing
      const index = this.spinnerSettings.findIndex(s => s.id === settingId);
      if (index >= 0) {
        this.spinnerSettings[index] = { ...settings };
      } else {
        return { success: false, error: 'Setting not found' };
      }
    } else {
      // Create new
      settingId = `mock-${Date.now()}`;
      this.spinnerSettings.push({ ...settings, id: settingId });
    }
    
    return { success: true, id: settingId };
  }

  async deleteSpinnerSettings(id: string): Promise<{ 
    success: boolean;
    error?: string;
  }> {
    if (!this.isAuthenticated) {
      return { success: false, error: 'Not authenticated' };
    }

    const index = this.spinnerSettings.findIndex(s => s.id === id);
    if (index < 0) {
      return { success: false, error: 'Setting not found' };
    }
    
    this.spinnerSettings.splice(index, 1);
    if (this.activeSpinnerId === id) {
      this.activeSpinnerId = null;
    }
    
    return { success: true };
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

describe('SpinnerBase', () => {
  let spinnerClient: MockSpinnerClient;
  
  beforeEach(() => {
    spinnerClient = new MockSpinnerClient();
  });
  
  test('should start unauthenticated', async () => {
    const authInfo = await spinnerClient.getAuthInfo();
    expect(authInfo.isAuthenticated).toBe(false);
  });
  
  test('should authenticate with valid credentials', async () => {
    const result = await spinnerClient.authenticate('test@example.com', 'password');
    expect(result.isAuthenticated).toBe(true);
    expect(result.email).toBe('test@example.com');
    expect(result.token).toBe('mock-token');
    
    const authInfo = await spinnerClient.getAuthInfo();
    expect(authInfo.isAuthenticated).toBe(true);
  });
  
  test('should fail authentication with empty credentials', async () => {
    const result = await spinnerClient.authenticate('', '');
    expect(result.isAuthenticated).toBe(false);
  });
  
  test('should logout successfully', async () => {
    await spinnerClient.authenticate('test@example.com', 'password');
    await spinnerClient.logout();
    
    const authInfo = await spinnerClient.getAuthInfo();
    expect(authInfo.isAuthenticated).toBe(false);
  });
  
  test('should require authentication to load settings', async () => {
    const result = await spinnerClient.loadSpinnerSettings();
    expect(result.success).toBe(false);
    expect(result.error).toBe('Not authenticated');
  });
  
  test('should create and load spinner settings when authenticated', async () => {
    // Authenticate first
    await spinnerClient.authenticate('test@example.com', 'password');
    
    // Save new settings
    const settings: SpinnerSettings = {
      name: 'Test Spinner',
      segments: [
        { id: '1', label: 'Option 1', value: '1' },
        { id: '2', label: 'Option 2', value: '2' },
      ],
      duration: 5,
      primaryColor: '#ff0000',
      secondaryColor: '#00ff00',
      showConfetti: true,
    };
    
    const saveResult = await spinnerClient.saveSpinnerSettings(settings);
    expect(saveResult.success).toBe(true);
    expect(saveResult.id).toBeDefined();
    
    // Now load settings
    const loadResult = await spinnerClient.loadSpinnerSettings();
    expect(loadResult.success).toBe(true);
    expect(loadResult.settings).toHaveLength(1);
    if (loadResult.settings && loadResult.settings[0] && loadResult.settings[0].segments) {
      expect(loadResult.settings[0].name).toBe('Test Spinner');
      expect(loadResult.settings[0].segments).toHaveLength(2);
    }
  });
  
  test('should load a single spinner setting by ID', async () => {
    // Authenticate first
    await spinnerClient.authenticate('test@example.com', 'password');
    
    // Save new settings
    const settings: SpinnerSettings = {
      name: 'Test Spinner',
      segments: [
        { id: '1', label: 'Option 1', value: '1' },
        { id: '2', label: 'Option 2', value: '2' },
      ],
      duration: 5,
      primaryColor: '#ff0000',
      secondaryColor: '#00ff00',
      showConfetti: true,
    };
    
    const saveResult = await spinnerClient.saveSpinnerSettings(settings);
    const settingId = saveResult.id!;
    
    // Load by ID
    const setting = await spinnerClient.loadSpinnerSettingById(settingId);
    expect(setting).not.toBeNull();
    expect(setting!.name).toBe('Test Spinner');
    expect(setting!.segments).toHaveLength(2);
  });
  
  test('should update existing spinner settings', async () => {
    // Authenticate first
    await spinnerClient.authenticate('test@example.com', 'password');
    
    // Save new settings
    const settings: SpinnerSettings = {
      name: 'Test Spinner',
      segments: [
        { id: '1', label: 'Option 1', value: '1' },
        { id: '2', label: 'Option 2', value: '2' },
      ],
      duration: 5,
      primaryColor: '#ff0000',
      secondaryColor: '#00ff00',
      showConfetti: true,
    };
    
    const saveResult = await spinnerClient.saveSpinnerSettings(settings);
    const settingId = saveResult.id!;
    
    // Update settings
    const updatedSettings: SpinnerSettings = {
      id: settingId,
      name: 'Updated Spinner',
      segments: [
        { id: '1', label: 'Option A', value: 'A' },
        { id: '2', label: 'Option B', value: 'B' },
        { id: '3', label: 'Option C', value: 'C' },
      ],
      duration: 8,
      primaryColor: '#0000ff',
      secondaryColor: '#ffff00',
      showConfetti: false,
    };
    
    const updateResult = await spinnerClient.saveSpinnerSettings(updatedSettings);
    expect(updateResult.success).toBe(true);
    
    // Load updated settings
    const setting = await spinnerClient.loadSpinnerSettingById(settingId);
    expect(setting).not.toBeNull();
    expect(setting!.name).toBe('Updated Spinner');
    expect(setting!.segments).toHaveLength(3);
    expect(setting!.duration).toBe(8);
    expect(setting!.showConfetti).toBe(false);
  });
  
  test('should delete spinner settings', async () => {
    // Authenticate first
    await spinnerClient.authenticate('test@example.com', 'password');
    
    // Save new settings
    const settings: SpinnerSettings = {
      name: 'Test Spinner',
      segments: [
        { id: '1', label: 'Option 1', value: '1' },
        { id: '2', label: 'Option 2', value: '2' },
      ],
      duration: 5,
      primaryColor: '#ff0000',
      secondaryColor: '#00ff00',
      showConfetti: true,
    };
    
    const saveResult = await spinnerClient.saveSpinnerSettings(settings);
    const settingId = saveResult.id!;
    
    // Delete the settings
    const deleteResult = await spinnerClient.deleteSpinnerSettings(settingId);
    expect(deleteResult.success).toBe(true);
    
    // Verify it's gone
    const loadResult = await spinnerClient.loadSpinnerSettings();
    expect(loadResult.settings).toHaveLength(0);
  });
  
  test('should manage active spinner ID', async () => {
    // Set active spinner
    await spinnerClient.setActiveSpinner('test-spinner');
    const activeId = await spinnerClient.getActiveSpinnerId();
    expect(activeId).toBe('test-spinner');
  });
  
  test('should provide configuration', async () => {
    const config = await spinnerClient.getConfig();
    expect(config).toHaveProperty('defaultDuration');
    expect(config).toHaveProperty('defaultPrimaryColor');
    expect(config).toHaveProperty('defaultSecondaryColor');
  });
});