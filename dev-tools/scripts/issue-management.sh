#!/bin/bash

# Source issue management scripts
source "$(dirname "${BASH_SOURCE[0]}")/issues-scripts/assign-issue.sh"
source "$(dirname "${BASH_SOURCE[0]}")/issues-scripts/create-issue.sh"
source "$(dirname "${BASH_SOURCE[0]}")/issues-scripts/set-issue-status.sh"
source "$(dirname "${BASH_SOURCE[0]}")/issues-scripts/set-issue-priority.sh"
source "$(dirname "${BASH_SOURCE[0]}")/issues-scripts/set-issue-dates.sh"
source "$(dirname "${BASH_SOURCE[0]}")/issues-scripts/list-project-issues.sh"
source "$(dirname "${BASH_SOURCE[0]}")/issues-scripts/list-issues.sh"

# Wrapper functions to provide consistent interface

# Update issue status
update_issue_status() {
    set_issue_status "$@"
}

# Set issue priority
set_issue_priority() {
    set_issue_priority "$@"
}

# Update issue dates
update_issue_dates() {
    set_issue_dates "$@"
}

# We don't need a wrapper for assign_issue as it's already defined with the correct name in its script

# We don't need wrappers for these functions as they are already defined with the correct names
# in their respective scripts
