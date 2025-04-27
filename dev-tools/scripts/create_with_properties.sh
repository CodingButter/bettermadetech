#!/bin/bash

# Script to create an issue with additional properties

# Source utility scripts
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source "$SCRIPT_DIR/colors.sh"
source "$SCRIPT_DIR/config.sh"
source "$SCRIPT_DIR/issues-scripts/create-issue.sh"
source "$SCRIPT_DIR/issues-scripts/set-issue-status.sh"
source "$SCRIPT_DIR/issues-scripts/set-issue-priority.sh"
source "$SCRIPT_DIR/issues-scripts/set-issue-dates.sh"

# Function to create an issue with additional properties
create_with_properties() {
    # Skip the 'create' command
    shift
    
    # Basic properties
    local title="$1"
    local labels="$2"
    local milestone="$3"
    local assignee="$4"
    shift 4
    
    # Additional properties
    local status=""
    local priority=""
    local start_date=""
    local end_date=""
    
    # Parse the flags
    while [ $# -gt 0 ]; do
        case "$1" in
            --status)
                status="$2"
                shift 2
                ;;
            --priority)
                priority="$2"
                shift 2
                ;;
            --start-date)
                start_date="$2"
                shift 2
                ;;
            --end-date)
                end_date="$2"
                shift 2
                ;;
            *)
                # Skip unknown flags
                shift
                ;;
        esac
    done
    
    if [ -z "$title" ]; then
        print_error "Title is required"
        echo "Usage: create_with_properties <title> [labels] [milestone] [assignee] [status] [priority] [start_date] [end_date]"
        return 1
    fi
    
    # Create the basic issue
    print_info "Creating issue: $title"
    local issue_url
    
    if [ -n "$labels" ] && [ -n "$assignee" ]; then
        issue_url=$(gh issue create --title "$title" --body "## Description\n$title" --label "$labels" --assignee "$assignee" -R "$REPO_NAME" 2>/dev/null)
    elif [ -n "$labels" ]; then
        issue_url=$(gh issue create --title "$title" --body "## Description\n$title" --label "$labels" -R "$REPO_NAME" 2>/dev/null)
    elif [ -n "$assignee" ]; then
        issue_url=$(gh issue create --title "$title" --body "## Description\n$title" --assignee "$assignee" -R "$REPO_NAME" 2>/dev/null)
    else
        issue_url=$(gh issue create --title "$title" --body "## Description\n$title" -R "$REPO_NAME" 2>/dev/null)
    fi
    
    if [ $? -ne 0 ] || [[ ! "$issue_url" =~ /issues/ ]]; then
        print_error "Failed to create issue"
        return 1
    fi
    
    # Extract issue number
    local issue_number
    issue_number=$(echo "$issue_url" | grep -o -E '/issues/[0-9]+' | sed 's#/issues/##')
    print_success "Issue #$issue_number created: $issue_url"
    
    # Apply additional properties if specified
    if [ -n "$status" ]; then
        print_info "Setting status to $status..."
        set_issue_status "$issue_number" "$status"
    fi
    
    if [ -n "$priority" ]; then
        print_info "Setting priority to $priority..."
        set_issue_priority "$issue_number" "$priority"
    fi
    
    if [ -n "$start_date" ] && [ -n "$end_date" ]; then
        print_info "Setting dates: $start_date to $end_date..."
        set_issue_dates "$issue_number" "$start_date" "$end_date"
    fi
    
    print_success "Issue #$issue_number created and configured"
    return 0
}

# Execute the function with all passed arguments
create_with_properties "$@"