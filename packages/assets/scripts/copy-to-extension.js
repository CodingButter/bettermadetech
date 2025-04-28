const { promises: fs } = require('fs');
const path = require('path');

async function copyToExtension() {
  const sourceIconsDir = path.join(__dirname, '../icons/extension');
  const targetIconsDir = path.join(__dirname, '../../../apps/extension/public/icons');
  // Also copy to the dist folder if it exists
  const distIconsDir = path.join(__dirname, '../../../apps/extension/dist/icons');
  
  try {
    // Ensure the target directories exist
    await fs.mkdir(targetIconsDir, { recursive: true });
    await fs.mkdir(distIconsDir, { recursive: true }).catch(() => {
      // If dist doesn't exist yet, that's okay
      console.log('Note: dist folder does not exist yet, will only copy to public');
    });
    
    console.log('Copying icons to extension...');
    
    // Read all extension icons
    const files = await fs.readdir(sourceIconsDir);
    const pngFiles = files.filter(file => file.endsWith('.png'));
    
    // Copy each icon to the extension's public directory
    for (const file of pngFiles) {
      const sourceFile = path.join(sourceIconsDir, file);
      const targetFile = path.join(targetIconsDir, file);
      
      await fs.copyFile(sourceFile, targetFile);
      // Also try to copy to dist if it exists
      try {
        const distFile = path.join(distIconsDir, file);
        await fs.copyFile(sourceFile, distFile);
        console.log(`Copied ${file} to extension dist`);
      } catch (err) {
        // Silently fail if dist doesn't exist
      }
      console.log(`Copied ${file} to extension public`);
    }
    
    // Check if we need to update the manifest.json file
    const manifestPath = path.join(__dirname, '../../../apps/extension/manifest.json');
    const distManifestPath = path.join(__dirname, '../../../apps/extension/dist/manifest.json');
    try {
      const manifestData = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
      
      // Ensure the icon paths are correctly set
      const iconSizes = ['16', '32', '48', '128'];
      let updated = false;
      
      // Check action icon paths
      if (manifestData.action && manifestData.action.default_icon) {
        for (const size of iconSizes) {
          if (manifestData.action.default_icon[size] !== `icons/icon${size}.png`) {
            manifestData.action.default_icon[size] = `icons/icon${size}.png`;
            updated = true;
          }
        }
      }
      
      // Check main icon paths
      if (manifestData.icons) {
        for (const size of iconSizes) {
          if (manifestData.icons[size] !== `icons/icon${size}.png`) {
            manifestData.icons[size] = `icons/icon${size}.png`;
            updated = true;
          }
        }
      }
      
      // Save the manifest if it was updated
      if (updated) {
        await fs.writeFile(manifestPath, JSON.stringify(manifestData, null, 2));
        console.log('Updated extension manifest.json with correct icon paths');
        
        // Also update the manifest in dist if it exists
        try {
          await fs.access(distManifestPath);
          await fs.writeFile(distManifestPath, JSON.stringify(manifestData, null, 2));
          console.log('Updated extension dist/manifest.json with correct icon paths');
        } catch (err) {
          // Silently fail if dist manifest doesn't exist
        }
      }
    } catch (error) {
      console.warn('Unable to update manifest.json:', error.message);
    }
    
    console.log('Copy to extension complete!');
  } catch (error) {
    console.error('Error copying to extension:', error);
    process.exit(1);
  }
}

// Execute the function
copyToExtension();