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

## MCP GSuite Server

- Install dependencies: `cd dev/mcp/gsuite && ./install.sh`
- Get OAuth refresh token (if needed): `cd dev/mcp/gsuite && node get-refresh-token.js`
- Start the GSuite MCP server: `cd dev/mcp/gsuite && ./build-and-run.sh`
- Test email sending: `cd dev/mcp/gsuite && node test-send-email.js` (automatically starts server if needed)
- Run comprehensive test: `cd dev/mcp/gsuite && node test-comprehensive.js` (automatically starts server if needed)
- Check server health: `curl http://localhost:3000/health`
- Start server directly: `cd dev/mcp/gsuite && node mcp-server-helper.js`
- Run client example: `cd dev/mcp/gsuite && node client-example.js`

### Using the Client Library

The GSuite MCP server comes with a client library that automatically ensures the server is running:

```javascript
const MCPGSuiteClient = require('./dev/mcp/gsuite/mcp-client');

// Create client instance
const client = new MCPGSuiteClient();

// Send an email (server starts automatically if needed)
await client.sendEmail({
  to: 'recipient@example.com',
  subject: 'Test Subject',
  body: '<h1>Hello World</h1>'
});

// Other available methods
await client.getMessages();
await client.getCalendarEvents();
await client.createCalendarEvent({...});
await client.checkHealth();
```

### API Endpoints (running on localhost:3000)
- `/gmail/send` (POST): Send emails
- `/gmail/messages` (GET): List recent Gmail messages
- `/calendar/events` (GET): List upcoming calendar events
- `/calendar/create` (POST): Create a new calendar event

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

## Project Management

- **GitHub CLI**: Use `gh` CLI to manage issues and projects
- **Issue Management**: 
  - Always develop in task-specific branches (e.g., `feature/X-feature-name`, `fix/X-bug-name`)
  - Update issue status when starting/completing work
  - Link commits to issues using `#issue-number` in commit messages
  - Follow issue templates precisely when creating new issues
  - Always verify GitHub project board is in sync with actual development status

- **Project Board Updates**:
  - The project board in this repository uses labels to track issue status
  - Use appropriate labels to indicate status: "todo", "in-progress", "completed"
  - Always update the "Status" section in the issue body to match the current state
  - Link commits and PRs in the issue body under "Related Commits"
  - Always develop in feature branches named after the issue: `feature/X-feature-name`
  - Reference issue numbers in commit messages using #issue-number format

Always refer to memory for insights into project structure and development workflow, and review previous commands/interactions for guidance on project-specific patterns.