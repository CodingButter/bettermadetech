import React, { useState } from 'react';
import { Button } from '@repo/ui/button';
import { ThemeProvider } from '@repo/ui/theme-provider';
import { ThemeToggle } from '@repo/ui/theme-toggle';
// import { Card } from '@repo/ui/card';
import { Spinner, SpinnerSettingsManager, SpinnerProvider, useSpinner, type SpinnerSegment } from '@repo/spinner';
import { ExtensionSpinnerClient } from '../../utils/extension-spinner-client';
import CSVUpload from '../../components/csv-upload';

// Create a singleton instance of the spinner client
const spinnerClient = new ExtensionSpinnerClient();

/**
 * Spinner panel component that uses the spinner context
 */
const SpinnerPanel: React.FC = () => {
  const { 
    auth, 
    spinnerSettings, 
    activeSpinnerId, 
    isAuthLoading, 
    isLoadingSettings,
    highContrastMode
  } = useSpinner();
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<SpinnerSegment | null>(null);
  
  const handleSpin = () => {
    setWinner(null);
    setIsSpinning(true);
  };
  
  const handleComplete = (winner: SpinnerSegment) => {
    setWinner(winner);
    setIsSpinning(false);
    
    // Announce winner for screen readers
    const announceElement = document.getElementById('winner-announcement');
    if (announceElement) {
      announceElement.textContent = `Winner: ${winner.label}${winner.value ? ', ' + winner.value : ''}`;
    }
  };
  
  const openOptions = () => {
    chrome.runtime.openOptionsPage();
  };
  
  // Show loading state
  if (isAuthLoading || isLoadingSettings) {
    return (
      <div className="flex justify-center items-center h-40" role="tabpanel" aria-labelledby="spinner-tab">
        <div 
          className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"
          role="progressbar"
          aria-label="Loading spinner data"
        ></div>
      </div>
    );
  }
  
  // Show login prompt if not authenticated
  if (!auth?.isAuthenticated) {
    return (
      <div className="p-6 text-center" role="tabpanel" aria-labelledby="spinner-tab">
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
      <div className="p-6 text-center" role="tabpanel" aria-labelledby="spinner-tab">
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
      <div className="p-6 text-center" role="tabpanel" aria-labelledby="spinner-tab">
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
    <div className="p-6" role="tabpanel" aria-labelledby="spinner-tab">
      <h3 className="text-xl font-bold text-center mb-4" id="spinner-title">{activeSpinner.name}</h3>
      
      {/* Screen reader announcement for winner */}
      <div className="sr-only" aria-live="assertive" id="winner-announcement"></div>
      
      <div className="mb-6 max-w-xs mx-auto" aria-labelledby="spinner-title">
        <Spinner
          segments={activeSpinner.segments}
          primaryColor={activeSpinner.primaryColor}
          secondaryColor={activeSpinner.secondaryColor}
          duration={activeSpinner.duration}
          isSpinning={isSpinning}
          onSpinEnd={handleComplete}
          showWinner={!!winner}
          highContrast={highContrastMode}
          accessibilityEnabled={true}
          respectReducedMotion={true}
          allowSkipAnimation={true}
          enableKeyboardControl={true}
          aria-label={`${activeSpinner.name} spinner with ${activeSpinner.segments.length} segments`}
        />
      </div>
      
      {winner && (
        <div 
          className="bg-card p-4 rounded-md text-center mb-6 max-w-xs mx-auto"
          aria-live="polite"
          role="status"
        >
          <h4 className="text-lg font-semibold mb-1">Winner!</h4>
          <p className="font-medium text-xl">{winner.label}</p>
          {winner.value && <p className="text-sm text-muted-foreground">{winner.value}</p>}
        </div>
      )}
      
      <div className="flex flex-col gap-3 max-w-xs mx-auto">
        <Button 
          size="lg"
          onClick={handleSpin} 
          disabled={isSpinning}
          aria-label={isSpinning ? "Spinner is currently spinning" : "Spin the wheel to select a random winner"}
        >
          {isSpinning ? "Spinning..." : "Spin the Wheel"}
        </Button>
        <Button 
          variant="outline"
          onClick={openOptions}
          aria-label="Open spinner configuration page"
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
    <div className="p-6" role="tabpanel" aria-labelledby="settings-tab">
      <h3 className="text-xl font-bold mb-6">Spinner Settings</h3>
      <SpinnerSettingsManager />
    </div>
  );
};

/**
 * CSV import panel component that uses the spinner context
 */
const CSVPanel: React.FC = () => {
  const { auth, client, activeSpinnerId, setActiveSpinner } = useSpinner();
  const [isCreating, setIsCreating] = useState(false);
  const [spinnerName, setSpinnerName] = useState("");
  const [error, setError] = useState<string | null>(null);
  
  const handleSegmentsGenerated = async (segments: SpinnerSegment[]) => {
    setError(null);
    
    if (!spinnerName.trim()) {
      setError("Please enter a name for your spinner.");
      return;
    }
    
    if (!segments.length) {
      setError("No valid segments were generated from the CSV data.");
      return;
    }
    
    setIsCreating(true);
    
    try {
      // Use the client's saveSpinnerSettings method directly
      const result = await client?.saveSpinnerSettings({
        name: spinnerName,
        segments: segments,
        duration: 5000,
        primaryColor: '#4f46e5',
        secondaryColor: '#f97316',
        showConfetti: false
      });
      
      if (result?.success && result.id) {
        // Set as active spinner
        await setActiveSpinner(result.id);
        setSpinnerName('');
        
        // Announce for screen readers
        const announceElement = document.getElementById('csv-announcement');
        if (announceElement) {
          announceElement.textContent = `Spinner created successfully with ${segments.length} segments.`;
        }
      } else {
        setError(result?.error || "Failed to create spinner");
      }
    } catch (error) {
      console.error('Failed to save spinner:', error);
      setError(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsCreating(false);
    }
  };
  
  // Show login prompt if not authenticated
  if (!auth?.isAuthenticated) {
    return (
      <div className="p-6 text-center" role="tabpanel" aria-labelledby="csv-tab">
        <h3 className="text-xl font-medium mb-4">Sign in to import CSV data</h3>
        <p className="text-muted-foreground mb-6">
          You need to sign in to your account to create spinners from CSV files.
        </p>
        <Button 
          onClick={() => chrome.runtime.openOptionsPage()} 
          size="lg"
          aria-label="Go to sign in page"
        >
          Sign In
        </Button>
      </div>
    );
  }
  
  return (
    <div className="p-6" role="tabpanel" aria-labelledby="csv-tab">
      <h3 className="text-xl font-bold mb-6">Import from CSV</h3>
      
      {/* Screen reader announcement area */}
      <div className="sr-only" aria-live="assertive" id="csv-announcement"></div>
      
      {error && (
        <div className="p-3 mb-4 bg-destructive/10 text-destructive rounded-md" 
          role="alert" 
          aria-live="polite"
        >
          {error}
        </div>
      )}
      
      <div className="mb-6">
        <label htmlFor="spinnerName" className="block mb-2 text-sm font-medium">
          Spinner Name
        </label>
        <input
          type="text"
          id="spinnerName"
          className="w-full p-2 border rounded-md bg-background"
          value={spinnerName}
          onChange={(e) => setSpinnerName(e.target.value)}
          placeholder="Enter a name for this spinner"
          aria-required="true"
          aria-invalid={error && !spinnerName.trim() ? "true" : "false"}
          aria-describedby={error && !spinnerName.trim() ? "name-error" : undefined}
        />
        {error && !spinnerName.trim() && (
          <p id="name-error" className="mt-1 text-sm text-destructive">
            Spinner name is required.
          </p>
        )}
      </div>
      
      <CSVUpload 
        onSegmentsGenerated={handleSegmentsGenerated} 
        className="mb-6"
      />
      
      {isCreating && (
        <div 
          className="flex justify-center items-center mt-4"
          role="status"
          aria-live="polite"
        >
          <div 
            className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary mr-2"
            aria-hidden="true"
          ></div>
          <span>Creating spinner...</span>
        </div>
      )}
    </div>
  );
};

/**
 * Accessibility panel component that uses the spinner context
 */
const AccessibilityPanel: React.FC = () => {
  const { 
    auth, 
    highContrastMode, 
    toggleHighContrastMode 
  } = useSpinner();
  
  // Show login prompt if not authenticated
  if (!auth?.isAuthenticated) {
    return (
      <div className="p-6 text-center" role="tabpanel" aria-labelledby="accessibility-tab">
        <h3 className="text-xl font-medium mb-4">Sign in to configure accessibility</h3>
        <p className="text-muted-foreground mb-6">
          You need to sign in to your account to use the accessibility features.
        </p>
        <Button 
          onClick={() => chrome.runtime.openOptionsPage()} 
          size="lg"
          aria-label="Go to sign in page"
        >
          Sign In
        </Button>
      </div>
    );
  }
  
  return (
    <div className="p-6" role="tabpanel" aria-labelledby="accessibility-tab">
      <h3 className="text-xl font-bold mb-6">Accessibility Options</h3>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-medium">High Contrast Mode</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Enhances visibility with stronger colors and improved contrast
            </p>
          </div>
          <Button 
            variant={highContrastMode ? "default" : "outline"}
            onClick={toggleHighContrastMode}
            aria-pressed={highContrastMode}
            className="min-w-24"
          >
            {highContrastMode ? "Enabled" : "Disabled"}
          </Button>
        </div>
        
        <div className="border-t pt-6">
          <h4 className="text-lg font-medium mb-2">Additional Features</h4>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            <li>Keyboard control is enabled (Tab to focus, Enter/Space to spin)</li>
            <li>Skip animation with Escape key while spinning</li>
            <li>Screen reader announcements for spin events</li>
            <li>Respects system motion reduction preferences</li>
            <li>Compatible with Windows High Contrast mode</li>
          </ul>
        </div>
        
        <div className="rounded-lg bg-muted p-4 mt-4">
          <h4 className="font-medium mb-2 text-sm">About High Contrast Mode</h4>
          <p className="text-xs text-muted-foreground">
            High contrast mode improves visibility for users with low vision or color 
            perception difficulties. This setting is automatically enabled if your 
            system has high contrast mode enabled, but you can override it here.
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * Main side panel component that provides spinner context
 */
const SidePanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('spinner');
  
  // Handle keyboard navigation for tabs
  const handleTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, tabName: string) => {
    // Current tab index
    const tabs = ['spinner', 'settings', 'csv', 'accessibility'];
    const currentIndex = tabs.indexOf(tabName);
    
    switch (event.key) {
      case 'ArrowRight':
        // Move to next tab, or wrap to first tab
        event.preventDefault();
        setActiveTab(tabs[(currentIndex + 1) % tabs.length]);
        break;
      case 'ArrowLeft':
        // Move to previous tab, or wrap to last tab
        event.preventDefault();
        setActiveTab(tabs[(currentIndex - 1 + tabs.length) % tabs.length]);
        break;
      case 'Home':
        // Move to first tab
        event.preventDefault();
        setActiveTab(tabs[0]);
        break;
      case 'End':
        // Move to last tab
        event.preventDefault();
        setActiveTab(tabs[tabs.length - 1]);
        break;
    }
  };

  return (
    <ThemeProvider defaultTheme="system" storageKey="bmt-theme">
      <SpinnerProvider client={spinnerClient}>
        <div className="sidepanel-container bg-background text-foreground">
          <header className="sidepanel-header flex items-center justify-between p-4 border-b">
            <h1 className="text-xl font-bold">Winner Spinner</h1>
            <ThemeToggle size="sm" />
          </header>
          
          <nav className="sidepanel-nav flex border-b" role="tablist" aria-label="Spinner tabs">
            <Button 
              variant={activeTab === 'spinner' ? 'default' : 'ghost'}
              className="flex-1 rounded-none py-3"
              onClick={() => setActiveTab('spinner')}
              onKeyDown={(e) => handleTabKeyDown(e, 'spinner')}
              aria-label="Spinner tab"
              role="tab"
              id="spinner-tab"
              aria-controls="spinner-panel"
              aria-selected={activeTab === 'spinner'}
              tabIndex={activeTab === 'spinner' ? 0 : -1}
            >
              Spinner
            </Button>
            <Button 
              variant={activeTab === 'settings' ? 'default' : 'ghost'}
              className="flex-1 rounded-none py-3"
              onClick={() => setActiveTab('settings')}
              onKeyDown={(e) => handleTabKeyDown(e, 'settings')}
              aria-label="Settings tab"
              role="tab"
              id="settings-tab"
              aria-controls="settings-panel"
              aria-selected={activeTab === 'settings'}
              tabIndex={activeTab === 'settings' ? 0 : -1}
            >
              Settings
            </Button>
            <Button 
              variant={activeTab === 'csv' ? 'default' : 'ghost'}
              className="flex-1 rounded-none py-3"
              onClick={() => setActiveTab('csv')}
              onKeyDown={(e) => handleTabKeyDown(e, 'csv')}
              aria-label="CSV Import tab"
              role="tab"
              id="csv-tab"
              aria-controls="csv-panel"
              aria-selected={activeTab === 'csv'}
              tabIndex={activeTab === 'csv' ? 0 : -1}
            >
              CSV
            </Button>
            <Button 
              variant={activeTab === 'accessibility' ? 'default' : 'ghost'}
              className="flex-1 rounded-none py-3"
              onClick={() => setActiveTab('accessibility')}
              onKeyDown={(e) => handleTabKeyDown(e, 'accessibility')}
              aria-label="Accessibility tab"
              role="tab"
              id="accessibility-tab"
              aria-controls="accessibility-panel"
              aria-selected={activeTab === 'accessibility'}
              tabIndex={activeTab === 'accessibility' ? 0 : -1}
            >
              A11y
            </Button>
          </nav>
          
          <main className="sidepanel-content overflow-y-auto">
            {activeTab === 'spinner' && <SpinnerPanel />}
            {activeTab === 'settings' && <SettingsPanel />}
            {activeTab === 'csv' && <CSVPanel />}
            {activeTab === 'accessibility' && <AccessibilityPanel />}
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
