// Content script for Better Made Tech extension

console.log('Better Made Tech content script loaded');

// Example function to interact with page content
const scanPageContent = () => {
  const pageTitle = document.title;
  const pageUrl = window.location.href;
  
  // Send data to the background script
  chrome.runtime.sendMessage({
    action: 'PAGE_SCANNED',
    data: {
      title: pageTitle,
      url: pageUrl,
      timestamp: new Date().toISOString()
    }
  }, (response) => {
    console.log('Response from background:', response);
  });
};

// Execute when content script is loaded
scanPageContent();
