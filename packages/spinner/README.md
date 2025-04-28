# Spinner Package

A modular, customizable spinner component for various applications in the Better Made Tech ecosystem.

## Overview

The `@repo/spinner` package provides a highly customizable spinner (wheel of fortune) component that can be used across different environments in the Better Made Tech ecosystem. The package follows a dependency injection pattern, allowing each application to provide its own implementation of the spinner's data storage and authentication mechanisms.

## Features

- Abstract base class design pattern for environment-specific implementations
- React Context API for state management and dependency injection
- Customizable appearance with support for colors, sizes, and animations
- Support for different platforms (Web, Extension, Documentation site)
- Built-in authentication and settings management
- Comprehensive test suite

## Installation

Since this is a workspace package, you don't need to install it separately. It's automatically available to all applications in the Better Made Tech monorepo.

To use it in one of your app packages:

```bash
# No installation needed - it's available via workspace dependencies
```

Make sure your application's `package.json` includes the spinner package:

```json
"dependencies": {
  "@repo/spinner": "workspace:*",
  // ... other dependencies
}
```

## Usage

### Basic Usage

```tsx
import { Spinner } from '@repo/spinner';

const MyComponent = () => {
  const segments = [
    { id: '1', label: 'Option 1', value: '1' },
    { id: '2', label: 'Option 2', value: '2' },
    { id: '3', label: 'Option 3', value: '3' },
    { id: '4', label: 'Option 4', value: '4' },
  ];

  const handleSpinEnd = (winner) => {
    console.log(`The winner is: ${winner.label}`);
  };

  return (
    <Spinner
      segments={segments}
      primaryColor="#4f46e5"
      secondaryColor="#f97316"
      duration={5}
      onSpinEnd={handleSpinEnd}
      showWinner={true}
    />
  );
};
```

### Using with Context

For applications that need to store and retrieve spinner settings, use the `SpinnerProvider` and `ContextSpinner` components:

```tsx
import { SpinnerProvider, ContextSpinner } from '@repo/spinner';
import { WebSpinnerClient } from './utils/web-spinner-client';

const App = () => {
  // Create an instance of your platform-specific spinner client
  const spinnerClient = new WebSpinnerClient();

  return (
    <SpinnerProvider client={spinnerClient}>
      <div className="app">
        <h1>My Spinner App</h1>
        <ContextSpinner />
      </div>
    </SpinnerProvider>
  );
};
```

### Implementing a Platform-Specific Client

To use the spinner in your application, you need to implement the `SpinnerBase` abstract class for your specific environment:

```tsx
// web-spinner-client.ts
import { SpinnerBase, SpinnerSettings, AuthInfo, LoadSpinnerResult } from '@repo/spinner';

export class WebSpinnerClient extends SpinnerBase {
  // Implement all required methods
  async getAuthInfo(): Promise<AuthInfo> {
    // Implementation for web environment
  }

  async authenticate(email: string, password: string): Promise<AuthInfo> {
    // Implementation for web environment
  }

  // ... implement other required methods
}
```

## API Reference

### Spinner Component

The main component for rendering the spinner wheel.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `segments` | `SpinnerSegment[]` | Required | Array of segments to display on the spinner |
| `duration` | `number` | `5` | Animation duration in seconds |
| `primaryColor` | `string` | `#4f46e5` | Primary color for odd-indexed segments |
| `secondaryColor` | `string` | `#f97316` | Secondary color for even-indexed segments |
| `isSpinning` | `boolean` | `false` | Controls if the spinner is currently spinning |
| `onSpinEnd` | `(winner: SpinnerSegment) => void` | `undefined` | Callback triggered when spinning stops |
| `className` | `string` | `undefined` | Additional CSS class names |
| `showWinner` | `boolean` | `false` | Whether to show a winner overlay when spinning stops |

### SpinnerBase Abstract Class

The abstract class that must be implemented for each platform environment.

#### Methods to Implement

