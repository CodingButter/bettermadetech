# @repo/assets

This package contains all shared assets for the Winner Spinner project. It centralizes logos, icons, and other media resources to ensure consistency across all applications.

## Usage

### In React Components

The UI package provides a Logo component that can be used in any React application:

```tsx
import { Logo, LogoWithText } from '@repo/ui';

// Just the logo
<Logo size="md" />

// Logo with text
<LogoWithText size="lg" variant="light" />
```

### Accessing Asset Paths

You can also access asset paths directly in a type-safe way:

```ts
import { logo, favicon, sizes } from '@repo/assets';

// Get the path to the original logo
const logoPath = logo.original;

// Get various icon sizes
const icon32Path = logo.webapp.icon32;
const icon128Path = logo.extension.icon128;

// Get the favicon.ico path
const faviconPath = favicon.ico;

// Get the HTML code for favicons
const getHtmlForFavicons = async () => {
  const htmlCode = await favicon.getHtmlCode();
  return htmlCode;
};

// Access icon size definitions
console.log(sizes.extension); // [16, 32, 48, 128]
```

## Structure

The package is organized as follows:

- `images/` - Original image assets
- `icons/` - Generated icons in various sizes
  - `extension/` - Icons for the Chrome extension (16, 32, 48, 128px)
  - `webapp/` - Icons for web applications (32, 64, 128, 192, 256, 512px)
  - `social/` - Icons for social media sharing (200, 400, 600, 800, 1200px)
- `favicons/` - Favicon files for web applications
- `scripts/` - Utility scripts for generating and copying assets

## Scripts

This package provides several utility scripts for managing assets:

```bash
# Generate all icons from the original logo
pnpm generate:icons

# Generate favicons for web applications
pnpm generate:favicon

# Copy icons to the extension
pnpm copy:extension

# Copy favicons to web and docs applications
pnpm copy:apps

# Complete build process (generate icons and favicons)
pnpm build

# Complete build and deploy to all applications
pnpm deploy
```

## Updating the Logo

To update the logo across all applications:

1. Replace the `images/logo.png` file with the new logo
2. Run `pnpm deploy` to regenerate and deploy all assets
3. Rebuild the applications to use the new assets

All apps and the extension will automatically use the updated logo after rebuilding.

## Asset Generation Process

The scripts in this package handle the following:

1. `generate:icons.js` - Takes the source logo from `images/logo.png` and generates:
   - Chrome extension icons (16px, 32px, 48px, 128px)
   - Web app icons (32px, 64px, 128px, 192px, 256px, 512px)
   - Social media icons (200px, 400px, 600px, 800px, 1200px)

2. `generate:favicon.js` - Creates a complete set of favicons for web applications:
   - favicon.ico
   - Apple touch icons
   - Android homescreen icons
   - Web manifest file

3. `copy-to-extension.js` - Copies extension icons to the Chrome extension and updates the manifest.json if needed

4. `copy-to-apps.js` - Copies favicons and web app icons to all web applications and creates favicon HTML snippet files for easy inclusion

## Including Favicons in a Web App

After running the deployment script, each web app will have a `favicon-snippet.html` file in its public directory. You can include this in your Next.js app by:

```tsx
import fs from 'fs';
import path from 'path';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Read the favicon snippet
  const faviconSnippet = fs.readFileSync(
    path.join(process.cwd(), 'public/favicon-snippet.html'),
    'utf8'
  );

  return (
    <html lang="en">
      <head>
        {/* Include favicons */}
        <div dangerouslySetInnerHTML={{ __html: faviconSnippet }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

## Adding New Assets

To add new assets:

1. Place the original file in the appropriate directory under `images/`
2. Add the file path to `index.js` and type definitions to `index.d.ts`
3. Create or update scripts as needed for processing the assets