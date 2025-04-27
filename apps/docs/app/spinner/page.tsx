'use client';

import React, { useState } from 'react';
import { Button } from '@repo/ui/button';
import { Card, CardTitle, CardContent } from '@repo/ui/card';
import { SpinnerProvider, Spinner, SpinnerSettingsManager, useSpinner } from '@repo/spinner';
import { DocsSpinnerClient } from '../utils/docs-spinner-client';
import { Code } from '@repo/ui/code';

// Initialize the DocsSpinnerClient
const spinnerClient = new DocsSpinnerClient();

/**
 * Login form component for the spinner demo
 */
const LoginForm: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('password');
  const { client } = useSpinner();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError('');
    
    try {
      const result = await client.authenticate(email, password);
      if (result.isAuthenticated) {
        onLogin();
      } else {
        setError('Authentication failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during login.');
      console.error(err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-4">Login to Demo</h3>
        <p className="mb-4 text-muted-foreground">
          For this demo, you can use any email address with any password.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block mb-1 text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 rounded border"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block mb-1 text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 rounded border"
              required
            />
          </div>
          
          {error && <div className="text-red-500 text-sm">{error}</div>}
          
          <Button type="submit" disabled={isLoggingIn}>
            {isLoggingIn ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

/**
 * Spinner demo component that shows a live spinner example
 */
const SpinnerDemo: React.FC = () => {
  const { auth, spinnerSettings, activeSpinnerId, client } = useSpinner();
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<any>(null);
  const [showLogin, setShowLogin] = useState(true);

  const handleSpin = () => {
    setWinner(null);
    setIsSpinning(true);
  };

  const handleSpinEnd = (winner: any) => {
    setWinner(winner);
    setIsSpinning(false);
  };

  const handleLogout = async () => {
    await client.logout();
    window.location.reload();
  };

  if (showLogin && !auth?.isAuthenticated) {
    return <LoginForm onLogin={() => setShowLogin(false)} />;
  }

  // Find the active spinner
  const activeSpinner = activeSpinnerId && spinnerSettings 
    ? spinnerSettings.find(s => s.id === activeSpinnerId) 
    : spinnerSettings?.[0];

  if (!activeSpinner) {
    return (
      <Card className="mb-8">
        <CardContent className="p-6 text-center">
          <p className="mb-4">No spinner found. Please try again.</p>
          <Button onClick={() => window.location.reload()}>Reload</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">{activeSpinner.name}</h3>
        {auth?.isAuthenticated && (
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <Card>
            <CardContent className="p-6">
              <div className="mb-4">
                <Spinner
                  segments={activeSpinner.segments}
                  primaryColor={activeSpinner.primaryColor}
                  secondaryColor={activeSpinner.secondaryColor}
                  duration={activeSpinner.duration}
                  isSpinning={isSpinning}
                  onSpinEnd={handleSpinEnd}
                  showWinner={!!winner}
                />
              </div>
              <Button 
                onClick={handleSpin} 
                disabled={isSpinning} 
                className="w-full"
              >
                {isSpinning ? "Spinning..." : "Spin"}
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardContent className="p-6">
              <h4 className="font-medium mb-2">Result</h4>
              {winner ? (
                <div className="text-center py-4">
                  <p className="text-lg font-semibold mb-1">Winner:</p>
                  <p className="text-2xl font-bold">{winner.label}</p>
                  <p className="text-muted-foreground">{winner.value}</p>
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  Spin the wheel to see the result
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <h4 className="font-medium mb-4">Spinner Configuration</h4>
          <SpinnerSettingsManager />
        </CardContent>
      </Card>
    </div>
  );
};

/**
 * Spinner implementation page for the documentation site.
 * Shows how to use the spinner components and provides documentation.
 */
export default function SpinnerPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-4">Spinner Component</h1>
      <p className="text-lg mb-8">
        The spinner component provides a customizable wheel that can be used for random selection,
        giveaways, and decision making.
      </p>
      
      <SpinnerProvider client={spinnerClient}>
        <SpinnerDemo />
      </SpinnerProvider>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Usage</h2>
        <p className="mb-4">
          The spinner package uses a dependency injection pattern to provide consistent behavior
          across different environments (web, docs, extension). Each application provides its own
          implementation of the SpinnerBase abstract class.
        </p>
        
        <Card className="mb-6">
          <CardContent className="p-6">
            <Code variant="block">{`import { SpinnerProvider, Spinner, useSpinner } from '@repo/spinner';
import { YourSpinnerClient } from './your-spinner-client';

// Create a client instance
const spinnerClient = new YourSpinnerClient();

function App() {
  return (
    <SpinnerProvider client={spinnerClient}>
      <YourSpinnerComponent />
    </SpinnerProvider>
  );
}

function YourSpinnerComponent() {
  const { auth, spinnerSettings, activeSpinnerId } = useSpinner();
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState(null);
  
  // Find the active spinner settings
  const activeSpinner = spinnerSettings?.find(s => s.id === activeSpinnerId);
  
  if (!activeSpinner) {
    return <div>No spinner selected</div>;
  }
  
  return (
    <div>
      <Spinner
        segments={activeSpinner.segments}
        primaryColor={activeSpinner.primaryColor}
        secondaryColor={activeSpinner.secondaryColor}
        duration={activeSpinner.duration}
        isSpinning={isSpinning}
        onSpinEnd={(winner) => {
          setWinner(winner);
          setIsSpinning(false);
        }}
        showWinner={!!winner}
      />
      <button onClick={() => setIsSpinning(true)}>
        Spin
      </button>
    </div>
  );
}`}</Code>
          </CardContent>
        </Card>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Implementing a Spinner Client</h2>
        <p className="mb-4">
          To use the spinner in your application, you need to implement the SpinnerBase
          abstract class. Below is an example implementation:
        </p>
        
        <Card>
          <CardContent className="p-6">
            <Code variant="block">{`import { SpinnerBase, SpinnerSettings, LoadSpinnerResult, AuthInfo } from '@repo/spinner';

export class YourSpinnerClient extends SpinnerBase {
  // Get the current authentication status
  async getAuthInfo(): Promise<AuthInfo> {
    // Implement your authentication logic
    return { isAuthenticated: true, email: 'user@example.com' };
  }

  // Authenticate with your backend
  async authenticate(email: string, password: string): Promise<AuthInfo> {
    // Implement your authentication logic
    return { isAuthenticated: true, email, token: 'token' };
  }

  // Log out the current user
  async logout(): Promise<void> {
    // Implement your logout logic
  }

  // Load all spinner settings
  async loadSpinnerSettings(): Promise<LoadSpinnerResult> {
    // Implement your logic to load spinner settings
    return {
      success: true,
      settings: [
        {
          id: 'spinner-1',
          name: 'My Spinner',
          segments: [
            { id: '1', label: 'Option 1', value: '1' },
            { id: '2', label: 'Option 2', value: '2' }
          ],
          duration: 5,
          primaryColor: '#4f46e5',
          secondaryColor: '#f97316',
          showConfetti: true,
        }
      ]
    };
  }

  // Load a specific spinner setting by ID
  async loadSpinnerSettingById(id: string): Promise<SpinnerSettings | null> {
    // Implement your logic
    return null;
  }

  // Save spinner settings
  async saveSpinnerSettings(settings: SpinnerSettings): Promise<{ 
    success: boolean;
    error?: string;
    id?: string;
  }> {
    // Implement your logic
    return { success: true, id: 'spinner-1' };
  }

  // Delete spinner settings
  async deleteSpinnerSettings(id: string): Promise<{ 
    success: boolean;
    error?: string;
  }> {
    // Implement your logic
    return { success: true };
  }

  // Set active spinner
  async setActiveSpinner(id: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    // Implement your logic
    return { success: true };
  }

  // Get active spinner ID
  async getActiveSpinnerId(): Promise<string | null> {
    // Implement your logic
    return 'spinner-1';
  }

  // Get application configuration
  async getConfig(): Promise<any> {
    // Implement your logic
    return {
      defaultDuration: 5,
      defaultPrimaryColor: '#4f46e5',
      defaultSecondaryColor: '#f97316',
    };
  }
}`}</Code>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}