#!/bin/bash

set_issue_status() {
    local issue_number="$1"
    local status="$2"
    if [ -z "$issue_number" ] || [ -z "$status" ]; then
        print_error "Issue number and status are required."
        echo "Usage: $0 status <issue-number> <status>"
        return 1
    fi
    case "$status" in
        todo|in-progress|done|archived) ;; 
        *) print_error "Invalid status: $status. Use 'todo', 'in-progress', 'done', or 'archived'."; return 1 ;;
    esac
    # Determine status display and option ID
    local status_name option_id
    case "$status" in
        todo)        status_name="Todo";        option_id="$TODO_OPTION_ID" ;;
        in-progress) status_name="In Progress"; option_id="$IN_PROGRESS_OPTION_ID" ;;
        done)        status_name="Done";        option_id="$DONE_OPTION_ID" ;;
        archived)    status_name="Archived";    option_id="$DONE_OPTION_ID" ;;  # Archived uses Done option as placeholder
    esac
    print_info "Setting status of issue #$issue_number to '$status_name'"
    # Update issue body "Status" section
    local issue_body
    issue_body=$(gh issue view "$issue_number" --json body -q .body 2>/dev/null)
    if [[ "$issue_body" == *"## Status"* ]]; then
        issue_body=$(echo "$issue_body" | sed -E "s/Current Status: .*/Current Status: $status_name/")
    else
        issue_body="${issue_body}\n\n## Status\nCurrent Status: $status_name"
    fi
    
    # Just update the issue body with the new status, no labels
    gh issue edit $issue_number --body "$issue_body" > /dev/null 2>&1
    
    # Only proceed with project operations if project details are configured
    if [ -n "$PROJECT_NUMBER" ] && [ -n "$PROJECT_ID" ]; then
        # Ensure issue is added to project, get item ID
        local owner="${REPO_NAME%%/*}"
        local add_out item_id=""
        add_out=$(gh project item-add "$PROJECT_NUMBER" --owner "$owner" --url "https://github.com/$REPO_NAME/issues/$issue_number" --format json 2>/dev/null)
        if [ $? -eq 0 ] && [ -n "$add_out" ]; then
            item_id=$(echo "$add_out" | grep -o '"id":"PVTI[^"]*' | sed -E 's/"id":"([^"]*)/\1/')
        fi
        if [ -z "$item_id" ]; then
            # If item-add didn't return ID (likely already in project), search for it
            local items_json
            items_json=$(gh project item-list "$PROJECT_NUMBER" --owner "$owner" --format json --limit 1000 2>/dev/null)
            item_id=$(echo "$items_json" | grep -A5 "\"number\": $issue_number" | grep -o '"id": *"PVTI[^"]*' | sed -E 's/"id": *"([^"]*)"/\1/')
        fi
        if [ -z "$item_id" ]; then
            print_error "Could not add/find issue #$issue_number in project."
            print_warning "The status was updated in the issue, but not in the project board."
            return 0  # Consider this a partial success
        fi
    else
        print_info "No project configured. Issue status updated via labels only."
        print_success "Issue #$issue_number status updated to '$status_name'."
        return 0
    fi
    if [ "$status" = "archived" ]; then
        # Archive the project item
        gh project item-archive "$PROJECT_NUMBER" --owner "$owner" --id "$item_id" > /dev/null 2>&1
        if [ $? -eq 0 ]; then
            print_success "Issue #$issue_number archived in project."
        else
            print_error "Failed to archive issue #$issue_number in project."
            print_warning "The status was updated in the issue, but not in the project board."
            return 0  # Consider this a partial success
        fi
    else
        # Update the project's Status field for this item
        gh project item-edit "$PROJECT_NUMBER" --owner "$owner" --id "$item_id" --project-id "$PROJECT_ID" --field-id "$STATUS_FIELD_ID" --single-select-option-id "$option_id" > /dev/null 2>&1
        if [ $? -ne 0 ]; then
            print_error "Failed to update project status for issue #$issue_number."
            print_warning "The status was updated in the issue, but not in the project board."
            return 0  # Consider this a partial success
        fi
        print_success "Issue #$issue_number status updated to '$status_name'."
    fi
}

# Update the priority of an issue
