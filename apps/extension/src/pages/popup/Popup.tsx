import React from 'react';
import { Button } from '@repo/ui/button';
import { ThemeProvider } from '@repo/ui/theme-provider';
import { ThemeToggle } from '@repo/ui/theme-toggle';

const Popup: React.FC = () => {
  const openSidePanel = () => {
    chrome.runtime.sendMessage({ action: 'OPEN_SIDE_PANEL' });
  };

  return (
    <ThemeProvider defaultTheme="system" storageKey="bmt-theme">
      <div className="popup-container bg-background text-foreground">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">Better Made Tech</h1>
          <ThemeToggle size="sm" />
        </div>
        <p className="text-muted-foreground mb-4">This is the popup page for the extension.</p>
        <Button onClick={openSidePanel} className="w-full">Open Side Panel</Button>
      </div>
    </ThemeProvider>
  );
};

export default Popup;
