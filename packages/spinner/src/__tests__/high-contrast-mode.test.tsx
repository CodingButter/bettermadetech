import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SpinnerProvider, useSpinner } from '../spinner-context';
import { SpinnerBase } from '../spinner-base';
import { AuthInfo, SpinnerSettings } from '../types';

// Mock SpinnerBase implementation for testing
class MockSpinnerClient extends SpinnerBase {
  // Mock implementation of required methods
  async authenticate(): Promise<{ isAuthenticated: boolean; email?: string }> {
    return { isAuthenticated: true, email: 'test@example.com' };
  }
  
  async getAuthInfo(): Promise<AuthInfo> {
    return { isAuthenticated: true, email: 'test@example.com' };
  }
  
  async logout(): Promise<void> {
    return;
  }
  
  async loadSpinnerSettings(): Promise<{ success: boolean; settings?: SpinnerSettings[]; error?: string }> {
    return { 
      success: true, 
      settings: [
        {
          id: '1',
          name: 'Test Spinner',
          segments: [
            { id: '1', label: 'Option 1', value: '1' },
            { id: '2', label: 'Option 2', value: '2' }
          ],
          primaryColor: '#ff0000',
          secondaryColor: '#0000ff',
          duration: 5,
          showConfetti: false
        }
      ]
    };
  }
  
  async saveSpinnerSettings(): Promise<{ success: boolean; id?: string; error?: string }> {
    return { success: true, id: '1' };
  }
  
  async getActiveSpinnerId(): Promise<string | null> {
    return '1';
  }
  
  async setActiveSpinner(): Promise<{ success: boolean; error?: string }> {
    return { success: true };
  }
}

// Test component that uses the context
const TestComponent = () => {
  const { highContrastMode, toggleHighContrastMode } = useSpinner();
  
  return (
    <div>
      <div data-testid="contrast-status">
        {highContrastMode ? 'High Contrast Mode: On' : 'High Contrast Mode: Off'}
      </div>
      <button data-testid="toggle-button" onClick={toggleHighContrastMode}>
        Toggle Contrast Mode
      </button>
    </div>
  );
};

describe('High Contrast Mode', () => {
  // Mock localStorage
  let localStorageMock: { [key: string]: string } = {};
  
  beforeEach(() => {
    // Setup localStorage mock
    global.Storage.prototype.getItem = jest.fn((key) => localStorageMock[key] || null);
    global.Storage.prototype.setItem = jest.fn((key, value) => {
      localStorageMock[key] = value;
    });
    
    // Clear mock data between tests
    localStorageMock = {};
  });
  
  afterEach(() => {
    jest.resetAllMocks();
  });
  
  it('initializes with high contrast mode disabled by default', () => {
    render(
      <SpinnerProvider client={new MockSpinnerClient()}>
        <TestComponent />
      </SpinnerProvider>
    );
    
    expect(screen.getByTestId('contrast-status')).toHaveTextContent('High Contrast Mode: Off');
  });
  
  it('enables high contrast mode when toggled', () => {
    render(
      <SpinnerProvider client={new MockSpinnerClient()}>
        <TestComponent />
      </SpinnerProvider>
    );
    
    // Initially off
    expect(screen.getByTestId('contrast-status')).toHaveTextContent('High Contrast Mode: Off');
    
    // Toggle on
    fireEvent.click(screen.getByTestId('toggle-button'));
    expect(screen.getByTestId('contrast-status')).toHaveTextContent('High Contrast Mode: On');
    
    // Toggle off
    fireEvent.click(screen.getByTestId('toggle-button'));
    expect(screen.getByTestId('contrast-status')).toHaveTextContent('High Contrast Mode: Off');
  });
  
  it('persists high contrast setting in localStorage', () => {
    render(
      <SpinnerProvider client={new MockSpinnerClient()}>
        <TestComponent />
      </SpinnerProvider>
    );
    
    // Initially localStorage should be empty
    expect(localStorage.getItem('spinner_high_contrast_mode')).toBeNull();
    
    // Toggle on - should save to localStorage
    fireEvent.click(screen.getByTestId('toggle-button'));
    expect(localStorage.setItem).toHaveBeenCalledWith('spinner_high_contrast_mode', 'true');
    
    // Toggle off - should update localStorage
    fireEvent.click(screen.getByTestId('toggle-button'));
    expect(localStorage.setItem).toHaveBeenCalledWith('spinner_high_contrast_mode', 'false');
  });
  
  it('loads high contrast preference from localStorage on initialization', () => {
    // Set localStorage before rendering
    localStorageMock['spinner_high_contrast_mode'] = 'true';
    
    render(
      <SpinnerProvider client={new MockSpinnerClient()}>
        <TestComponent />
      </SpinnerProvider>
    );
    
    // Should initialize with value from localStorage
    expect(screen.getByTestId('contrast-status')).toHaveTextContent('High Contrast Mode: On');
  });
  
  it('allows initialHighContrast prop to override localStorage', () => {
    // Set localStorage to opposite of what we want to enforce
    localStorageMock['spinner_high_contrast_mode'] = 'false';
    
    render(
      <SpinnerProvider client={new MockSpinnerClient()} initialHighContrast={true}>
        <TestComponent />
      </SpinnerProvider>
    );
    
    // Should use the prop value, not localStorage
    expect(screen.getByTestId('contrast-status')).toHaveTextContent('High Contrast Mode: On');
  });
});