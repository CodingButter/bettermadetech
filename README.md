# Better Made Tech

<div align="center">
  <h2>The Ultimate Winner Spinner Platform</h2>
  <p>A highly customizable spinning wheel solution for random selection, giveaways, and decision making</p>
</div>

## 📋 Overview

Better Made Tech is a comprehensive platform for creating and managing interactive spinning wheels for random selection. The project includes:

- **Chrome Extension**: A browser extension for using spinning wheels directly in your browser
- **Web Application**: A full-featured web application for creating and managing spinners
- **Documentation**: Comprehensive documentation and guides
- **UI Component Library**: Reusable UI components with TypeScript and Tailwind CSS
- **Directus Integration**: Backend powered by Directus for data management

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or newer)
- [pnpm](https://pnpm.io/) (v8 or newer)
- [Git](https://git-scm.com/)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/CodingButter/bettermadetech.git
cd bettermadetech
```

2. Install dependencies:

```bash
pnpm install
```

3. Build all packages and applications:

```bash
pnpm build
```

4. Start the development environment:

```bash
pnpm dev
```

### Extension Development

To build the Chrome extension:

```bash
cd apps/extension
pnpm build
```

The built extension will be available in the `apps/extension/dist` directory and can be loaded into Chrome using the "Load unpacked" option in the Extensions page.

## 📦 Project Structure

This monorepo is powered by [Turborepo](https://turborepo.com/) and includes the following packages and applications:

### Apps

- `extension`: Chrome extension for spinner functionality
- `web`: Main web application built with Next.js
- `docs`: Documentation site built with Next.js
- `directus`: Directus instance for backend functionality

### Packages

- `@repo/ui`: Shared UI component library with Tailwind CSS
- `@repo/spinner`: Customizable spinner components
- `@repo/env-config`: Environment configuration utilities
- `@repo/eslint-config`: Shared ESLint configuration
- `@repo/typescript-config`: Shared TypeScript configuration

## 🎯 Key Features

- **Customizable Spinner**: Fully customizable spinning wheel with animation, colors, and styles
- **Chrome Extension**: Use spinners directly from your browser
- **User Accounts**: Save and manage multiple spinner configurations
- **Theme Support**: Light and dark mode support across all applications
- **Responsive Design**: Works on desktop and mobile devices
- **Directus Backend**: Powerful headless CMS for data management

## 🧩 Components

The platform provides several reusable components:

- **Spinner Component**: The core spinning wheel component with customization options
- **UI Components**: Buttons, cards, modals, and other UI elements
- **Theme Provider**: Context for theme management
- **Storage Utilities**: Type-safe storage utilities for Chrome extension

## 🛠️ Development

### Commands

- `pnpm dev`: Start development environment for all applications
- `pnpm build`: Build all applications and packages
- `pnpm lint`: Run linting on all applications and packages
- `pnpm test`: Run tests across the monorepo

### Testing the Extension

1. Build the extension:

```bash
cd apps/extension
pnpm build
```

2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the `apps/extension/dist` directory

## 📚 Documentation

Comprehensive documentation is available in the `docs` application. To view the documentation locally:

```bash
cd apps/docs
pnpm dev
```

Then visit `http://localhost:3000` in your browser.

## 🤝 Contributing

Contributions are welcome! Please see our [Contributing Guide](CONTRIBUTING.md) for more information.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

For questions or support, please contact [support@bettermade.tech](mailto:support@bettermade.tech).