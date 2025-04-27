import { SpinnerBase, SpinnerSettings, AuthInfo } from '../src/spinner-base';

// Chrome extension types
declare namespace chrome {
  namespace storage {
    interface StorageArea {
      get(keys: string | string[] | null, callback: (items: Record<string, any>) => void): void;
      set(items: Record<string, any>, callback?: () => void): void;
      remove(keys: string | string[], callback?: () => void): void;
    }
    
    const local: StorageArea;
    const sync: StorageArea;
  }
  
  namespace identity {
    function launchWebAuthFlow(options: any, callback: (responseUrl?: string) => void): void;
  }
  
  namespace runtime {
    function sendMessage(message: any, callback?: (response: any) => void): void;
  }
}

// Mock the chrome API
const mockChrome = {
  storage: {
    local: {
      get: jest.fn(),
      set: jest.fn(),
      remove: jest.fn(),
    },
    sync: {
      get: jest.fn(),
      set: jest.fn(),
      remove: jest.fn(),
    }
  },
  identity: {
    launchWebAuthFlow: jest.fn(),
  },
  runtime: {
    sendMessage: jest.fn(),
  }
};

// Mock global chrome
(global as any).chrome = mockChrome;

// Extension implementation of SpinnerBase
class ExtensionSpinnerClient extends SpinnerBase {
  private storage: typeof chrome.storage;
  private authKey = 'spinner_auth';
  private settingsKey = 'spinner_settings';
  private activeSpinnerKey = 'active_spinner';
  private apiUrl = 'https://api.example.com';

  constructor() {
    super();
    this.storage = chrome.storage;
  }

  // Helper to get data from storage
  private async getFromStorage<T>(key: string, storageType: 'local' | 'sync' = 'local'): Promise<T | null> {
    return new Promise((resolve) => {
      this.storage[storageType].get([key], (result) => {
        resolve(result[key] || null);
      });
    });
  }

  // Helper to set data in storage
  private async setInStorage(key: string, value: any, storageType: 'local' | 'sync' = 'local'): Promise<void> {
    return new Promise((resolve) => {
      this.storage[storageType].set({ [key]: value }, resolve);
    });
  }

  // Helper to remove data from storage
  private async removeFromStorage(key: string, storageType: 'local' | 'sync' = 'local'): Promise<void> {
    return new Promise((resolve) => {
      this.storage[storageType].remove(key, resolve);
    });
  }

  async getAuthInfo(): Promise<AuthInfo> {
    const auth = await this.getFromStorage<AuthInfo>(this.authKey);
    return auth || { isAuthenticated: false };
  }

  async authenticate(email: string, password: string): Promise<AuthInfo> {
    // For testing, simply store the auth info directly
    const authInfo: AuthInfo = { 
      isAuthenticated: true, 
      email, 
      token: 'test-token',
      userId: 'test-user'
    };
    
    await this.setInStorage(this.authKey, authInfo);
    return authInfo;
  }

  async logout(): Promise<void> {
    await this.removeFromStorage(this.authKey);
  }

  async loadSpinnerSettings(): Promise<{ success: boolean; error?: string; settings?: SpinnerSettings[] }> {
    const auth = await this.getAuthInfo();
    
    if (!auth.isAuthenticated) {
      return { success: false, error: 'Not authenticated' };
    }
    
    const settings = await this.getFromStorage<SpinnerSettings[]>(this.settingsKey);
    return { success: true, settings: settings || [] };
  }

  async loadSpinnerSettingById(id: string): Promise<SpinnerSettings | null> {
    const auth = await this.getAuthInfo();
    
    if (!auth.isAuthenticated) {
      return null;
    }
    
    const settings = await this.getFromStorage<SpinnerSettings[]>(this.settingsKey);
    
    if (!settings) {
      return null;
    }
    
    return settings.find(s => s.id === id) || null;
  }

  async saveSpinnerSettings(settings: SpinnerSettings): Promise<{ success: boolean; error?: string; id?: string }> {
    const auth = await this.getAuthInfo();
    
    if (!auth.isAuthenticated) {
      return { success: false, error: 'Not authenticated' };
    }
    
    const allSettings = await this.getFromStorage<SpinnerSettings[]>(this.settingsKey) || [];
    
    if (settings.id) {
      // Update existing
      const index = allSettings.findIndex(s => s.id === settings.id);
      
      if (index >= 0) {
        allSettings[index] = { ...settings };
      } else {
        return { success: false, error: 'Setting not found' };
      }
    } else {
      // Create new
      const id = `spinner-${Date.now()}`;
      allSettings.push({ ...settings, id, userId: auth.userId });
      settings.id = id;
    }
    
    await this.setInStorage(this.settingsKey, allSettings);
    return { success: true, id: settings.id };
  }

  async deleteSpinnerSettings(id: string): Promise<{ success: boolean; error?: string }> {
    const auth = await this.getAuthInfo();
    
    if (!auth.isAuthenticated) {
      return { success: false, error: 'Not authenticated' };
    }
    
    const allSettings = await this.getFromStorage<SpinnerSettings[]>(this.settingsKey) || [];
    const index = allSettings.findIndex(s => s.id === id);
    
    if (index < 0) {
      return { success: false, error: 'Setting not found' };
    }
    
    allSettings.splice(index, 1);
    await this.setInStorage(this.settingsKey, allSettings);
    
    // If this was the active spinner, clear it
    const activeId = await this.getActiveSpinnerId();
    if (activeId === id) {
      await this.removeFromStorage(this.activeSpinnerKey);
    }
    
    return { success: true };
  }

