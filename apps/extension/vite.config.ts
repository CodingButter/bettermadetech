import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import path from 'path';
import fs from 'fs';
import tailwindcss from '@tailwindcss/vite';

// Helper function to find files recursively
function findFilesRecursively(dir, extension) {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Recurse into subdirectory
      results = results.concat(findFilesRecursively(filePath, extension));
    } else if (file.endsWith(extension)) {
      results.push(filePath);
    }
  });
  
  return results;
}

// Define __dirname for browser environment
const __dirname = path.resolve();

export default defineConfig({
  resolve: {
    alias: {
      // Replace @repo/env-config with our local implementation
      '@repo/env-config': path.resolve(__dirname, 'src/utils/env-config.ts'),
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'fix-extension-structure',
      closeBundle() {
        const distDir = path.resolve(__dirname, 'dist');
        
        // Create necessary directories if they don't exist
        ['popup', 'options', 'sidepanel', 'background', 'content', 'icons', 'assets', 'assets/css', 'assets/images'].forEach(dir => {
          const dirPath = path.resolve(distDir, dir);
          if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
          }
        });
        
        // Fix the HTML files in dist/src/pages - this is needed because Vite automatically rewrites these
        const srcPagesDir = path.resolve(distDir, 'src/pages');
        if (fs.existsSync(srcPagesDir)) {
          // Find all HTML files in src/pages and subfolders
          const htmlFiles = findFilesRecursively(srcPagesDir, '.html');
          
          for (const htmlFile of htmlFiles) {
            let htmlContent = fs.readFileSync(htmlFile, 'utf8');
            // Replace all absolute paths with relative paths (going up two levels)
            htmlContent = htmlContent.replace(/src="\/([^"]+)"/g, 'src="../$1"');
            htmlContent = htmlContent.replace(/href="\/([^"]+)"/g, 'href="../$1"');
            // Write the modified content back
            fs.writeFileSync(htmlFile, htmlContent);
          }
        }
        
        // Copy manifest.json
        fs.copyFileSync(
          path.resolve(__dirname, 'manifest.json'),
          path.resolve(distDir, 'manifest.json')
        );
        
        // Fix HTML paths - move HTML files to correct locations
        try {
          // Process popup HTML - ALWAYS create a new one instead of relying on Vite's output
          const popupHtmlDest = path.resolve(distDir, 'popup/index.html');
          
          // Create the popup HTML directly with relative paths
          const popupHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Better Made Tech - Popup</title>
  <script type="module" crossorigin src="../popup/popup.js"></script>
  <link rel="modulepreload" crossorigin href="../vendor/vendor.DJG_os-6.js">
  <link rel="modulepreload" crossorigin href="../globals/globals.B_diGAw5.js">
  <link rel="stylesheet" crossorigin href="../assets/css/globals-B_mZq1v8.css">
</head>
<body>
  <div id="root"></div>
</body>
</html>`;
          
          fs.writeFileSync(popupHtmlDest, popupHtml);
          
          // Process options HTML - ALWAYS create a new one
          const optionsHtmlDest = path.resolve(distDir, 'options/index.html');
          
          // Create the options HTML directly with relative paths
          const optionsHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Better Made Tech - Options</title>
  <script type="module" crossorigin src="../options/options.js"></script>
  <link rel="modulepreload" crossorigin href="../vendor/vendor.DJG_os-6.js">
  <link rel="modulepreload" crossorigin href="../globals/globals.B_diGAw5.js">
  <link rel="modulepreload" crossorigin href="../storage/storage.DpB5bn1N.js">
  <link rel="stylesheet" crossorigin href="../assets/css/globals-B_mZq1v8.css">
</head>
<body>
  <div id="root"></div>
</body>
</html>`;
          
          fs.writeFileSync(optionsHtmlDest, optionsHtml);
          
          // Process sidepanel HTML - ALWAYS create a new one
          const sidepanelHtmlDest = path.resolve(distDir, 'sidepanel/index.html');
          
          // Create the sidepanel HTML directly with relative paths
          const sidepanelHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Better Made Tech - Side Panel</title>
  <script type="module" crossorigin src="../sidepanel/sidepanel.js"></script>
  <link rel="modulepreload" crossorigin href="../vendor/vendor.DJG_os-6.js">
  <link rel="modulepreload" crossorigin href="../globals/globals.B_diGAw5.js">
  <link rel="stylesheet" crossorigin href="../assets/css/globals-B_mZq1v8.css">
</head>
<body>
  <div id="root"></div>
</body>
</html>`;
          
          fs.writeFileSync(sidepanelHtmlDest, sidepanelHtml);
          
          // Process all JS files to fix imports with underscore prefixes and correct paths
          const jsFiles = findFilesRecursively(distDir, '.js');
          for (const jsFile of jsFiles) {
            let fileContent = fs.readFileSync(jsFile, 'utf8');
            // Fix underscore prefixes
            fileContent = fileContent.replace(/(\/(|src\/|href="|import from "|import.+from ")_)([^/"']+)/g, '$1common-$3');
            fileContent = fileContent.replace(/\/_commonjsHelpers\//g, '/common-commonjsHelpers/');
            
            // Fix absolute paths in imports to be relative based on the file's location
            // This is a complex transformation that may need refinement based on testing
            const jsFileDir = path.dirname(jsFile);
            const relativeToDist = path.relative(jsFileDir, distDir);
            fileContent = fileContent.replace(
              /import\s+(?:[\w\s{},*]+from\s+)?["']\/([^"']+)["']/g, 
              (match, importPath) => {
                return match.replace(`"/${importPath}"`, `"${relativeToDist}/${importPath}"`);
              }
            );
            
            fs.writeFileSync(jsFile, fileContent);
          }
          
          // Copy public assets
          // Copy icons from public directory if they exist, or create placeholders
          ['icon16.png', 'icon32.png', 'icon48.png', 'icon128.png'].forEach(iconName => {
            const sourcePath = path.resolve(__dirname, 'public/icons', iconName);
            const targetPath = path.resolve(distDir, 'icons', iconName);
            
            if (fs.existsSync(sourcePath)) {
              // Copy the existing icon
              fs.copyFileSync(sourcePath, targetPath);
            } else if (!fs.existsSync(targetPath)) {
              // Create an empty placeholder only if it doesn't already exist
              fs.writeFileSync(targetPath, '');
            }
          });
          
          // Copy any CSS files from public if they exist
          const publicPath = path.resolve(__dirname, 'public');
          if (fs.existsSync(publicPath)) {
            const copyRecursively = (src, dest) => {
              if (fs.statSync(src).isDirectory()) {
                if (!fs.existsSync(dest)) {
                  fs.mkdirSync(dest, { recursive: true });
                }
                
                fs.readdirSync(src).forEach(file => {
                  const srcFile = path.join(src, file);
                  const destFile = path.join(dest, file);
                  copyRecursively(srcFile, destFile);
                });
              } else {
                // Skip icons directory as we already handled it
                if (!src.includes('public/icons')) {
                  fs.copyFileSync(src, dest);
                }
              }
            };
            
            // Copy public assets to dist, preserving directory structure
            fs.readdirSync(publicPath).forEach(item => {
              // Skip the icons directory as we handle that separately
              if (item !== 'icons') {
                const srcItem = path.join(publicPath, item);
                const destItem = path.join(distDir, item);
                copyRecursively(srcItem, destItem);
              }
            });
          }
          
          console.log('Extension structure fixed successfully');
        } catch (error) {
          console.error('Error fixing extension structure:', error);
        }
      }
    }
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/pages/popup/index.html'),
        options: resolve(__dirname, 'src/pages/options/index.html'),
        sidepanel: resolve(__dirname, 'src/pages/sidepanel/index.html'),
        background: resolve(__dirname, 'src/background/index.ts'),
        content: resolve(__dirname, 'src/content/index.ts'),
      },
      output: {
        // Avoid Chrome's reserved filename pattern starting with underscore
        inlineDynamicImports: false,
        manualChunks: {
          'vendor': ['react', 'react-dom'],
        },
        sanitizeFileName: (name) => {
          // Replace underscore prefix with 'common-'
          return name.startsWith('_') ? `common-${name.slice(1)}` : name;
        },
        entryFileNames: (chunk) => {
          return chunk.name === 'background' || chunk.name === 'content'
            ? '[name]/index.js'
            : '[name]/[name].js';
        },
        chunkFileNames: (chunkInfo) => {
          // Ensure no chunk filenames start with underscore
          const sanitizedName = chunkInfo.name.startsWith('_') 
            ? `common-${chunkInfo.name.slice(1)}` 
            : chunkInfo.name;
          return `${sanitizedName}/${sanitizedName}.[hash].js`;
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const extType = info[info.length - 1];
          // Ensure no asset filenames start with underscore
          const nameWithoutExt = assetInfo.name.substring(0, assetInfo.name.lastIndexOf('.'));
          const sanitizedName = nameWithoutExt.startsWith('_')
            ? `common-${nameWithoutExt.slice(1)}`
            : nameWithoutExt;
          
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name)) {
            return `assets/images/${sanitizedName}-[hash][extname]`;
          }
          
          if (/\.(css)$/i.test(assetInfo.name)) {
            return `assets/css/${sanitizedName}-[hash][extname]`;
          }
          
          return `assets/${sanitizedName}-[hash][extname]`;
        }
      },
    },
  },
});