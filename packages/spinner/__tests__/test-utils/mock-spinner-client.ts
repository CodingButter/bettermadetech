import { SpinnerBase, SpinnerSettings, LoadSpinnerResult, AuthInfo } from '../../src/spinner-base';

/**
 * Mock implementation of SpinnerBase for testing
 */
export class MockSpinnerClient extends SpinnerBase {
  // Changed from private to protected to allow access in subclasses
  protected isAuthenticated = false;
  protected email: string = '';
  protected activeSpinnerId: string | null = null;
  protected spinnerSettings: SpinnerSettings[] = [];

  async getAuthInfo(): Promise<AuthInfo> {
    return { 
      isAuthenticated: this.isAuthenticated,
      email: this.email,
      userId: this.isAuthenticated ? 'mock-user-id' : undefined,
      token: this.isAuthenticated ? 'mock-token' : undefined,
    };
  }

  async authenticate(email: string, password: string): Promise<AuthInfo> {
    // For testing, authenticate any non-empty email/password
    if (email && password) {
      this.isAuthenticated = true;
      this.email = email;
      return { 
        isAuthenticated: true, 
        email, 
        token: 'mock-token',
        userId: 'mock-user-id',
      };
    }
    return { isAuthenticated: false };
  }

  async logout(): Promise<void> {
    this.isAuthenticated = false;
    this.email = '';
    this.activeSpinnerId = null;
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