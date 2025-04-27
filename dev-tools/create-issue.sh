#!/bin/bash

# Script to create a GitHub issue with full details including dates and status

# Constants
TEMPLATE_FILE="dev-tools/issue-template.md"

# Function to ensure required arguments are provided
ensure_args() {
    if [ -z "$1" ] || [ -z "$2" ] || [ -z "$3" ] || [ -z "$4" ] || [ -z "$5" ]; then
        echo "Missing required arguments."
        echo "Usage: $0 \"Title\" \"Priority (1-3)\" \"Start Date (YYYY-MM-DD)\" \"End Date (YYYY-MM-DD)\" \"Status (todo|in-progress|done)\""
        exit 1
    fi
}

# Function to generate issue body from template
generate_body() {
    local title="$1"
    local priority="$2"
    local start_date="$3"
    local end_date="$4"
    local depends_on="$5"  # Optional dependency (issue number)
    
    # Start with a basic template if template file doesn't exist
    if [ ! -f "$TEMPLATE_FILE" ]; then
        echo "## Description

## Tasks
- [ ] Task 1
- [ ] Task 2

## Deliverables
- 

## Dependencies
${depends_on:+- Depends on #$depends_on}

## Due Dates
- Start Date: $start_date
- End Date: $end_date

## Priority
Priority: $priority"
    else
        # Read from template and modify
        body=$(cat "$TEMPLATE_FILE")
        # Replace placeholders
        body="${body//\<\!-- Replace with descriptive title --\>/$title}"
        body="${body//Priority: /Priority: $priority}"
        body="${body//- Start Date: YYYY-MM-DD/- Start Date: $start_date}"
        body="${body//- End Date: YYYY-MM-DD/- End Date: $end_date}"
        
        # Add dependency if provided
        if [ ! -z "$depends_on" ]; then
            body="${body//\<\!-- List any issues this one depends on --\>/- Depends on #$depends_on}"
        fi
        
        echo "$body"
    fi
}

# Main function to create an issue
create_issue() {
    local title="$1"
    local priority="$2"
    local start_date="$3"
    local end_date="$4"
    local status="$5"
    local depends_on="$6"  # Optional
    
    # Use existing labels or create new ones
    local label
    case "$priority" in
        1) label="enhancement" ;;  # Using existing "enhancement" label for high priority
        2) label="enhancement" ;;  # Using existing "enhancement" label for medium priority
        3) label="good first issue" ;;  # Using existing "good first issue" label for low priority
        *) label="enhancement" ;;  # Default to "enhancement"
    esac
    
    # Generate issue body
    local body=$(generate_body "$title" "$priority" "$start_date" "$end_date" "$depends_on")
    
    # Create issue
    echo "Creating issue: $title"
    local issue_url
    if [ -z "$label" ]; then
        issue_url=$(gh issue create --title "$title" --body "$body")
    else
        issue_url=$(gh issue create --title "$title" --body "$body" --label "$label")
    fi
    
    echo "Issue URL: $issue_url"
    
    # Extract issue number
    local issue_number=$(echo "$issue_url" | grep -o '/issues/[0-9]*' | grep -o '[0-9]*')
    
    echo "Issue #$issue_number created: $issue_url"
    
    # Add to project with status and dates
    ./dev-tools/github-project-manager.sh add-issue "$issue_number" "$status" "$start_date" "$end_date"
    
    echo "Issue #$issue_number added to project with status $status and dates $start_date to $end_date"
}

# Check arguments
ensure_args "$1" "$2" "$3" "$4" "$5"

# Call the main function
create_issue "$1" "$2" "$3" "$4" "$5" "$6"