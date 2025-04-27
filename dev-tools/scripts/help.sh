#!/bin/bash

# CLI HELP FUNCTIONS
# ============================================================

# General help message
show_help() {
    printf "${BOLD}BetterMadeTech Unified Development Tools${RESET}\n"
    printf "Manage GitHub projects and issues from the command line.\n"
    printf "\n"
    printf "${BOLD}Usage:${RESET} %s <command> [options]\n" "$0"
    printf "\n"
    printf "${BOLD}Commands:${RESET}\n"
    printf "  setup                      Set up and configure the development tools (interactive)\n"
    printf "  create-project <title>     Create a new GitHub project with required fields\n"
    printf "\n"
    printf "  status <issue> <status>    Set issue status (todo, in-progress, done, archived)\n"
    printf "  priority <issue> <level>   Set issue priority (high, medium, low)\n"
    printf "  dates <issue> <start> <end>   Set issue start and end dates (YYYY-MM-DD format)\n"
    printf "  assign <issue> <user>      Assign issue to a user\n"
    printf "  assign auto                Auto-assign all issues based on content (coder/designer)\n"
    printf "  assign lists               Interactively assign each open issue\n"
    printf "  assign unassigned <user>   Assign all unassigned issues to <user>\n"
    printf "  create \"<title>\" [labels] [milestone] [assignee]  Create a new issue\n"
    printf "\n"
    printf "  list project               List all issues in the current project\n"
    printf "  list issues [state] [limit] [assignee] [label]   List repository issues\n"
    printf "\n"
    printf "  bulk prioritize auto       Auto-set priority for all issues\n"
    printf "  bulk prioritize lists      Manually set priority for each issue\n"
    printf "  bulk assign auto           Same as 'assign auto'\n"
    printf "  bulk assign lists          Same as 'assign lists'\n"
    printf "  bulk assign unassigned <user>   Same as 'assign unassigned'\n"
    printf "\n"
    printf "  help [command]             Show general or command-specific help\n"
    printf "\n"
    printf "${BOLD}Examples:${RESET}\n"
    printf "  %s setup\n" "$0"
    printf "  %s create-project \"Dev Board Q2\"\n" "$0"
    printf "  %s create \"New feature\" \"enhancement\" \"v1.0\" \"username\" --status todo --priority high\n" "$0"
    printf "  %s status 42 done\n" "$0"
    printf "  %s assign 42 alice\n" "$0"
    printf "  %s assign auto\n" "$0"
    printf "  %s bulk prioritize auto\n" "$0"
}

# Detailed help for specific commands
show_command_help() {
    local cmd="$1"
    case "$cmd" in
        setup)
            printf "${BOLD}setup:${RESET} Set up and configure the tool.\n"
            printf "Usage: %s setup\n" "$0"
            printf "Interactive setup to select a project and configure default settings.\n"
            ;;
        create-project)
            printf "${BOLD}create-project:${RESET} Create a new project and configure it.\n"
            printf "Usage: %s create-project <title>\n" "$0"
            printf "Creates a new GitHub project with required fields (Status, Priority, Start/End Dates).\n"
            ;;
        status)
            printf "${BOLD}status:${RESET} Update the status of an issue.\n"
            printf "Usage: %s status <issue-number> <todo|in-progress|done|archived>\n" "$0"
            printf "Adds the issue to the current project if not already present, and updates its status field and issue body.\n"
            ;;
        priority)
            printf "${BOLD}priority:${RESET} Update the priority of an issue.\n"
            printf "Usage: %s priority <issue-number> <high|medium|low>\n" "$0"
            printf "Sets the project's priority field for the issue and updates the issue body accordingly.\n"
            ;;
        dates)
            printf "${BOLD}dates:${RESET} Set the start and end dates for an issue.\n"
            printf "Usage: %s dates <issue-number> <start-date> <end-date>\n" "$0"
            printf "Dates must be in YYYY-MM-DD format. Updates the project fields and issue body.\n"
            ;;
        assign)
            printf "${BOLD}assign:${RESET} Assign issues to team members.\n"
            printf "Usage: %s assign <issue-number> <assignee>\n" "$0"
            printf "   or: %s assign auto\n" "$0"
            printf "   or: %s assign lists\n" "$0"
            printf "   or: %s assign unassigned <assignee>\n" "$0"
            printf "\n"
            printf "Options:\n"
            printf "  auto        Auto-assign all open issues to default assignees (based on content)\n"
            printf "  lists       Step through each open issue and choose an assignee interactively\n"
            printf "  unassigned  Assign all currently unassigned open issues to the specified user\n"
            printf "\n"
            printf "Examples:\n"
            printf "  %s assign 42 alice       # Assign issue #42 to user 'alice'\n" "$0"
            printf "  %s assign auto           # Auto-assign all issues\n" "$0"
            printf "  %s assign unassigned bob # Assign all unassigned issues to 'bob'\n" "$0"
            ;;
        create)
            printf "${BOLD}create:${RESET} Create a new GitHub issue.\n"
            printf "Usage: %s create \"<title>\" [labels] [milestone] [assignee] [flags]\n" "$0"
            printf "\n"
            printf "Parameters:\n"
            printf "  title        The issue title (in quotes if multi-word)\n"
            printf "  labels       (Optional) Comma-separated list of labels to apply\n"
            printf "  milestone    (Optional) Milestone to associate with the issue\n"
            printf "  assignee     (Optional) Assignee username (default auto-determined)\n"
            printf "\n"
            printf "Flags (all optional):\n"
            printf "  --status <status>        Set issue status after creation (todo, in-progress, done, archived)\n"
            printf "  --priority <priority>    Set issue priority after creation (high, medium, low)\n"
            printf "  --start-date <date>      Set start date (format: YYYY-MM-DD)\n"
            printf "  --end-date <date>        Set end date (format: YYYY-MM-DD)\n"
            printf "\n"
            printf "Examples:\n"
            printf "  %s create \"Simple issue\" \"enhancement\"\n" "$0"
            printf "  %s create \"Complex issue\" \"bug\" \"v1.0\" \"username\" --status todo --priority high --start-date 2025-06-01 --end-date 2025-06-15\n" "$0"
            ;;
        list)
            printf "${BOLD}list:${RESET} List issues.\n"
            printf "Usage: %s list project\n" "$0"
            printf "   or: %s list issues [state] [limit] [assignee] [label]\n" "$0"
            printf "\n"
            printf "If 'project' is specified, lists all issues in the current project.\n"
            printf "If 'issues' is specified (or omitted), lists repository issues with optional filters:\n"
            printf "  state      Issue state filter (open, closed, all), default 'open'\n"
            printf "  limit      Maximum number of issues to list (default 20)\n"
            printf "  assignee   Only issues assigned to this user\n"
            printf "  label      Only issues with this label\n"
            ;;
        bulk)
            printf "${BOLD}bulk:${RESET} Perform bulk operations on issues.\n"
            printf "Usage: %s bulk prioritize <auto|lists>\n" "$0"
            printf "   or: %s bulk assign <auto|lists|unassigned> [assignee]\n" "$0"
            printf "\n"
            printf "Subcommands:\n"
            printf "  prioritize auto    Auto-set priorities for all open issues (based on keywords)\n"
            printf "  prioritize lists   Prompt for each open issue's priority\n"
            printf "  assign auto        Auto-assign all open issues (same as 'assign auto')\n"
            printf "  assign lists       Prompt for each open issue's assignee (same as 'assign lists')\n"
            printf "  assign unassigned <user>  Assign all unassigned issues to <user>\n"
            ;;
        *)
            show_help ;;
    esac
}

# ============================================================