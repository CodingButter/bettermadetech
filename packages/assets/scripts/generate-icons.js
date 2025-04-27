const { promises: fs } = require('fs');
const path = require('path');
const sharp = require('sharp');

// Define icon sizes for different purposes
const SIZES = {
  // Chrome extension icons
  extension: [16, 32, 48, 128],
  // Web app icons (including PWA support)
  webapp: [32, 64, 128, 192, 256, 512],
  // Social media and other platforms
  social: [200, 400, 600, 800, 1200]
};

async function generateIcons() {
  const logoPath = path.join(__dirname, '../images/logo.png');
  
  // Ensure the icons directory exists
  await fs.mkdir(path.join(__dirname, '../icons/extension'), { recursive: true });
  await fs.mkdir(path.join(__dirname, '../icons/webapp'), { recursive: true });
  await fs.mkdir(path.join(__dirname, '../icons/social'), { recursive: true });

  try {
    // Check if logo file exists
    await fs.access(logoPath);
    
    console.log('Generating extension icons...');
    // Generate Chrome extension icons
    for (const size of SIZES.extension) {
      await sharp(logoPath)
        .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
        .png()
        .toFile(path.join(__dirname, `../icons/extension/icon${size}.png`));
      console.log(`Created extension icon: ${size}x${size}`);
    }

    console.log('Generating web app icons...');
    // Generate web app icons
    for (const size of SIZES.webapp) {
      await sharp(logoPath)
        .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
        .png()
        .toFile(path.join(__dirname, `../icons/webapp/icon${size}.png`));
      console.log(`Created web app icon: ${size}x${size}`);
    }

    console.log('Generating social media icons...');
    // Generate social media icons
    for (const size of SIZES.social) {
      await sharp(logoPath)
        .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
        .png()
        .toFile(path.join(__dirname, `../icons/social/icon${size}.png`));
      console.log(`Created social media icon: ${size}x${size}`);
    }

    // Create a combined manifest file for easy reference
    const manifest = {
      extension: SIZES.extension.map(size => ({ size, path: `icons/extension/icon${size}.png` })),
      webapp: SIZES.webapp.map(size => ({ size, path: `icons/webapp/icon${size}.png` })),
      social: SIZES.social.map(size => ({ size, path: `icons/social/icon${size}.png` }))
    };
    
    await fs.writeFile(
      path.join(__dirname, '../icons/manifest.json'), 
      JSON.stringify(manifest, null, 2)
    );

    console.log('Icon generation complete! Icons saved to packages/assets/icons/');
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

// Execute the function
generateIcons();