import React, { useState } from 'react';
import { Button } from '@repo/ui/button';
import { ThemeProvider } from '@repo/ui/theme-provider';
import { ThemeToggle } from '@repo/ui/theme-toggle';
// import { Card } from '@repo/ui/card';
import { Spinner, SpinnerSettingsManager, SpinnerProvider, useSpinner, type SpinnerSegment } from '@repo/spinner';
import { ExtensionSpinnerClient } from '../../utils/extension-spinner-client';

// Create a singleton instance of the spinner client
const spinnerClient = new ExtensionSpinnerClient();

/**
 * Spinner panel component that uses the spinner context
 */
const SpinnerPanel: React.FC = () => {
  const { auth, spinnerSettings, activeSpinnerId, isAuthLoading, isLoadingSettings } = useSpinner();
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<SpinnerSegment | null>(null);
  
  const handleSpin = () => {
    setWinner(null);
    setIsSpinning(true);
  };
  
  const handleSpinEnd = (winner: SpinnerSegment) => {
    setWinner(winner);
    setIsSpinning(false);
  };
  
  const openOptions = () => {
    chrome.runtime.openOptionsPage();
  };
  
  // Show loading state
  if (isAuthLoading || isLoadingSettings) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Show login prompt if not authenticated
  if (!auth?.isAuthenticated) {
    return (
      <div className="p-6 text-center">
        <h3 className="text-xl font-medium mb-4">Sign in to use spinners</h3>
        <p className="text-muted-foreground mb-6">
          You need to sign in to your account to use the spinner functionality.
        </p>
        <Button onClick={openOptions} size="lg">
          Sign In
        </Button>
      </div>
    );
  }
  
  // Show spinner not found message if no active spinner
  if (!activeSpinnerId || !spinnerSettings || spinnerSettings.length === 0) {
    return (
      <div className="p-6 text-center">
        <h3 className="text-xl font-medium mb-4">No active spinner selected</h3>
        <p className="text-muted-foreground mb-6">
          You need to create and select an active spinner to use this feature.
        </p>
        <Button onClick={openOptions} size="lg">
          Configure Spinners
        </Button>
      </div>
    );
  }
  
  // Find the active spinner
  const activeSpinner = spinnerSettings.find(s => s.id === activeSpinnerId);
  
  if (!activeSpinner) {
    return (
      <div className="p-6 text-center">
        <h3 className="text-xl font-medium mb-4">Spinner not found</h3>
        <p className="text-muted-foreground mb-6">
          The selected spinner could not be found. Please choose another one.
        </p>
        <Button onClick={openOptions} size="lg">
          Configure Spinners
        </Button>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      <h3 className="text-xl font-bold text-center mb-4">{activeSpinner.name}</h3>
      
      <div className="mb-6 max-w-xs mx-auto">
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
      
      {winner && (
        <div className="bg-card p-4 rounded-md text-center mb-6 max-w-xs mx-auto">
          <h4 className="text-lg font-semibold mb-1">Winner!</h4>
          <p className="font-medium text-xl">{winner.label}</p>
          <p className="text-sm text-muted-foreground">{winner.value}</p>
        </div>
      )}
      
      <div className="flex flex-col gap-3 max-w-xs mx-auto">
        <Button 
          size="lg"
          onClick={handleSpin} 
          disabled={isSpinning}
        >
          {isSpinning ? "Spinning..." : "Spin the Wheel"}
        </Button>
        <Button 
          variant="outline"
          onClick={openOptions}
        >
          Manage Spinners
        </Button>
      </div>
    </div>
  );
};

/**
 * Settings management panel component that uses the spinner context
 */
const SettingsPanel: React.FC = () => {
  return (
    <div className="p-6">
      <h3 className="text-xl font-bold mb-6">Spinner Settings</h3>
      <SpinnerSettingsManager />
    </div>
  );
};

/**
 * Main side panel component that provides spinner context
 */
const SidePanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('spinner');

  return (
    <ThemeProvider defaultTheme="system" storageKey="bmt-theme">
      <SpinnerProvider client={spinnerClient}>
        <div className="sidepanel-container bg-background text-foreground">
          <header className="sidepanel-header flex items-center justify-between p-4 border-b">
            <h1 className="text-xl font-bold">Winner Spinner</h1>
            <ThemeToggle size="sm" />
          </header>
          
          <nav className="sidepanel-nav flex border-b">
            <Button 
              variant={activeTab === 'spinner' ? 'default' : 'ghost'}
              className="flex-1 rounded-none py-3"
              onClick={() => setActiveTab('spinner')}
            >
              Spinner
            </Button>
            <Button 
              variant={activeTab === 'settings' ? 'default' : 'ghost'}
              className="flex-1 rounded-none py-3"
              onClick={() => setActiveTab('settings')}
            >
              Settings
            </Button>
          </nav>
          
          <main className="sidepanel-content overflow-y-auto">
            {activeTab === 'spinner' && <SpinnerPanel />}
            {activeTab === 'settings' && <SettingsPanel />}
          </main>
          
          <footer className="sidepanel-footer p-3 text-center text-sm text-muted-foreground border-t">
            <p>Better Made Tech &copy; {new Date().getFullYear()}</p>
          </footer>
        </div>
      </SpinnerProvider>
    </ThemeProvider>
  );
};

export default SidePanel;
