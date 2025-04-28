import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { SpinnerProvider, useSpinner } from '../src/spinner-context';
import { SpinnerBase } from '../src/spinner-base';
import { Spinner, ContextSpinner } from '../src/spinner';
import { MockSpinnerClient } from './test-utils/mock-spinner-client';

// Test component that uses SpinnerProvider with real components
const TestApp = ({ client }: { client: SpinnerBase }) => {
  return (
    <SpinnerProvider client={client}>
      <SpinnerIntegration />
    </SpinnerProvider>
  );
};

// Component that tests the integration of context and spinner
const SpinnerIntegration = () => {
  const { 
    client,
    auth, 
    spinnerSettings, 
    activeSpinnerId, 
    refreshSettings,
    setActiveSpinner,
  } = useSpinner();

  // Authenticate and set up spinner when mounted
  React.useEffect(() => {
    const initialize = async () => {
      if (client) {
        // Authenticate
        await client.authenticate('test@example.com', 'password');
        // Load spinner settings
        await refreshSettings();
        // Set active spinner to the first one if available
        const firstSpinner = spinnerSettings && spinnerSettings.length > 0 ? spinnerSettings[0] : null;
        if (firstSpinner && firstSpinner.id) {
          await setActiveSpinner(firstSpinner.id);
        }
      }
    };
    initialize();
  }, [client, refreshSettings, spinnerSettings, setActiveSpinner]);

  if (!auth?.isAuthenticated) {
    return <div data-testid="loading">Loading authentication...</div>;
  }

  if (!spinnerSettings || spinnerSettings.length === 0) {
    return <div data-testid="no-spinners">No spinner settings available</div>;
  }

  if (!activeSpinnerId) {
    return <div data-testid="no-active">No active spinner selected</div>;
  }

  return (
    <div data-testid="spinner-container">
      <div data-testid="auth-status">Authenticated: {auth.email}</div>
      <div data-testid="spinner-count">Spinners: {spinnerSettings.length}</div>
      <div data-testid="active-spinner">Active: {activeSpinnerId}</div>
      
      <div data-testid="context-spinner">
        <h3>Context Spinner</h3>
        <ContextSpinner />
      </div>
      
      <div data-testid="manual-spinner">
        <h3>Manual Spinner</h3>
        {spinnerSettings.map(setting => (
          setting.id === activeSpinnerId && (
            <Spinner
              key={setting.id}
              segments={setting.segments}
              duration={setting.duration}
              primaryColor={setting.primaryColor}
              secondaryColor={setting.secondaryColor}
              showWinner={true}
            />
          )
        ))}
      </div>
    </div>
  );
};

describe('Spinner Integration', () => {
  test('integrates SpinnerContext with Spinner components', async () => {
    // Create a mock client with pre-populated data
    const mockClient = new MockSpinnerClient();
    
    // Pre-populate the client with a spinner setting
    await mockClient.authenticate('test@example.com', 'password');
    await mockClient.saveSpinnerSettings({
      name: 'Test Spinner',
      segments: [
        { id: '1', label: 'Option 1', value: '1' },
        { id: '2', label: 'Option 2', value: '2' },
        { id: '3', label: 'Option 3', value: '3' },
      ],
      duration: 5,
      primaryColor: '#ff0000',
      secondaryColor: '#00ff00',
      showConfetti: true,
    });
    
    render(<TestApp client={mockClient} />);
    
    // Initially it should show loading
    expect(screen.getByTestId('loading')).toBeInTheDocument();
    
    // Eventually it should load the spinner
    await waitFor(() => {
      expect(screen.getByTestId('spinner-container')).toBeInTheDocument();
    });
    
    // Check auth status
    expect(screen.getByTestId('auth-status')).toHaveTextContent('test@example.com');
    
    // Check spinner count
    expect(screen.getByTestId('spinner-count')).toHaveTextContent('Spinners: 1');
    
    // Both context and manual spinner should be rendered
    expect(screen.getByTestId('context-spinner')).toBeInTheDocument();
    expect(screen.getByTestId('manual-spinner')).toBeInTheDocument();
    
    // Segments should be rendered
    expect(screen.getAllByText('Option 1').length).toBe(2); // One in each spinner
    expect(screen.getAllByText('Option 2').length).toBe(2);
    expect(screen.getAllByText('Option 3').length).toBe(2);
  });

  test('handles missing spinner settings', async () => {
    // Create empty mock client
    const emptyClient = new MockSpinnerClient();
    await emptyClient.authenticate('test@example.com', 'password');
    
    render(<TestApp client={emptyClient} />);
    
    // Initially it should show loading
    expect(screen.getByTestId('loading')).toBeInTheDocument();
    
    // Then it should show no spinners available
    await waitFor(() => {
      expect(screen.getByTestId('no-spinners')).toBeInTheDocument();
    });
  });
});