# Environment Configuration

This package contains environment configuration for the Better Made Tech project. It provides centralized access to environment variables and configuration settings.

## Setup

1. Copy the `.env.example` file to create a new `.env` file:
   ```bash
   cp packages/env-config/.env.example packages/env-config/.env
   ```

2. Edit the `.env` file with your actual configuration values:
   ```
   DIRECTUS_API_URL=https://your-directus-instance.com
   DIRECTUS_ADMIN_TOKEN=your_actual_admin_token
   ```

> **Important:** The `.env` file contains sensitive information and should never be committed to the repository.

## Usage

```typescript
import { DIRECTUS_CONFIG, APP_CONFIG, isDevelopment } from '@repo/env-config';

// Access Directus configuration
const apiUrl = DIRECTUS_CONFIG.API_URL;
const token = DIRECTUS_CONFIG.ADMIN_TOKEN;

// Access app configuration
const appName = APP_CONFIG.APP_NAME;
const defaultTheme = APP_CONFIG.DEFAULT_THEME;

// Access spinner default configuration
const spinDuration = APP_CONFIG.DEFAULT_SPINNER.SPIN_DURATION;
const primaryColor = APP_CONFIG.DEFAULT_SPINNER.PRIMARY_COLOR;

// Check environment
if (isDevelopment) {
  console.log('Running in development mode');
}
```

## Configuration

The package includes the following configuration:

- `DIRECTUS_CONFIG`: Configuration related to the Directus API
  - `API_URL`: The URL of the Directus API
  - `ADMIN_TOKEN`: The admin authentication token for the Directus API

- `APP_CONFIG`: General application configuration
  - `APP_NAME`: The name of the application
  - `DEFAULT_THEME`: The default theme for the application
  - `DEFAULT_SPINNER`: Default spinner configuration
    - `SPIN_DURATION`: Default spin duration in seconds
    - `PRIMARY_COLOR`: Default primary color
    - `SECONDARY_COLOR`: Default secondary color
    - `SHOW_CONFETTI`: Default confetti setting

- Environment helpers:
  - `isDevelopment`: Check if running in development mode
  - `isProduction`: Check if running in production mode