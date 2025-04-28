// Background script for Better Made Tech extension
import { initializeDefaultSettings } from '../utils/storage';

const handleInstalled = async (details: chrome.runtime.InstalledDetails) => {
  console.log('Extension installed:', details);
  
  // Initialize default settings
  try {
    await initializeDefaultSettings();
    console.log('Default settings initialized');
  } catch (error) {
    console.error('Failed to initialize settings:', error);
  }
  
  // Set up side panel
  if (chrome.sidePanel) {
    chrome.sidePanel.setOptions({
      path: 'sidepanel/index.html',
      enabled: true
    });
  }
};

chrome.runtime.onInstalled.addListener(handleInstalled);

// Listen for messages from content script or popup
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  console.log('Message received in background script:', message);
  
  // Handle opening the side panel if requested
  if (message.action === 'OPEN_SIDE_PANEL') {
    if (chrome.sidePanel) {
      // Using the current tab as the target for the side panel
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          chrome.sidePanel.open({ tabId: tabs[0].id });
        }
      });
    }
  }
  
  // You can process messages here and send back a response
  sendResponse({ status: 'Received in background script' });
  
  // Return true to indicate you wish to send a response asynchronously
  return true;
});
