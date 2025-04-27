import React, { useState } from 'react';
import { Button } from '@repo/ui/button';
import { ThemeProvider } from '@repo/ui/theme-provider';
import { ThemeToggle } from '@repo/ui/theme-toggle';
import { Spinner, ContextSpinner, SpinnerProvider, useSpinner } from '@repo/spinner';
import { ExtensionSpinnerClient } from '../../utils/extension-spinner-client';

/**
 * Singleton spinner client for the extension
 */
const spinnerClient = new ExtensionSpinnerClient();

/**
 * Popup content component that uses the spinner context
 */
const PopupContent: React.FC = () => {
  const { auth, spinnerSettings, activeSpinnerId, isAuthLoading, isLoadingSettings } = useSpinner();
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<any>(null);
  
  const openSidePanel = () => {
    chrome.runtime.sendMessage({ action: 'OPEN_SIDE_PANEL' });
  };
  
  const openOptions = () => {
    chrome.runtime.openOptionsPage();
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
      <div className="flex justify-center items-center h-24">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Show login prompt if not authenticated
  if (!auth?.isAuthenticated) {
    return (
      <div className="p-4">
        <p className="text-center mb-4">Sign in to use spinners</p>
        <Button onClick={openOptions} className="w-full">
          Sign In
        </Button>
      </div>
    );
  }
  
  // Show spinner not found message if no active spinner
  if (!activeSpinnerId || !spinnerSettings || spinnerSettings.length === 0) {
    return (
      <div className="p-4">
        <p className="text-center mb-4">No active spinner selected</p>
        <Button onClick={openOptions} className="w-full">
          Configure Spinners
        </Button>
      </div>
    );
  }
  
  // Find the active spinner
  const activeSpinner = spinnerSettings.find(s => s.id === activeSpinnerId);
  
  return (
    <div className="p-4">
      {activeSpinner && (
        <div className="mb-4">
          <h2 className="text-lg font-medium text-center mb-2">{activeSpinner.name}</h2>
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
          
          {winner && (
            <div className="bg-card p-3 rounded-md text-center mb-4">
              <p className="font-medium">Winner: {winner.label}</p>
              <p className="text-sm text-muted-foreground">{winner.value}</p>
            </div>
          )}
          
          <Button 
            onClick={handleSpin} 
            disabled={isSpinning} 
            className="w-full mb-2"
          >
            {isSpinning ? "Spinning..." : "Spin"}
          </Button>
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" onClick={openOptions}>
          Settings
        </Button>
        <Button variant="outline" onClick={openSidePanel}>
          Side Panel
        </Button>
      </div>
    </div>
  );
};

/**
 * Main popup component that provides theme and spinner context
 */
const Popup: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="bmt-theme">
      <SpinnerProvider client={spinnerClient}>
        <div className="popup-container bg-background text-foreground w-64">
          <div className="flex items-center justify-between p-3 border-b">
            <h1 className="text-lg font-bold">Winner Spinner</h1>
            <ThemeToggle size="sm" />
          </div>
          
          <PopupContent />
        </div>
      </SpinnerProvider>
    </ThemeProvider>
  );
};

export default Popup;
