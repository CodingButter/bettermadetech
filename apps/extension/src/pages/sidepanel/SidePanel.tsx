import React, { useState } from 'react';
import { Button } from '@repo/ui/button';
import { ThemeProvider } from '@repo/ui/theme-provider';
import { ThemeToggle } from '@repo/ui/theme-toggle';
import { Card } from '@repo/ui/card';

const SidePanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('home');

  return (
    <ThemeProvider defaultTheme="system" storageKey="bmt-theme">
      <div className="sidepanel-container bg-background text-foreground">
        <header className="sidepanel-header flex items-center justify-between">
          <h1 className="text-xl font-bold">Better Made Tech</h1>
          <ThemeToggle size="sm" />
        </header>
        
        <nav className="sidepanel-nav">
          <Button 
            variant={activeTab === 'home' ? 'default' : 'ghost'}
            className="flex-1 rounded-none"
            onClick={() => setActiveTab('home')}
          >
            Home
          </Button>
          <Button 
            variant={activeTab === 'tools' ? 'default' : 'ghost'}
            className="flex-1 rounded-none"
            onClick={() => setActiveTab('tools')}
          >
            Tools
          </Button>
          <Button 
            variant={activeTab === 'settings' ? 'default' : 'ghost'}
            className="flex-1 rounded-none"
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </Button>
        </nav>
        
        <main className="sidepanel-content">
          {activeTab === 'home' && (
            <div className="tab-content">
              <h2 className="text-2xl font-bold mb-4">Welcome to Better Made Tech</h2>
              <p className="text-muted-foreground mb-6">Use this panel to access tools and settings for enhancing your browsing experience.</p>
            </div>
          )}
          
          {activeTab === 'tools' && (
            <div className="tab-content">
              <h2 className="text-2xl font-bold mb-4">Tools</h2>
              <ul className="tools-list">
                <li>
                  <Card className="p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                    <h3 className="font-medium mb-2">Website Analyzer</h3>
                    <p className="text-sm text-muted-foreground">Analyze website performance and structure</p>
                  </Card>
                </li>
                <li>
                  <Card className="p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                    <h3 className="font-medium mb-2">Code Inspector</h3>
                    <p className="text-sm text-muted-foreground">Inspect and analyze page source code</p>
                  </Card>
                </li>
                <li>
                  <Card className="p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                    <h3 className="font-medium mb-2">Performance Monitor</h3>
                    <p className="text-sm text-muted-foreground">Monitor website performance metrics</p>
                  </Card>
                </li>
              </ul>
            </div>
          )}
          
          {activeTab === 'settings' && (
            <div className="tab-content">
              <h2 className="text-2xl font-bold mb-4">Settings</h2>
              <form className="settings-form space-y-4">
                <div className="form-group">
                  <label htmlFor="theme" className="text-sm font-medium mb-1 block">Theme</label>
                  <select 
                    id="theme" 
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System Default</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="notifications" 
                      className="rounded border-input h-4 w-4"
                    />
                    Enable Notifications
                  </label>
                </div>
                
                <div className="form-group">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="analytics" 
                      className="rounded border-input h-4 w-4"
                    />
                    Share Anonymous Usage Data
                  </label>
                </div>
                
                <Button type="button">Save Settings</Button>
              </form>
            </div>
          )}
        </main>
        
        <footer className="sidepanel-footer">
          <p>Better Made Tech &copy; {new Date().getFullYear()}</p>
        </footer>
      </div>
    </ThemeProvider>
  );
};

export default SidePanel;
