# BetterMade Technology Monorepo

This repository contains the codebase for BetterMade Technology, including the marketing website, Directus CMS, and related applications.

## Structure

This is a Turborepo-based monorepo containing:

```
bettermade/
├── apps/
│   ├── directus/          # Directus CMS (Headless CMS)
│   └── nextjs/            # Main marketing website (Next.js)
│   
└── packages/
    ├── tailwind-config/   # Shared Tailwind CSS v4 configuration
    ├── tsconfig/          # Shared TypeScript configuration
    └── ui/                # Shared UI components
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Docker and Docker Compose (for Directus CMS)

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/your-organization/bettermade.git
cd bettermade
npm install
```

### Development

Run the development servers:

```bash
# Start Directus CMS
npm run dev:cms

# Start Next.js website
npm run dev:web

# Or start everything in parallel
npm run dev
```

## Apps

### Directus CMS

Located in `apps/directus`. This is a headless CMS that powers the content for the marketing website and other applications.

Configuration is done through environment variables - see the `.env.example` file in the Directus directory.

### Main Website

Located in `apps/nextjs`. Built with Next.js, this is the main marketing website for BetterMade Technology.

## Packages

### tailwind-config

Shared Tailwind CSS v4 configuration. This package provides a consistent design system across all apps with:

- Shared color palette
- Typography settings
- Component styles
- Theme variables

### tsconfig

Shared TypeScript configuration with different targets for:

- React libraries
- Next.js applications
- Base configurations

### ui

Shared React components used across applications.

## Development Workflow

1. Make changes in appropriate package or app
2. Run tests if applicable
3. Create a PR for review
4. Merge to main branch
5. CI/CD will handle deployment

## License

Proprietary - Copyright © BetterMade Technology