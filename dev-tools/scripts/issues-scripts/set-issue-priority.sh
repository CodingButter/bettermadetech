#!/bin/bash

set_issue_priority() {
    local issue_number="$1"
    local priority="$2"
    if [ -z "$issue_number" ] || [ -z "$priority" ]; then
        print_error "Issue number and priority are required."
        echo "Usage: $0 priority <issue-number> <high|medium|low>"
        return 1
    fi
    case "$priority" in
        high|medium|low) ;;
        *) print_error "Invalid priority: $priority. Use 'high', 'medium', or 'low'."; return 1 ;;
    esac
    # Determine option ID for priority
    local option_id
    local priority_name="$(tr '[:lower:]' '[:upper:]' <<< ${priority:0:1})${priority:1}"  # Capitalize for display
    case "$priority" in
        high)   option_id="$HIGH_PRIORITY_OPTION_ID" ;;
        medium) option_id="$MEDIUM_PRIORITY_OPTION_ID" ;;
        low)    option_id="$LOW_PRIORITY_OPTION_ID" ;;
    esac
    if [ -z "$option_id" ]; then
        print_error "Priority field not configured. Please run 'setup' first."
        return 1
    fi
    # Update issue body "Priority" section
    local issue_body
    issue_body=$(gh issue view "$issue_number" --json body -q .body 2>/dev/null)
    if [[ "$issue_body" == *"## Priority"* ]]; then
        issue_body=$(echo "$issue_body" | sed -E "s/Priority: .*/Priority: $priority/")
    else
        issue_body="${issue_body}\n\n## Priority\nPriority: $priority"
    fi
    gh issue edit "$issue_number" --body "$issue_body" > /dev/null 2>&1
    # Ensure issue is in project, get item ID (add if necessary)
    local owner="${REPO_NAME%%/*}"
    local items_json item_id
    items_json=$(gh project item-list "$PROJECT_NUMBER" --owner "$owner" --format json --limit 1000 2>/dev/null)
    item_id=$(echo "$items_json" | grep -A5 "\"number\": $issue_number" | grep -o '"id": *"PVTI[^"]*' | sed -E 's/"id": *"([^"]*)"/\1/')
    if [ -z "$item_id" ]; then
        local add_out
        add_out=$(gh project item-add "$PROJECT_NUMBER" --owner "$owner" --url "https://github.com/$REPO_NAME/issues/$issue_number" --format json 2>/dev/null)
        item_id=$(echo "$add_out" | grep -o '"id":"PVTI[^"]*' | sed -E 's/"id":"([^"]*)/\1/')
    fi
    if [ -z "$item_id" ]; then
        print_error "Could not find or add issue #$issue_number in project."
        return 1
    fi
    # Update Priority field in project
    gh project item-edit "$PROJECT_NUMBER" --owner "$owner" --id "$item_id" --project-id "$PROJECT_ID" --field-id "$PRIORITY_FIELD_ID" --single-select-option-id "$option_id" > /dev/null 2>&1
    if [ $? -ne 0 ]; then
        print_error "Failed to update priority for issue #$issue_number."
        return 1
    fi
    print_success "Issue #$issue_number priority set to $priority_name."
}

# Update the start and end dates for an issue
