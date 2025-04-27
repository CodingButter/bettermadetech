import { Card, CardTitle, CardContent } from "@repo/ui/card";
import { Code } from "@repo/ui/code";

/**
 * Extension documentation page that provides information on how to use
 * and develop with the Better Made Tech Chrome extension.
 */
export default function ExtensionPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8">Chrome Extension</h1>
      <p className="text-lg mb-12">
        The Better Made Tech Chrome extension provides spinning wheel functionality
        directly in your browser. This documentation covers how to use the extension,
        configure it, and develop for it.
      </p>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6" id="overview">Overview</h2>
        <Card className="p-6">
          <CardContent>
            <p className="mb-4">
              The Better Made Tech extension enhances your browsing experience by providing
              tools for random selection and decision making. Key features include:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Customizable spinning wheel for random selection</li>
              <li>Integration with Directus backend for storage and synchronization</li>
              <li>Theme support (light/dark mode)</li>
              <li>Side panel for quick access to spinner functionality</li>
              <li>Options page for customizing spinner appearance and behavior</li>
            </ul>
          </CardContent>
        </Card>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6" id="installation">Installation</h2>
        <Card className="p-6 mb-8">
          <CardTitle>Development Installation</CardTitle>
          <CardContent className="pt-4">
            <p className="mb-4">
              To install the extension in development mode:
            </p>
            <ol className="list-decimal pl-6 mb-4 space-y-2">
              <li>Clone the repository</li>
              <li>Install dependencies with <Code variant="inline">pnpm install</Code></li>
              <li>Build the extension with <Code variant="inline">pnpm build</Code> in the extension directory</li>
              <li>Open Chrome and navigate to <Code variant="inline">chrome://extensions</Code></li>
              <li>Enable Developer Mode (toggle in top-right)</li>
              <li>Click &quot;Load unpacked&quot; and select the <Code variant="inline">apps/extension/dist</Code> directory</li>
            </ol>
          </CardContent>
        </Card>

        <Card className="p-6">
          <CardTitle>Production Installation</CardTitle>
          <CardContent className="pt-4">
            <p className="mb-4">
              The extension can be installed from the Chrome Web Store (coming soon):
            </p>
            <ol className="list-decimal pl-6 mb-4 space-y-2">
              <li>Visit the Chrome Web Store</li>
              <li>Search for &quot;Better Made Tech Spinner&quot;</li>
              <li>Click &quot;Add to Chrome&quot;</li>
            </ol>
          </CardContent>
        </Card>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6" id="usage">Usage</h2>
        
        <Card className="p-6 mb-8">
          <CardTitle>Popup</CardTitle>
          <CardContent className="pt-4">
            <p className="mb-4">
              The extension popup provides quick access to the spinner:
            </p>
            <ol className="list-decimal pl-6 mb-4 space-y-2">
              <li>Click the extension icon in the toolbar</li>
              <li>The popup will show the spinner with current settings</li>
              <li>Click &quot;Spin&quot; to start the spinner</li>
              <li>The winner will be displayed after spinning completes</li>
              <li>Click &quot;Settings&quot; to access the options page</li>
            </ol>
          </CardContent>
        </Card>
        
        <Card className="p-6 mb-8">
          <CardTitle>Side Panel</CardTitle>
          <CardContent className="pt-4">
            <p className="mb-4">
              The side panel provides spinner functionality without leaving the current page:
            </p>
            <ol className="list-decimal pl-6 mb-4 space-y-2">
              <li>Click the side panel icon in Chrome&apos;s toolbar</li>
              <li>Select the Better Made Tech extension</li>
              <li>Use the spinner directly from the side panel</li>
              <li>Access saved spinners from your account</li>
            </ol>
          </CardContent>
        </Card>
        
        <Card className="p-6">
          <CardTitle>Options Page</CardTitle>
          <CardContent className="pt-4">
            <p className="mb-4">
              The options page allows customization of the extension:
            </p>
            <ol className="list-decimal pl-6 mb-4 space-y-2">
              <li>Right-click the extension icon and select &quot;Options&quot;</li>
              <li>Or access options from the popup menu</li>
              <li>Customize spinner colors, duration, and appearance</li>
              <li>Connect to your Directus account</li>
              <li>Manage saved spinners</li>
              <li>Configure extension behavior</li>
            </ol>
          </CardContent>
        </Card>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6" id="development">Development</h2>
        
        <Card className="p-6 mb-8">
          <CardTitle>Architecture</CardTitle>
          <CardContent className="pt-4">
            <p className="mb-4">
              The extension follows Chrome Extension Manifest V3 architecture:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>Background Script:</strong> Handles background operations and state management</li>
              <li><strong>Content Script:</strong> Interacts with web pages when needed</li>
              <li><strong>Popup:</strong> UI for quick spinner access</li>
              <li><strong>Side Panel:</strong> Extended UI for spinner functionality</li>
              <li><strong>Options Page:</strong> Configuration interface</li>
            </ul>
            <p>
              The extension is built with React, TypeScript, and Tailwind CSS, using Vite as the build tool.
            </p>
          </CardContent>
        </Card>
        
        <Card className="p-6 mb-8">
          <CardTitle>Storage API</CardTitle>
          <CardContent className="pt-4">
            <p className="mb-4">
              The extension uses Chrome&apos;s Storage API for persistent data:
            </p>
            <Code variant="block">{`import { getStorageItems, setStorageItems, type StorageItems } from '../utils/storage';

// Get storage items
const getData = async () => {
  const { options, userData } = await getStorageItems(['options', 'userData']);
  console.log('User theme preference:', options?.theme);
  console.log('User is logged in:', userData?.loggedIn);
};

// Set storage items
const saveData = async () => {
  await setStorageItems({
    options: {
      theme: 'dark',
      notifications: true
    }
  });
  console.log('Settings saved successfully');
};`}</Code>
          </CardContent>
        </Card>
        
        <Card className="p-6">
          <CardTitle>Environment Configuration</CardTitle>
          <CardContent className="pt-4">
            <p className="mb-4">
              Environment variables are handled through a browser-compatible config module:
            </p>
            <Code variant="block">{`import { DIRECTUS_CONFIG, APP_CONFIG } from '../utils/env-config';

// Access Directus configuration
console.log('API URL:', DIRECTUS_CONFIG.API_URL);

// Access app configuration
console.log('Default spin duration:', APP_CONFIG.DEFAULT_SPINNER.SPIN_DURATION);
console.log('Primary color:', APP_CONFIG.DEFAULT_SPINNER.PRIMARY_COLOR);`}</Code>
            <p className="mt-4">
              During development, you can modify these values in the <Code variant="inline">env-config.ts</Code> file.
              For production, the values are injected during the build process.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6" id="directus">Directus Integration</h2>
        
        <Card className="p-6">
          <CardTitle>Connecting to Directus</CardTitle>
          <CardContent className="pt-4">
            <p className="mb-4">
              The extension integrates with Directus for data storage and user management:
            </p>
            <Code variant="block">{`import { loginToDirectus, fetchUserSpinners } from '../utils/directus';

// Login to Directus
const handleLogin = async () => {
  try {
    const token = await loginToDirectus('user@example.com', 'password');
    if (token) {
      console.log('Login successful');
      // Save token to storage
      await chrome.storage.local.set({
        userData: {
          loggedIn: true,
          token,
        },
      });
      
      // Load user data
      const spinners = await fetchUserSpinners(token);
      console.log('User spinners:', spinners);
    }
  } catch (error) {
    console.error('Login failed:', error);
  }
};`}</Code>
            <p className="mt-4">
              To configure your own Directus instance, update the <Code variant="inline">DIRECTUS_CONFIG</Code> in 
              the environment configuration.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6" id="build">Build Process</h2>
        
        <Card className="p-6">
          <CardTitle>Building the Extension</CardTitle>
          <CardContent className="pt-4">
            <p className="mb-4">
              The extension uses Vite for building:
            </p>
            <Code variant="block">{`# Install dependencies
pnpm install

# Build the extension
cd apps/extension
pnpm build

# For development with hot-reload
pnpm dev`}</Code>
            <p className="mt-4">
              The build configuration in <Code variant="inline">vite.config.ts</Code> handles:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Creating HTML pages for popup, options, and side panel</li>
              <li>Compiling TypeScript to JavaScript</li>
              <li>Processing CSS with Tailwind</li>
              <li>Copying static assets</li>
              <li>Sanitizing filenames to avoid Chrome&apos;s underscore prefix restrictions</li>
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}