import React from 'react';
import { render, screen } from '@testing-library/react';
import { ContextSpinner } from '../src/spinner';
import { SpinnerProvider } from '../src/spinner-context';
import { SpinnerBase, SpinnerSettings, LoadSpinnerResult, AuthInfo } from '../src/spinner-base';

// Mock implementation for testing the ContextSpinner
class MockSpinnerClient extends SpinnerBase {
  private activeSpinnerId: string = 'test-spinner-1';
  private spinnerSettings: SpinnerSettings[] = [
    {
      id: 'test-spinner-1',
      name: 'Test Spinner 1',
      segments: [
        { id: '1', label: 'Option 1', value: '1' },
        { id: '2', label: 'Option 2', value: '2' },
        { id: '3', label: 'Option 3', value: '3' },
        { id: '4', label: 'Option 4', value: '4' },
      ],
      duration: 5,
      primaryColor: '#ff0000',
      secondaryColor: '#00ff00',
      showConfetti: true,
    }
  ];

  async getAuthInfo(): Promise<AuthInfo> {
    return { isAuthenticated: true };
  }

  async authenticate(email: string, password: string): Promise<AuthInfo> {
    return { isAuthenticated: true, email, token: 'mock-token' };
  }

  async logout(): Promise<void> {
    // No-op
  }

  async loadSpinnerSettings(): Promise<LoadSpinnerResult> {
    return { success: true, settings: this.spinnerSettings };
  }

  async loadSpinnerSettingById(id: string): Promise<SpinnerSettings | null> {
    return this.spinnerSettings.find(s => s.id === id) || null;
  }

  async saveSpinnerSettings(settings: SpinnerSettings): Promise<{ 
    success: boolean;
    error?: string;
    id?: string;
  }> {
    return { success: true, id: settings.id || 'new-id' };
  }

  async deleteSpinnerSettings(id: string): Promise<{ 
    success: boolean;
    error?: string;
  }> {
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

// Mock the useSpinner hook to provide spinner settings and activeSpinnerId
jest.mock('../src/spinner-context', () => {
  const originalModule = jest.requireActual('../src/spinner-context');
  
  return {
    ...originalModule,
    useSpinner: () => ({
      spinnerSettings: [
        {
          id: 'test-spinner-1',
          name: 'Test Spinner 1',
          segments: [
            { id: '1', label: 'Option 1', value: '1' },
            { id: '2', label: 'Option 2', value: '2' },
            { id: '3', label: 'Option 3', value: '3' },
            { id: '4', label: 'Option 4', value: '4' },
          ],
          duration: 5,
          primaryColor: '#ff0000',
          secondaryColor: '#00ff00',
          showConfetti: true,
        }
      ],
      activeSpinnerId: 'test-spinner-1',
      client: new MockSpinnerClient(),
    }),
  };
});

describe('ContextSpinner Component', () => {
  test('renders spinner using context values', () => {
    render(<ContextSpinner />);
    
    // Check that all segment labels from the mock data are rendered
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
    expect(screen.getByText('Option 4')).toBeInTheDocument();
  });

  test('displays error message when no active spinner', () => {
    // Temporarily override the mock to return no active spinner
    jest.spyOn(require('../src/spinner-context'), 'useSpinner').mockReturnValue({
      spinnerSettings: [],
      activeSpinnerId: null,
    });
    
    render(<ContextSpinner />);
    
    expect(screen.getByText('No active spinner configured')).toBeInTheDocument();
  });

  test('displays error when active spinner not found', () => {
    // Temporarily override the mock to return an ID that doesn't match any spinner
    jest.spyOn(require('../src/spinner-context'), 'useSpinner').mockReturnValue({
      spinnerSettings: [
        {
          id: 'test-spinner-1',
          name: 'Test Spinner 1',
          segments: [{ id: '1', label: 'Option 1', value: '1' }],
          duration: 5,
          primaryColor: '#ff0000',
          secondaryColor: '#00ff00',
          showConfetti: true,
        }
      ],
      activeSpinnerId: 'non-existent-id',
    });
    
    render(<ContextSpinner />);
    
    expect(screen.getByText('Selected spinner not found')).toBeInTheDocument();
  });
});