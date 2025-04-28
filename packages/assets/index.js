const path = require('path');

// Define icon sizes
const SIZES = {
  extension: [16, 32, 48, 128],
  webapp: [32, 64, 128, 192, 256, 512],
  social: [200, 400, 600, 800, 1200]
};

// Create path objects for each icon category
const extensionIcons = SIZES.extension.reduce((acc, size) => {
  acc[`icon${size}`] = path.join(__dirname, `icons/extension/icon${size}.png`);
  return acc;
}, {});

const webappIcons = SIZES.webapp.reduce((acc, size) => {
  acc[`icon${size}`] = path.join(__dirname, `icons/webapp/icon${size}.png`);
  return acc;
}, {});

const socialIcons = SIZES.social.reduce((acc, size) => {
  acc[`icon${size}`] = path.join(__dirname, `icons/social/icon${size}.png`);
  return acc;
}, {});

// Export paths to common assets
module.exports = {
  // Icon sizes definition (useful for generation scripts)
  sizes: SIZES,
  
  // Logo images
  logo: {
    original: path.join(__dirname, 'images/logo.png'),
    // Extension icons
    extension: extensionIcons,
    // Web app icons
    webapp: webappIcons,
    // Social media icons
    social: socialIcons,
  },
  
  // Favicon
  favicon: {
    ico: path.join(__dirname, 'favicons/favicon.ico'),
    manifest: path.join(__dirname, 'favicons/manifest.json'),
    webmanifest: path.join(__dirname, 'favicons/manifest.webmanifest'),
    // Helper method to get HTML for favicon inclusion
    getHtmlCode: async () => {
      try {
        const fs = require('fs').promises;
        const manifestPath = path.join(__dirname, 'favicons/manifest.json');
        const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
        return manifest.htmlCode.join('\n');
      } catch (error) {
        console.error('Error reading favicon HTML code:', error);
        return '<!-- Error loading favicon code -->';
      }
    }
  },
  
  // Directories
  directories: {
    images: path.join(__dirname, 'images'),
    icons: path.join(__dirname, 'icons'),
    favicons: path.join(__dirname, 'favicons'),
  },
};