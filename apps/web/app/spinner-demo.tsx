/**
 * Spinner demo component for the web application.
 * This demonstrates the use of the SpinnerProvider and WebSpinnerClient
 * with the spinner components from the @repo/spinner package.
 */
'use client';

import React, { useState } from 'react';
import { Button } from '@repo/ui/button';
import { Card, CardTitle, CardContent } from '@repo/ui/card';
import { SpinnerProvider, Spinner, SpinnerSettingsManager, useSpinner } from '@repo/spinner';
import { WebSpinnerClient } from './utils/web-spinner-client';

// Initialize the WebSpinnerClient with the Directus API URL
const spinnerClient = new WebSpinnerClient('https://admin.bettermade.tech');

/**
 * Login form component for authentication
 */
interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>;
  isLoggingIn: boolean;
  error?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, isLoggingIn, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onLogin(email, password);
  };

  return (
    <Card className="p-6 max-w-md mx-auto">
      <CardTitle className="mb-4">Sign In</CardTitle>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded bg-background"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded bg-background"
              required
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <Button type="submit" className="w-full" disabled={isLoggingIn}>
            {isLoggingIn ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

/**
 * Spinner demo content component
 */
const SpinnerDemoContent: React.FC = () => {
  const { auth, client, spinnerSettings, activeSpinnerId, isAuthLoading, isLoadingSettings } = useSpinner();
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<any>(null);
  const [loginError, setLoginError] = useState<string>();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [activeTab, setActiveTab] = useState<'spinner' | 'settings'>('spinner');

  const handleLogin = async (email: string, password: string) => {
    try {
      setIsLoggingIn(true);
      setLoginError(undefined);
      
      if (!client) {
        setLoginError('Client not initialized');
        return;
      }
      
      const authResult = await client.authenticate(email, password);
      
      if (!authResult.isAuthenticated) {
        setLoginError('Invalid email or password. Please try again.');
      }
    } catch (error) {
      setLoginError('An error occurred during login. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    if (client) {
      await client.logout();
      window.location.reload(); // Reload to reset state
    }
  };

  const handleSpin = () => {
    setWinner(null);
    setIsSpinning(true);
  };

  const handleSpinEnd = (winner: any) => {
    setWinner(winner);
    setIsSpinning(false);
  };

  // Show loading state
  if (isAuthLoading || isLoadingSettings) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!auth?.isAuthenticated) {
    return <LoginForm onLogin={handleLogin} isLoggingIn={isLoggingIn} error={loginError} />;
  }

  // Find the active spinner
  const activeSpinner = activeSpinnerId && spinnerSettings 
    ? spinnerSettings.find(s => s.id === activeSpinnerId) 
    : null;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Winner Spinner</h2>
        <div className="flex items-center space-x-4">
          <div className="text-sm">
            Logged in as <span className="font-medium">{auth.email}</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Log Out
          </Button>
        </div>
      </div>

      <div className="flex border-b mb-6">
        <Button
          variant={activeTab === 'spinner' ? 'default' : 'ghost'}
          className="rounded-none py-2 px-4"
          onClick={() => setActiveTab('spinner')}
        >
          Spinner
        </Button>
        <Button
          variant={activeTab === 'settings' ? 'default' : 'ghost'}
          className="rounded-none py-2 px-4"
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </Button>
      </div>

      {activeTab === 'spinner' && (
        <div className="mb-8">
          {!activeSpinner ? (
            <div className="text-center py-8">
              <p className="text-xl mb-4">No active spinner selected</p>
              <Button onClick={() => setActiveTab('settings')}>
                Configure Spinners
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <Card className="p-6">
                  <CardTitle>{activeSpinner.name}</CardTitle>
                  <CardContent className="pt-4">
                    <div className="mb-6">
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
                {winner ? (
                  <Card className="p-6 h-full">
                    <CardTitle>Result</CardTitle>
                    <CardContent className="pt-4 flex flex-col items-center justify-center h-full">
                      <div className="text-center mb-4">
                        <h3 className="text-2xl font-bold text-primary mb-2">Winner!</h3>
                        <p className="text-3xl font-bold">{winner.label}</p>
                        <p className="text-lg text-muted-foreground">{winner.value}</p>
                      </div>
                      <Button onClick={handleSpin} variant="outline">
                        Spin Again
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="p-6 h-full">
                    <CardTitle>Instructions</CardTitle>
                    <CardContent className="pt-4">
                      <ol className="list-decimal pl-5 space-y-2">
                        <li>Click the "Spin" button to start the spinner</li>
                        <li>Wait for the spinner to stop</li>
                        <li>The winner will be displayed here</li>
                        <li>You can change spinners in the Settings tab</li>
                      </ol>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'settings' && (
        <div>
          <SpinnerSettingsManager />
        </div>
      )}
    </div>
  );
};

/**
 * Main spinner demo component with provider
 */
export function SpinnerDemo() {
  return (
    <SpinnerProvider client={spinnerClient}>
      <SpinnerDemoContent />
    </SpinnerProvider>
  );
}