| Method | Return Type | Description |
|--------|-------------|-------------|
| `getAuthInfo()` | `Promise<AuthInfo>` | Get the current authentication status |
| `authenticate(email, password)` | `Promise<AuthInfo>` | Authenticate with the backend service |
| `logout()` | `Promise<void>` | Log out the current user |
| `loadSpinnerSettings()` | `Promise<LoadSpinnerResult>` | Load all spinner settings for the current user |
| `loadSpinnerSettingById(id)` | `Promise<SpinnerSettings \| null>` | Load a specific spinner setting by ID |
| `saveSpinnerSettings(settings)` | `Promise<{success, error?, id?}>` | Save spinner settings to storage |
| `deleteSpinnerSettings(id)` | `Promise<{success, error?}>` | Delete spinner settings |
| `setActiveSpinner(id)` | `Promise<{success, error?}>` | Update the current active spinner |
| `getActiveSpinnerId()` | `Promise<string \| null>` | Get the ID of the currently active spinner |
| `getConfig()` | `Promise<any>` | Get application-specific configuration |

### SpinnerContext

The React context for managing spinner state and providing the spinner client to components.

```tsx
const { 
  client,         // The spinner client implementation
  auth,           // Current authentication status
  spinnerSettings, // Currently loaded spinner settings
  activeSpinnerId, // Currently active spinner ID
  refreshSettings, // Function to refresh spinner settings
  setActiveSpinner // Function to set the active spinner
} = useSpinner();
```

## Examples

### Web Application Example

```tsx
// web-spinner-client.ts
import { SpinnerBase, SpinnerSettings, AuthInfo } from '@repo/spinner';

export class WebSpinnerClient extends SpinnerBase {
  async getAuthInfo(): Promise<AuthInfo> {
    const auth = localStorage.getItem('spinner_auth');
    return auth ? JSON.parse(auth) : { isAuthenticated: false };
  }

  // Implement other methods...
}

// app.tsx
import { SpinnerProvider, ContextSpinner } from '@repo/spinner';
import { WebSpinnerClient } from './web-spinner-client';

const App = () => {
  const client = new WebSpinnerClient();
  
  return (
    <SpinnerProvider client={client}>
      <ContextSpinner />
    </SpinnerProvider>
  );
};
```

### Chrome Extension Example

```tsx
// extension-spinner-client.ts
import { SpinnerBase, SpinnerSettings, AuthInfo } from '@repo/spinner';

export class ExtensionSpinnerClient extends SpinnerBase {
  async getAuthInfo(): Promise<AuthInfo> {
    return new Promise((resolve) => {
      chrome.storage.local.get(['auth'], (result) => {
        resolve(result.auth || { isAuthenticated: false });
      });
    });
  }

  // Implement other methods...
}

// popup.tsx
import { SpinnerProvider, ContextSpinner } from '@repo/spinner';
import { ExtensionSpinnerClient } from './extension-spinner-client';

const Popup = () => {
  const client = new ExtensionSpinnerClient();
  
  return (
    <SpinnerProvider client={client}>
      <ContextSpinner />
    </SpinnerProvider>
  );
};
```

## Customization

The spinner appearance can be customized in multiple ways:

1. **Colors**: Use `primaryColor` and `secondaryColor` props to change the segment colors
2. **Segments**: Provide custom `segments` with your own `id`, `label`, and `value`
3. **Duration**: Adjust the `duration` prop to control the spinning animation time
4. **Winner display**: Toggle `showWinner` to display the winner overlay
5. **CSS Classes**: Use the `className` prop to apply custom CSS classes

## Testing

The package includes comprehensive tests for all components:

```bash
# Run the tests
pnpm test

# Run tests with coverage report
pnpm test:coverage

# Run tests in watch mode
pnpm test:watch
```

## Contributing

When contributing to the spinner package, please ensure:

1. All tests pass before and after your changes
2. Type checking passes with `pnpm check-types`
3. Linting passes with `pnpm lint`
4. New features are properly tested
5. Documentation is updated to reflect any changes

## License

This package is part of the Better Made Tech project and is subject to the project's license terms.