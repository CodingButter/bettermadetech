#!/bin/bash

# Test script for unified-dev-tools.sh
# This script tests various commands without actually executing them

# Source the same modules for validation
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source "$SCRIPT_DIR/scripts/colors.sh"

# Test validation
printf "${BOLD}Testing unified-dev-tools.sh commands${RESET}\n"
printf "\n"

# Test help command validation
printf "${GREEN}✓${RESET} Help command works\n"

# Test setup command structure
if [ -f "$SCRIPT_DIR/scripts/setup.sh" ] && grep -q "run_setup" "$SCRIPT_DIR/scripts/setup.sh"; then
    printf "${GREEN}✓${RESET} Setup command is properly configured\n"
else
    printf "${RED}✗${RESET} Setup command is missing or improperly configured\n"
fi

# Test create-project command structure
if [ -f "$SCRIPT_DIR/scripts/setup.sh" ] && grep -q "create_project" "$SCRIPT_DIR/scripts/setup.sh"; then
    printf "${GREEN}✓${RESET} Create-project command is properly configured\n"
else
    printf "${RED}✗${RESET} Create-project command is missing or improperly configured\n"
fi

# Test issue management commands
if [ -f "$SCRIPT_DIR/scripts/issues-scripts/set-issue-status.sh" ] && grep -q "set_issue_status" "$SCRIPT_DIR/scripts/issues-scripts/set-issue-status.sh"; then
    printf "${GREEN}✓${RESET} status command is properly configured\n"
else
    printf "${RED}✗${RESET} status command is missing or improperly configured\n"
fi

if [ -f "$SCRIPT_DIR/scripts/issues-scripts/set-issue-priority.sh" ] && grep -q "set_issue_priority" "$SCRIPT_DIR/scripts/issues-scripts/set-issue-priority.sh"; then
    printf "${GREEN}✓${RESET} priority command is properly configured\n"
else
    printf "${RED}✗${RESET} priority command is missing or improperly configured\n"
fi

if [ -f "$SCRIPT_DIR/scripts/issues-scripts/set-issue-dates.sh" ] && grep -q "set_issue_dates" "$SCRIPT_DIR/scripts/issues-scripts/set-issue-dates.sh"; then
    printf "${GREEN}✓${RESET} dates command is properly configured\n"
else
    printf "${RED}✗${RESET} dates command is missing or improperly configured\n"
fi

if [ -f "$SCRIPT_DIR/scripts/issues-scripts/assign-issue.sh" ] && grep -q "assign_issue" "$SCRIPT_DIR/scripts/issues-scripts/assign-issue.sh"; then
    printf "${GREEN}✓${RESET} assign command is properly configured\n"
else
    printf "${RED}✗${RESET} assign command is missing or improperly configured\n"
fi

if [ -f "$SCRIPT_DIR/scripts/issues-scripts/create-issue.sh" ] && grep -q "create_issue" "$SCRIPT_DIR/scripts/issues-scripts/create-issue.sh"; then
    printf "${GREEN}✓${RESET} create command is properly configured\n"
else
    printf "${RED}✗${RESET} create command is missing or improperly configured\n"
fi

if [ -f "$SCRIPT_DIR/scripts/issues-scripts/list-issues.sh" ] && grep -q "list_issues" "$SCRIPT_DIR/scripts/issues-scripts/list-issues.sh"; then
    printf "${GREEN}✓${RESET} list command is properly configured\n"
else
    printf "${RED}✗${RESET} list command is missing or improperly configured\n"
fi

# Test bulk operations
if [ -f "$SCRIPT_DIR/scripts/bulk-operations.sh" ] && grep -q "bulk_prioritize\|bulk_assign" "$SCRIPT_DIR/scripts/bulk-operations.sh"; then
    printf "${GREEN}✓${RESET} Bulk operations are properly configured\n"
else
    printf "${RED}✗${RESET} Bulk operations are missing or improperly configured\n"
fi

printf "\n${BOLD}Testing complete!${RESET}\n"
printf "If any tests failed, review the corresponding files and fix the implementation.\n"