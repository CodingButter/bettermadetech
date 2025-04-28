# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build/Lint/Test Commands

- Build all workspaces: `pnpm build` or `turbo run build`
- Run dev server: `pnpm dev`
- Lint code: `pnpm lint` or `turbo run lint`
- Type check: `pnpm check-types` or `turbo run check-types`
- Format code: `pnpm format`
- Run tests (spinner package): `pnpm --filter @repo/spinner test`
- Run single test: `pnpm --filter @repo/spinner test -- -t "test name"`

## Linting Notes

- **Web package**: Uses Next.js ESLint config with warnings allowed
- **Extension package**: Uses custom ESLint config with zero-warnings policy
- **Spinner package**: Fixed linting but has type errors related to module resolution

## Code Style Guidelines

- TypeScript preferred with explicit types for function parameters, returns, and variables
- React components use functional style with named exports
- CSS uses Tailwind with custom classes in component-specific modules
- Imports grouped: React/next, external libraries, internal modules, types
- Component props defined as interfaces, not types
- Error handling with try/catch and meaningful error messages
- File naming: kebab-case for components, camelCase for utilities
- Bash scripts follow POSIX standards with clear functions and error handling

When making changes, follow patterns in existing code and run type checks/lint before committing.