# BetterMadeTech Development Tools

A unified command-line interface for managing GitHub projects, issues, and development workflows.

## Overview

This toolset provides a streamlined, intuitive command-line interface that abstracts away the complexity of GitHub's GraphQL API and CLI commands. It enables developers to efficiently manage projects, track issues, set priorities, and assign tasks through a single entry point.

## Features

- **Single Script Architecture**: All functionality consolidated in one script
- **Environment Management**: Automatically configures and stores settings
- **Command-Line Interface**: Intuitive commands with detailed help
- **Self-Documentation**: Help system for all commands and subcommands
- **Project Management**: Create and configure GitHub projects
- **Issue Management**: Manage issues, statuses, priorities, and dates
- **Bulk Operations**: Perform actions on multiple issues at once
- **Smart Automation**: Auto-assign and prioritize issues based on content

## Installation

1. Clone this repository
2. Navigate to the dev-tools directory
3. Run the setup command to configure the tools:

```bash
./unified-dev-tools.sh setup
```

## Quick Start

```bash
# Set up the tools
./unified-dev-tools.sh setup

# List issues in the current project
./unified-dev-tools.sh list project

# Change issue status
./unified-dev-tools.sh status 42 in-progress

# Set issue priority
./unified-dev-tools.sh priority 42 high

# Create a new issue
./unified-dev-tools.sh create "Add new feature" high 2025-05-01 2025-05-15

# Bulk assign issues
./unified-dev-tools.sh bulk assign auto
```

## Command Reference

### Setup and Configuration

- `setup`: Auto-configure the tools based on repository and project
- `create-project <title>`: Create a new GitHub project with all required fields

### Issue Management

- `status <issue> <status>`: Set issue status (todo, in-progress, done)
- `priority <issue> <priority>`: Set issue priority (high, medium, low)
- `dates <issue> <start> <end>`: Set issue start and end dates
- `assign <issue> <assignee>`: Assign issue to user
- `create <title> <priority> <start> <end> [status] [assignee]`: Create a new issue

### Listing and Filtering

- `list project`: List all issues in current project
- `list issues [filters]`: List GitHub issues with filters
- `list unassigned`: List unassigned issues

### Bulk Operations

- `bulk prioritize [mode]`: Set priorities for all issues
- `bulk assign [mode]`: Assign all issues

### Help System

- `help`: Show main help message
- `help <command>`: Show help for a specific command

## Examples

```bash
# Set up and configure tools
./unified-dev-tools.sh setup

# Set issue #42 to 'in-progress'
./unified-dev-tools.sh status 42 in-progress

# Create a new high priority issue
./unified-dev-tools.sh create "New feature" high 2025-05-01 2025-05-15

# List all issues in current project
./unified-dev-tools.sh list project

# Auto-assign issues based on content
./unified-dev-tools.sh bulk assign auto

# Show help for a specific command
./unified-dev-tools.sh help create
```

## Configuration

The script creates a `.temp` directory for storing configuration (automatically added to `.gitignore`). Configuration includes:

- Repository information
- Project IDs
- Field IDs for status, priority, and dates
- Team member assignments

You can reconfigure at any time by running the `setup` command again.

## Contributing

Contributions are welcome! Please submit pull requests or report issues on the GitHub repository.