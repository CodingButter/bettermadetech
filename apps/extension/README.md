# Better Made Tech Chrome Extension

A Chrome extension built with React and Vite for Better Made Tech.

## Features

- React + TypeScript for UI components
- Vite for fast development and building
- Background service worker
- Content script for page interaction
- Chrome storage utilities
- Popup and options pages

## Development

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Building

```bash
# Build extension
npm run build
```

The built extension will be in the `dist` directory.

### Loading the Extension in Chrome

1. Build the extension: `npm run build`
2. Open Chrome and navigate to `chrome://extensions`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the `dist` folder

## Project Structure

```
src/
├── background/         # Background service worker
├── content/            # Content scripts
├── components/         # Shared React components
├── pages/
│   ├── popup/          # Popup UI
│   └── options/        # Options page UI
└── utils/              # Utility functions
```

## Chrome API Usage

The extension uses the following Chrome APIs:

- `chrome.storage` - For storing user preferences and data
- `chrome.runtime` - For handling extension installation and messaging
- `chrome.tabs` - For interacting with browser tabs

## License

ISC