  async setActiveSpinner(id: string): Promise<{ success: boolean; error?: string }> {
    await this.setInStorage(this.activeSpinnerKey, id);
    return { success: true };
  }

  async getActiveSpinnerId(): Promise<string | null> {
    return this.getFromStorage<string>(this.activeSpinnerKey);
  }

  async getConfig(): Promise<any> {
    return {
      defaultDuration: 5,
      defaultPrimaryColor: '#4f46e5',
      defaultSecondaryColor: '#f97316',
      apiUrl: this.apiUrl,
    };
  }
}

describe('ExtensionSpinnerClient', () => {
  let spinnerClient: ExtensionSpinnerClient;
  
  beforeEach(() => {
    jest.clearAllMocks();
    spinnerClient = new ExtensionSpinnerClient();
    
    // Mock storage.get to initially return empty objects
    mockChrome.storage.local.get.mockImplementation((keys, callback) => {
      callback({});
    });
    
    // Mock storage.set to call callback immediately
    mockChrome.storage.local.set.mockImplementation((data, callback) => {
      if (callback) callback();
    });
    
    // Mock storage.remove to call callback immediately
    mockChrome.storage.local.remove.mockImplementation((key, callback) => {
      if (callback) callback();
    });
  });
  
  test('should start unauthenticated', async () => {
    const authInfo = await spinnerClient.getAuthInfo();
    expect(authInfo.isAuthenticated).toBe(false);
    expect(mockChrome.storage.local.get).toHaveBeenCalledWith(['spinner_auth'], expect.any(Function));
  });
  
  test('should authenticate and store credentials', async () => {
    // After authenticate is called, mock subsequent get calls to return auth data
    mockChrome.storage.local.get.mockImplementation((keys, callback) => {
      if (keys.includes('spinner_auth')) {
        callback({
          spinner_auth: { 
            isAuthenticated: true, 
            email: 'test@example.com', 
            token: 'test-token',
            userId: 'test-user'
          }
        });
      } else {
        callback({});
      }
    });
    
    const authResult = await spinnerClient.authenticate('test@example.com', 'password');
    
    // Check authentication result
    expect(authResult.isAuthenticated).toBe(true);
    expect(authResult.email).toBe('test@example.com');
    expect(authResult.token).toBe('test-token');
    
    // Check that data was stored correctly
    expect(mockChrome.storage.local.set).toHaveBeenCalledWith(
      {
        spinner_auth: {
          isAuthenticated: true,
          email: 'test@example.com',
          token: 'test-token',
          userId: 'test-user'
        }
      },
      expect.any(Function)
    );
    
    // Test that getAuthInfo now returns authenticated data
    const authInfo = await spinnerClient.getAuthInfo();
    expect(authInfo.isAuthenticated).toBe(true);
  });
  
  test('should handle spinner settings operations', async () => {
    // Set up authenticated state
    mockChrome.storage.local.get.mockImplementation((keys, callback) => {
      if (keys.includes('spinner_auth')) {
        callback({
          spinner_auth: { 
            isAuthenticated: true, 
            email: 'test@example.com', 
            token: 'test-token',
            userId: 'test-user'
          }
        });
      } else if (keys.includes('spinner_settings')) {
        callback({
          spinner_settings: []
        });
      } else {
        callback({});
      }
    });
    
    // Test saving spinner settings
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
    
    // Update the mock to save the settings
    let savedSettings: SpinnerSettings[] = [];
    mockChrome.storage.local.set.mockImplementation((data, callback) => {
      if (data.spinner_settings) {
        savedSettings = data.spinner_settings;
      }
      if (callback) callback();
    });
    
    // Update the mock to retrieve the saved settings
    mockChrome.storage.local.get.mockImplementation((keys, callback) => {
      if (keys.includes('spinner_auth')) {
        callback({
          spinner_auth: { 
            isAuthenticated: true, 
            email: 'test@example.com', 
            token: 'test-token',
            userId: 'test-user'
          }
        });
      } else if (keys.includes('spinner_settings')) {
        callback({
          spinner_settings: savedSettings
        });
      } else {
        callback({});
      }
    });
    
    // Save the settings
    const saveResult = await spinnerClient.saveSpinnerSettings(settings);
    expect(saveResult.success).toBe(true);
    expect(saveResult.id).toBeDefined();
    
    // Load the settings
    const loadResult = await spinnerClient.loadSpinnerSettings();
    expect(loadResult.success).toBe(true);
    expect(loadResult.settings).toHaveLength(1);
    if (loadResult.settings && loadResult.settings[0]) {
      expect(loadResult.settings[0].name).toBe('Test Spinner');
    }
  });
  
  test('should set and get active spinner ID', async () => {
    const testId = 'test-spinner-id';
    
    // Update storage mock for getting active spinner ID
    mockChrome.storage.local.get.mockImplementation((keys, callback) => {
      if (keys.includes('active_spinner')) {
        callback({
          active_spinner: testId
        });
      } else {
        callback({});
      }
    });
    
    // Set active spinner
    await spinnerClient.setActiveSpinner(testId);
    expect(mockChrome.storage.local.set).toHaveBeenCalledWith(
      { active_spinner: testId },
      expect.any(Function)
    );
    
    // Get active spinner
    const activeId = await spinnerClient.getActiveSpinnerId();
    expect(activeId).toBe(testId);
  });
  
  test('should provide configuration', async () => {
    const config = await spinnerClient.getConfig();
    expect(config).toHaveProperty('defaultDuration');
    expect(config).toHaveProperty('defaultPrimaryColor');
    expect(config).toHaveProperty('defaultSecondaryColor');
    expect(config).toHaveProperty('apiUrl');
  });
});